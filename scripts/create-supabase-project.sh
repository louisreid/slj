#!/usr/bin/env bash
# Create the "slj" Supabase project via CLI.
# Prereq: run `supabase login` once and complete the browser auth.
set -e

echo "Checking Supabase login..."
if ! supabase projects list &>/dev/null; then
  echo "Not logged in. Run this in your terminal and complete the browser flow:"
  echo "  supabase login"
  echo "Then run this script again."
  exit 1
fi

echo "Fetching your organizations..."
supabase orgs list

echo ""
echo "Create the 'slj' project (pick an org-id from above; choose a strong DB password):"
echo ""
echo "  supabase projects create slj --org-id YOUR_ORG_ID --db-password 'YOUR_DB_PASSWORD' --region eu-west-1"
echo ""
echo "Example (replace the org-id and password):"
echo "  supabase projects create slj --org-id cool-green-pqdr0qc --db-password 'your-secure-password' --region eu-west-1"
echo ""
echo "After creation, use the project ref from the output to link and push migrations:"
echo "  supabase link --project-ref YOUR_PROJECT_REF"
echo "  supabase db push"
echo ""
echo "Then add the project URL and anon key to Vercel env vars and Supabase Auth URL config (see docs/DEPLOYMENT.md)."
