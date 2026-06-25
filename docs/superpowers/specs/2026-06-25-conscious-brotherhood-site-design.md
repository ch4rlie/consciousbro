# The Conscious Brotherhood — Site Design Spec

**Date:** 2026-06-25
**Status:** Approved (pending final spec review)

A single-page lead-gen marketing site whose one job is to fill the free monthly brotherhood call. Circles ($99/mo) are the upsell made to men *after* they show up — never sold via a public buy button.

---

## 1. Goal & conversion architecture

```
Cold visitor
   → [ Save your seat on the next call ]   ← ONLY primary CTA (→ Luma RSVP)
   → shows up, feels less alone
   → [ Apply for a circle ]                ← quiet secondary path (→ /apply form)
   → host vets → private Stripe link ($99/mo)
   → member
```

- **Primary CTA everywhere:** *Save your seat* — points at the Luma event.
- **Secondary CTA:** *Explore the circles* → anchors to the Circles section → *Apply for a circle* → `/apply`.
- **No public Stripe / buy button.** Applications are vetted first.

Success = a man can RSVP to the call in one tap on his phone, and an interested man can submit a circle application that reliably reaches the hosts' inbox.

---

## 2. Stack & deployment

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** + **shadcn/ui** (accordion, button, form primitives)
- **`next/font`**: Fraunces (headlines, serif, soul) + Inter (body)
- **Resend** for the `/apply` email
- **Vercel Analytics** on; **Plausible** behind a config flag
- Deploy target: **Vercel**
- Mobile-first; fast LCP hero; accessible (semantic landmarks, keyboard-navigable accordion, alt text).

---

## 3. Design system

Dark-mode-leaning, warm, earthy — "firelight, not a clinic." Avoid culty/intense, red-pill hustle, and wellness-spa-soft failure modes.

**Palette (Tailwind theme tokens):**
| Token | Value | Use |
|---|---|---|
| `charcoal` (base) | `#15130F` | page background |
| `bone` / sand | `#E8E1D4` | primary text |
| `ember` (accent) | `#C8651B` | CTAs, accents (warmth, not literal flames) |
| `olive` (support) | `#3A4434` | secondary surfaces / muted accents |

**Type:** Fraunces for headlines (big, tight, generous whitespace); Inter for body (generous line height). One personality face max.

**Imagery:** v1 ships a tasteful placeholder hero (no fake-looking stock). Real shoot later. Texture over polish: wood, stone, ember, weathered hands.

---

## 4. Single source of truth — `site.config.ts`

Every fill-in-later value lives here so the user swaps content in one place. Components read from it. Values that are still `TBD` drive **loud placeholder** behavior (see §6).

```ts
export const siteConfig = {
  name: "The Conscious Brotherhood",
  domain: "consciousbrotherhood.com",      // TBD-confirm
  contactEmail: "TBD@...",                 // used by /apply error fallback mailto
  social: { instagram: "TBD", youtube: "TBD" },

  nextCall: {
    date: null,        // e.g. "Thursday, July 17" — null => loud placeholder
    time: "TBD",
    tz: "TBD",
  },
  lumaUrl: null,       // null/TBD => SaveSeatButton degrades to "Dates announced soon"

  hosts: [             // two co-hosts; names real, bios are loud placeholders
    { name: "Ccowl Humphries", bio: null, photo: null },
    { name: "Charlie Grove",   bio: null, photo: null },
  ],

  analytics: { vercel: true, plausibleDomain: null },
} as const;
```

---

## 5. Routes & components

