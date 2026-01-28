# Supabase Setup

1) Create project at Supabase, grab:
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY (server-only)

2) Enable pgvector (Database → Extensions).

3) Run schema:
- SQL Editor → paste `schema.sql` and run.
- Create Storage bucket `documents` (Public: false).

4) (Later) Add RLS policies. For MVP, use service-role key on server routes only.


