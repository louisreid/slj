#!/usr/bin/env bash
# Push pending Supabase migrations to the linked slj project via Supabase CLI.
# Uses a clean workdir so an expired SUPABASE_ACCESS_TOKEN in .env.local does not break CLI auth.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI_VERSION="${SUPABASE_CLI_VERSION:-2.104.0}"
WORK="${TMPDIR:-/tmp}/slj-supabase-cli-$$"
REF="$(cat "$ROOT/supabase/.temp/project-ref" 2>/dev/null || echo mlbmjrgykjjwhellmtpz)"

cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

mkdir -p "$WORK/supabase/migrations" "$WORK/supabase/.temp"
cp "$ROOT/supabase/migrations/"*.sql "$WORK/supabase/migrations/"
echo "$REF" > "$WORK/supabase/.temp/project-ref"

echo "Linking project $REF (CLI $CLI_VERSION)…"
(cd "$WORK" && npx "supabase@${CLI_VERSION}" link --project-ref "$REF" --yes)

echo "Pushing migrations…"
(cd "$WORK" && npx "supabase@${CLI_VERSION}" db push --yes)

echo "Verifying chapter_progress…"
node --env-file="$ROOT/.env.local" -e "
const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) { console.error('Missing NEXT_PUBLIC_SUPABASE_* in .env.local'); process.exit(1); }
const supabase = createClient(url, key);
supabase.from('chapter_progress').select('chapter_id').limit(1).then(({ error }) => {
  if (error) { console.error('Verify failed:', error.message); process.exit(1); }
  console.log('chapter_progress is available.');
});
"

echo "Done."
