#!/bin/bash

echo "🔗 Linking Allie Advocate to your Supabase project"
echo ""
echo "Available projects:"
echo "  1. supabase-teal-book (active)"
echo "  2. supabase-teal-mountain (active)"
echo "  3. supabase-amber-mountain (paused - not recommended)"
echo ""

# Login first
echo "Step 1: Logging in..."
npx supabase login

echo ""
echo "Step 2: Listing projects to get reference IDs..."
npx supabase projects list

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Step 3: Enter the project reference ID you want to use"
echo "   (Recommended: one of the active projects - teal-book or teal-mountain)"
read -p "Project Reference ID: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Project reference ID is required"
  exit 1
fi

echo ""
echo "🔗 Linking to project..."
npx supabase link --project-ref "$PROJECT_REF"

echo ""
echo "📤 Pushing database schema (this will create Allie's tables)..."
npx supabase db push

echo ""
echo "✅ Database schema pushed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Go to Supabase dashboard → Your project → Settings → API"
echo "   2. Copy:"
echo "      - Project URL → NEXT_PUBLIC_SUPABASE_URL"
echo "      - service_role key → SUPABASE_SERVICE_ROLE_KEY"
echo "   3. Update .env.local with these values"
echo "   4. Create storage bucket 'documents' (Storage → New bucket → Private)"
echo "   5. Run: npm run seed:knowledge"
echo "   6. Run: npm run dev"
