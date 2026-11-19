# Pranav Ayachit: personal site

Next.js (App Router) + TypeScript + Tailwind CSS + Supabase.

## Setup
1. `npm install next react react-dom @supabase/supabase-js @supabase/ssr`
2. `npm install -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss`
3. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. In the Supabase SQL Editor run, in order: `sql/01_schema.sql`, `sql/02_patch.sql`, `sql/03_security_review.sql`.
5. Supabase → Authentication: turn OFF "Allow new users to sign up", add your own user, then run
   `update profiles set role='admin' where email='YOUR_EMAIL';`
6. `npx tsc --noEmit`, then `npm run build`, then `npm run dev`
7. Optional connection check: `node --env-file=.env.local scripts/check-supabase.mjs`

Admin: `/admin/login`. Never commit `.env.local` or any Supabase secret/service-role key.
