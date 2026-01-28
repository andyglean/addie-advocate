#!/bin/bash

echo "🔍 Checking your Supabase access..."
echo ""

# First, make sure we're logged in
echo "Step 1: Login (if needed)"
npx supabase login

echo ""
echo "Step 2: Listing your available projects..."
echo ""

npx supabase projects list

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next steps:"
echo ""
echo "If you see projects listed above:"
echo "   1. Pick one to use (or create a new one if you have permissions)"
echo "   2. Copy its 'Reference ID'"
echo "   3. Run: npx supabase link --project-ref YOUR_REF_ID"
echo "   4. Run: npx supabase db push"
echo ""
echo "If you don't see any projects or can't create one:"
echo "   - You may need to use a personal Supabase account"
echo "   - Or ask your org admin for project creation permissions"
echo ""
