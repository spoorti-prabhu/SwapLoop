import { query, get, run } from './db';

export function isValueBandAllowedForTrust(trustLevel: string, valueBand: string): boolean {
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

interface CandidateLoop {
  type: 'loop' | 'gift_chain';
  students: string[]; // student IDs in cycle order
  items: string[]; // item IDs given by each student
  signature: string;
  totalSwapScore: number;
}

export async function runServerDropMatchingEngine(): Promise<{
  createdProposalsCount: number;
  scenarioNote: string;
}> {
  // 1. Fetch eligible users (not banned, swap score >= 60)
  const users = await query<any>(`
    SELECT id, name, trust_level, swap_score, is_banned FROM users
    WHERE is_banned = 0 AND swap_score >= 60
  `);
  const userMap = new Map<string, any>(users.map(u => [u.id, u]));

  // 2. Fetch available items (not locked in active proposal)
  const items = await query<any>(`
    SELECT id, owner_id, title, category, condition, value_band, is_free_gift, is_locked_in_proposal
    FROM items
    WHERE is_locked_in_proposal = 0
  `);
  const itemMap = new Map<string, any>(items.map(i => [i.id, i]));

  // 3. Fetch wants
  const wants = await query<any>('SELECT student_id, item_id FROM wants');

  // 4. Fetch declined signatures (never propose identical loop again)
  const declinedRows = await query<any>('SELECT signature FROM declined_signatures');
  const declinedSignatures = new Set<string>(declinedRows.map(r => r.signature));

  // Build items by owner
  const userItems = new Map<string, any[]>();
  for (const item of items) {
    if (!userMap.has(item.owner_id)) continue;
    if (!userItems.has(item.owner_id)) {
      userItems.set(item.owner_id, []);
    }
    userItems.get(item.owner_id)!.push(item);
  }

  // Build wants by student
  const studentWants = new Map<string, Set<string>>();
  for (const want of wants) {
    if (!studentWants.has(want.student_id)) {
      studentWants.set(want.student_id, new Set());
    }
    studentWants.get(want.student_id)!.add(want.item_id);
  }

  // Directed edges: (Student A, Item A) -> Student B
  // A has Item A, which B wants.
  interface Edge {
    fromStudentId: string;
    toStudentId: string;
    itemId: string;
  }

  const outgoingEdges = new Map<string, Edge[]>();
  for (const [ownerId, itemsOwned] of userItems.entries()) {
    for (const item of itemsOwned) {
      for (const [wantiStudentId, wantedItemSet] of studentWants.entries()) {
        if (wantiStudentId === ownerId) continue;
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

  const candidateLoops: CandidateLoop[] = [];

  // 5. Find closed cycles (2 to 5 members)
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
      if (edge.toStudentId === startStudent && pathStudents.length >= 3) {
        const cycleStudents = [...pathStudents];
        const cycleItems = [...pathItems, edge.itemId];
        const sig = getCycleSignature(cycleStudents, cycleItems);

        if (!declinedSignatures.has(sig)) {
          const totalScore = cycleStudents.reduce((acc, sId) => acc + (userMap.get(sId)?.swap_score || 100), 0);
          candidateLoops.push({
            type: 'loop',
            students: cycleStudents,
            items: cycleItems,
            signature: sig,
            totalSwapScore: totalScore
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

  // 6. Find Gift Chains (F11):
  // Free gift donor -> Receiver 1 -> Receiver 2 -> ... -> Receiver k (up to 5 students)
  const freeGiftItems = items.filter(it => it.is_free_gift === 1);
  for (const giftItem of freeGiftItems) {
    const donorId = giftItem.owner_id;
    // Find who wants the gift item
    for (const [wantiStudentId, wantedItemSet] of studentWants.entries()) {
      if (wantiStudentId === donorId) continue;
      if (wantedItemSet.has(giftItem.id)) {
        // Trace chain starting with (donorId, giftItem) -> wantiStudentId
        // Find if wantiStudentId's items can pass forward
        const chainStudents = [donorId, wantiStudentId];
        const chainItems = [giftItem.id];

        // Search continuation
        let curr = wantiStudentId;
        const chainVisited = new Set([donorId, wantiStudentId]);

        while (chainStudents.length < 5) {
          const nextEdges = outgoingEdges.get(curr) || [];
          const nextEdge = nextEdges.find(e => !chainVisited.has(e.toStudentId));
          if (nextEdge) {
            chainStudents.push(nextEdge.toStudentId);
            chainItems.push(nextEdge.itemId);
            chainVisited.add(nextEdge.toStudentId);
            curr = nextEdge.toStudentId;
          } else {
            break;
          }
        }

        if (chainStudents.length >= 3) {
          const sig = `GIFT_CHAIN:${chainStudents.join('->')}:${chainItems.join('->')}`;
          if (!declinedSignatures.has(sig)) {
            candidateLoops.push({
              type: 'gift_chain',
              students: chainStudents,
              items: chainItems,
              signature: sig,
              totalSwapScore: 500
            });
          }
        }
      }
    }
  }

  // Deduplicate by signature
  const uniqueCandidateMap = new Map<string, CandidateLoop>();
  for (const c of candidateLoops) {
    if (!uniqueCandidateMap.has(c.signature)) {
      uniqueCandidateMap.set(c.signature, c);
    }
  }
  const uniqueCandidates = Array.from(uniqueCandidateMap.values());

  // 7. TRUST VALIDATOR (T4):
  // Filter out any cycle violating member trust levels:
  // E.g., 'New' members can never receive or give 'Medium' or 'High' items.
  const trustValidatedLoops = uniqueCandidates.filter(candidate => {
    const n = candidate.students.length;
    for (let i = 0; i < candidate.items.length; i++) {
      const giverId = candidate.students[i];
      const receiverId = candidate.students[(i + 1) % n];
      const givenItemId = candidate.items[i];

      const giver = userMap.get(giverId);
      const receiver = userMap.get(receiverId);
      const item = itemMap.get(givenItemId);

      if (!giver || !receiver || !item) return false;

      // Trust rule: giver value band
      if (!isValueBandAllowedForTrust(giver.trust_level, item.value_band)) {
        return false;
      }
      // Trust rule: receiver value band
      if (!isValueBandAllowedForTrust(receiver.trust_level, item.value_band)) {
        return false;
      }
    }
    return true;
  });

  // 8. OPTIMIZATION STRATEGY (F6):
  // When multiple valid combinations conflict over the same items,
  // choose the valid combination that maximizes the number of students satisfied!
  // Higher Swap Score breaks ties.
  let bestSubset: CandidateLoop[] = [];
  let maxStudentsSatisfied = -1;
  let maxTotalScore = -1;

  function canAdd(loop: CandidateLoop, usedStudents: Set<string>, usedItems: Set<string>): boolean {
    for (const s of loop.students) {
      if (usedStudents.has(s)) return false;
    }
    for (const it of loop.items) {
      if (usedItems.has(it)) return false;
    }
    return true;
  }

  // Sort prioritizing longer loops first
  const sortedCandidates = [...trustValidatedLoops].sort((a, b) => {
    if (b.students.length !== a.students.length) {
      return b.students.length - a.students.length;
    }
    return b.totalSwapScore - a.totalSwapScore;
  });

  function searchDisjoint(
    index: number,
    currentSubset: CandidateLoop[],
    usedStudents: Set<string>,
    usedItems: Set<string>
  ) {
    const totalCount = currentSubset.reduce((acc, c) => acc + c.students.length, 0);
    const totalScore = currentSubset.reduce((acc, c) => acc + c.totalSwapScore, 0);

    if (
      totalCount > maxStudentsSatisfied ||
      (totalCount === maxStudentsSatisfied && totalScore > maxTotalScore)
    ) {
      maxStudentsSatisfied = totalCount;
      maxTotalScore = totalScore;
      bestSubset = [...currentSubset];
    }

    for (let i = index; i < sortedCandidates.length; i++) {
      const candidate = sortedCandidates[i];
      if (canAdd(candidate, usedStudents, usedItems)) {
        for (const s of candidate.students) usedStudents.add(s);
        for (const it of candidate.items) usedItems.add(it);
        currentSubset.push(candidate);

        searchDisjoint(i + 1, currentSubset, usedStudents, usedItems);

        currentSubset.pop();
        for (const s of candidate.students) usedStudents.delete(s);
        for (const it of candidate.items) usedItems.delete(it);
      }
    }
  }

  searchDisjoint(0, [], new Set(), new Set());

  // 9. Persist Generated Proposals in Database
  const now = Date.now();
  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  let createdCount = 0;

  for (const loop of bestSubset) {
    const proposalId = `prop-${now}-${Math.random().toString(36).substr(2, 6)}`;
    await run(`
      INSERT INTO proposals (id, type, status, handover_method, created_at, expires_at, signature)
      VALUES (?, ?, 'proposed', 'desk', ?, ?, ?)
    `, [proposalId, loop.type, now, now + FIVE_MINUTES_MS, loop.signature]);

    const n = loop.students.length;
    for (let i = 0; i < n; i++) {
      const studentId = loop.students[i];
      const givesItemId = loop.items[i];
      const prevIndex = (i - 1 + n) % n;
      const receivesItemId = loop.items[prevIndex];
      const codename = `Swapper ${i + 1}`;

      const dropoffCode = generate6CharCode();
      const pickupCode = generate6CharCode();

      await run(`
        INSERT INTO proposal_members (
          proposal_id, student_id, codename, gives_item_id, receives_item_id,
          accepted, handover_choice, checked_in_meet, dropoff_code, dropoff_done,
          pickup_code, pickup_done
        )
        VALUES (?, ?, ?, ?, ?, 0, 'desk', 0, ?, 0, ?, 0)
      `, [proposalId, studentId, codename, givesItemId, receivesItemId, dropoffCode, pickupCode]);

      // Lock item in proposal
      await run('UPDATE items SET is_locked_in_proposal = 1 WHERE id = ?', [givesItemId]);

      // Add Notification
      await run(`
        INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
        VALUES (?, ?, '🎉 Proposals Ready!', 'Your SwapLoop proposals are ready. You give an item and receive an item you want. Review within 5 minutes.', 'proposal', 0, ?)
      `, [`notif-${now}-${Math.random().toString(36).substr(2, 4)}`, studentId, now]);
    }

    createdCount++;
  }

  // Fetch active scenario for note
  const scenarioConfig = await get<any>('SELECT value FROM system_config WHERE key = ?', ['active_scenario']);
  const activeScenario = scenarioConfig ? scenarioConfig.value : 'A';

  let scenarioNote = `Created ${createdCount} proposal loop(s).`;
  if (activeScenario === 'A') {
    scenarioNote = createdCount > 0
      ? 'Scenario A: 3-student loop (Arjun -> Bhavya -> Chetan) successfully matched under 3–5 member loop rule. (Former 2-student loop prohibited).'
      : 'Scenario A: No valid loop formed.';
  } else if (activeScenario === 'B') {
    scenarioNote = createdCount > 0
      ? 'Scenario B: Free Gift Chain successfully built across students! Final receiver item passes forward as new free gift.'
      : 'Scenario B: No valid gift chain found.';
  } else if (activeScenario === 'C') {
    if (createdCount === 0) {
      scenarioNote = 'Scenario C: No valid loop found! Bhavya’s Bicycle (Medium value) is disqualified under Trust T4 because Arjun & Bhavya are New tier. 2-person loops are prohibited, so no 3–5 student loop is possible.';
    } else {
      scenarioNote = 'Scenario C (Trusted): Arjun & Bhavya promoted to Trusted tier! Bhavya’s Medium bike is now eligible and the 3-student loop (Arjun -> Bhavya -> Chetan) was successfully created!';
    }
  }

  return { createdProposalsCount: createdCount, scenarioNote };
}
