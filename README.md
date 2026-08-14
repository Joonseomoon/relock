# ReLock

A spaced-repetition LeetCode review tracker. Save problems with trick/insight notes, then get a weighted-random problem to review each day. Less-reviewed problems surface more often.

**Live:** https://relock.vercel.app

## Features

- **Weighted random review** — problems surface more often the fewer times they've been solved, the more they've relied on a hint, and the longer it's been since their last review
- **Problem tracker** — add problems with difficulty, NeetCode-roadmap topics, and trick notes; search by title, filter, and sort
- **Hide/show columns** — toggle topics and trick notes columns for a cleaner view
- **Delete confirmation** — deleting a problem requires an explicit confirm, so a stray click can't wipe a record
- **Stats dashboard** — streak, total problems, and today's review count
- **Auth** — email + password via Supabase, per-user data isolation with RLS

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Supabase](https://supabase.com) — Auth + Postgres
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Add environment variables
# Create .env.local with the variables listed below

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Future development

- **History view** — surface a per-problem activity timeline (review logs, hint usage, and when a problem was added/edited/deleted) instead of only using review logs internally for streak/stats calculation.
