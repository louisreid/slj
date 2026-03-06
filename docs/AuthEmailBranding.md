# Auth email branding — Simplicity, Love & Justice

Magic link and confirmation emails are customized for the app and use `{{ .ConfirmationURL }}` so redirects (e.g. localhost) work correctly.

---

## 1. Templates via Management API (recommended)

The app’s script applies branded subjects and HTML bodies without “powered by Supabase”:

- **Magic link:** subject “Sign in to Simplicity, Love & Justice”; body uses `{{ .ConfirmationURL }}`.
- **Confirmation:** subject “Confirm your account — Simplicity, Love & Justice”; body uses `{{ .ConfirmationURL }}`.

### Prerequisites

- **Supabase Management API token:** [Dashboard → Account → Access Tokens](https://supabase.com/dashboard/account/tokens). Create a token and add it to `.env.local` as `SUPABASE_ACCESS_TOKEN`.
- **Project ref:** Either set `SUPABASE_PROJECT_REF` in `.env.local` or have `NEXT_PUBLIC_SUPABASE_URL` set (script derives the ref from the URL), or pass the project ref as the first argument.

### Run the script

From the repo root:

```bash
./scripts/update-supabase-email-templates.sh
```

Or with an explicit project ref:

```bash
./scripts/update-supabase-email-templates.sh mlbmjrgykjjwhellmtpz
```

The script will:

1. Load `.env.local` (if present).
2. Verify the token with a GET on the auth config.
3. PATCH the auth config with the magic link and confirmation subject + HTML template.

### Verify

- In **Supabase Dashboard → Authentication → Email Templates**, confirm Magic Link and Confirm signup show the new subject and content.
- Trigger a magic link from `/auth/sign-in` (e.g. with localhost redirect) and confirm the link uses your `emailRedirectTo` and the email looks correct.

---

## 2. Custom SMTP (optional)

To send from your own domain and sender name (e.g. “Simplicity, Love & Justice” &lt;noreply@slj.talksfromthewarehouse.co.uk&gt;):

1. **SMTP provider:** Use Resend, SendGrid, Postmark, or another SMTP provider. Create an API key or SMTP credentials.
2. **Supabase:** **Dashboard → Project → Authentication → SMTP Settings**. Enable custom SMTP and enter:
   - Sender email (e.g. `noreply@slj.talksfromthewarehouse.co.uk`)
   - Sender name (e.g. `Simplicity, Love & Justice`)
   - Host, port, and credentials from your provider.
3. **DNS:** Add any records the provider requires (e.g. SPF, DKIM) for the sending domain so mail is not marked as spam.

Templates (subjects and bodies) are still controlled by the email templates in Auth (Dashboard or the script above). Custom SMTP only changes how the email is sent and who it appears from.

---

## Reference

- [Supabase Auth email templates](https://supabase.com/docs/guides/auth/auth-email-templates) — variables like `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .Email }}`.
- [Management API — update auth config](https://supabase.com/docs/reference/api/v1-update-auth-service-config) — PATCH keys include `mailer_subjects_magic_link`, `mailer_templates_magic_link_content`, `mailer_subjects_confirmation`, `mailer_templates_confirmation_content`.
- Deployment: see [DEPLOYMENT.md](DEPLOYMENT.md) for Auth URLs and env vars.
