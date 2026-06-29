# The Conscious Brotherhood

A single-page lead-gen site whose one job is to fill the free monthly brotherhood call. Circles ($99/mo) are offered to men once they've shown up — there is **no public buy button**; applications are vetted first.

Built with Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui, deployed to Vercel.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Vitest unit/integration tests
npm run build    # production build
npm run lint
```

> This repo lives in WSL; Node 20 (via nvm) is the toolchain. The helper scripts in `.devscripts/` set a clean PATH for you.

## Fill these in before launch — all in `site.config.ts`

Every fill-in-later value is centralized in **`site.config.ts`** (the single source of truth). Anything left at its placeholder renders a *loud* placeholder on the page (e.g. "Dates announced soon", "Bio coming soon") — never a blank gap or a dead link. Swap these in one place:

| Field | What to set |
|---|---|
| `domain` | final domain (currently `consciousbrotherhood.org`) |
| `contactEmail` | the inbox that receives circle applications **and** the mailto fallback if sending fails |
| `social.instagram` / `social.youtube` | handles (or leave `null`) |
| `nextCall.date` / `time` / `tz` | next call details — until `date` is set, the call section shows "Next date announced soon" |
| `lumaUrl` | the Luma event URL — until set, every "Save your seat" button shows a disabled "Dates announced soon" (no dead link) |
| `hosts[].bio` / `hosts[].photo` | bios for Ccowl Humphries and Charlie Grove — names already ship; each null bio shows a "Bio coming soon" block |
| `analytics.plausibleDomain` | optional; Vercel Analytics is already on |

## Environment variables (required in production)

Set these in Vercel (see `.env.example`):

| Var | Purpose |
|---|---|
| `RESEND_API_KEY` | **Required in production.** Without it, `/api/apply` returns an error (it never pretends to succeed). |
| `APPLY_FROM_EMAIL` | the verified Resend "from" address (defaults to `applications@<domain>`) |

**The fail-loud guarantee:** in production, a missing key or a Resend send failure makes the application form show an inline error with a direct "email us" link — it does **not** redirect to `/thanks`. A man's application can never silently vanish. (Locally, with no key set, `/api/apply` soft-succeeds so you can develop without secrets.)

## How the funnel works

- **Primary CTA everywhere:** *Save your seat* → the Luma event (RSVP, reminders, calendar handled by Luma).
- **Secondary path:** *Explore the circles* → the `#circles` section → *Apply for a circle* → `/apply`.
- `/apply` → `POST /api/apply` → emails the hosts via Resend → you vet → you send a private Stripe link ($99/mo).
- `/thanks` confirms the **application** (Luma owns the call-RSVP confirmation).

## Routes

- `/` — landing page (Header, Hero, Problem, Ownership, BeingSeen, MonthlyCall, Circles, WhoFor, Container, Host, FAQ, FinalCTA, Footer)
- `/apply` — circle application form (honeypot + server-side validation)
- `/thanks`, `/privacy`, `/terms`
- `/api/apply` — application handler (Resend)
- `/opengraph-image`, `/icon` — generated OG image + favicon

## Launch checklist

- [ ] Domain + matching IG/YouTube handle
- [ ] Vercel project connected to `github.com/ch4rlie/consciousbro`
- [ ] Luma event created (recurring monthly) → set `lumaUrl`
- [ ] Stripe $99/mo product + payment link (kept private until vetting)
- [ ] Resend wired: `RESEND_API_KEY` + `APPLY_FROM_EMAIL` set in Vercel; verify a test application arrives
- [ ] Set the next call `date`/`time`/`tz`
- [ ] Real host photos + bios for both co-hosts
- [ ] Confirm OG image + favicon render (share the URL in a DM to check the unfurl)
- [ ] `/privacy`, `/terms`, footer disclaimer (with 988) live
- [ ] Test on a phone, top to bottom, with a stranger
- [ ] Vercel Analytics on

---

*All marketing copy is original. The footer disclaimer and the FAQ's 988 crisis references are intentional and must stay.*
