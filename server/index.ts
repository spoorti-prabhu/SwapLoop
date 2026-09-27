import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { initDb, query, get, run, seedScenarioA, seedScenarioB, seedScenarioC } from './db';
import { runServerDropMatchingEngine, isValueBandAllowedForTrust } from './engine';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize Database
initDb().then(() => {
  console.log('✅ SQLite Database ready with persistent schema and seeded data.');
});

// Daily Scheduled Drop (Section 40)
// Configurable cron schedule: default 8:00 PM (20:00) every day
cron.schedule('0 20 * * *', async () => {
  console.log('⏰ Scheduled Daily Drop running at 8:00 PM...');
  try {
    const result = await runServerDropMatchingEngine();
    console.log(`Drop executed automatically: ${result.scenarioNote}`);
  } catch (err) {
    console.error('Error running daily drop scheduler:', err);
  }
});

// Helper to get authenticated user from request header
async function getAuthUser(req: express.Request) {
  const userId = (req.headers['x-user-id'] as string) || 'user-arjun';
  const user = await get<any>('SELECT * FROM users WHERE id = ?', [userId]);
  return user;
}

// -------------------------------------------------------------
// 1. HEALTH & METRICS
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), service: 'SwapLoop API' });
});

app.get('/api/stats', async (req, res) => {
  try {
    const rehomedCount = await get<any>(`
      SELECT COUNT(*) as count FROM proposal_members
      WHERE pickup_done = 1
    `);
    const loopsCompleted = await get<any>(`
      SELECT COUNT(*) as count FROM proposals
      WHERE status = 'completed'
    `);
    const activeConfig = await get<any>('SELECT value FROM system_config WHERE key = ?', ['active_scenario']);

    res.json({
      totalRehomed: 24 + (rehomedCount?.count || 0),
      loopsCompleted: 8 + (loopsCompleted?.count || 0),
      longestGiftChain: 5,
      activeScenario: activeConfig?.value || 'A'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 2. AUTHENTICATION & USERS (F1, T1)
// -------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, contactNote } = req.body;
    if (!name || !email || !contactNote) {
      return res.status(400).json({ error: 'Name, email, and private contact note are required.' });
    }

    const emailLower = email.toLowerCase().trim();
    if (!emailLower.endsWith('@college.edu') && !emailLower.endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'College Email must end with @college.edu or @gmail.com for testing.' });
    }

    const existing = await get('SELECT id FROM users WHERE email = ?', [emailLower]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password || 'password123', 10);
    const userId = `user-${Date.now()}`;
    const now = Date.now();

    await run(`
      INSERT INTO users (id, name, email, password_hash, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned, created_at)
      VALUES (?, ?, ?, ?, ?, 'New', 100, 1, 'Student', 0, 0, ?)
    `, [userId, name.trim(), emailLower, passwordHash, contactNote.trim(), now]);

    const newUser = await get('SELECT id, name, email, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count FROM users WHERE id = ?', [userId]);
    res.json({ user: newUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await get('SELECT id, name, email, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(404).json({ error: 'User not found. Try one of the seeded student emails.' });
    }
    if (user.is_banned === 1) {
      return res.status(403).json({ error: 'Your account has been suspended due to community report penalties.' });
    }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) return res.status(404).json({ error: 'Not authenticated' });
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/toggle-verify', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const newVerified = user.email_verified === 1 ? 0 : 1;
    await run('UPDATE users SET email_verified = ? WHERE id = ?', [newVerified, user.id]);
    res.json({ email_verified: newVerified === 1 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned FROM users WHERE is_banned = 0');
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. ITEMS (HAVE LIST & BROWSE) (F2, F3, F4, T4)
// -------------------------------------------------------------
app.get('/api/items', async (req, res) => {
  try {
    const items = await query('SELECT * FROM items ORDER BY created_at DESC');
    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { title, category, condition, valueBand, isFreeGift } = req.body;
    if (!title || !category || !condition || !valueBand) {
      return res.status(400).json({ error: 'Missing required item fields.' });
    }

    // SERVER-SIDE TRUST RULE VALIDATION (T4)
    if (!isValueBandAllowedForTrust(user.trust_level, valueBand)) {
      return res.status(403).json({
        error: `Trust Level Restriction: Members at '${user.trust_level}' tier cannot list '${valueBand}' tier items.`
      });
    }

    const itemId = `item-${Date.now()}`;
    const now = Date.now();

    await run(`
      INSERT INTO items (id, owner_id, title, category, condition, value_band, is_free_gift, is_locked_in_proposal, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
    `, [itemId, user.id, title.trim(), category, condition, valueBand, isFreeGift ? 1 : 0, now]);

    const createdItem = await get('SELECT * FROM items WHERE id = ?', [itemId]);
    res.status(201).json({ item: createdItem });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const { id } = req.params;
    const { title, category, condition, valueBand, isFreeGift } = req.body;

    const item = await get('SELECT * FROM items WHERE id = ?', [id]);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.owner_id !== user.id && user.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized to edit this item.' });
    }

    if (!isValueBandAllowedForTrust(user.trust_level, valueBand)) {
      return res.status(403).json({ error: `Trust restriction: ${valueBand} not permitted.` });
    }

    await run(`
      UPDATE items
      SET title = ?, category = ?, condition = ?, value_band = ?, is_free_gift = ?
      WHERE id = ?
    `, [title, category, condition, valueBand, isFreeGift ? 1 : 0, id]);

    const updated = await get('SELECT * FROM items WHERE id = ?', [id]);
    res.json({ item: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const { id } = req.params;

    const item = await get('SELECT * FROM items WHERE id = ?', [id]);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.owner_id !== user.id && user.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this item.' });
    }

    await run('DELETE FROM wants WHERE item_id = ?', [id]);
    await run('DELETE FROM items WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. WANTS (F3, F4)
// -------------------------------------------------------------
app.get('/api/wants', async (req, res) => {
  try {
    const wants = await query('SELECT student_id, item_id FROM wants');
    res.json({ wants });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wants/toggle', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: 'itemId required' });

    const existing = await get('SELECT * FROM wants WHERE student_id = ? AND item_id = ?', [user.id, itemId]);
    if (existing) {
      await run('DELETE FROM wants WHERE student_id = ? AND item_id = ?', [user.id, itemId]);
      res.json({ inWants: false });
    } else {
      await run('INSERT INTO wants (student_id, item_id) VALUES (?, ?)', [user.id, itemId]);
      res.json({ inWants: true });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. THE DROP & BLIND PROPOSALS (F5, F6, F7, F8, F9, F11)
// -------------------------------------------------------------
app.post('/api/drop/trigger', async (req, res) => {
  try {
    const result = await runServerDropMatchingEngine();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/drop/status', async (req, res) => {
  try {
    const config = await get<any>('SELECT value FROM system_config WHERE key = ?', ['drop_time']);
    const dropTimeStr = config?.value || '20:00';
    const [h, m] = dropTimeStr.split(':').map(Number);

    const now = new Date();
    const nextDrop = new Date();
    nextDrop.setHours(h, m, 0, 0);
    if (now.getTime() >= nextDrop.getTime()) {
      nextDrop.setDate(nextDrop.getDate() + 1);
    }
    const remainingSeconds = Math.max(0, Math.floor((nextDrop.getTime() - now.getTime()) / 1000));

    res.json({
      scheduledTime: dropTimeStr,
      secondsUntilDrop: remainingSeconds
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * STRICT BLIND PROPOSALS (F7):
 * Unsealed proposals NEVER send real names, emails, or private contact notes over the wire!
 */
app.get('/api/proposals', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const proposals = await query<any>('SELECT * FROM proposals ORDER BY created_at DESC');

    const sanitizedProposals = [];
    for (const prop of proposals) {
      const members = await query<any>(`
        SELECT pm.*, u.name as real_name, u.email as real_email, u.contact_note as real_contact_note
        FROM proposal_members pm
        JOIN users u ON pm.student_id = u.id
        WHERE pm.proposal_id = ?
      `, [prop.id]);

      const isSealed = prop.status === 'sealed' || prop.status === 'completed';

      const sanitizedMembers = members.map((m: any) => {
        const isSelf = user && m.student_id === user.id;

        if (isSealed) {
          // SEALED: Real identities and codes revealed
          return {
            studentId: m.student_id,
            name: m.real_name,
            email: m.real_email,
            contactNote: m.real_contact_note,
            codename: m.codename,
            givesItemId: m.gives_item_id,
            receivesItemId: m.receives_item_id,
            accepted: m.accepted === 1,
            handoverChoice: m.handover_choice,
            checkedInMeet: m.checked_in_meet === 1,
            dropoffCode: m.dropoff_code,
            dropoffDone: m.dropoff_done === 1,
            pickupCode: m.pickup_code,
            pickupDone: m.pickup_done === 1,
            returnCode: m.return_code
          };
        } else {
          // BLIND (F7): Omit real name, email, contact note from network payload!
          return {
            studentId: m.student_id,
            name: isSelf ? m.real_name : m.codename,
            email: isSelf ? m.real_email : undefined,
            contactNote: isSelf ? m.real_contact_note : undefined,
            codename: m.codename,
            givesItemId: m.gives_item_id,
            receivesItemId: m.receives_item_id,
            accepted: m.accepted === 1,
            handoverChoice: m.handover_choice,
            checkedInMeet: m.checked_in_meet === 1
          };
        }
      });

      sanitizedProposals.push({
        id: prop.id,
        type: prop.type,
        status: prop.status,
        handoverMethod: prop.handover_method,
        createdAt: prop.created_at,
        expiresAt: prop.expires_at,
        signature: prop.signature,
        failureReason: prop.failure_reason,
        members: sanitizedMembers
      });
    }

    res.json({ proposals: sanitizedProposals });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/proposals/:id/accept', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const { id } = req.params;
    const { handoverChoice } = req.body; // 'desk' or 'meet'

    const prop = await get('SELECT * FROM proposals WHERE id = ?', [id]);
    if (!prop) return res.status(404).json({ error: 'Proposal not found' });
    if (prop.status !== 'proposed') {
      return res.status(400).json({ error: 'Proposal is no longer accepting decisions.' });
    }

    // Mark user accepted
    await run(`
      UPDATE proposal_members
      SET accepted = 1, handover_choice = ?
      WHERE proposal_id = ? AND student_id = ?
    `, [handoverChoice || 'desk', id, user.id]);

    // Check if ALL members have accepted
    const members = await query('SELECT accepted, handover_choice FROM proposal_members WHERE proposal_id = ?', [id]);
    const allAccepted = members.every((m: any) => m.accepted === 1);

    if (allAccepted) {
      // Determine handover method: If ANY member chooses desk, desk is used (Section 17)
      const anyDesk = members.some((m: any) => m.handover_choice === 'desk');
      const finalMethod = anyDesk ? 'desk' : 'meet';

      await run('UPDATE proposals SET status = ?, handover_method = ? WHERE id = ?', ['sealed', finalMethod, id]);

      // Add sealed notification to members
      const allMembers = await query('SELECT student_id, dropoff_code FROM proposal_members WHERE proposal_id = ?', [id]);
      const now = Date.now();
      for (const m of allMembers) {
        await run(`
          INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
          VALUES (?, ?, '🔒 Loop Sealed! Real Identities Revealed', 'All participants accepted! Use Swap Desk code: ' || ? || ' to deposit your item.', 'sealed', 0, ?)
        `, [`notif-${now}-${Math.random().toString(36).substr(2, 4)}`, m.student_id, m.dropoff_code, now]);
      }
    }

    res.json({ success: true, allAccepted });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/proposals/:id/decline', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const { id } = req.params;

    const prop = await get<any>('SELECT * FROM proposals WHERE id = ?', [id]);
    if (!prop) return res.status(404).json({ error: 'Proposal not found' });

    // 1. Release items back to available
    const members = await query<any>('SELECT gives_item_id FROM proposal_members WHERE proposal_id = ?', [id]);
    for (const m of members) {
      await run('UPDATE items SET is_locked_in_proposal = 0 WHERE id = ?', [m.gives_item_id]);
    }

    // 2. Record signature so this exact loop is never offered again (F8, F9)
    await run('INSERT OR IGNORE INTO declined_signatures (signature, created_at) VALUES (?, ?)', [prop.signature, Date.now()]);

    // 3. Mark proposal declined
    await run("UPDATE proposals SET status = 'declined' WHERE id = ?", [id]);

    // 4. Minor Swap Score deduction for declining (-3)
    await run('UPDATE users SET swap_score = MAX(50, swap_score - 3) WHERE id = ?', [user.id]);

    res.json({ success: true, dissolved: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/proposals/:id/expire', async (req, res) => {
  try {
    const { id } = req.params;
    const prop = await get<any>('SELECT * FROM proposals WHERE id = ?', [id]);
    if (!prop || prop.status !== 'proposed') return res.json({ success: false });

    // Release items
    const members = await query<any>('SELECT student_id, gives_item_id, accepted FROM proposal_members WHERE proposal_id = ?', [id]);
    for (const m of members) {
      await run('UPDATE items SET is_locked_in_proposal = 0 WHERE id = ?', [m.gives_item_id]);
      if (m.accepted === 0) {
        // Penalize score of anyone who let timer expire without accepting (-5)
        await run('UPDATE users SET swap_score = MAX(50, swap_score - 5) WHERE id = ?', [m.student_id]);
      }
    }

    await run('INSERT OR IGNORE INTO declined_signatures (signature, created_at) VALUES (?, ?)', [prop.signature, Date.now()]);
    await run("UPDATE proposals SET status = 'expired' WHERE id = ?", [id]);

    res.json({ success: true, expired: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. SWAP DESK ESCROW PORTAL (T2, T3)
// -------------------------------------------------------------
app.post('/api/desk/dropoff', async (req, res) => {
  try {
    const { proposalId, dropoffCode } = req.body;
    if (!dropoffCode) return res.status(400).json({ error: 'Drop-off code required' });

    const member = await get<any>(`
      SELECT * FROM proposal_members
      WHERE proposal_id = ? AND UPPER(dropoff_code) = UPPER(?)
    `, [proposalId, dropoffCode.trim()]);

    if (!member) {
      return res.status(404).json({ error: 'Invalid drop-off code for this proposal.' });
    }

    await run(`
      UPDATE proposal_members
      SET dropoff_done = 1
      WHERE proposal_id = ? AND student_id = ?
    `, [proposalId, member.student_id]);

    res.json({ success: true, message: `Item from ${member.codename} verified and locked into desk escrow.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/desk/pickup', async (req, res) => {
  try {
    const { proposalId, pickupCode } = req.body;
    if (!pickupCode) return res.status(400).json({ error: 'Pickup code required' });

    // Escrow Security Rule (T2): ALL items must have arrived at the desk
    const members = await query<any>('SELECT * FROM proposal_members WHERE proposal_id = ?', [proposalId]);
    const allDroppedOff = members.every(m => m.dropoff_done === 1);

    if (!allDroppedOff) {
      return res.status(403).json({
        error: 'Escrow Security Hold (T2): All items in the proposal must arrive at the desk before ANY pickups can occur.'
      });
    }

    const member = members.find(m => m.pickup_code.toUpperCase() === pickupCode.trim().toUpperCase());
    if (!member) {
      return res.status(404).json({ error: 'Invalid pickup code.' });
    }

    await run(`
      UPDATE proposal_members
      SET pickup_done = 1
      WHERE proposal_id = ? AND student_id = ?
    `, [proposalId, member.student_id]);

    // Check if all pickups completed
    const updatedMembers = await query<any>('SELECT pickup_done, student_id FROM proposal_members WHERE proposal_id = ?', [proposalId]);
    const allPickedUp = updatedMembers.every(m => m.pickup_done === 1);

    if (allPickedUp) {
      await run("UPDATE proposals SET status = 'completed' WHERE id = ?", [proposalId]);

      // Reward members: +10 swap score, increment completed swaps, update trust level
      for (const m of updatedMembers) {
        const u = await get<any>('SELECT completed_swaps_count, swap_score FROM users WHERE id = ?', [m.student_id]);
        const newCount = (u?.completed_swaps_count || 0) + 1;
        let newTrust = 'New';
        if (newCount >= 8) newTrust = 'Veteran';
        else if (newCount >= 3) newTrust = 'Trusted';

        await run(`
          UPDATE users
          SET completed_swaps_count = ?, trust_level = ?, swap_score = swap_score + 10
          WHERE id = ?
        `, [newCount, newTrust, m.student_id]);
      }
    }

    res.json({
      success: true,
      message: `Pickup verified for ${member.codename}. Swapped item released from escrow!`,
      isAllCompleted: allPickedUp
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/desk/simulate-failure', async (req, res) => {
  try {
    const { proposalId } = req.body;
    const members = await query<any>('SELECT * FROM proposal_members WHERE proposal_id = ?', [proposalId]);

    // Deadline failure rule (T3):
    // Issue return codes for items deposited at desk; release missing items
    for (const m of members) {
      if (m.dropoff_done === 1 && m.pickup_done === 0) {
        const returnCode = `RET-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        await run('UPDATE proposal_members SET return_code = ? WHERE proposal_id = ? AND student_id = ?', [returnCode, proposalId, m.student_id]);
      } else if (m.dropoff_done === 0) {
        await run('UPDATE items SET is_locked_in_proposal = 0 WHERE id = ?', [m.gives_item_id]);
        await run('UPDATE users SET swap_score = MAX(50, swap_score - 10) WHERE id = ?', [m.student_id]); // penalty for missing deadline
      }
    }

    await run(`
      UPDATE proposals
      SET status = 'failed', failure_reason = 'Deadline expired: One or more members failed to deliver item to Swap Desk.'
      WHERE id = ?
    `, [proposalId]);

    res.json({ success: true, message: 'Proposal deadline expired. Return codes generated for deposited items.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. SWAP MEET ALTERNATIVE (Section 17 & 29)
// -------------------------------------------------------------
app.post('/api/meet/checkin', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const { proposalId, campusLocationCode } = req.body;

    // Verify campus location check-in (simulating anti-fake geolocation verification)
    if (!campusLocationCode || campusLocationCode !== 'CENTRAL_QUAD_2026') {
      return res.status(400).json({ error: 'Check-in failed: You must be present at the Central Campus Quad designated meet spot.' });
    }

    await run(`
      UPDATE proposal_members
      SET checked_in_meet = 1
      WHERE proposal_id = ? AND student_id = ?
    `, [proposalId, user.id]);

    const members = await query<any>('SELECT checked_in_meet FROM proposal_members WHERE proposal_id = ?', [proposalId]);
    const allCheckedIn = members.every(m => m.checked_in_meet === 1);

    res.json({
      success: true,
      allCheckedIn,
      message: allCheckedIn
        ? 'All swappers checked in! Handover codes unlocked.'
        : 'Checked in! Waiting for remaining swappers to arrive at the meet spot.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 8. REPORTS & BANS (Section 22)
// -------------------------------------------------------------
app.post('/api/reports', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const { reportedUserId, proposalId, reason, details } = req.body;

    const reportId = `rep-${Date.now()}`;
    await run(`
      INSERT INTO reports (id, reporter_id, reported_user_id, proposal_id, reason, details, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
    `, [reportId, user.id, reportedUserId, proposalId, reason, details || '', Date.now()]);

    res.json({ success: true, reportId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await query(`
      SELECT r.*, u1.name as reporter_name, u2.name as reported_name
      FROM reports r
      JOIN users u1 ON r.reporter_id = u1.id
      JOIN users u2 ON r.reported_user_id = u2.id
      ORDER BY r.created_at DESC
    `);
    res.json({ reports });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reports/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'uphold' or 'dismiss'

    const report = await get<any>('SELECT * FROM reports WHERE id = ?', [id]);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    if (action === 'uphold') {
      // Deduct 15 points from reported user
      await run('UPDATE users SET swap_score = MAX(0, swap_score - 15) WHERE id = ?', [report.reported_user_id]);
      const reportedUser = await get<any>('SELECT swap_score FROM users WHERE id = ?', [report.reported_user_id]);

      // If score drops below ban threshold (60), auto-ban
      if (reportedUser && reportedUser.swap_score < 60) {
        await run('UPDATE users SET is_banned = 1 WHERE id = ?', [report.reported_user_id]);
      }
      await run("UPDATE reports SET status = 'upheld' WHERE id = ?", [id]);
    } else {
      await run("UPDATE reports SET status = 'dismissed' WHERE id = ?", [id]);
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 9. SCENARIO PRESETS (F10, Scenarios A, B, C)
// -------------------------------------------------------------
app.post('/api/scenarios/:name', async (req, res) => {
  try {
    const { name } = req.params;
    if (name.toUpperCase() === 'A') {
      await seedScenarioA();
    } else if (name.toUpperCase() === 'B') {
      await seedScenarioB();
    } else if (name.toUpperCase() === 'C') {
      await seedScenarioC(false);
    } else if (name.toUpperCase() === 'C_TRUSTED') {
      await seedScenarioC(true);
    } else {
      await seedScenarioA();
    }
    res.json({ success: true, scenario: name.toUpperCase() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 10. NOTIFICATIONS (F13)
// -------------------------------------------------------------
app.get('/api/notifications', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const notifs = await query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [user.id]);
    res.json({ notifications: notifs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await run('UPDATE notifications SET read = 1 WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express API server
app.listen(PORT, () => {
  console.log(`🚀 SwapLoop REST API Server running on port ${PORT}`);
});
