# Supabase CLI Setup Guide

## Option 1: Quick Setup via CLI (Recommended)

### Step 1: Login to Supabase CLI

```bash
npx supabase login
```

This will open your browser. Sign in and authorize the CLI.

### Step 2: Create or Link Project

**If you already have a Supabase project:**
```bash
# List your projects
npx supabase projects list

# Link to your project (replace PROJECT_REF with your project reference ID)
npx supabase link --project-ref YOUR_PROJECT_REF
```

**If you need to create a new project:**
1. Go to https://app.supabase.com
2. Create a new project
3. Note the project reference ID (found in Settings → General)
4. Then run: `npx supabase link --project-ref YOUR_PROJECT_REF`

### Step 3: Push Database Schema

```bash
npx supabase db push
```

This will:
- Enable pgvector extension
- Create all tables (leads, intake_submissions, conversations, messages, documents, knowledge_chunks)
- Create the vector search function
- Set up indexes

### Step 4: Create Storage Bucket

The storage bucket is configured in `supabase/config.toml`, but for cloud projects, create it via:

```bash
# Or create via Supabase dashboard: Storage → New bucket → name: "documents" → Private
```

### Step 5: Get Your Credentials

1. Go to Supabase dashboard → Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 6: Update .env.local

```bash
# Edit .env.local and add your credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-...
```

### Step 7: Seed Knowledge Base

```bash
npm run seed:knowledge
```

### Step 8: Start Development

```bash
npm run dev
```

---

## Option 2: Manual Setup (Web Interface)

If you prefer using the web interface:

1. **Create Supabase Project** at https://app.supabase.com
2. **Enable pgvector**: Database → Extensions → enable `vector`
3. **Run Schema**: SQL Editor → paste contents of `supabase/schema.sql` → Run
4. **Create Storage Bucket**: Storage → New bucket → name: `documents` → Private
5. **Get Credentials**: Settings → API → copy URL and service_role key
6. **Update .env.local** with your credentials
7. **Seed knowledge**: `npm run seed:knowledge`
8. **Start dev server**: `npm run dev`

---

## Troubleshooting

**"Access token not provided"**
- Run `npx supabase login` first

**"Project not found"**
- Make sure you're using the correct project reference ID
- Find it in: Supabase dashboard → Settings → General → Reference ID

**"Extension vector does not exist"**
- Make sure pgvector is enabled in your Supabase project
- For cloud: Database → Extensions → enable `vector`
- For local: It's enabled automatically

**Migration errors**
- Make sure you're linked to the correct project
- Check if tables already exist (you may need to drop them first)

**Storage bucket not found**
- Create it manually in Supabase dashboard: Storage → New bucket → `documents`
