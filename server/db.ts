import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'swaploop.db');
const db = new sqlite3.Database(DB_PATH);

// Promisified DB helpers
export const query = <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
};

export const get = <T = any>(sql: string, params: any[] = []): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
};

export const run = (sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const initDb = async () => {
  // Create tables
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      contact_note TEXT NOT NULL,
      trust_level TEXT NOT NULL DEFAULT 'New',
      swap_score INTEGER NOT NULL DEFAULT 100,
      email_verified INTEGER NOT NULL DEFAULT 1,
      role TEXT NOT NULL DEFAULT 'Student',
      completed_swaps_count INTEGER NOT NULL DEFAULT 0,
      is_banned INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      condition TEXT NOT NULL,
      value_band TEXT NOT NULL,
      image_url TEXT,
      is_free_gift INTEGER NOT NULL DEFAULT 0,
      is_locked_in_proposal INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  try {
    await run('ALTER TABLE items ADD COLUMN image_url TEXT');
  } catch (_) {
    // Column already exists
  }

  await run(`
    CREATE TABLE IF NOT EXISTS wants (
      student_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      PRIMARY KEY (student_id, item_id),
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      handover_method TEXT NOT NULL DEFAULT 'desk',
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      signature TEXT NOT NULL,
      failure_reason TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS proposal_members (
      proposal_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      codename TEXT NOT NULL,
      gives_item_id TEXT NOT NULL,
      receives_item_id TEXT NOT NULL,
      accepted INTEGER NOT NULL DEFAULT 0,
      handover_choice TEXT NOT NULL DEFAULT 'desk',
      checked_in_meet INTEGER NOT NULL DEFAULT 0,
      dropoff_code TEXT NOT NULL,
      dropoff_done INTEGER NOT NULL DEFAULT 0,
      pickup_code TEXT NOT NULL,
      pickup_done INTEGER NOT NULL DEFAULT 0,
      return_code TEXT,
      PRIMARY KEY (proposal_id, student_id),
      FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS declined_signatures (
      signature TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      reported_user_id TEXT NOT NULL,
      proposal_id TEXT,
      reason TEXT NOT NULL,
      details TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS system_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Check if database needs seeding
  const userCount = await get<{ count: number }>('SELECT COUNT(*) as count FROM users');
  if (!userCount || userCount.count === 0) {
    await seedScenarioA();
  }
};

export const seedScenarioA = async () => {
  // Clear existing items and proposals
  await run('DELETE FROM wants');
  await run('DELETE FROM items');
  await run('DELETE FROM proposal_members');
  await run('DELETE FROM proposals');
  await run('DELETE FROM users');
  await run('DELETE FROM declined_signatures');
  await run('DELETE FROM reports');
  await run('DELETE FROM notifications');

  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  const now = Date.now();

  // 1. Arjun
  await run(`
    INSERT INTO users (id, name, email, password_hash, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['user-arjun', 'Arjun Sharma', 'arjun@college.edu', defaultPasswordHash, 'Hostel 3, Room 204 | Ph: +91 98765 43210', 'New', 100, 1, 'Student', 0, 0, now]);

  // 2. Bhavya
  await run(`
    INSERT INTO users (id, name, email, password_hash, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['user-bhavya', 'Bhavya Patel', 'bhavya@college.edu', defaultPasswordHash, 'Hostel 2, Room 112 | Ph: +91 98765 43211', 'New', 100, 1, 'Student', 0, 0, now]);

  // 3. Chetan
  await run(`
    INSERT INTO users (id, name, email, password_hash, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['user-chetan', 'Chetan Verma', 'chetan@college.edu', defaultPasswordHash, 'Hostel 4, Room 305 | Ph: +91 98765 43212', 'New', 100, 1, 'Student', 0, 0, now]);

  // 4. Divya
  await run(`
    INSERT INTO users (id, name, email, password_hash, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['user-divya', 'Divya Nair', 'divya@college.edu', defaultPasswordHash, 'Hostel 1, Room 108 | Ph: +91 98765 43213', 'New', 100, 1, 'Student', 0, 0, now]);

  // 5. Esha
  await run(`
    INSERT INTO users (id, name, email, password_hash, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['user-esha', 'Esha Rao', 'esha@college.edu', defaultPasswordHash, 'Hostel 5, Room 402 | Ph: +91 98765 43214', 'New', 100, 1, 'Student', 0, 0, now]);

  // Desk Operator Account
  await run(`
    INSERT INTO users (id, name, email, password_hash, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['user-desk-operator', 'Hostel Desk Operator', 'desk@college.edu', defaultPasswordHash, 'Campus Escrow Station #1', 'Veteran', 150, 1, 'Desk Operator', 24, 0, now]);

  // Admin Account
  await run(`
    INSERT INTO users (id, name, email, password_hash, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['user-admin', 'Campus Admin', 'admin@college.edu', defaultPasswordHash, 'Student Affairs Dean Office', 'Veteran', 200, 1, 'Admin', 50, 0, now]);

  // Seed Items
  // Arjun: Mini drafter (Low, Stationery)
  await run(`
    INSERT INTO items (id, owner_id, title, category, condition, value_band, image_url, is_free_gift, is_locked_in_proposal, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['item-drafter', 'user-arjun', 'Mini drafter', 'Stationery', 'Like New', 'Low', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80', 0, 0, now]);

  // Bhavya: Bicycle (Low, Hostel Gear)
  await run(`
    INSERT INTO items (id, owner_id, title, category, condition, value_band, image_url, is_free_gift, is_locked_in_proposal, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['item-bicycle', 'user-bhavya', 'Bicycle', 'Hostel Gear', 'Good', 'Low', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80', 0, 0, now]);

  // Chetan: Extension board (Low, Electronics)
  await run(`
    INSERT INTO items (id, owner_id, title, category, condition, value_band, image_url, is_free_gift, is_locked_in_proposal, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['item-ext-board', 'user-chetan', 'Extension board', 'Electronics', 'Like New', 'Low', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', 0, 0, now]);

  // Divya: Headphones (Low, Electronics)
  await run(`
    INSERT INTO items (id, owner_id, title, category, condition, value_band, image_url, is_free_gift, is_locked_in_proposal, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['item-headphones', 'user-divya', 'Headphones', 'Electronics', 'Good', 'Low', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 0, 0, now]);

  // Esha: Table lamp (Low, Furniture)
  await run(`
    INSERT INTO items (id, owner_id, title, category, condition, value_band, image_url, is_free_gift, is_locked_in_proposal, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['item-table-lamp', 'user-esha', 'Table lamp', 'Furniture', 'Good', 'Low', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', 0, 0, now]);

  // Seed Wants
  // Arjun wants: Bicycle, Headphones
  await run('INSERT INTO wants (student_id, item_id) VALUES (?, ?)', ['user-arjun', 'item-bicycle']);
  await run('INSERT INTO wants (student_id, item_id) VALUES (?, ?)', ['user-arjun', 'item-headphones']);

  // Bhavya wants: Extension board
  await run('INSERT INTO wants (student_id, item_id) VALUES (?, ?)', ['user-bhavya', 'item-ext-board']);

  // Chetan wants: Mini drafter
  await run('INSERT INTO wants (student_id, item_id) VALUES (?, ?)', ['user-chetan', 'item-drafter']);

  // Divya wants: Mini drafter
  await run('INSERT INTO wants (student_id, item_id) VALUES (?, ?)', ['user-divya', 'item-drafter']);

  // Esha wants: Bicycle
  await run('INSERT INTO wants (student_id, item_id) VALUES (?, ?)', ['user-esha', 'item-bicycle']);

  // Set active scenario
  await run('INSERT OR REPLACE INTO system_config (key, value) VALUES (?, ?)', ['active_scenario', 'A']);
  await run('INSERT OR REPLACE INTO system_config (key, value) VALUES (?, ?)', ['drop_time', '17:00']);

  // Initial welcome and drop schedule notifications
  await run(`
    INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, ['notif-1', 'user-arjun', 'Welcome to SwapLoop!', 'Scenario A loaded. Your Mini drafter is ready for The Drop matching.', 'system', 0, now - 3600000]);

  await run(`
    INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, ['notif-2', 'user-arjun', '⏰ Drop Reminder: 30 Mins', 'The Drop is today at 5:00 PM.', 'drop', 0, now - 1800000]);

  await run(`
    INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, ['notif-3', 'user-arjun', '⚡ Drop Alert: 15 Mins', 'The Drop starts in 15 minutes.', 'drop', 0, now - 900000]);

  await run(`
    INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, ['notif-4', 'user-arjun', '🔥 Final Prep: 5 Mins', 'The Drop starts in 5 minutes.', 'drop', 0, now - 300000]);
};

export const seedScenarioB = async () => {
  await seedScenarioA();
  const now = Date.now();
  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // Add Kiran with Free Gift Study Table
  await run(`
    INSERT INTO users (id, name, email, password_hash, contact_note, trust_level, swap_score, email_verified, role, completed_swaps_count, is_banned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['user-kiran', 'Kiran Reddy', 'kiran@college.edu', defaultPasswordHash, 'Hostel 3, Room 110 | Ph: +91 98765 43215', 'Trusted', 115, 1, 'Student', 4, 0, now]);

  await run(`
    INSERT INTO items (id, owner_id, title, category, condition, value_band, image_url, is_free_gift, is_locked_in_proposal, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['item-study-table', 'user-kiran', 'Solid Wood Study Table', 'Furniture', 'Good', 'Medium', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80', 1, 0, now]);

  // Divya also wants Kiran's study table
  await run('INSERT INTO wants (student_id, item_id) VALUES (?, ?)', ['user-divya', 'item-study-table']);

  await run('INSERT OR REPLACE INTO system_config (key, value) VALUES (?, ?)', ['active_scenario', 'B']);
};

export const seedScenarioC = async (trustedUpgrade: boolean = false) => {
  await seedScenarioA();

  // Change Bhavya's bicycle to Medium
  await run('UPDATE items SET value_band = ? WHERE id = ?', ['Medium', 'item-bicycle']);

  if (trustedUpgrade) {
    // Upgrade Arjun & Bhavya to Trusted
    await run('UPDATE users SET trust_level = ? WHERE id = ?', ['Trusted', 'user-arjun']);
    await run('UPDATE users SET trust_level = ? WHERE id = ?', ['Trusted', 'user-bhavya']);
  }

  await run('INSERT OR REPLACE INTO system_config (key, value) VALUES (?, ?)', ['active_scenario', 'C']);
};