### `/` — landing page
Section components, in order (all copy verbatim from the brief's copy deck):

1. `Header` — sticky; wordmark + single `SaveSeatButton`.
2. `Hero` — eyebrow, headline, subhead, primary `SaveSeatButton`, secondary "Explore the circles ↓" anchor link.
3. `Problem` — "Most men are doing it alone."
4. `Ownership` — "Nothing changes until you own it."
5. `BeingSeen` — emotional centerpiece, "What it's like to actually be heard."
6. `MonthlyCall` — details list + Luma embed (`lumaUrl`) + `SaveSeatButton`.
7. `Circles` — offer details, "$99/month", `Apply for a circle` → `/apply`. (Anchor target for secondary CTA; no standalone `/circles` page in v1.)
8. `WhoFor` — two columns: "This is for you if…" / "This isn't for you if…".
9. `Container` — the six agreements (trust/safety signal).
10. `Host` — **two co-hosts**, framed around "we're doing this together — because no man should do it alone." Names real; bios loud placeholders until filled.
11. `FAQ` — shadcn accordion. **Both 988 references stay verbatim** (never trimmed).
12. `FinalCTA` — "You don't have to do this alone anymore." + `SaveSeatButton`.
13. `Footer` — nav + social + **disclaimer with 988 line, verbatim, non-negotiable**.

### `/apply` — circle application (see §7)
Form → `POST /api/apply` → Resend email to hosts.

### `/thanks` — application confirmation
Copy points at the **application** path (Luma owns its own call-RSVP confirmation, so most call sign-ups never reach this page). Message: "I read every application personally and reply within a few days." Includes what-to-expect. The Save-seat CTA goes to Luma, **not** here.

### `/privacy`, `/terms`
Simple legal pages.

### Shared components
- `SaveSeatButton` — the one swappable RSVP component. Live CTA → `lumaUrl` when set; **degrades to a disabled "Dates announced soon" state with no dead link when `lumaUrl` is TBD.**
- `Section` — layout wrapper (consistent vertical rhythm, max-width, padding).
- `SecondaryLink` — the "Explore the circles ↓" style anchor.

---

## 6. Loud-placeholder behavior (no silent gaps)

A placeholder must be *visible*, never a blank hole or a dead link.

- **`SaveSeatButton`** with `lumaUrl == null/TBD` → disabled control reading **"Dates announced soon"**, no `href`.
- **`nextCall.date == null`** → call section shows "Next date announced soon" rather than an empty "next one is ___".
- **`Host` bio == null** → renders a visible **"Bio coming soon"** block (name + placeholder), not a blank gap. Names always render.

---

## 7. `/apply` form + `/api/apply` route

### Form fields
- Name (required)
- Email (required, validated)
- "What's drawing you in?" (required, textarea)
- Availability (required)
- **Prior men's-work experience** (optional — helps hosts read intake)
- Agreement checkbox: month-to-month, $99/mo, by-application (required)
- **Honeypot** — hidden field, not shown to humans.

### `POST /api/apply` behavior
1. **Honeypot check** — if filled, return `200` with no email sent (silently drop the bot).
2. **Server-side validation** — required fields present + email format valid. Invalid → `400` with field errors.
3. **Send via Resend** to the hosts' inbox.
4. **Environment-dependent failure handling — the critical rule:**
   - **Development (`NODE_ENV !== 'production'`):** if `RESEND_API_KEY` is missing, log the payload and soft-succeed so the site builds/runs without secrets.
   - **Production:** a missing key **or** a Resend send failure returns an **error** response. The client shows an inline error with a direct **"email me at `contactEmail`"** mailto fallback. It does **NOT** redirect to `/thanks`.
   - The `/thanks` success redirect fires **only** on a confirmed successful send.

> Rationale: the unshippable failure mode is a man submitting his one act of reaching out, landing on `/thanks` believing he was heard, while the email silently never sends. In production this must fail loud.

---

## 8. Cross-cutting

- **Metadata + OG:** full page metadata, favicon, and a **real generated OG image** (wordmark on charcoal) that exists on disk — these men share by text/DM, so a blank unfurl is costly. No reference to a missing file.
- **Analytics:** Vercel Analytics on; Plausible mounted only when `analytics.plausibleDomain` is set.
- **Accessibility:** semantic landmarks, keyboard-navigable accordion, alt text, sufficient contrast on charcoal.
- **Performance:** mobile-first; prioritize hero LCP.

---

## 9. Out of scope for v1 (YAGNI)

- Standalone `/circles` page (anchor section on `/` instead).
- Public Stripe / buy button (vet-first; private link sent manually).
- Real photography (placeholder hero; real shoot later).
- In-person event logic (online for now).
- Custom email list / ConvertKit sync (Luma owns call reminders; `/apply` just emails the hosts).

---

## 10. Content that must survive verbatim (non-negotiable)

- Footer disclaimer, including the **988** crisis line.
- Both **988** references inside the FAQ ("Is this therapy?" and "What if I'm really struggling right now?").

These stay for ethical and protective reasons and are never trimmed for length.
