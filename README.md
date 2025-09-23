# SmartSQL – Agent (Next.js + Supabase)

SmartSQL is a Next.js app with Google OAuth (via Supabase) that routes users to a minimal chat experience. The chat streams tokens from a FastAPI backend (SSE), shows a ChatGPT-like typing cursor, and offers example prompts. The header includes a sticky account avatar that opens a centered Account Settings modal with Sign Out.

## Highlights

- Google Sign‑In with Supabase OAuth (consent screen enabled)
- AuthContext (React Context API) for global auth state
- Home hero CTA: checks session → `/chat` if authenticated, else `/auth`
- Auth page: Google sign‑in, redirects to `/chat` when authenticated
- Chat page:
  - SSE streaming from FastAPI endpoint (`/ask/stream`)
  - Typing cursor ▍ during streaming; stops when stream ends
  - Example queries as quick suggestions
  - Send button spinner; loading clears on first streamed token
  - Simple toast system (auto-hide after 5s)
- Header: sticky; shows only avatar (click to open modal) or “Sign in” button
- Account modal: user email + Sign Out, overlay close, redirects to home

## Requirements

- Node.js 18+
- Supabase project with Google provider enabled
- Google OAuth Client (Web) credentials

## Environment

Create `.env.local` in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API base (FastAPI)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Install & Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

## UX details

- The typing cursor ▍ appears at the end of the current assistant message while streaming.
- Toasts auto-dismiss after 5 seconds.
- Example prompts prefill the input when clicked; press Send to stream.
- Avatar in header opens a modal; Sign Out returns to home.

## Troubleshooting

- Blank redirect after sign‑in: verify `.env.local` Supabase values and Google OAuth Authorized Redirect URI.
- 401/403 from backend: ensure you forward the Supabase access token and backend validates it.
- No streaming/parse issues: make sure each SSE line starts with `data:` followed by valid JSON.

## License

MIT