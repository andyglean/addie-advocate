#!/bin/bash

echo "🚀 Setting up Supabase for Allie Advocate"
echo ""

# Check if logged in
if ! npx supabase projects list &>/dev/null; then
  echo "📝 You need to login to Supabase first."
  echo "   This will open your browser to authenticate."
  echo ""
  read -p "Press Enter to continue with login..."
  npx supabase login
fi

echo ""
echo "📋 Your Supabase projects:"
npx supabase projects list

echo ""
echo "🔗 Now let's link this project to your Supabase project."
echo "   You'll need your project reference ID (found in project settings)."
echo ""
read -p "Enter your Supabase project reference ID: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Project reference ID is required"
  exit 1
fi

echo ""
echo "🔗 Linking project..."
npx supabase link --project-ref "$PROJECT_REF"

echo ""
echo "📤 Pushing database schema..."
npx supabase db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Get your project URL and service_role key from Supabase dashboard"
echo "   2. Update .env.local with your credentials"
echo "   3. Run: npm run seed:knowledge"
echo "   4. Run: npm run dev"
