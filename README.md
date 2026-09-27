# SwapLoop — The Campus Circular Economy Platform

> **Campus item-swapping web application for university students.**  
> *No prices. No bargaining. No public chat. Pure algorithmic circular value exchange.*

---

## 📖 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Technology Stack](#3-technology-stack)
4. [Architecture & How It Works](#4-architecture--how-it-works)
5. [Matching Engine & Drop Strategy](#5-matching-engine--drop-strategy)
6. [Why "Give Before Receive" Fails in a Loop](#6-why-give-before-receive-fails-in-a-loop)
7. [Trust System & Value Bands (T4)](#7-trust-system--value-bands-t4)
8. [Swap Score Formula](#8-swap-score-formula)
9. [Handover Systems: Swap Desk Escrow vs. Swap Meet](#9-handover-systems-swap-desk-escrow-vs-swap-meet)
10. [Security & Strict Blind Proposals](#10-security--strict-blind-proposals)
11. [Admin Scenario Presets (Scenarios A, B, C)](#11-admin-scenario-presets-scenarios-a-b-c)
12. [Setup, Local Development & Scheduler](#12-setup-local-development--scheduler)
13. [Deployment Guide](#13-deployment-guide)

---

## 1. Project Overview
SwapLoop is designed specifically for university students (approx. 18–25) residing in campus dorms and hostels. Instead of traditional buy/sell classifieds plagued by ghosting, haggling, and payment hassles, SwapLoop uses **directed-graph cycle matching** and **physical escrow** to enable cashless, multi-student circular trades.

---

## 2. Key Features
- **Blush Mist Design System**: Modern, friendly pastel palette (`#FFF7F9` canvas, `#FFFFFF` cards, `#F472B6`/`#FB7185` primary rose accents, deep charcoal/plum `#1D1722` text, and delicate `#FDE7F0` borders).
- **Original S-Loop Brand Mark**: Custom vector logo featuring two interlocking curved arrows forming an "S" with an active energy spark element.
- **Categorized Campus Inventory**: Custom vector illustrations for *Books*, *Electronics*, *Stationery*, *Furniture*, and *Hostel Gear*.
- **The Daily Drop**: Algorithmic matching scheduled every day at 8:00 PM, finding closed loops (2–5 swappers) and Free Gift chains.
- **Strict Blind Proposals (F7)**: Real names and private contact notes are withheld from client payloads and network responses until 100% of participants accept.
- **Swap Desk Escrow (T2, T3)**: Physical campus station verification where pickup codes remain strictly locked until all items in a proposal have arrived.
- **Swap Meet Alternative (Section 17 & 29)**: Peer-to-peer exchange for Trusted members with anti-fake campus quad geofence check-in verification.
- **Reports & Automatic Ban Threshold**: Swap scores decrease on upheld reports; members with score $< 60$ are automatically excluded from the Drop.
- **Loop Wall**: Public statistics celebrating items rehomed, loops completed, and longest gift chains.

---

## 3. Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti.
- **Tooling**: Vite 6, PostCSS, Autoprefixer.
- **Backend**: Node.js, Express.js, TypeScript (`tsx`).
- **Database**: Persistent SQLite (`sqlite3`) stored at `server/data/swaploop.db`.
- **Security**: `bcryptjs` password hashing, token auth, server-side data sanitization.
- **Scheduler**: `node-cron` background scheduler.

---

## 4. Architecture & How It Works

```
Browser Client (React + Vite :5173)
       │
       ▼  (Proxy /api/*)
Express API Server (Node.js :3001)
       │
   ┌───┴──────────────────────────────┐
   ▼                                  ▼
SQLite Database (swaploop.db)    Daily Cron Scheduler (8:00 PM)
   │                                  │
   ▼                                  ▼
Auth & Blind Sanitizer ────────► Swap Engine Pipeline
                                  ├── Cycle Finder (DFS 2–5 members)
                                  ├── Gift Chain Finder (F11)
                                  ├── Trust T4 Validator
                                  └── Max-Student Optimizer
```

---

## 5. Matching Engine & Drop Strategy

### The Directed Graph Model
- Each student is a vertex $S_i$.
- A directed edge $S_A \to S_B$ with item $I_A$ exists if and only if **Student A owns item $I_A$ and Student B has added $I_A$ to their Wants list**.

### Search & Optimization Pipeline
1. **Cycle Detection**: Depth-First Search discovers simple cycles of length $2 \le k \le 5$ where $S_0 \to S_1 \to \dots \to S_{k-1} \to S_0$.
2. **Gift Chain Finder (F11)**: Detects chains initiated by a "Free Gift" item where the final receiver's item becomes the new community gift.
3. **Trust T4 Validation**: Filters out any cycle violating member trust levels:
   - `New`: Low only.
   - `Trusted`: Low + Medium.
   - `Veteran`: Low + Medium + High.
4. **Disjoint Set Optimization (F6)**: Solves maximum set packing via branch & bound:
   $$\max \sum_{C \in \mathcal{S}} |C|$$
   When multiple disjoint subsets achieve identical student satisfaction counts, the tie is broken by the highest aggregate **Swap Score**.

---

## 6. Why "Give Before Receive" Fails in a Loop

In a 2-person direct swap ($A \leftrightarrow B$), one person can hand over their item while immediately receiving the other person's item simultaneously.

However, in a **3-way or multi-way circular loop** ($A \to B \to C \to A$):
- $A$ must give to $B$.
- $B$ cannot give to $A$ (because $B$ gives to $C$).
- $C$ cannot give to $B$ (because $C$ gives to $A$).

If any student is expected to "give before they receive" without escrow, **the first giver takes 100% of the counterparty risk**. If student $B$ or $C$ defaults or ghosts, the chain collapses and student $A$ loses their item with zero recourse.

**SwapLoop’s Solution**: **Physical Escrow (Swap Desk)** or **Simultaneous Multi-Party Verification (Swap Meet)**. At the Swap Desk, items are held securely in escrow until every item has arrived. No pickup code unlocks until all items are physically present. If anyone defaults, all deposited items receive automatic return codes (`RET-XXXXXX`).

---

## 7. Trust System & Value Bands (T4)

| Trust Tier | Completed Swaps Required | Permitted Item Value Bands |
| :--- | :--- | :--- |
| **New** | 0 – 2 swaps | **Low** only |
| **Trusted** | 3 – 7 swaps | **Low** and **Medium** |
| **Veteran** | 8+ swaps | **Low**, **Medium**, and **High** |

*Options locked by trust rules display a lock icon with a descriptive tooltip explaining the unlock requirement.*

---

## 8. Swap Score Formula

Every student starts at a base score of **100**.

$$\text{Swap Score} = 100 + 10 \times (\text{Completed Swaps}) - 3 \times (\text{Declines}) - 5 \times (\text{Expired Proposals}) - 10 \times (\text{Missed Deadlines}) - 15 \times (\text{Upheld Reports})$$

- **Minimum Floor**: 0.
- **Banned Threshold**: Any student whose score falls below **60** is automatically excluded from The Drop matching engine until resolved by an Admin.
- **Tie-Breaking**: Higher average Swap Scores win conflicting loop matches during Drop evaluation.

---

## 9. Handover Systems: Swap Desk Escrow vs. Swap Meet

### Option A: Swap Desk Escrow (`/desk`)
1. Proposal is sealed $\to$ single-use 6-character `dropoffCode` and `pickupCode` generated.
2. Swappers drop off items at hostel desk $\to$ operator inputs `dropoffCode`.
3. **Escrow Hold (T2)**: Pickup codes remain locked until **100% of items arrive**.
4. Once all items are verified, the terminal displays *"All items secured. Ready for pickup."*
5. Swappers present `pickupCode` $\to$ operator inputs code $\to$ items released $\to$ score $+10$.
6. **Deadline Expiry (T3)**: If a swapper misses the deadline, operator triggers deadline failure; items already at the desk receive automatic return codes (`RET-XXXXXX`).

### Option B: Swap Meet (Section 17 & 29)
1. **Prerequisites**: All members must be `Trusted` or higher, no High-value items, and all members elect Meet. If any member selects Desk, Desk is used.
2. **Anti-Fake Check-in**: Swappers must physically arrive at the Central Campus Quad Gazebo and confirm arrival.
3. Handover release codes unlock simultaneously on all phones **only once everyone checks in**.
4. Receiver reveals their release code to the giver only after inspecting and receiving the item.

---

## 10. Security & Strict Blind Proposals

1. **Strict Blind Payloads**: The server API (`/api/proposals`) filters out real names, emails, and contact notes for unsealed proposals. Only masked codenames (`Swapper 1`, `Swapper 2`) are transmitted.
2. **Private Contact Notes**: Phone numbers and hostel room details are encrypted/protected and never displayed publicly in Browse or Inventory.
3. **Single-Use Codes**: Handover codes are generated randomly using a 32-character non-ambiguous alphabet and can only be redeemed once.
4. **Ownership & Role Enforcement**: Server routes verify user ID and role permissions on every modification request.

---

## 11. Admin Scenario Presets (Scenarios A, B, C)

Access the black top admin bar to load preconfigured scenarios:

- **Scenario A (Base 5)**:
  - Arjun: Mini drafter (Low) $\to$ Wants: Bicycle, Headphones
  - Bhavya: Bicycle (Low) $\to$ Wants: Extension board
  - Chetan: Extension board (Low) $\to$ Wants: Mini drafter
  - Divya: Headphones (Low) $\to$ Wants: Mini drafter
  - Esha: Table lamp (Low) $\to$ Wants: Bicycle
  - *Outcome*: Engine proposes the 3-student loop (**Arjun $\to$ Bhavya $\to$ Chetan**) over the 2-student loop (**Arjun $\leftrightarrow$ Divya**) to maximize students satisfied (3 vs 2).
- **Scenario B (+Free Gift)**:
  - Adds Kiran with a free gift study table. Divya wants the study table.
  - *Outcome*: Successfully builds a multi-student Free Gift Chain.
- **Scenario C (Trust T4 Lock)**:
  - Bhavya's bicycle is changed to *Medium*. All students remain *New*.
  - *Outcome*: T4 trust rules disqualify the 3-student loop. The engine falls back to proposing the 2-student loop (**Arjun $\leftrightarrow$ Divya**). Upgrading Arjun & Bhavya to *Trusted* restores the 3-student loop!

---

## 12. Setup, Local Development & Scheduler

### Prerequisites
- Node.js LTS (v20+ or v24+)
- npm v10+

### Installation & Launch
```powershell
# 1. Install dependencies
npm install

# 2. Start the Express API server (Port 3001)
npm run server

# 3. In another terminal, start the Vite frontend (Port 5173)
npm run dev
```

The web application is accessible at:
👉 **http://127.0.0.1:5173**

---

## 13. Deployment Guide

1. **Frontend Production Build**:
   ```powershell
   npm run build
   ```
   Outputs production assets to the `dist/` folder.
2. **Production Hosting**:
   - Host `server/index.ts` on Node.js container (Render, Railway, Fly.io, AWS EC2).
   - Serve static assets from `dist/` or CDN (Vercel, Netlify, Cloudflare Pages).
   - Mount persistent volume for `server/data/swaploop.db`.
