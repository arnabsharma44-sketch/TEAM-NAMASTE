# Life RPG

> **TZPS Hackathon 2025** — Gamify your life with an RPG progression system.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jinendrabanthia/TEAM-NAMASTE)

## What is Life RPG?

Life RPG transforms real-world tasks into an RPG game loop. Complete **Quests** (tasks), earn **XP** and **Gold**, level up 5 character attributes, maintain daily **Streaks**, and spend Gold in the **Shop**.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + Framer Motion animations
- **Zustand** (global state) + **React Query** (server state)
- **Prisma** ORM + **PostgreSQL** (Supabase / Neon)
- **bcryptjs** passwords + **JWT** sessions (jose)
- Deploy: **Vercel**

## Setup

```bash
# 1. Clone
git clone https://github.com/jinendrabanthia/TEAM-NAMASTE.git
cd TEAM-NAMASTE

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in DATABASE_URL, NEXTAUTH_SECRET (32+ random bytes),
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Push DB schema
npx prisma db push

# 5. Run dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Min 32-byte random secret for JWT |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

## Features

- ⚔️ **Quest CRUD** — Create, complete, edit, abandon quests
- 📈 **XP & Leveling** — Non-linear curve (Level N = N² × 100 XP)
- 🔥 **Streaks** — 7-day (1.5×) and 30-day (2.0×) XP multipliers
- 💰 **Economy** — Earn Gold, spend in the Shop
- 🎨 **Themes** — Dark Dungeon, Neon Cyber, Cozy Tavern
- 🚀 **Optimistic UI** — Instant feedback, rollback on error
- ♿ **Accessible** — WCAG AA, keyboard navigation, ARIA

## Live URL

> _Add your Vercel deployment URL here_

## Walkthrough Video

> _Add your 90–180s demo video link here_
