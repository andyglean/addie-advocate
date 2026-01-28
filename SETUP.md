# Allie Advocate - Setup Guide

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com and sign in (or create an account)
2. Click "New Project"
3. Fill in:
   - **Name**: `allie-advocate` (or your choice)
   - **Database Password**: Save this securely (you'll need it)
   - **Region**: Choose closest to you (e.g., `US East`)
4. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (under "Project API keys") → This is your `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **Important**: Use the `service_role` key, NOT the `anon` key

## Step 3: Enable pgvector Extension

1. In Supabase dashboard, go to **Database** → **Extensions**
2. Search for `vector` or `pgvector`
3. Click the toggle to enable it
4. Wait for it to activate (usually instant)

## Step 4: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents and paste into the SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned" - this is correct!

## Step 5: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click "New bucket"
3. Name it: `documents`
4. Set it to **Private** (not public)
5. Click "Create bucket"

## Step 6: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in (or create account)
3. Click "Create new secret key"
4. Name it: `allie-advocate` (or your choice)
5. Copy the key immediately (you won't see it again!)

## Step 7: Update .env.local

1. Open `.env.local` in this project
2. Replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   OPENAI_API_KEY=sk-...
   ```

## Step 8: Install Dependencies & Seed Knowledge

```bash
npm install
npm run seed:knowledge
```

## Step 9: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see Allie!

---

## Troubleshooting

**"Extension vector does not exist"**
- Make sure you enabled the pgvector extension in Step 3

**"relation does not exist"**
- Make sure you ran the schema.sql file in Step 4

**"Invalid API key"**
- Double-check you copied the full key (they're long!)
- For Supabase: Make sure you're using `service_role` key, not `anon` key

**Storage upload fails**
- Verify the `documents` bucket exists and is named exactly `documents`
