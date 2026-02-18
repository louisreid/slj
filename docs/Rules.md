# Rules (Timeless)

## Product rules
- Not an LMS. Keep features minimal.
- Notes are private, always.
- Print reliability is a first-class requirement.

## Architecture rules
- Content is Markdown in repo. No CMS UI in V1.
- Notes/progress/groups live in Supabase with strict RLS.
- Prefer Server Components for content rendering; Client Components for interactivity.
- Keep dependencies minimal and stable.

## Dependency rules (3+ year durability)
- Avoid niche libraries.
- Prefer well-supported basics: Next.js, Tailwind, Supabase.
- Minimize moving parts (no queues, no complex background jobs in V1).

## Security rules
- RLS on all tables with user data.
- Never use service role from client.
- Never log note contents.

## “Never do”
- Don’t add rich highlighting/text-range anchoring in V1.
- Don’t add complex group features (chat/events).
- Don’t store course content in the database.
