# ⚔️ HELLFIRE QUESTS — Life RPG

> **Transform real-world productivity into a supernatural RPG progression system.**  
> *Official Submission for the TZPS Hackathon 2025*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-https%3A%2F%2Fhellfirequests.vercel.app-E50914?style=for-the-badge&logo=vercel&logoColor=white)](https://hellfirequests.vercel.app/)
[![Next.js 14](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Security Hardened](https://img.shields.io/badge/Security-A%2B%20Hardened-00C853?style=for-the-badge&logo=shield&logoColor=white)](#-security-hardening--data-isolation)

---

## 🌌 Overview

**Hellfire Quests** gamifies personal development, daily habits, and task management through a Stranger Things / Supernatural RPG lens. By applying the immediate feedback loops of video games to real-world tasks, users forge their character, complete campaigns, earn XP and Gold, build daily streaks, unlock items in the shop, and elevate 5 key life attributes (**Intellect, Strength, Wisdom, Creativity, Endurance**).

---

## ⚡ Key Features & Mechanics

### ⚔️ Campaigns & Quest System (CRUD)
- **Task Types**: Filter and manage tasks by difficulty (`EASY`, `MEDIUM`, `HARD`) and category mapping directly to character attributes.
- **Dynamic Rewards**:
  | Difficulty | XP Earned | Gold Earned |
  |---|---|---|
  | 🟢 **Easy** | `50 XP` | `10 Gold` |
  | 🟡 **Medium** | `150 XP` | `30 Gold` |
  | 🔴 **Hard** | `300 XP` | `60 Gold` |
- **Optimistic UI Updates**: Instant completion response with automatic rollback on network errors.

### 📈 Progression Engine & Attributes
- **Level Formula**: Exponential growth curve ($Level_N = N^2 \times 100\text{ XP}$).
- **Attributes**:
  - 🧠 **Intellect**: Study, reading, deep work
  - ⚔️ **Strength**: Workouts, physical fitness
  - 🔮 **Wisdom**: Meditation, planning, mindfulness
  - 🎨 **Creativity**: Coding, writing, art, design
  - 🏃 **Endurance**: Daily habits, cardio, persistence
- **Level-Up Celebrations**: Triggering full-screen particle bursts and stat attribute upgrades upon reaching milestone XP.

### 🔥 Supernatural Streak Multipliers
- Daily activity tracking with automatic multiplier boosts:
  - **7-Day Streak**: $1.5\times$ XP multiplier on all quest completions.
  - **30-Day Streak**: $2.0\times$ XP multiplier + exclusive 'Veteran Hero' status.

### 🛒 Starcourt Mall (Virtual Economy)
- Spend hard-earned Gold on custom themes, profile badges, and character gear.
- Real-time balance verification and inventory ownership persistence.

### 🎒 The Backpack & Hawkins Logs
- **The Backpack**: Full inventory view of unlocked shop items.
- **Hawkins Logs**: Searchable, paginated activity feed tracking past completed quests, earned XP, and gold rewards over time.

---

## 🔒 Security Hardening & Data Isolation

Hellfire Quests is built with a **Security-First Architecture** enforcing the strict invariant:

$$\text{AUTHENTICATED\_USER\_ID} = \text{RESOURCE\_OWNER\_ID}$$

### Security Highlights:
1. **Cryptographic Authentication**:
   - HTTP-only, `SameSite=Lax`, `Secure` signed JWT cookies signed via `jose` (`HS256`).
   - Secure password hashing using `bcryptjs` (salt factor 12).
2. **Google OAuth 2.0 Resilience**:
   - Dynamic canonical origin resolution via `X-Forwarded-Host` / `Host` request headers, eliminating `redirect_uri_mismatch` across environments.
3. **Zero IDOR Policy**:
   - All backend API endpoints (`/api/me`, `/api/quests`, `/api/inventory`, `/api/history`, `/api/shop/buy`) explicitly scope database queries to the authenticated session context (`session.userId`).
   - Client-supplied IDs in request bodies or query parameters can **NEVER** bypass ownership context.
4. **State Isolation & Clean Logout**:
   - Logging out triggers a full reset of client-side state (`queryClient.clear()` & Zustand store clearing), preventing cross-account state leakage on shared browsers.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Vanilla CSS Design System, Lucide Icons
- **Motion & UI**: Framer Motion, Canvas Spores Engine, Dynamic Sound & Particle FX
- **State Management**: React Query (server state), Zustand (client stores)
- **Backend & API**: Next.js Server Routes, Zod Validation, Jose JWT
- **Database**: PostgreSQL (Supabase / Neon), Prisma ORM
- **Deployment**: Vercel

---

## 🗄️ Database Architecture

```mermaid
erDiagram
    USER ||--o| CHARACTER : "owns"
    USER ||--o{ QUEST : "creates"
    USER ||--o{ QUEST_LOG : "records"
    USER ||--o{ INVENTORY_ITEM : "owns"

    USER {
        string id PK
        string email UK
        string passwordHash
        string firstName
        string lastName
        DateTime createdAt
    }

    CHARACTER {
        string id PK
        string userId FK, UK
        string name
        string class
        int level
        int xp
        int gold
        int streak
        int intellect
        int strength
        int wisdom
        int creativity
        int endurance
    }

    QUEST {
        string id PK
        string userId FK
        string title
        enum category
        enum difficulty
        enum status
        DateTime createdAt
    }

    QUEST_LOG {
        string id PK
        string userId FK
        string questId
        int xpEarned
        int goldEarned
        DateTime completedAt
    }

    INVENTORY_ITEM {
        string id PK
        string userId FK
        string itemId
        DateTime purchasedAt
    }
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js `18.x` or later
- npm or pnpm
- PostgreSQL database instance (Supabase, Neon, or local Postgres)

### 2. Clone & Install
```bash
git clone https://github.com/jinendrabanthia/TEAM-NAMASTE.git
cd TEAM-NAMASTE
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# PostgreSQL Connection
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# JWT Secret (Min 32 random characters)
NEXTAUTH_SECRET="your-super-secret-jwt-key-minimum-32-bytes!"

# App Base URL (For production Google OAuth redirect resolution)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth Credentials (Optional for Google Sign-In)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Database Setup
```bash
# Push Prisma schema to your PostgreSQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Reference

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/api/auth/signup` | `POST` | No | Register new user with email/password |
| `/api/auth/login` | `POST` | No | Authenticate user & issue httpOnly JWT |
| `/api/auth/logout` | `POST` | Yes | Revoke cookie session |
| `/api/auth/google` | `GET` | No | Initiate Google OAuth redirect |
| `/api/auth/google/callback` | `GET` | No | Google OAuth code exchange |
| `/api/me` | `GET` | Yes | Fetch authenticated user profile & character |
| `/api/me/profile` | `PUT` | Yes | Update user profile bio & details |
| `/api/me/character` | `POST` | Yes | Initialize character during onboarding |
| `/api/quests` | `GET`, `POST` | Yes | List active quests or create a quest |
| `/api/quests/[id]` | `PATCH`, `DELETE` | Yes | Edit quest or soft-delete (abandon) |
| `/api/quests/[id]/complete` | `POST` | Yes | Complete quest, award XP/Gold & update streak |
| `/api/inventory` | `GET` | Yes | List user's owned inventory items |
| `/api/history` | `GET` | Yes | Fetch paginated history of completed quests |
| `/api/shop/buy` | `POST` | Yes | Purchase item from shop with Gold |

---

## 🎯 Hackathon Checklist (TZPS 2025)

- [x] **Full-Stack Application**: Built with Next.js 14 App Router, Prisma ORM, and PostgreSQL.
- [x] **Gamified Feedback Loop**: Instant XP, Gold, Level progression, and streak multipliers.
- [x] **Production-Safe Security**: Enforced user isolation, zero IDOR, and signed JWT cookies.
- [x] **Cinematic UX**: High-performance Framer Motion animations and particle engines.
- [x] **Mobile First & Responsive**: Optimized for desktop and mobile viewports.
- [x] **Live Vercel Deployment**: [https://hellfirequests.vercel.app](https://hellfirequests.vercel.app)

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<p align="center">
  <b>Built with ⚔️ for TZPS Hackathon 2025 by Team Namaste</b>
</p>
