# LIFE RPG — Product Requirements Document (PRD)
**Version 1.0 · TZPS Hackathon Submission · 2025**

---

## Table of Contents
1. [Overview](#1-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Users & Personas](#3-users--personas)
4. [Feature Specifications](#4-feature-specifications)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Out of Scope](#6-out-of-scope-v10)
7. [Suggested Delivery Milestones](#7-suggested-delivery-milestones)

---

## 1. Overview

Life RPG is a full-stack web application that transforms real-world tasks and habits into an engaging RPG progression system. Users create a character, complete daily tasks ("Quests"), earn XP and Gold, level up stats, and spend currency in a virtual shop — all backed by a secure server-side database so progress is persistent and cheat-resistant.

The application targets students, professionals, and anyone who finds traditional productivity tools demotivating. The core insight: video games solve delayed gratification through immediate feedback loops. Life RPG applies that same loop to real-world self-improvement.

---

## 2. Goals & Success Metrics

### 2.1 Business Goals
- Win or place in the TZPS hackathon judging criteria
- Demonstrate a full-stack, production-grade architecture
- Deliver a visually distinctive, thematically cohesive product

### 2.2 User Goals
- Complete real-world tasks with immediate, satisfying feedback
- Track self-improvement across multiple life dimensions (fitness, study, creativity)
- Feel rewarded for consistency via streaks and the economy system

### 2.3 Success Metrics

| Metric | Target | Measurement Method |
|---|---|---|
| Task completion animation latency | < 100 ms (optimistic UI) | Chrome DevTools |
| Lighthouse Performance score | ≥ 90 | Lighthouse CI |
| Lighthouse Accessibility score | ≥ 90 | Lighthouse CI |
| Mobile usability | No horizontal scroll on 375px | Chrome device emulation |
| Auth persistence | Session survives page refresh | Manual QA |
| Git commit count | ≥ 3 chronological commits | GitHub history |

---

## 3. Users & Personas

### 3.1 Primary Persona — The Overwhelmed Student
- Age 18–24, full-time student, uses apps on mobile 70% of the time
- **Motivation:** wants to study and build habits but finds to-do apps boring
- **Pain point:** no immediate reward for effort; gives up after 3–4 days
- **Goal:** see tangible character growth that mirrors real academic progress

### 3.2 Secondary Persona — The Ambitious Professional
- Age 25–35, hybrid work, switches between laptop and phone throughout the day
- **Motivation:** tracks fitness, coding side-projects, and reading goals simultaneously
- **Pain point:** existing apps don't connect different life domains into one view
- **Goal:** a unified dashboard that shows growth across all personal KPIs

---

## 4. Feature Specifications

### 4.1 Authentication & Security
- Signup via email + password (hashed with bcrypt or equivalent)
- Login returns a signed JWT (or Supabase/Firebase session token)
- All API routes protected by middleware — users see only their own data
- Session persists across page refreshes; logout clears token
- Rate-limiting on auth endpoints to prevent brute-force

### 4.2 Character & Dashboard
- On first login, user creates a character (name, avatar/class selection)
- Dashboard shows: Level, XP bar, Gold balance, Streak counter, Attributes panel
- **Attributes:** Intellect, Strength, Wisdom, Creativity, Endurance (5 stats)
- **XP formula:** Level N requires N² × 100 XP (non-linear, exponential curve)
- Leveling up triggers a full-screen celebratory animation + stat point award

### 4.3 Quest (Task) System — CRUD

| Action | Details |
|---|---|
| **Create** | Title, description, category (maps to attribute), difficulty (Easy / Medium / Hard) |
| **Read** | Paginated list of active quests, filterable by category and difficulty |
| **Update** | Edit title, description, category, difficulty of incomplete quests |
| **Delete** | Soft-delete (moves to Abandoned log) to preserve history |
| **Complete** | Marks quest done, triggers XP/Gold animation, logs to history |

**Reward table:**

| Difficulty | XP | Gold |
|---|---|---|
| Easy | 50 XP | 10 G |
| Medium | 150 XP | 30 G |
| Hard | 300 XP | 60 G |

### 4.4 Streak System
- A streak increments when ≥ 1 quest is completed on a calendar day
- Streak counter resets to 0 if no quest is completed on a given day
- **7-day streak:** +50% XP multiplier on all quests
- **30-day streak:** +100% XP multiplier + exclusive 'Veteran' badge
- Streak state is stored server-side and checked at login + quest completion

### 4.5 Economy & Shop
- **Currency:** Gold (earned per quest completion)
- **Shop items:** UI themes (Dark Dungeon, Neon Cyber, Cozy Tavern), profile badges, avatar skins
- **Purchase flow:** confirm modal → server deducts Gold → item added to inventory → UI updates
- Purchased themes apply globally and persist in user profile
- Inventory page lists all owned items

### 4.6 History & Logs
- Completed quests stored in a history table with timestamp, XP earned, Gold earned
- History page: searchable, filterable, paginated log of all past quests
- Stat growth chart: line graph showing attribute level over time

### 4.7 Responsive & Accessible UI
- Mobile-first CSS (375px → 1440px) with fluid grid
- All interactive elements reachable via `Tab`, activated via `Enter`/`Space`
- ARIA roles on modal dialogs, live regions for XP gain announcements
- Colour contrast ratio ≥ 4.5:1 for all text
- Focus-visible ring on all focusable elements

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Initial page load (LCP) < 2.5 s on mid-range 4G (Lighthouse throttling)
- Time to Interactive < 3.5 s
- Images lazy-loaded; fonts subset and self-hosted or via CDN

### 5.2 Security
- Passwords hashed (bcrypt, cost factor ≥ 12)
- JWT secret stored in environment variable, not committed
- SQL/NoSQL injection prevented via parameterised queries / ORM
- CORS policy restricts origins to the production frontend URL

### 5.3 Reliability & Error Handling
- All API errors return structured JSON: `{ error: string, code: string }`
- Client displays in-theme error toasts — no raw console errors visible to user
- Offline detection: banner shown when network is unavailable

---

## 6. Out of Scope (v1.0)
- Multiplayer guilds or friend systems
- Push / email notifications
- Native mobile apps (iOS / Android)
- Real-money purchases or payment processing
- AI-generated quest suggestions

---

## 7. Suggested Delivery Milestones

| Milestone | Scope | Suggested Duration |
|---|---|---|
| **M1 — Foundation** | Auth, DB schema, basic CRUD API, repo setup | Day 1–2 |
| **M2 — Core Loop** | Quest CRUD UI, XP engine, leveling, streak logic | Day 3–4 |
| **M3 — Economy & Shop** | Gold system, shop UI, inventory, theme switching | Day 5 |
| **M4 — Polish** | Animations, accessibility pass, SEO, error handling | Day 6 |
| **M5 — Deployment & Video** | Deploy to Vercel/Render, record walkthrough video | Day 7 |

---

*Life RPG PRD · TZPS Hackathon · Confidential*
