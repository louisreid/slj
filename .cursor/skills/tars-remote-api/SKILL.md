---
name: tars-remote-api
description: >-
  Call TARS Mac mini remote API for Gmail, Sheets, Docs, and Drive via Tailscale.
  Use when an agent needs to search or read Gmail, draft email, read or update
  Google Sheets, or any Google Workspace action from a non-TARS repo (e.g.
  jobs-foundation). Requires Cursor secrets MAC_MINI_HOST and REID_REMOTE_TOKEN.
---

# TARS remote API — agent skill

## When to use

- Agent needs **Gmail** (search, read, draft) from any repo
- Agent needs **Google Sheets** read/write from a project repo
- User mentions TARS, Mac mini, `:3049`, or cross-repo Google access
- Error `REID_REMOTE_TOKEN not set` or `401 Unauthorized` — see prerequisites below

## Prerequisites (Cursor secrets — set once)

Add in **Cursor Settings → Cloud Agents → Secrets** ([cursor.com/docs/cloud-agent/setup](https://cursor.com/docs/cloud-agent/setup)). Secrets are **account/workspace-scoped**, not per-repo — one set works for jobs-foundation, WTC, and all repos in your workspace.

| Secret | Required | Purpose |
|--------|----------|---------|
| `REID_REMOTE_TOKEN` | **Yes** | Bearer token from Mac mini `~/openclaw/.env` |
| `MAC_MINI_HOST` | **Yes** | Tailscale IP (default `100.84.168.56`) |
| `TAILSCALE_AUTH_KEY` | Cloud Agents only | Ephemeral key (`tag:automation`) to join tailnet |

Use secret type **Runtime Secret** (not build-time only). Wrong type → env var missing at shell runtime.

**Never** store Google OAuth refresh tokens in project repos. OAuth lives on Mac mini only.

**Full spec:** [README § For agents in other repos](https://github.com/louisreid/å-reid-finance/blob/main/README.md#for-agents-in-other-repos) · [cross-repo-agent-bridge.md](/Users/louisreid/Documents/å-reid-finance/docs/tars/cross-repo-agent-bridge.md)

## Cloud Agent vs local / Build Locally

| Session | Secrets injected? | Tailnet? | What agents see |
|---------|-------------------|----------|-----------------|
| **Cloud Agent** (default for background agents) | Yes — `REID_REMOTE_TOKEN`, `MAC_MINI_HOST`, `TAILSCALE_AUTH_KEY` | Yes (ephemeral node) | `curl` with `$REID_REMOTE_TOKEN` works |
| **Build Locally** / local agent on Mac | **No** — Cloud secrets are **not** passed to local shells | Your Mac's Tailscale (if connected) | `REID_REMOTE_TOKEN not set` unless Louis exports locally |

**Common failure:** secrets configured in Cursor but agent runs **Build Locally** → token absent → `REID_REMOTE_TOKEN not set` or agent says "TARS Gmail isn't authenticated".

**Local workaround (Louis only, never commit):**

```bash
export REID_REMOTE_TOKEN='…'   # from Mac mini ~/openclaw/.env
export MAC_MINI_HOST='100.84.168.56'
```

**Agent rule:** In any repo (including jobs-foundation), **read this skill first** when Gmail/Sheets is needed — do not assume TARS hub repo context or local OAuth.

## Preflight (run before every Gmail/Sheets call)

```bash
bash /Users/louisreid/Documents/å-reid-finance/scripts/tars-remote-preflight.sh
```

Exits 0 only when token is set **and** `GET /google/status` returns 200. If preflight fails, report the printed fix to Louis — do not guess or fall back to "not authenticated".

## Base URL

```
http://${MAC_MINI_HOST}:3049/google/<service>/<action>
Authorization: Bearer ${REID_REMOTE_TOKEN}
```

Health check: `GET http://${MAC_MINI_HOST}:3049/google/status`

## Gmail

### Search messages

```bash
curl -sS -X POST "http://${MAC_MINI_HOST}:3049/google/gmail/search" \
  -H "Authorization: Bearer ${REID_REMOTE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"query":"from:jamie@good.space","maxResults":5}'
```

Returns array of `{ id, threadId, from, to, subject, date, snippet, bodyText }`.

### Get one message

```bash
curl -sS -X POST "http://${MAC_MINI_HOST}:3049/google/gmail/get" \
  -H "Authorization: Bearer ${REID_REMOTE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"messageId":"19f4b9153758e91e"}'
```

### Create draft (no send)

```bash
curl -sS -X POST "http://${MAC_MINI_HOST}:3049/google/gmail/draft" \
  -H "Authorization: Bearer ${REID_REMOTE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"to":["jamie@good.space"],"subject":"Re: …","body":"…","threadId":"optional"}'
```

Louis reviews and sends manually in Gmail.

**HTML formatting (not yet live):** hub today sends `text/plain` only. Implementation spec (priority): [prompt-gmail-draft-html-formatting.md](/Users/louisreid/Documents/å-reid-finance/docs/tars/prompt-gmail-draft-html-formatting.md) in TARS repo — `bodyHtml` + `format: multipart` when shipped.

## Google Sheets

### Read range

```bash
curl -sS -X POST "http://${MAC_MINI_HOST}:3049/google/sheets/get" \
  -H "Authorization: Bearer ${REID_REMOTE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"spreadsheetId":"YOUR_SHEET_ID","range":"Sheet1!A1:Z100"}'
```

### Update / append

See [README § Sheets](https://github.com/louisreid/å-reid-finance/blob/main/README.md#sheets--copy-paste-curl-examples) for `sheets/update` and `sheets/append`.

## Error handling

| Symptom | Meaning | Fix |
|---------|---------|-----|
| `REID_REMOTE_TOKEN not set` (shell) | Env var absent — **most common in project repos** | Cloud Agent: add Runtime Secret, avoid Build Locally. Local: `export REID_REMOTE_TOKEN=…` |
| Agent says "Gmail isn't authenticated" without calling API | Skill not used; agent guessing | User prompt must include `Use tars-remote-api skill`; run preflight |
| `401` / `Unauthorized` | Wrong token value | Re-copy from Mac mini `~/openclaw/.env` into Cursor secret |
| `503` / token not configured on Mac mini | Hub env missing token | Run `bash scripts/mac-mini/install-remote-access.sh` on Mac mini |
| Connection refused / timeout | Not on tailnet or Mac mini down | Cloud: `TAILSCALE_AUTH_KEY`. Local: `tailscale status`. TARS repo: `bash scripts/mac-mini/remote.sh health` |
| Works in å-reid-finance repo only | Coincidence — same secret gap; hub AGENTS.md reminds agents | Install skill + AGENTS.md in project repo; use Cloud Agent |
| `error` in JSON body | Google API or bad payload | Read message; verify `messageId` / `spreadsheetId` |

## Thin wrapper (optional)

From TARS repo (or any repo with the script on PATH):

```bash
bash /Users/louisreid/Documents/å-reid-finance/scripts/tars-remote.sh gmail/search '{"query":"from:jamie@good.space","maxResults":5}'
```

## Install in other repos

```bash
# Personal (all projects — recommended)
cp -R /Users/louisreid/Documents/å-reid-finance/skills/tars-remote-api ~/.cursor/skills/tars-remote-api

# Or per-repo
cp -R /Users/louisreid/Documents/å-reid-finance/skills/tars-remote-api /path/to/repo/.cursor/skills/tars-remote-api

# Bulk install (Louis's repos)
bash /Users/louisreid/Documents/å-reid-finance/scripts/install-tars-remote-api-skill.sh
```

## AGENTS.md block (copy into any project repo)

```markdown
## TARS remote API (Gmail / Sheets)

Gmail, Sheets, Docs via Mac mini `:3049` — **no local OAuth**. Skill: `.cursor/skills/tars-remote-api/SKILL.md`

**Cursor secrets (Cloud Agent only):** `REID_REMOTE_TOKEN`, `MAC_MINI_HOST`, `TAILSCALE_AUTH_KEY` — **not** injected in Build Locally; export locally if needed.

**Preflight:** `bash /Users/louisreid/Documents/å-reid-finance/scripts/tars-remote-preflight.sh`

**Hub:** [å-reid-finance README § For agents in other repos](https://github.com/louisreid/å-reid-finance/blob/main/README.md#for-agents-in-other-repos)

**Search prompt:** `Use tars-remote-api skill. Run preflight, then search Gmail from:jamie@good.space`

**Draft prompt:** `Use tars-remote-api skill. Run preflight, search thread, create Gmail draft (plain text) via POST /google/gmail/draft — Louis sends manually.`
```

## Workflow

1. **Read this skill** (required in non-TARS repos — do not improvise OAuth).
2. Run **preflight**; if it fails, stop and tell Louis which fix applies (cloud vs local).
3. Call the route you need (search → get → draft / sheets get → update).
4. Write results to project memory files; never commit tokens.

### jobs-foundation Gmail draft (copy-paste user prompt)

```
Use tars-remote-api skill. Run preflight. Search Gmail for the latest thread with [client@domain]. Summarize. Create a reply draft via POST /google/gmail/draft with threadId, plain-text body, subject "Re: …". Do not send — Louis reviews in Gmail.
```
