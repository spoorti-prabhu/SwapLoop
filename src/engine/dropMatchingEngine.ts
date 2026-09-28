import { Item, Proposal, ProposalMember, User, WantRelation, ValueBand, TrustLevel } from '../types/swaploop';

export function isValueBandAllowedForTrust(trustLevel: TrustLevel, valueBand: ValueBand): boolean {
  if (trustLevel === 'New') {
    return valueBand === 'Low';
  }
  if (trustLevel === 'Trusted') {
    return valueBand === 'Low' || valueBand === 'Medium';
  }
  return true; // Veteran allows Low, Medium, High
}

export function generate6CharCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export interface CandidateCycle {
  type: 'loop' | 'gift_chain';
  students: string[]; // student IDs in cycle order
  items: string[]; // items given by each student: items[i] given by students[i] to students[(i+1)%n]
  signature: string;
}

/**
 * Builds a deterministic canonical signature for a cycle so duplicates and previously
 * declined cycles can be uniquely identified regardless of starting rotation.
 */
export function getCycleSignature(studentIds: string[], itemIds: string[]): string {
  const n = studentIds.length;
  const rotations: string[] = [];
  
  for (let offset = 0; offset < n; offset++) {
    const sSeq: string[] = [];
    for (let i = 0; i < n; i++) {
      const idx = (offset + i) % n;
      sSeq.push(`${studentIds[idx]}:${itemIds[idx]}`);
    }
    rotations.push(sSeq.join('->'));
  }
  
  rotations.sort();
  return rotations[0];
}

/**
 * Main Drop Matching Engine
 */
