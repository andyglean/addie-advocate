#!/bin/bash

PROJECT_REF="aukstdwxnrggjiekiarw"

echo "🔗 Setting up Allie Advocate with supabase-teal-book"
echo ""

echo "Step 1: Logging in to Supabase..."
npx supabase login

echo ""
echo "Step 2: Linking to project..."
npx supabase link --project-ref "$PROJECT_REF"

echo ""
echo "Step 3: Pushing database schema..."
npx supabase db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Go to: https://app.supabase.com/project/$PROJECT_REF/settings/api"
echo "   2. Copy your credentials:"
echo "      - Project URL → NEXT_PUBLIC_SUPABASE_URL"
echo "      - service_role key → SUPABASE_SERVICE_ROLE_KEY"
echo "   3. Update .env.local with these values"
echo "   4. Create storage bucket: Storage → New bucket → name: 'documents' → Private"
echo "   5. Run: npm run seed:knowledge"
echo "   6. Run: npm run dev"
