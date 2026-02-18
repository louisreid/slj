# Deployment checklist — slj.talksfromthewarehouse.co.uk

Deployment-only steps: Git push, Vercel, Supabase Auth, DNS, smoke tests. No feature work.

---

## 1) Git — push to GitHub

**1.1** Create a GitHub repo (e.g. `your-org/slj` or `your-username/slj`) if needed. Create it empty (no README).

**1.2** From the project root, add remote and push (replace `YOUR_ORG_OR_USERNAME` with your GitHub org or username):

```bash
git remote add origin https://github.com/YOUR_ORG_OR_USERNAME/slj.git
git push -u origin main
```

Or with SSH:

```bash
git remote add origin git@github.com:YOUR_ORG_OR_USERNAME/slj.git
git push -u origin main
```

**1.3** Confirm `.env.local` and `.next/` are never committed (they are in `.gitignore`).

---

## 2) Vercel — create project and build settings

**2.1** Go to [vercel.com](https://vercel.com), sign in, **Add New → Project**.

**2.2** Import the GitHub repo `slj`. Authorize Vercel for GitHub if prompted.

**2.3** Configure:

| Setting | Value |
|--------|--------|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | `.` (default) |
| **Build Command** | Leave blank or `pnpm run build` (Vercel uses pnpm when `pnpm-lock.yaml` is present) |
| **Output Directory** | Default (Next.js) |
| **Install Command** | Leave blank or `pnpm install` |

**2.4** Ensure pnpm: repo has `pnpm-lock.yaml`; Vercel will use pnpm automatically.

**2.5** Add environment variables (from `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (e.g. `https://xxxx.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key

Do **not** add `SUPABASE_SERVICE_ROLE_KEY` for V1.

**2.6** Click **Deploy**. Add custom domain before or after deploy.

---

## 3) Supabase Auth — magic-link URLs

In **Supabase Dashboard → Authentication → URL Configuration** (or **Project Settings → Auth**):

**3.1** **Site URL:** `https://slj.talksfromthewarehouse.co.uk`

**3.2** **Redirect URLs** — add both:

- `http://localhost:3000/auth/callback`
- `https://slj.talksfromthewarehouse.co.uk/auth/callback`

Save.

---

## 4) Custom domain — DNS

**4.1** In Vercel: **Project → Settings → Domains**. Add `slj.talksfromthewarehouse.co.uk`. Note the target Vercel shows.

**4.2** At the DNS provider for `talksfromthewarehouse.co.uk`, add:

- **Type:** `CNAME`
- **Name / Host:** `slj` (subdomain only; some providers show full name)
- **Value / Target:** Use the exact value from Vercel (e.g. `cname.vercel-dns.com` or project-specific CNAME)

**4.3** Wait for DNS propagation (minutes to 48 hours). Vercel shows a check when verified. SSL is provisioned automatically.

**4.4** Gotchas:

- Adding only the `slj` subdomain does **not** change the existing `talksfromthewarehouse.co.uk` (apex) site.
- Only `slj.talksfromthewarehouse.co.uk` points to Vercel; other subdomains and apex keep existing DNS.

---

## 5) Smoke-test checklist (production)

On **https://slj.talksfromthewarehouse.co.uk**:

1. **Sign in via magic link** — `/auth/sign-in`, enter email, click link in email; confirm redirect and signed-in state.
2. **Load course reader** — Open course; confirm content loads.
3. **Create note** — Add a private margin note to a block; confirm it saves and appears.
4. **Mark progress** — Toggle section completion; confirm it persists after refresh.
5. **Print worksheet** — Open worksheets, use browser Print; confirm print-friendly layout.
6. **Join group + edit shared notes** — Join a group, edit shared group notes, save; confirm edits persist (e.g. after refresh).

If auth fails, re-check Supabase **Site URL** and **Redirect URLs**. Check browser console and network tab for other errors.
