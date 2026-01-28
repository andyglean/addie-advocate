#!/bin/bash

echo "📋 Checking your Supabase projects..."
echo ""

# Try to list projects (will prompt for login if needed)
npx supabase projects list

echo ""
echo "💡 If you see projects listed above, you can link to one of them."
echo "   Or you can create a new project under your personal account."
echo ""
echo "To link to an existing project, run:"
echo "   npx supabase link --project-ref YOUR_PROJECT_REF"