export function runDropMatchingEngine(
  users: User[],
  items: Item[],
  wants: WantRelation[],
  declinedSignatures: Set<string>,
  activeProposalItemIds: Set<string>
): Proposal[] {
  const userMap = new Map<string, User>(users.map(u => [u.id, u]));
  const itemMap = new Map<string, Item>(items.map(i => [i.id, i]));

  // Filter available items (not locked, owned by a valid user)
  const availableItems = items.filter(
    item => !item.isLockedInProposal && !activeProposalItemIds.has(item.id)
  );

  // Group items by owner
  const userItems = new Map<string, Item[]>();
  for (const item of availableItems) {
    if (!userItems.has(item.ownerId)) {
      userItems.set(item.ownerId, []);
    }
    userItems.get(item.ownerId)!.push(item);
  }

  // Group wants by student
  const studentWants = new Map<string, Set<string>>();
  for (const want of wants) {
    if (!studentWants.has(want.studentId)) {
      studentWants.set(want.studentId, new Set());
    }
    studentWants.get(want.studentId)!.add(want.itemId);
  }

  // Directed edges: (Student A, Item A) -> Student B
  // Meaning: Student A has item A which Student B wants.
  interface Edge {
    fromStudentId: string;
    toStudentId: string;
    itemId: string;
  }

  const outgoingEdges = new Map<string, Edge[]>();
  for (const [ownerId, itemsOwned] of userItems.entries()) {
    for (const item of itemsOwned) {
      // Find all students who want this item
      for (const [wantiStudentId, wantedItemSet] of studentWants.entries()) {
        if (wantiStudentId === ownerId) continue; // cannot trade with self
        if (wantedItemSet.has(item.id)) {
          if (!outgoingEdges.has(ownerId)) {
            outgoingEdges.set(ownerId, []);
          }
          outgoingEdges.get(ownerId)!.push({
            fromStudentId: ownerId,
            toStudentId: wantiStudentId,
            itemId: item.id
          });
        }
      }
    }
  }

  const allCandidateCycles: CandidateCycle[] = [];

  // Find closed cycles of length 2 to 5
  function findCycles() {
    const studentList = Array.from(userItems.keys());

    function dfs(
      startStudent: string,
      currentStudent: string,
      pathStudents: string[],
      pathItems: string[],
      visited: Set<string>
    ) {
      if (pathStudents.length >= 5) return;

      const edges = outgoingEdges.get(currentStudent) || [];
      for (const edge of edges) {
        if (edge.toStudentId === startStudent && pathStudents.length >= 3 && pathStudents.length <= 5) {
          // Found a cycle!
          const cycleStudents = [...pathStudents];
          const cycleItems = [...pathItems, edge.itemId];
          const sig = getCycleSignature(cycleStudents, cycleItems);

          // Check if not declined before
          if (!declinedSignatures.has(sig)) {
            allCandidateCycles.push({
              type: 'loop',
              students: cycleStudents,
              items: cycleItems,
              signature: sig
            });
          }
        } else if (!visited.has(edge.toStudentId) && pathStudents.length < 5) {
          visited.add(edge.toStudentId);
          dfs(
            startStudent,
            edge.toStudentId,
            [...pathStudents, edge.toStudentId],
            [...pathItems, edge.itemId],
            visited
          );
          visited.delete(edge.toStudentId);
        }
      }
    }

    for (const s of studentList) {
      const visited = new Set<string>([s]);
      const edges = outgoingEdges.get(s) || [];
      for (const edge of edges) {
        if (edge.toStudentId !== s) {
          visited.add(edge.toStudentId);
          dfs(s, edge.toStudentId, [s, edge.toStudentId], [edge.itemId], visited);
          visited.delete(edge.toStudentId);
        }
      }
    }
  }

  findCycles();

  // Deduplicate candidate cycles by canonical signature
  const uniqueCandidateMap = new Map<string, CandidateCycle>();
  for (const c of allCandidateCycles) {
    if (!uniqueCandidateMap.has(c.signature)) {
      uniqueCandidateMap.set(c.signature, c);
    }
  }
  const uniqueCandidates = Array.from(uniqueCandidateMap.values());

  // TRUST VALIDATOR (T4):
  // Filter out any cycle violating member trust levels:
  // E.g., 'New' members can never receive or give 'Medium' or 'High' items.
  const trustValidatedCycles = uniqueCandidates.filter(candidate => {
    const n = candidate.students.length;
    for (let i = 0; i < n; i++) {
      const giverId = candidate.students[i];
      const receiverId = candidate.students[(i + 1) % n];
      const givenItemId = candidate.items[i];

      const giver = userMap.get(giverId);
      const receiver = userMap.get(receiverId);
      const item = itemMap.get(givenItemId);

      if (!giver || !receiver || !item) return false;

      // Trust rule: Giver must be allowed to trade this value band
      if (!isValueBandAllowedForTrust(giver.trustLevel, item.valueBand)) {
        return false;
      }
      // Trust rule: Receiver must also be allowed to receive this value band
      if (!isValueBandAllowedForTrust(receiver.trustLevel, item.valueBand)) {
        return false;
      }
    }
    return true;
  });

  // OPTIMIZATION STRATEGY (F6):
  // If multiple valid cycles conflict over the same item or student,
  // pick the combination of disjoint cycles that maximizes total students satisfied!
  // Sort candidate combinations to find maximum coverage.

  // We can use a branch & bound / greedy search to find the optimal disjoint subset of cycles:
  let bestSubset: CandidateCycle[] = [];
  let maxStudentsSatisfied = -1;

  function canAdd(cycle: CandidateCycle, usedStudents: Set<string>, usedItems: Set<string>): boolean {
    for (const s of cycle.students) {
      if (usedStudents.has(s)) return false;
    }
    for (const it of cycle.items) {
      if (usedItems.has(it)) return false;
    }
    return true;
  }

  // Sort cycles prioritizing longer loops (e.g. 5 > 4 > 3 > 2)
  const sortedCandidates = [...trustValidatedCycles].sort((a, b) => {
    return b.students.length - a.students.length;
  });

  function searchDisjoint(index: number, currentSubset: CandidateCycle[], usedStudents: Set<string>, usedItems: Set<string>) {
    // Current total satisfied
    const totalCount = currentSubset.reduce((acc, c) => acc + c.students.length, 0);
    if (totalCount > maxStudentsSatisfied) {
      maxStudentsSatisfied = totalCount;
      bestSubset = [...currentSubset];
    }

    for (let i = index; i < sortedCandidates.length; i++) {
      const candidate = sortedCandidates[i];
      if (canAdd(candidate, usedStudents, usedItems)) {
        // Add
        for (const s of candidate.students) usedStudents.add(s);
        for (const it of candidate.items) usedItems.add(it);
        currentSubset.push(candidate);

        searchDisjoint(i + 1, currentSubset, usedStudents, usedItems);

        // Backtrack
        currentSubset.pop();
        for (const s of candidate.students) usedStudents.delete(s);
        for (const it of candidate.items) usedItems.delete(it);
      }
    }
  }

  searchDisjoint(0, [], new Set(), new Set());

  // Convert best subset into concrete Proposal objects
  const generatedProposals: Proposal[] = [];
  const now = Date.now();
  const FIVE_MINUTES_MS = 5 * 60 * 1000;

  for (const cycle of bestSubset) {
    const n = cycle.students.length;
    const members: ProposalMember[] = [];

    for (let i = 0; i < n; i++) {
      const studentId = cycle.students[i];
      const givesItemId = cycle.items[i];
      // receives item from student (i - 1 + n) % n
      const prevIndex = (i - 1 + n) % n;
      const receivesItemId = cycle.items[prevIndex];
      const studentUser = userMap.get(studentId);

      members.push({
        studentId,
        codename: `Swapper ${i + 1}`,
        name: studentUser?.name || `Swapper ${i + 1}`,
        contactNote: 'Awaiting item deposit',
        givesItemId,
        receivesItemId,
        accepted: true,
        handoverChoice: 'desk',
        dropoffCode: generate6DigitCode(),
        dropoffDone: false,
        pickupCode: generate6DigitCode(),
        pickupDone: false
      });
    }

    generatedProposals.push({
      id: `0${Math.floor(100 + Math.random() * 900)}`,
      type: cycle.type,
      members,
      status: 'eligible',
      handoverMethod: 'desk',
      createdAt: now,
      expiresAt: now + FIVE_MINUTES_MS,
      signature: cycle.signature
    });
  }

  return generatedProposals;
}
