#!/usr/bin/env bash
# Update Supabase Auth email templates (magic link + confirmation) via Management API.
# Requires SUPABASE_ACCESS_TOKEN in .env.local (or env). Optional: SUPABASE_PROJECT_REF or pass as first arg.
# See docs/AuthEmailBranding.md.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

if [ -f .env.local ]; then
  set -a
  source .env.local 2>/dev/null || true
  set +a
fi

PROJECT_REF="${1:-$SUPABASE_PROJECT_REF}"
if [ -z "$PROJECT_REF" ] && [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  # Extract project ref from URL (e.g. https://xxxx.supabase.co -> xxxx)
  PROJECT_REF="$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -n 's|https://\([^.]*\)\.supabase\.co.*|\1|p')"
fi
if [ -z "$PROJECT_REF" ]; then
  echo "Usage: $0 [PROJECT_REF]" >&2
  echo "  Or set SUPABASE_PROJECT_REF or NEXT_PUBLIC_SUPABASE_URL in .env.local" >&2
  exit 1
fi
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "SUPABASE_ACCESS_TOKEN is not set. Add it to .env.local or env." >&2
  echo "Get a token from: https://supabase.com/dashboard/account/tokens" >&2
  exit 1
fi

BASE_URL="https://api.supabase.com/v1/projects/${PROJECT_REF}"
AUTH_CONFIG_URL="${BASE_URL}/config/auth"

echo "Verifying token (GET auth config)..."
HTTP_CODE="$(curl -s -o /tmp/slj-auth-config.json -w "%{http_code}" "$AUTH_CONFIG_URL" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN")"
if [ "$HTTP_CODE" != "200" ]; then
  echo "GET auth config failed (HTTP $HTTP_CODE). Check SUPABASE_ACCESS_TOKEN and project ref." >&2
  cat /tmp/slj-auth-config.json 2>/dev/null | head -20
  exit 1
fi
echo "Token OK."

# Templates use {{ .ConfirmationURL }} so emailRedirectTo from sign-in is honored (localhost fix).
MAGIC_LINK_HTML='<h2>Sign in to Simplicity, Love &amp; Justice</h2><p>Click the link below to sign in:</p><p><a href="{{ .ConfirmationURL }}">Sign in</a></p>'
CONFIRMATION_HTML='<h2>Confirm your account</h2><p>Click the link below to confirm your account for Simplicity, Love &amp; Justice:</p><p><a href="{{ .ConfirmationURL }}">Confirm account</a></p>'

PAYLOAD="$(jq -n \
  --arg subj_ml "Sign in to Simplicity, Love & Justice" \
  --arg body_ml "$MAGIC_LINK_HTML" \
  --arg subj_conf "Confirm your account — Simplicity, Love & Justice" \
  --arg body_conf "$CONFIRMATION_HTML" \
  '{
    mailer_subjects_magic_link: $subj_ml,
    mailer_templates_magic_link_content: $body_ml,
    mailer_subjects_confirmation: $subj_conf,
    mailer_templates_confirmation_content: $body_conf
  }')"

echo "PATCHing auth config (email subjects + templates)..."
HTTP_CODE="$(curl -s -o /tmp/slj-auth-patch.json -w "%{http_code}" -X PATCH "$AUTH_CONFIG_URL" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")"
if [ "$HTTP_CODE" != "200" ]; then
  echo "PATCH auth config failed (HTTP $HTTP_CODE)." >&2
  cat /tmp/slj-auth-patch.json 2>/dev/null
  exit 1
fi
echo "Done. Magic link and confirmation templates updated."
