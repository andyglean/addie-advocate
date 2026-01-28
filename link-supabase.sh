#!/bin/bash

echo "🔗 Linking Allie Advocate to your Supabase account"
echo ""

# Check if already linked
if [ -f ".supabase/config.toml" ] && grep -q "project_id" .supabase/config.toml 2>/dev/null; then
  echo "⚠️  Project may already be linked. Check .supabase/config.toml"
  echo ""
fi

echo "Step 1: Login to Supabase"
echo "   (This will open your browser)"
npx supabase login

echo ""
echo "Step 2: List your projects"
npx supabase projects list

echo ""
echo "Step 3: Link to your project"
echo "   Enter the project reference ID from the list above"
read -p "Project Reference ID: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Project reference ID is required"
  exit 1
fi

echo ""
echo "🔗 Linking to project: $PROJECT_REF"
npx supabase link --project-ref "$PROJECT_REF"

echo ""
echo "📤 Pushing database schema..."
npx supabase db push

echo ""
echo "✅ Done! Now:"
echo "   1. Get your credentials from Supabase dashboard → Settings → API"
echo "   2. Update .env.local with:"
echo "      - NEXT_PUBLIC_SUPABASE_URL"
echo "      - SUPABASE_SERVICE_ROLE_KEY"
echo "   3. Create storage bucket 'documents' in Supabase dashboard"
echo "   4. Run: npm run seed:knowledge"
echo "   5. Run: npm run dev"
