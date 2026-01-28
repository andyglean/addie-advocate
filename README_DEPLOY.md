## Deploy to DigitalOcean App Platform

Prereqs:
- Supabase project created; run `supabase/schema.sql`; bucket `documents` created
- Environment values ready:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - `OPENAI_API_KEY` (server-only)

Steps:
1) Push this repo to GitHub.
2) In DigitalOcean → Apps → Create App → connect repo.
3) Framework: Next.js. Default build/run commands are fine.
4) Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY (mark as encrypted)
   - OPENAI_API_KEY (mark as encrypted)
5) Deploy.

Seeding knowledge (one-time):
- From local dev with envs set: `npm run seed:knowledge`
- Alternatively, add a one-off console to run the script post-deploy (not recommended).

Notes:
- Ensure `documents` bucket is private if you plan to use signed URLs later.
- Never expose the service role key to the browser; keep it only in server routes.


