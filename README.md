# ReLock

A spaced-repetition LeetCode review tracker. Save problems with trick/insight notes, then get a weighted-random problem to review each day. Less-reviewed problems surface more often.

**Live:** https://relock.vercel.app

## Features

- **Weighted random review** — problems with fewer solves appear more often (`weight = 1 / (solve_count + 1)`)
- **Problem tracker** — add problems with difficulty, NeetCode-roadmap topics, and trick notes
- **Hide/show columns** — toggle topics and trick notes columns for a cleaner view
- **Stats dashboard** — streak, total problems, and today's review count
- **Auth** — email + password via Supabase, per-user data isolation with RLS

## Stack

- [Next.js 14](https://nextjs.org) (App Router)
- [Supabase](https://supabase.com) — Auth + Postgres
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Add environment variables
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
