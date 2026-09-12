# LIFE RPG — Technical Requirements Document (TRD)
**Version 1.0 · TZPS Hackathon · 2025**

---

## Table of Contents
1. [Recommended Technology Stack](#1-recommended-technology-stack)
2. [Database Schema](#2-database-schema)
3. [API Route Specification](#3-api-route-specification)
4. [Game Logic Algorithms](#4-game-logic-algorithms)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Security Requirements](#6-security-requirements)
7. [Deployment Checklist](#7-deployment-checklist)

---

## 1. Recommended Technology Stack

### 1.1 Frontend

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/SSG, API routes, Vercel deploy in one repo |
| Styling | Tailwind CSS + custom CSS variables | Utility-first speed; custom tokens for theming |
| Animation | Framer Motion | Spring physics, layout animations, SVG paths |
| State | Zustand + React Query | Light global state; server-state caching & invalidation |
| Icons | Lucide React | Tree-shakeable, accessible SVG icons |
| Fonts | Google Fonts (subset) via next/font | Zero layout shift, self-hosted for performance |

### 1.2 Backend / API

| Layer | Choice | Reason |
|---|---|---|
| API | Next.js Route Handlers (or Express) | Co-located with frontend; avoids CORS complexity |
| Auth | Supabase Auth (or NextAuth.js) | Handles JWT, sessions, OAuth in < 30 min setup |
| ORM | Prisma | Type-safe queries, migration system, schema-first |
| Password hashing | bcrypt (cost 12) | Industry standard; Supabase handles this automatically |
| Rate limiting | Upstash Redis + @upstash/ratelimit | Edge-compatible, serverless-friendly |

### 1.3 Database

| Concern | Choice | Notes |
|---|---|---|
| Primary DB | PostgreSQL (via Supabase or Neon) | Relational, ACID, free tier available |
| Local dev | SQLite (via Prisma adapter) | Zero-setup local development |
| Caching | Upstash Redis (optional) | Session rate-limit counters, streak cache |

### 1.4 DevOps & Hosting
- **Frontend + API:** Vercel (zero-config Next.js deployment, free tier)
- **Database:** Supabase free tier (500 MB PostgreSQL + Auth)
- **CI:** GitHub Actions — lint, type-check, build on every push
- **Env management:** `.env.local` (gitignored) + Vercel environment variables

---

## 2. Database Schema

### 2.1 Entity Relationship Summary

```
users ─< characters    (1:1)
users ─< quests        (1:many)
users ─< quest_log     (1:many)
users ─< inventory     (1:many)
```

### 2.2 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String          @id @default(cuid())
  email        String          @unique
  passwordHash String?         // null if OAuth
  createdAt    DateTime        @default(now())
  character    Character?
  quests       Quest[]
  questLog     QuestLog[]
  inventory    InventoryItem[]
}

model Character {
  id         String   @id @default(cuid())
  userId     String   @unique
  name       String
  class      String   // Warrior | Mage | Rogue | Sage
  level      Int      @default(1)
  xp         Int      @default(0)
  gold       Int      @default(0)
  streak     Int      @default(0)
  lastActive DateTime @default(now())
  intellect  Int      @default(1)
  strength   Int      @default(1)
  wisdom     Int      @default(1)
  creativity Int      @default(1)
  endurance  Int      @default(1)
  user       User     @relation(fields: [userId], references: [id])
}

model Quest {
  id          String     @id @default(cuid())
  userId      String
  title       String
  description String?
  category    Category
  difficulty  Difficulty
  status      Status     @default(ACTIVE)
  createdAt   DateTime   @default(now())
  completedAt DateTime?
  user        User       @relation(fields: [userId], references: [id])
}

model QuestLog {
  id          String   @id @default(cuid())
  userId      String
  questId     String
  xpEarned    Int
  goldEarned  Int
  attribute   String
  completedAt DateTime @default(now())
}

model InventoryItem {
  id          String   @id @default(cuid())
  userId      String
  itemId      String   // references static item catalogue
  purchasedAt DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

enum Category {
  INTELLECT
  STRENGTH
  WISDOM
  CREATIVITY
  ENDURANCE
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum Status {
  ACTIVE
  COMPLETED
  ABANDONED
}
```

---

## 3. API Route Specification

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Create user + character, return JWT |
| `POST` | `/api/auth/login` | Public | Verify password, return JWT |
| `GET` | `/api/me` | JWT | Return character + stats + inventory |
| `GET` | `/api/quests` | JWT | List active quests (paginated, filterable) |
| `POST` | `/api/quests` | JWT | Create new quest (Zod validated) |
| `PATCH` | `/api/quests/:id` | JWT | Update quest fields (own quests only) |
| `DELETE` | `/api/quests/:id` | JWT | Soft-delete → ABANDONED |
| `POST` | `/api/quests/:id/complete` | JWT | Award XP/Gold, update streak, log to history |
| `GET` | `/api/history` | JWT | Paginated QuestLog |
| `GET` | `/api/shop` | Public | Return static item catalogue |
| `POST` | `/api/shop/buy` | JWT | Deduct Gold, add InventoryItem |
| `GET` | `/api/inventory` | JWT | Return user's InventoryItem[] |

### Error Response Shape

All errors return structured JSON:

```json
{
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE"
}
```

---

## 4. Game Logic Algorithms

### 4.1 XP & Leveling

```typescript
// lib/game.ts

/** XP required to reach Level N */
function xpForLevel(n: number): number {
  return n * n * 100; // 100, 400, 900, 1600, 2500 …
}

/** Called server-side after quest completion */
function applyXP(character: Character, xpGained: number): Character {
  character.xp += xpGained;

  while (character.xp >= xpForLevel(character.level + 1)) {
    character.xp -= xpForLevel(character.level + 1);
    character.level++;
    // Award +1 to the relevant attribute (see mapping below)
  }

  return character;
}
```

### 4.2 Streak Logic

```typescript
function updateStreak(character: Character): Character {
  const diff = daysBetween(character.lastActive, new Date());

  if (diff === 1) {
    character.streak++;          // consecutive day ✓
  } else if (diff > 1) {
    character.streak = 1;        // streak broken, reset to 1
  }
  // diff === 0: same calendar day, streak unchanged

  character.lastActive = new Date();
  return character;
}
```

### 4.3 XP Multiplier (Streak Bonus)

```typescript
function streakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 7)  return 1.5;
  return 1.0;
}
```

### 4.4 Reward Table

| Difficulty | Base XP | Gold |
|---|---|---|
| Easy | 50 XP | 10 G |
| Medium | 150 XP | 30 G |
| Hard | 300 XP | 60 G |

> **Final XP** = `Math.floor(baseXP × streakMultiplier(streak))`
> Gold is **not** multiplied (scarcity balance).

### 4.5 Attribute Mapping

| Category | Attribute incremented on level-up |
|---|---|
| `INTELLECT` | `intellect` |
| `STRENGTH` | `strength` |
| `WISDOM` | `wisdom` |
| `CREATIVITY` | `creativity` |
| `ENDURANCE` | `endurance` |

---

## 5. Frontend Architecture

### 5.1 Folder Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (app)/
│   ├── dashboard/page.tsx
│   ├── quests/page.tsx
│   ├── shop/page.tsx
│   ├── history/page.tsx
│   └── inventory/page.tsx
└── api/                        ← Route Handlers

components/
├── ui/                         ← Button, Modal, Toast, Skeleton
├── game/                       ← XPBar, StatCard, QuestCard, LevelUpOverlay
└── layout/                     ← Sidebar, MobileNav, ThemeProvider

lib/
├── prisma.ts                   ← Prisma client singleton
├── auth.ts                     ← JWT helpers / Supabase client
└── game.ts                     ← XP / streak algorithms

store/
├── character.ts                ← Zustand slice
└── ui.ts                       ← Zustand UI state (modals, toasts)
```

### 5.2 Component Spec

| Component | Purpose |
|---|---|
| `XPBar` | Animated fill on XP gain using Framer Motion `layoutId` |
| `StatCard` | Shows attribute name + level with icon |
| `QuestCard` | Title, category badge, difficulty chip, Complete/Delete/Edit buttons |
| `LevelUpOverlay` | Full-screen animated overlay when level increases |
| `XPFloater` | Floating `+XP` text that animates up and fades on quest complete |
| `StreakBadge` | Fire emoji + count, pulses on milestone |
| `ShopItem` | Item card with Gold cost, Buy button, owned state |
| `ErrorToast` | In-theme error with shake animation |
| `LoadingSkeleton` | Shimmer placeholders matching card shapes |

### 5.3 Optimistic UI Pattern

```
User action
    │
    ▼
Immediately update Zustand store (XP, Gold, streak)
    │
    ▼
Fire API call in background
    │
    ├── SUCCESS → React Query invalidates ['me', 'quests'] cache
    │
    └── ERROR   → Rollback Zustand to previous snapshot
                  Show ErrorToast with in-theme message
```

### 5.4 Animation Spec (Framer Motion)

| Event | Animation | Duration |
|---|---|---|
| Quest complete | XP number flies up (`y: 0 → -60`, `opacity: 1 → 0`, spring) | 600 ms |
| XP bar fill | `layoutId` animation to new width | 500 ms ease-out |
| Level up | Full-screen overlay: `scale 0.8→1`, `opacity 0→1`, hold, fade out | 2000 ms total |
| Shop purchase | Item icon drops into slot (`y: -40 → 0`, bounce) | 500 ms |
| Error | Card shakes (`x: 0→-8→8→-8→0`, tween) | 300 ms |
| Page transitions | Fade + slide (`opacity 0→1`, `y: 16→0`) | 200 ms |

---

## 6. Security Requirements

| Requirement | Implementation |
|---|---|
| Password storage | bcrypt, cost factor ≥ 12 |
| JWT secret | Min 32 random bytes; stored in `NEXTAUTH_SECRET` env var |
| DB queries | All via Prisma — no raw string interpolation |
| CORS | Allow only `NEXT_PUBLIC_APP_URL` origin on API routes |
| Input validation | Zod schemas on all `POST`/`PATCH` request bodies (server-side) |
| HTTP headers | CSP, `X-Frame-Options`, HSTS via Next.js `headers()` config |
| Secrets | Never committed; `.env.example` lists keys without values |

---

## 7. Deployment Checklist

```
☐  Vercel project linked to GitHub repo — auto-deploy on main branch
☐  Supabase / Neon DB provisioned; DATABASE_URL set in Vercel env
☐  NEXTAUTH_SECRET (32+ random bytes) set in Vercel env
☐  NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY set
☐  prisma migrate deploy run as build step (postinstall or build command)
☐  .env.example committed with all keys, no values
☐  README.md: setup steps, env var guide, live URL, video link
☐  Lighthouse CI run on production URL — Performance ≥ 90, A11y ≥ 90
☐  Walkthrough video: 90–180 s, < 100 MB, publicly accessible link in README
☐  GitHub repo is PUBLIC
☐  ≥ 3 descriptive chronological commits in repo history
```

---

*Life RPG TRD · TZPS Hackathon · Confidential*
