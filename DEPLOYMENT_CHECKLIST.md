# Addie - Deployment Checklist for DigitalOcean

## Pre-Deployment Preparation

### 1. Environment Variables
Ensure these are set in DigitalOcean:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `OPENAI_API_KEY`

### 2. Supabase Setup
- [ ] Database tables created (run `supabase/schema.sql`)
- [ ] pgvector extension enabled
- [ ] Storage bucket `documents` created (private)
- [ ] Knowledge base seeded (`npm run seed:knowledge`)

### 3. Core Files to Include
- [ ] `ADDIE_BEHAVIOR_RULES.md` - Behavior guidelines
- [ ] `knowledge/tx/*.md` - Texas PI knowledge base files
- [ ] `public/addie_pod_cutout.png` - Logo image
- [ ] All component and API files

### 4. Configuration Files
- [ ] `next.config.ts` - Image domains configured
- [ ] `supabase/schema.sql` - Database schema
- [ ] `.env.local` template (without actual keys)

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial Addie deployment"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2. DigitalOcean App Platform Setup
1. Create new App
2. Connect GitHub repository
3. Select branch: `main`
4. Framework: Next.js
5. Build command: `npm run build`
6. Run command: `npm start`

### 3. Environment Variables
Add in DigitalOcean dashboard under "Settings" > "App-level Environment Variables":
- Mark `SUPABASE_SERVICE_ROLE_KEY` as encrypted
- Mark `OPENAI_API_KEY` as encrypted
- Keep `NEXT_PUBLIC_SUPABASE_URL` as plain text

### 4. Deploy & Verify
- [ ] Deploy application
- [ ] Test language selection
- [ ] Test English chat
- [ ] Test Spanish chat
- [ ] Test intake form
- [ ] Verify disclaimers appear
- [ ] Test file upload (if implemented)

## Post-Deployment

### Monitoring
- [ ] Set up error tracking
- [ ] Monitor OpenAI API usage
- [ ] Monitor Supabase storage usage
- [ ] Check conversation logs periodically

### Knowledge Base Maintenance
- [ ] Add new Texas PI guides as needed
- [ ] Run `npm run seed:knowledge` after updates
- [ ] Review and update `ADDIE_BEHAVIOR_RULES.md`

### Behavior Updates
When updating Addie's behavior:
1. Update `ADDIE_BEHAVIOR_RULES.md`
2. Update `lib/prompts/allieSystem.ts` if needed
3. Test thoroughly in development
4. Commit and push changes
5. DigitalOcean will auto-deploy

## Important Files Reference

### Behavior & Training
- `ADDIE_BEHAVIOR_RULES.md` - Canonical behavior rules
- `lib/prompts/allieSystem.ts` - System prompt
- `knowledge/tx/` - Knowledge base files

### Configuration
- `next.config.ts` - Next.js configuration
- `supabase/schema.sql` - Database schema
- `.env.local` - Environment variables (local only)

### Core Functionality
- `app/page.tsx` - Main landing/chat page
- `app/api/chat/route.ts` - Chat API endpoint
- `components/Chat.tsx` - Chat interface
- `lib/rag.ts` - Knowledge retrieval

---

**Note**: Keep `ADDIE_BEHAVIOR_RULES.md` in version control. This ensures consistent behavior across deployments.
