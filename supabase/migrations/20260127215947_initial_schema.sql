-- Enable pgvector
create extension if not exists vector;

-- Leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  zip text,
  created_at timestamptz not null default now()
);

-- Intake
create table if not exists public.intake_submissions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  accident_datetime timestamptz,
  location text,
  weather text,
  fault_view text,
  injuries_text text,
  treatment_started boolean,
  insurance_info jsonb,
  police_report jsonb,
  created_at timestamptz not null default now()
);

-- Conversations and messages
create type message_role as enum ('user', 'assistant', 'system');

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  role message_role not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Documents (Storage references)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  file_url text not null,
  type text,
  created_at timestamptz not null default now()
);

-- Knowledge chunks
-- Using text-embedding-3-small (1536 dims)
create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  chunk text not null,
  embedding vector(1536)
);

-- Helpful indexes
create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at);
create index if not exists idx_conversations_lead on public.conversations(lead_id, created_at);

-- RPC for vector similarity search
create or replace function public.match_knowledge (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
) returns table (
  id uuid,
  source text,
  chunk text,
  similarity float
) language sql stable as
$$
  select
    k.id,
    k.source,
    k.chunk,
    1 - (k.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks k
  where 1 - (k.embedding <=> query_embedding) > similarity_threshold
  order by k.embedding <=> query_embedding
  limit match_count;
$$;
