# 🚀 Deploying Life RPG to Vercel

This application is fully optimized for continuous deployment on **Vercel** with Next.js 14 and Prisma PostgreSQL.

---

## 🛠️ Step 1: Push latest code to GitHub

Make sure your latest changes are pushed to `main`:
```bash
git add .
git commit -m "prep: ready for Vercel deployment"
git push origin main
```

---

## 🗄️ Step 2: Set Up a Production PostgreSQL Database

Life RPG requires a cloud PostgreSQL database. You can create a **free** hosted database on any of the following providers:

1. **[Neon](https://neon.tech/)** (Recommended - 1-click serverless Postgres)
2. **[Supabase](https://supabase.com/)**
3. **[Vercel Postgres / Storage](https://vercel.com/docs/storage/vercel-postgres)**
4. **[Railway](https://railway.app/)**

Once created, copy your database connection string URL (e.g. `postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`).

---

## ⚡ Step 3: Run Database Migrations/Push

Run `prisma db push` locally pointed to your production `DATABASE_URL` (or run it via terminal):
```bash
DATABASE_URL="your-production-postgres-url" npx prisma db push
```

---

## 🌐 Step 4: Import Project into Vercel

1. Log in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
2. Select your GitHub repository: `jinendrabanthia/TEAM-NAMASTE`.
3. Framework Preset will be automatically detected as **Next.js**.
4. Open the **Environment Variables** section and add the following required variables:

| Variable Name | Value | Required |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://...` (Your cloud Postgres connection string) | Yes |
| `NEXTAUTH_SECRET` | A secure 32+ character random string (e.g., `openssl rand -base64 32`) | Yes |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Yes |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID (if using Google Login) | Optional |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret (if using Google Login) | Optional |

5. Click **Deploy**. Vercel will automatically build the app and deploy it to a production URL!

---

## 🔄 Automatic Deployment

Every time you commit and push to the `main` branch on GitHub, Vercel will automatically trigger a new deployment.
