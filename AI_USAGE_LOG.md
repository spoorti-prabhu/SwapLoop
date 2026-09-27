# SwapLoop — AI Usage Log & Engineering Journal

This document records the engineering lifecycle and collaboration with AI throughout the development of **SwapLoop**, a campus circular economy item-swapping web application. Each entry documents the task, AI generation, verification procedures, flaws detected, and the engineering refinements applied.

---

## Table of Entries
1. [Entry 1: Initial Project Scaffolding & Blush Mist Design System](#entry-1-initial-project-scaffolding--blush-mist-design-system)
2. [Entry 2: Directed Graph Cycle Detection & Free Gift Chain Engine](#entry-2-directed-graph-cycle-detection--free-gift-chain-engine)
3. [Entry 3: Disjoint-Set Max-Student Optimization & Tie-Breaking (F6)](#entry-3-disjoint-set-max-student-optimization--tie-breaking-f6)
4. [Entry 4: Strict Blind Proposal Security & Network Payload Sanitization (F7)](#entry-4-strict-blind-proposal-security--network-payload-sanitization-f7)
5. [Entry 5: Swap Desk Escrow Station & Atomic Pickup Release (T2, T3)](#entry-5-swap-desk-escrow-station--atomic-pickup-release-t2-t3)
6. [Entry 6: Trust Tier Value Bands (T4) & Swap Score Recalculation Engine](#entry-6-trust-tier-value-bands-t4--swap-score-recalculation-engine)
7. [Entry 7: Peer-to-Peer Swap Meet Flow with Anti-Fake Quad Geofence](#entry-7-peer-to-peer-swap-meet-flow-with-anti-fake-quad-geofence)
8. [Entry 8: Edge Cases — Proposal Expiration, Declines & Ban Thresholds](#entry-8-edge-cases--proposal-expiration-declines--ban-thresholds)
9. [Entry 9: SQLite Persistent Schema, Foreign Keys & Migration Engine](#entry-9-sqlite-persistent-schema-foreign-keys--migration-engine)
10. [Entry 10: Frontend Reactive State, Optimistic Updates & E2E Scenario Verification](#entry-10-frontend-reactive-state-optimistic-updates--e2e-scenario-verification)

---

### Entry 1: Initial Project Scaffolding & Blush Mist Design System

#### 1. What was asked
Scaffold the initial React 18 + Vite + Tailwind CSS project for SwapLoop. Configure the aesthetic guidelines according to the specification: blush mist canvas (`#FFF7F9`), pure white cards (`#FFFFFF`), primary rose accents (`#F472B6`, `#FB7185`), deep charcoal/plum text (`#1D1722`), and delicate borders (`#FDE7F0`). Create the custom logo with two curved interlocking S-loop arrows and an energy spark.

#### 2. What AI produced
- Set up `package.json`, `vite.config.ts`, `tailwind.config.js`, and `postcss.config.js`.
- Generated `src/components/BrandLogo.tsx` with inline SVG markup.
- Created layout wrappers with pastel classes (`bg-[#fff7f9]`, `rounded-3xl`, `shadow-sm`).

#### 3. What was correct
- Tailwind color palette extensions mapped accurately to the specified hex codes.
- Font styling maintained high contrast with deep plum/charcoal typography instead of standard gray.
- Rounded corners (`rounded-3xl` and `rounded-2xl`) gave the UI the signature friendly, modern aesthetic.

#### 4. What was wrong or incomplete
- The initial SVG logo produced by the AI was a generic recycling symbol with three identical triangles rather than the custom "S-shaped interlocking curved loop with an energetic spark" specified in Section 3 of the design specification.
- Tailwind was missing custom color aliases in `tailwind.config.js`, requiring long arbitrary hex utilities like `bg-[#fff7f9]` everywhere instead of semantic tokens like `bg-blush-50` and `text-plum-900`.
- Missing proxy configuration in `vite.config.ts` for forwarding `/api` calls to the Express backend.

#### 5. How it was verified
- Inspected the rendered DOM in Vite dev server at `http://127.0.0.1:5173`.
- Tested responsive scaling of the logo across mobile (375px) and desktop viewports.
- Ran TypeScript compilation check `npx tsc --noEmit`.

#### 6. What was changed
- Replaced the generic recycling SVG with an authentic bespoke dual-curved path creating an "S" monogram loop with forward and backward arrowheads plus a 4-point golden spark (`#F472B6` and `#F59E0B`).
- Added proxy in `vite.config.ts`:
  ```typescript
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  }
  ```
- Configured semantic color names in `tailwind.config.js` (`blush`, `roseAccent`, `charcoalPlum`, `borderBlush`).

---

### Entry 2: Directed Graph Cycle Detection & Free Gift Chain Engine

#### 2.1. What was asked
Implement the core algorithmic Drop matching engine in TypeScript on the server. The engine must build a directed graph where vertices are students and edges represent want-requests for specific items. Find all simple cycles of length $2 \le k \le 5$ and identify free gift chains (F11) where an unreciprocated gift seeds a downstream trade sequence.

#### 2.2. What AI produced
- A recursive Depth-First Search (DFS) algorithm that visited adjacent nodes based on item desires.
- An edge-building map querying active items and wants from the database.
- A rudimentary gift chain finder that checked if any item had `category === 'Gift'`.

#### 2.3. What was correct
- The adjacency list representation correctly mapped `userId -> Array<{ toUserId, itemId, wantId }>`.
- Basic 2-person reciprocal trades ($A \leftrightarrow B$) were correctly identified.
- Recursion depth was bounded at 5 to avoid combinatorial explosion on dense campus graphs.

#### 2.4. What was wrong or incomplete
- **Cycle Duplication**: The DFS produced cyclical permutations of the identical cycle (e.g., $A \to B \to C \to A$, $B \to C \to A \to B$, and $C \to A \to B \to C$ were all emitted as distinct cycles).
- **Self-Loops & Multi-edges**: Students wanting multiple items from the same student created duplicate edges, causing spurious duplicate loops.
- **Gift Chain Misconception**: The AI treated "Gift" as a category rather than a flag or zero-expectation item, and failed to model the requirement that the terminal receiver in a gift chain must offer a downstream item into the pool to keep circular value moving.

#### 2.5. How it was verified
- Unit tested the engine with mock graph fixtures:
  - 3-student loop ($A \to B \to C \to A$)
  - 2-student loop ($A \leftrightarrow D$)
- Verified that cycles were canonicalized and unique by running test passes and printing cycle keys.

#### 2.6. What was changed
- Canonicalized cycles using lexicographical minimum rotation to guarantee uniqueness:
  ```typescript
  function canonicalizeCycle(members: string[]): string {
    const minId = members.reduce((min, cur) => cur < min ? cur : min, members[0]);
    const idx = members.indexOf(minId);
    const rotated = [...members.slice(idx), ...members.slice(0, idx)];
    return rotated.join('->');
  }
  ```
- Deduped edges between identical pairs of students to preserve single best item priority.
- Modeled Free Gift Chains (F11) correctly: nodes with `is_gift = 1` initiate a chain where downstream receivers pass an item forward, terminating with a community gift entry.

---

### Entry 3: Disjoint-Set Max-Student Optimization & Tie-Breaking (F6)

#### 3.1. What was asked
Implement the global optimizer for the Daily Drop. When multiple valid cycles share the same items or students (contested items), the engine must find a mutually disjoint set of cycles that maximizes the total number of students receiving items ($\max \sum |C_i|$). If two subsets have equal student counts, break the tie using aggregate Swap Score.

#### 3.2. What AI produced
- A greedy selector that sorted detected cycles in descending order of length, picked the longest cycle, eliminated all overlapping candidates, and proceeded down the list.

#### 3.3. What was correct
- Identified the conflict constraint: no student $S_i$ or item $I_j$ can appear in more than one accepted proposal in the same Drop batch.
- Calculating the sum of lengths as the objective function.

#### 3.4. What was wrong or incomplete
- **Suboptimal Greedy Choice**: The greedy heuristic of "always pick the longest cycle first" can be mathematically suboptimal. For instance, picking one 4-student cycle can preclude two independent 3-student cycles ($4 < 3 + 3 = 6$).
- In Scenario A, Arjun's mini drafter was contested between a 3-way loop ($A \to B \to C \to A$) and a 2-way loop ($A \leftrightarrow D$). While greedy happened to work for $3 > 2$, it failed on complex overlapping graph clusters.
- The tie-breaking logic completely ignored the specification's mandate to use sum of member **Swap Scores** when student satisfaction counts were identical.

#### 3.5. How it was verified
- Created a test case with conflicting cycles:
  - Cycle 1: Students {1, 2, 3, 4} (length 4)
  - Cycle 2: Students {1, 5, 6} (length 3)
  - Cycle 3: Students {4, 7, 8} (length 3)
- Greedy selected Cycle 1 (4 students satisfied).
- Optimal branch-and-bound selects Cycle 2 + Cycle 3 (6 students satisfied).

#### 3.6. What was changed
- Implemented an exact backtracking branch-and-bound disjoint-set solver:
  ```typescript
  function findOptimalDisjointCycles(cycles: CandidateCycle[]): CandidateCycle[] {
    let bestSet: CandidateCycle[] = [];
    let maxStudents = 0;
    let maxScore = 0;

    function search(index: number, currentSet: CandidateCycle[], usedStudents: Set<string>, usedItems: Set<string>) {
      if (index === cycles.length) {
        const studentCount = currentSet.reduce((sum, c) => sum + c.members.length, 0);
        const scoreSum = currentSet.reduce((sum, c) => sum + c.totalSwapScore, 0);
        if (studentCount > maxStudents || (studentCount === maxStudents && scoreSum > maxScore)) {
          bestSet = [...currentSet];
          maxStudents = studentCount;
          maxScore = scoreSum;
        }
        return;
      }

      const cycle = cycles[index];
      const hasConflict = cycle.members.some(m => usedStudents.has(m.userId)) ||
                          cycle.transfers.some(t => usedItems.has(t.giveItemId));

      if (!hasConflict) {
        cycle.members.forEach(m => usedStudents.add(m.userId));
        cycle.transfers.forEach(t => usedItems.add(t.giveItemId));
        currentSet.push(cycle);

        search(index + 1, currentSet, usedStudents, usedItems);

        currentSet.pop();
        cycle.members.forEach(m => usedStudents.delete(m.userId));
        cycle.transfers.forEach(t => usedItems.delete(t.giveItemId));
      }

      // Branch without picking current cycle
      search(index + 1, currentSet, usedStudents, usedItems);
    }

    search(0, [], new Set(), new Set());
    return bestSet;
  }
  ```

---

### Entry 4: Strict Blind Proposal Security & Network Payload Sanitization (F7)

#### 4.1. What was asked
Implement the Strict Blind Proposal security model (Section 13, F7). During the 5-minute proposal acceptance phase, participants must only see item details, condition, value tier, and member nicknames (e.g., "Swapper #1"). Real names, college email addresses, phone numbers, and private contact notes must never be leaked over the network until 100% of participants accept.

#### 4.2. What AI produced
- React frontend components that used conditional rendering:
  ```jsx
  {proposal.status === 'sealed' ? user.realName : 'Swapper #1'}
  ```
- Express backend endpoints that returned the complete user object containing `real_name`, `email`, and `contact_note`.

#### 4.3. What was correct
- The visual presentation on the frontend correctly hid the names when the state was `'proposed'`.
- The user interface informed students that contact details would remain locked until all members confirmed.

#### 4.4. What was wrong or incomplete
- **Severe Security Vulnerability**: Obfuscating sensitive personal contact information in the frontend UI while sending real emails and hostel room contact notes in the raw JSON response payload is a critical flaw. Any student opening Chrome DevTools / Network tab could inspect the JSON response and see private names and room numbers before accepting.
- The server did not sanitize proposal member records in `/api/proposals` or `/api/proposals/:id`.

#### 4.5. How it was verified
- Simulated an active proposal via `curl http://localhost:3001/api/proposals` while authenticated as a participating student.
- Inspected the raw response text before sealing. Verified that `real_name` and `contact_note` were visible in the AI's original endpoint output.

#### 4.6. What was changed
- Enforced strict server-side sanitization in Express route handlers before sending payloads:
  ```typescript
  export function sanitizeProposalForStudent(proposal: ProposalWithMembers, currentUserId: string) {
    const isSealedOrCompleted = proposal.status === 'sealed' || proposal.status === 'completed';
    return {
      ...proposal,
      members: proposal.members.map(m => {
        if (m.userId === currentUserId || isSealedOrCompleted) {
          return m; // Self details or sealed details are permitted
        }
        return {
          ...m,
          name: `Swapper #${m.position}`,
          email: undefined,
          contactNote: undefined,
          avatarUrl: null
        };
      })
    };
  }
  ```
- Tested via API calls to ensure that unauthorized network snooping yields only sanitized pseudonyms.

---

### Entry 5: Swap Desk Escrow Station & Atomic Pickup Release (T2, T3)

#### 5.1. What was asked
Implement the Swap Desk escrow station workflow (Section 16, T2 & T3). The campus desk operates with physical QR/alphanumeric check-ins. When a proposal is routed through Swap Desk, each student receives a dropoff code. Crucially: **Pickup codes must remain locked until ALL participating items are physically verified at the desk**. If the deadline expires with missing items, the system must trigger failure mode and issue return codes for deposited items.

#### 5.2. What AI produced
- A Swap Desk operator UI where the operator could input a code to mark an item as dropped off.
- Automatically displayed both dropoff and pickup codes simultaneously on the student's dashboard.

#### 5.3. What was correct
- The desk operator portal permitted code entry and verification.
- Item state transitioned from `pending` to `dropped_off`.

#### 5.4. What was wrong or incomplete
- **Fundamental Escrow Failure**: Generating and showing pickup codes to students before items were deposited breaks the entire physical escrow guarantee. A student could obtain their pickup code and retrieve an item even if other members never dropped off their items.
- No deadline enforcement logic for partial dropoffs (e.g., Student A and B drop off, but Student C ghosts).
- Missing return code generation for failed proposals.

#### 5.5. How it was verified
- Walked through Scenario A at the Swap Desk. Checked if Arjun could see his pickup code before Chetan and Bhavya dropped off their items.
- Simulated a deadline timeout with only 2 of 3 items dropped off.

#### 5.6. What was changed
- Redesigned the database schema and API logic to enforce an escrow barrier:
  ```typescript
  // In server/index.ts desk dropoff handler
  const allDroppedOff = allMembers.every(m => m.item_dropped_off === 1);
  if (allDroppedOff) {
    // Atomically unlock pickup codes for all members
    await dbRun(`UPDATE proposals SET escrow_status = 'ready_for_pickup' WHERE id = ?`, [proposalId]);
    await notifyAllMembers(proposalId, 'All items received at Swap Desk! Your pickup code is now ready.');
  } else {
    // Keep pickup codes hidden and null in student API responses
  }
  ```
- Added deadline monitor: if `deadline_at` passes and `escrow_status !== 'ready_for_pickup'`, status transitions to `'failed'`, generating return codes for students who completed dropoff and deducting 20 Swap Score points from the ghosting member.

---

### Entry 6: Trust Tier Value Bands (T4) & Swap Score Recalculation Engine

#### 6.1. What was asked
Implement Trust T4 value band restrictions and the exact Swap Score calculation formula (Section 18–20). New students can only trade Low-value items ($\le \$15$). Trusted students can trade Low and Medium ($\le \$50$). Veterans can trade all tiers including High ($\le \$150$). Validate these rules in both item creation and Drop matching. Implement the score formula:
$$\text{Score} = 100 + (\text{Completed} \times 5) + (\text{Gifts} \times 8) - (\text{Declines} \times 5) - (\text{NoShows} \times 20) - (\text{UpheldReports} \times 15)$$

#### 6.2. What AI produced
- Static mock values for user trust levels in `localStorage`.
- Simple arithmetic addition when clicking "Complete Swap".
- No backend enforcement during item listing or matching engine execution.

#### 6.3. What was correct
- Display badges ("New", "Trusted", "Veteran") with appropriate colors (rose, green, purple).
- Correct coefficient weights in the score display tooltip.

#### 6.4. What was wrong or incomplete
- **Scenario C Failure**: In Scenario C, Bhavya lists a bicycle (Medium value). Chetan and Arjun have `New` trust status. The matching engine should disqualify the 3-student loop and fall back to the 2-student loop between Arjun and Divya (both Low value). Because the AI performed trust checks on the client only, the backend matching engine generated the illegal 3-way loop anyway.
- Swap Score was stored as a mutable integer without an audit log or automated recalculation from historical actions.

#### 6.5. How it was verified
- Ran the matching engine against Scenario C seeded data.
- Checked whether Bhavya's Medium-value bicycle was accepted into a loop containing New users.
- Inspected the returned cycle list.

#### 6.6. What was changed
- Added strict T4 filter into `server/engine.ts`:
  ```typescript
  function isCycleTrustValid(cycle: CandidateCycle, userTrustMap: Map<string, string>, itemMap: Map<string, Item>): boolean {
    for (const transfer of cycle.transfers) {
      const giverTrust = userTrustMap.get(transfer.fromUserId) || 'new';
      const receiverTrust = userTrustMap.get(transfer.toUserId) || 'new';
      const item = itemMap.get(transfer.giveItemId);
      if (!item) return false;

      // New users cannot receive or give Medium or High tier items
      if ((giverTrust === 'new' || receiverTrust === 'new') && item.value_tier !== 'low') {
        return false;
      }
      // Trusted users cannot receive or give High tier items
      if ((giverTrust === 'trusted' || receiverTrust === 'trusted') && item.value_tier === 'high') {
        return false;
      }
    }
    return true;
  }
  ```
- Implemented automated recalculation of Swap Score in `server/db.ts` triggered by any drop completion, report, decline, or desk forfeiture.

---

### Entry 7: Peer-to-Peer Swap Meet Flow with Anti-Fake Quad Geofence

#### 7.1. What was asked
Implement the alternative Swap Meet peer-to-peer exchange flow (Section 17 & 29). For students with `Trusted` status, allow direct handover at designated campus zones (e.g., Central Quad). Require students to check in within 50 meters of the designated GPS coordinates before generating verification codes, preventing remote code trading without physical item inspection.

#### 7.2. What AI produced
- A generic modal asking users to enter a 4-digit code.
- A button that read "Simulate GPS Check-in" which immediately passed `true` to the state without calculating distance.

#### 7.3. What was correct
- Provided an alternative tab/modal for the Swap Meet flow alongside Swap Desk.
- Clear step-by-step instructions for in-person item inspection before exchanging verification codes.

#### 7.4. What was wrong or incomplete
- No real browser `navigator.geolocation` integration.
- No Haversine formula to compute great-circle distance between the user's coordinates and the campus quad landmark (`lat: 28.5458, lng: 77.1926`).
- Lacked the dual-checkin gate: both exchanging parties must have verified GPS check-in at the quad before handoff verification codes unlock.

#### 7.5. How it was verified
- Tested in the browser using the Geolocation API.
- Verified coordinate distance calculation using positive and negative test coordinates (within 30m vs. 500m away).

#### 7.6. What was changed
- Implemented Haversine distance calculator on both client and server:
  ```typescript
  function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(deltaPhi / 2) ** 2 +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  ```
- Integrated real `navigator.geolocation.getCurrentPosition` with a dev-mode fallback coordinate simulator so evaluators can test the 50m geofence check-in seamlessly.

---

### Entry 8: Edge Cases — Proposal Expiration, Declines & Ban Thresholds

#### 8.1. What was asked
Implement robust handling of edge cases (Section 21–24):
1. **5-Minute Countdown**: If any participant fails to accept within 5 minutes, the proposal dissolves gracefully.
2. **Decline Signature Memory**: If a student declines a proposal, their reason is recorded, and the engine must never re-propose the identical cycle in subsequent drops.
3. **Ghosting Penalties & Ban Threshold**: Drop forfeiture deducts 20 score points. Any student whose Swap Score falls below 60 must be blocked from entering subsequent drops.

#### 8.2. What AI produced
- A simple client-side `setInterval` timer that reset on page reload.
- An alert dialog displaying "Proposal Cancelled" when decline was clicked.
- No persistent storage of declined signatures or score ban filters.

#### 8.3. What was correct
- Visual countdown timer showing MM:SS on the proposal card.
- User prompt asking for a decline reason ("Changed mind", "Item unavailable", "Prefer desk").

#### 8.4. What was wrong or incomplete
- Client-side timer reset meant a student could refresh the page to get another 5 minutes, violating synchronous drop fairness.
- The matching engine re-generated the exact same declined proposal immediately when "Trigger Daily Drop" was clicked again.
- Students with a score of 50 were still included in graph cycle finding.

#### 8.5. How it was verified
- Tested proposal decline in Scenario A: Arjun declined the 3-way loop.
- Triggered Drop again; verified whether the engine proposed the exact same loop or avoided it.
- Reduced student Swap Score to 55 and observed engine candidate selection.

#### 8.6. What was changed
- Added server-side expiration timestamp `expires_at` stored in SQLite; expired proposals transition to `'expired'` on read.
- Created `declined_signatures` table:
  ```sql
  CREATE TABLE IF NOT EXISTS declined_signatures (
    id TEXT PRIMARY KEY,
    cycle_signature TEXT UNIQUE,
    declined_by TEXT,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- Excluded banned members (`swap_score < 60`) from graph vertex construction:
  ```typescript
  const eligibleUsers = allUsers.filter(u => u.swap_score >= 60 && u.is_active === 1);
  ```

---

### Entry 9: SQLite Persistent Schema, Foreign Keys & Migration Engine

#### 9.1. What was asked
Replace any in-memory or volatile state with a real, persistent SQLite database stored in `server/data/swaploop.db`. The database must survive server restarts, implement proper relations, enforce foreign keys, and seed Scenarios A, B, and C with idempotency.

#### 9.2. What AI produced
- An initial script utilizing `better-sqlite3` which attempted to compile native C++ bindings.
- Unindexed tables with foreign keys declared but `PRAGMA foreign_keys = ON` omitted.

#### 9.3. What was correct
- Table schema covered the necessary entities: `users`, `items`, `wants`, `proposals`, `proposal_members`.
- Seed data contained correct user profiles (Arjun, Bhavya, Chetan, Divya).

#### 9.4. What was wrong or incomplete
- On Windows MinGW development environments, `better-sqlite3` failed native compilation during npm install due to node-gyp Visual Studio toolchain mismatches.
- `PRAGMA foreign_keys = ON` was not executed on connection open, allowing orphaned records if a user or item was deleted.
- Scenarios were hardcoded directly in server startup, causing duplicate entry crashes on restart when unique constraints were violated.

#### 9.5. How it was verified
- Tested server launch on Windows PowerShell with `npx tsx server/index.ts`.
- Verified database file creation at `server/data/swaploop.db`.
- Restarted the server three times to verify idempotent seeding without constraint violations.

#### 9.6. What was changed
- Replaced `better-sqlite3` with standard `sqlite3` using async/await wrapper functions (`dbRun`, `dbGet`, `dbAll`) that compile cleanly across all platforms.
- Enabled foreign key enforcement on every connection:
  ```typescript
  const db = new sqlite3.Database(DB_PATH);
  db.run('PRAGMA foreign_keys = ON;');
  ```
- Wrapped initial scenario seeds with `INSERT OR IGNORE` and transaction boundaries to guarantee safe restarts.

---

### Entry 10: Frontend Reactive State, Optimistic Updates & E2E Scenario Verification

#### 10.1. What was asked
Wire the React frontend context (`SwapLoopContext.tsx`) to the Express REST API. Provide optimistic UI updates for adding items, adding wants, accepting proposals, and switching roles/personas. Include a scenario control bar to load and test Scenarios A, B, and C with one click. Add confetti celebration on loop completion.

#### 10.2. What AI produced
- Created API service functions in `src/services/api.ts`.
- Implemented Context provider with `useState` and `useEffect` fetching.
- Added buttons in an Admin Control Bar.

#### 10.3. What was correct
- API endpoints were called using `fetch` with proper JSON headers.
- Confetti celebration using `canvas-confetti` fired when proposal status changed to `'completed'`.
- Role Switcher smoothly toggled between Student, Desk Operator, and Admin modes.

#### 10.4. What was wrong or incomplete
- When switching between students (e.g., Arjun to Bhavya), the UI lagged or retained stale proposal state from the previous user because proposal queries were not keyed to the active `currentUserId`.
- Missing error handling when the backend server was unreachable, leading to white-screen React render crashes.
- Category visual indicators used plain emoji icons instead of the custom SVG illustrations specified in Section 4.

#### 10.5. How it was verified
- Automated build verification: executed `npm run build` to confirm 0 TypeScript errors and clean bundle output.
- Interactively switched between Arjun, Bhavya, and Chetan while accepting a proposal; observed synchronization.
- Verified scenario switching from Admin Bar (Scenario A $\to$ Scenario B $\to$ Scenario C).

#### 10.6. What was changed
- Refactored `SwapLoopContext.tsx` to re-fetch all user-specific state atomically upon persona change.
- Added comprehensive try/catch boundaries and toast feedback for network operations.
- Built `CategoryVisual.tsx` featuring custom vector SVGs for all five categories (*Books*, *Electronics*, *Stationery*, *Furniture*, *Hostel Gear*).
- Validated end-to-end flow with zero build warnings and clean production assets.

---

## Summary of AI Strengths and Limitations Encountered

| Area | AI Initial Strength | Where AI Struggled | Human Architecture Fix |
| :--- | :--- | :--- | :--- |
| **Styling & Aesthetics** | Rapid Tailwind layout, pastel palettes | Used generic recycling iconography instead of the custom S-loop spark logo | Built custom mathematical SVG path with dual curved arrows and energy spark |
| **Matching Algorithms** | Basic DFS graph traversal | Permutation duplicates, greedy suboptimality in disjoint sets | Canonicalized cycles; implemented branch-and-bound max-student optimizer |
| **Security & Privacy** | Frontend UI conditional rendering | Leaked confidential contact notes in raw JSON network payloads | Implemented server-side data sanitization and blind proposal masking |
| **Escrow Mechanics** | Basic UI status flags | Unlocked pickup codes before all physical items were dropped off | Enforced strict atomic escrow barrier in backend with timeout return codes |
| **Trust & Rules** | Badge displays and formula definitions | Ignored value bands in backend engine (Scenario C failure) | Added T4 filter pipeline preventing New users from receiving Medium/High items |
| **Persistence** | Database schema structure | Native module compilation issues on Windows, lack of idempotency | Migrated to robust `sqlite3` driver with idempotent seed transactions |
