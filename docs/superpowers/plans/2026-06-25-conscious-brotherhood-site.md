# The Conscious Brotherhood Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page Next.js lead-gen site for The Conscious Brotherhood whose one job is to fill the free monthly call, with a vetted `/apply` flow for circles.

**Architecture:** Next.js App Router with section components on `/`, a native `/apply` form posting to a `/api/apply` route that emails the hosts via Resend, and a single `site.config.ts` driving all fill-in-later content with loud-placeholder behavior. Spec: `docs/superpowers/specs/2026-06-25-conscious-brotherhood-site-design.md`.

**Tech Stack:** Next.js (App Router) + TypeScript, Tailwind CSS, shadcn/ui, `next/font` (Fraunces + Inter), Resend, Vitest + React Testing Library for unit tests, Vercel deploy.

## Global Constraints

- **Runtime:** Node 20+. Next.js 15+ (App Router), React 19, TypeScript strict mode.
- **Palette (Tailwind tokens), exact values:** `charcoal #15130F` (bg), `bone #E8E1D4` (text), `ember #C8651B` (accent), `olive #3A4434` (support).
- **Fonts:** Fraunces (headlines) + Inter (body) via `next/font/google`.
- **No public Stripe / buy button anywhere.** Circles are application-only.
- **All fill-in-later values live in `site.config.ts`.** Components never hardcode dates, URLs, host names, or handles.
- **Loud placeholders:** a `null`/TBD config value must render a visible placeholder, never a blank gap or dead link.
- **988 verbatim:** the footer disclaimer and both FAQ 988 references must ship exactly as written and never be trimmed.
- **`/apply` production rule:** in production, a missing `RESEND_API_KEY` or a Resend send failure returns an error (never the `/thanks` redirect); only outside production does it soft-succeed.
- **Copy:** all marketing copy comes verbatim from the brief copy deck (reproduced in the relevant tasks).
- **Commits:** frequent, one per task minimum. Conventional-commit style messages.

---

## File Structure

```
site.config.ts                      # single source of truth for fill-in-later content
lib/copy.ts                         # all marketing copy strings, verbatim from brief
app/layout.tsx                      # fonts, metadata, analytics, <html> shell
app/globals.css                     # Tailwind + theme base
app/page.tsx                        # landing — composes section components in order
app/thanks/page.tsx                 # application confirmation
app/apply/page.tsx                  # circle application form page
app/privacy/page.tsx                # legal
app/terms/page.tsx                  # legal
app/api/apply/route.ts              # POST handler → Resend
app/opengraph-image.tsx            # generated OG image (wordmark on charcoal)
app/icon.tsx                        # favicon
components/site/Section.tsx         # layout wrapper
components/site/SaveSeatButton.tsx  # the one swappable RSVP CTA
components/site/SecondaryLink.tsx   # "Explore the circles ↓" anchor
components/site/Header.tsx
components/site/Hero.tsx
components/site/Problem.tsx
components/site/Ownership.tsx
components/site/BeingSeen.tsx
components/site/MonthlyCall.tsx
components/site/Circles.tsx
components/site/WhoFor.tsx
components/site/Container.tsx
components/site/Host.tsx
components/site/Faq.tsx
components/site/FinalCTA.tsx
components/site/Footer.tsx
components/ui/*                      # shadcn primitives (accordion, button)
lib/apply-schema.ts                 # zod schema + types shared by form and route
lib/__tests__/*                     # vitest unit tests
components/site/__tests__/*         # component tests
```

---

## Task 1: Scaffold Next.js + Tailwind + theme + test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore`, `.env.example`
- Test: `lib/__tests__/smoke.test.ts`

**Interfaces:**
- Produces: a runnable Next.js app with Tailwind theme tokens `charcoal`/`bone`/`ember`/`olive`, Fraunces+Inter fonts loaded in `layout.tsx`, and a working Vitest harness.

- [ ] **Step 1: Create the Next.js app non-interactively**

Run from the repo root (the repo already exists with `docs/` and a git remote):
```bash
npx create-next-app@latest . --ts --app --tailwind --eslint --no-src-dir --import-alias "@/*" --use-npm --yes
```
If create-next-app refuses because the directory is non-empty, scaffold into a temp dir and copy in:
```bash
npx create-next-app@latest .cb-tmp --ts --app --tailwind --eslint --no-src-dir --import-alias "@/*" --use-npm --yes \
  && cp -r .cb-tmp/. . && rm -rf .cb-tmp
```

- [ ] **Step 2: Add the theme tokens to `tailwind.config.ts`**

Ensure `content` covers `./app/**/*.{ts,tsx}` and `./components/**/*.{ts,tsx}`, and extend colors:
```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#15130F",
        bone: "#E8E1D4",
        ember: "#C8651B",
        olive: "#3A4434",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 3: Load fonts + base theme in `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = { title: "The Conscious Brotherhood" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-charcoal text-bone font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Set `app/globals.css` base**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html { color-scheme: dark; }
body { background-color: #15130F; color: #E8E1D4; }
```

- [ ] **Step 5: Install and configure Vitest**

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
});
```
Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```
Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 6: Write the smoke test**

`lib/__tests__/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 7: Run the smoke test — expect PASS**

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 8: Verify the app builds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Tailwind theme + Vitest harness"
```

---

## Task 2: `site.config.ts` — single source of truth

**Files:**
- Create: `site.config.ts`
- Test: `lib/__tests__/site-config.test.ts`

**Interfaces:**
- Produces: `siteConfig` object and helper predicates `hasCallDate()`, `hasLumaUrl()`, `hostHasBio(host)`. Exact shape below — all later tasks import from here.

- [ ] **Step 1: Write the failing test**

`lib/__tests__/site-config.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { siteConfig, hasLumaUrl, hasCallDate, hostHasBio } from "@/site.config";

describe("siteConfig", () => {
  it("has two co-hosts with real names", () => {
    expect(siteConfig.hosts.map((h) => h.name)).toEqual(["Ccowl Humphries", "Charlie Grove"]);
  });
  it("treats null lumaUrl as no luma", () => {
    expect(hasLumaUrl({ ...siteConfig, lumaUrl: null })).toBe(false);
    expect(hasLumaUrl({ ...siteConfig, lumaUrl: "https://lu.ma/x" })).toBe(true);
  });
  it("treats null date as no call date", () => {
    expect(hasCallDate({ ...siteConfig, nextCall: { ...siteConfig.nextCall, date: null } })).toBe(false);
  });
  it("treats null bio as no bio", () => {
    expect(hostHasBio({ name: "x", bio: null, photo: null })).toBe(false);
    expect(hostHasBio({ name: "x", bio: "hi", photo: null })).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- site-config`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `site.config.ts`**

```ts
export type Host = { name: string; bio: string | null; photo: string | null };

export type SiteConfig = {
  name: string;
  domain: string;
  contactEmail: string;
  social: { instagram: string | null; youtube: string | null };
  nextCall: { date: string | null; time: string; tz: string };
  lumaUrl: string | null;
  hosts: Host[];
  analytics: { vercel: boolean; plausibleDomain: string | null };
};

export const siteConfig: SiteConfig = {
  name: "The Conscious Brotherhood",
  domain: "consciousbrotherhood.com", // TODO-CONTENT: confirm final domain
  contactEmail: "hello@consciousbrotherhood.com", // TODO-CONTENT: real inbox for /apply fallback + delivery
  social: { instagram: null, youtube: null }, // TODO-CONTENT: handles
  nextCall: { date: null, time: "TBD", tz: "TBD" }, // TODO-CONTENT: next call
  lumaUrl: null, // TODO-CONTENT: Luma event URL
  hosts: [
    { name: "Ccowl Humphries", bio: null, photo: null }, // TODO-CONTENT: Ccowl bio + photo
    { name: "Charlie Grove", bio: null, photo: null }, // TODO-CONTENT: Charlie bio + photo
  ],
  analytics: { vercel: true, plausibleDomain: null },
};

export const hasLumaUrl = (c: SiteConfig = siteConfig): boolean => Boolean(c.lumaUrl);
export const hasCallDate = (c: SiteConfig = siteConfig): boolean => Boolean(c.nextCall.date);
export const hostHasBio = (h: Host): boolean => Boolean(h.bio);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- site-config`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site.config.ts lib/__tests__/site-config.test.ts
git commit -m "feat: add site.config.ts single source of truth with loud-placeholder predicates"
```

---

## Task 3: `lib/copy.ts` — verbatim marketing copy

**Files:**
- Create: `lib/copy.ts`
- Test: `lib/__tests__/copy.test.ts`

**Interfaces:**
- Produces: `copy` object with all section strings. Later section components import named groups (`copy.hero`, `copy.problem`, … `copy.faq`, `copy.disclaimer`). FAQ is `Array<{ q: string; a: string }>`.

- [ ] **Step 1: Write the failing test (locks the non-negotiable 988 content)**

`lib/__tests__/copy.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { copy } from "@/lib/copy";

describe("copy", () => {
  it("footer disclaimer keeps the 988 line verbatim", () => {
    expect(copy.disclaimer).toContain("call/text **988**");
    expect(copy.disclaimer).toContain("not therapy");
  });
  it("FAQ keeps both 988 references", () => {
    const a = copy.faq.map((f) => f.a).join("\n");
    expect(a.match(/988/g)?.length).toBeGreaterThanOrEqual(2);
  });
  it("hero has the headline", () => {
    expect(copy.hero.headline).toBe("You were never meant to carry it alone.");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- copy`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `lib/copy.ts` with the full copy deck**

Reproduce the brief copy deck verbatim. Structure:
```ts
export const copy = {
  hero: {
    eyebrow: "Men's circles + a free monthly brotherhood call",
    headline: "You were never meant to carry it alone.",
    subhead:
      "The Conscious Brotherhood is a community of men who tell the truth, own their lives, and have each other's backs. It starts with one honest conversation.",
    secondary: "Explore the circles ↓",
  },
  problem: {
    header: "Most men are doing it alone. It's quietly wrecking us.",
    body: [
      "Somewhere along the way you learned to handle it yourself. Keep it together. Don't be a burden. So you built a life that looks fine from the outside — and carried the weight alone behind it. The stress. The resentment you don't say out loud. The numbing. The slow distance growing between you and your wife, your kids, the man you meant to become.",
      "You're not broken, and you're not weak. You're isolated. And isolation is the one thing a man can't think his way out of by himself.",
    ],
  },
  ownership: {
    header: "Nothing changes until you own it.",
    body: [
      "You can't fix what you blame. The moment you stop being a victim of your schedule, your marriage, your boss, your past — and start taking full ownership of your response to all of it — your life becomes workable again.",
      "That doesn't mean everything is your fault. It means your next move is yours. We don't trade in excuses here. We hold each other to the next right action — brothers who'll have your back and won't let you off the hook.",
    ],
  },
  beingSeen: {
    header: "What it's like to actually be heard.",
    body: [
      "Picture sitting with a handful of men who aren't trying to fix you, impress you, or one-up you. They're just there — listening past your words to the thing underneath. Reflecting back the man they see in you, especially the parts you've stopped believing in.",
      "They remember the promises you made when you were being honest with yourself, and they hold you to them. They'll tell you the truth about where you're strong and where you're hiding — because they actually give a damn.",
      "Most men go their whole lives without this. It changes everything.",
    ],
  },
  monthlyCall: {
    header: "Start here — the free monthly brotherhood call.",
    body: "Once a month, men gather on a call to get something off their chest, hear from other men, and leave a little less alone. No experience needed. No pressure to talk before you're ready. Come exactly as you are.",
    cost: "Free",
    who: "Any man who's tired of doing it alone",
    where: "Zoom (link after you RSVP)",
  },
  circles: {
    header: "Go deeper — join a circle.",
    body: "A circle is a small group of men (6–8) who meet regularly with a trained facilitator. Same men, every session — that's where the real trust and accountability get built. This is where the work goes from \"a good call\" to a brotherhood that has your back week after week.",
    bullets: [
      "Small, consistent group of 6–8 men",
      "Facilitated sessions with clear agreements",
      "A private group thread for support and accountability between meetings",
      "$99/month — month to month, cancel anytime",
    ],
    note: "Circles are by application so we can keep each one safe and committed.",
  },
  whoFor: {
    forHeader: "This is for you if…",
    forItems: [
      "You're ready to stop doing your life on hard mode, alone.",
      "You're willing to be honest — even when it's uncomfortable.",
      "You want to take ownership of your life, your marriage, your kids.",
      "You can show up consistently and listen as well as you talk.",
    ],
    notHeader: "This isn't for you if…",
    notItems: [
      "You're in acute crisis and need clinical care — this is peer support, not therapy.",
      "You're looking for a pickup-artist or red-pill space. That's not what we do.",
      "You want a one-time fix without showing up.",
      "You're looking for someone to blame instead of something to own.",
    ],
  },
  container: {
    header: "How we keep it real and safe.",
    intro: "We run on a few agreements every man commits to:",
    items: [
      ["Confidentiality.", "What's said here stays here."],
      ["Ownership.", "Each man speaks from his own experience and owns it."],
      ["Consent before feedback.", "We ask before offering a reflection or advice."],
      ["No rescuing.", "We let a man feel what he feels instead of rushing to fix him."],
      ["Presence.", "Phones down. Fully here."],
      ["Safety.", "Anyone can call \"safety\" and everything stops."],
    ] as [string, string][],
  },
  host: {
    header: "Who's leading this.",
    intro:
      "We're starting this together — because we believe what we're asking of you: no man should do it alone.",
  },
  faq: [
    { q: "Is this therapy?", a: "No. This is peer support and personal-growth work among men. It complements clinical care but doesn't replace it. If you're in crisis, please reach out to a professional or call/text 988 (US)." },
    { q: "Is it religious?", a: "No. Men of any faith or none are welcome. We don't push a doctrine." },
    { q: "What actually happens on the call?", a: "We open, men share what's alive for them, others listen and reflect, and we close. You can pass. Many men say nothing their first time and still leave lighter." },
    { q: "Do I have to talk?", a: "No. Show up, listen, breathe. Speak when you're ready." },
    { q: "Is this a red-pill or pickup thing?", a: "No. We're not here to blame anyone or \"win\" at anything. We're here to get honest and grow up well." },
    { q: "Online or in person?", a: "Calls and circles are online for now." },
    { q: "What if I'm really struggling right now?", a: "You're welcome here — and if you're in acute crisis, peer support isn't enough on its own. Please contact a licensed professional or 988 (US). We'll still be here." },
  ] as { q: string; a: string }[],
  finalCta: {
    header: "You don't have to do this alone anymore.",
    subhead: "Start with one call. See what it's like to be heard.",
  },
  disclaimer:
    "The Conscious Brotherhood offers peer support and personal-growth experiences among men. It is not therapy, counseling, or a substitute for professional mental health treatment. If you are in crisis or thinking about harming yourself, contact emergency services or call/text **988** (US) right away.",
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- copy`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/copy.ts lib/__tests__/copy.test.ts
git commit -m "feat: add verbatim marketing copy with locked 988 references"
```

---

## Task 4: `Section` + `SecondaryLink` layout primitives

**Files:**
- Create: `components/site/Section.tsx`, `components/site/SecondaryLink.tsx`
- Test: `components/site/__tests__/Section.test.tsx`

**Interfaces:**
- Produces:
  - `Section({ id?, className?, children })` — `<section>` with consistent padding/max-width.
  - `SecondaryLink({ href, children })` — styled anchor.

- [ ] **Step 1: Write the failing test**

`components/site/__tests__/Section.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/site/Section";

describe("Section", () => {
  it("renders children and applies its id", () => {
    render(<Section id="circles">hello</Section>);
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(document.getElementById("circles")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Section`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement both components**

`components/site/Section.tsx`:
```tsx
export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`px-6 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </section>
  );
}
```
`components/site/SecondaryLink.tsx`:
```tsx
export function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-bone/70 underline-offset-4 hover:text-ember hover:underline">
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Section`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/site/Section.tsx components/site/SecondaryLink.tsx components/site/__tests__/Section.test.tsx
git commit -m "feat: add Section and SecondaryLink layout primitives"
```

---

## Task 5: `SaveSeatButton` — the swappable RSVP CTA with loud placeholder

**Files:**
- Create: `components/site/SaveSeatButton.tsx`
- Test: `components/site/__tests__/SaveSeatButton.test.tsx`

**Interfaces:**
- Consumes: `siteConfig`, `hasLumaUrl`, `hasCallDate` from `@/site.config`; `copy` (none needed here).
- Produces: `SaveSeatButton({ config?, className? })`. When `hasLumaUrl(config)` is true → an `<a href={config.lumaUrl}>` reading `Save your seat — next call <date>` (or just `Save your seat` when no date). When false → a disabled `<button>` reading `Dates announced soon` with no `href`.

- [ ] **Step 1: Write the failing test**

`components/site/__tests__/SaveSeatButton.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SaveSeatButton } from "@/components/site/SaveSeatButton";
import { siteConfig } from "@/site.config";

describe("SaveSeatButton", () => {
  it("renders a live link when lumaUrl is set", () => {
    render(<SaveSeatButton config={{ ...siteConfig, lumaUrl: "https://lu.ma/x", nextCall: { date: "July 17", time: "7pm", tz: "ET" } }} />);
    const link = screen.getByRole("link", { name: /save your seat/i });
    expect(link).toHaveAttribute("href", "https://lu.ma/x");
    expect(link).toHaveTextContent("July 17");
  });

  it("degrades to a disabled 'Dates announced soon' control with no link when lumaUrl is null", () => {
    render(<SaveSeatButton config={{ ...siteConfig, lumaUrl: null }} />);
    expect(screen.queryByRole("link")).toBeNull();
    const btn = screen.getByRole("button", { name: /dates announced soon/i });
    expect(btn).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- SaveSeatButton`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `SaveSeatButton`**

```tsx
import { siteConfig, hasLumaUrl, hasCallDate, type SiteConfig } from "@/site.config";

const base =
  "inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold transition";

export function SaveSeatButton({
  config = siteConfig,
  className = "",
}: {
  config?: SiteConfig;
  className?: string;
}) {
  if (!hasLumaUrl(config)) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`${base} cursor-not-allowed bg-olive/40 text-bone/60 ${className}`}
      >
        Dates announced soon
      </button>
    );
  }
  const label = hasCallDate(config)
    ? `Save your seat — next call ${config.nextCall.date}`
    : "Save your seat";
  return (
    <a
      href={config.lumaUrl as string}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-ember text-charcoal hover:bg-ember/90 ${className}`}
    >
      {label}
    </a>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- SaveSeatButton`
Expected: PASS (both cases).

- [ ] **Step 5: Commit**

```bash
git add components/site/SaveSeatButton.tsx components/site/__tests__/SaveSeatButton.test.tsx
git commit -m "feat: add SaveSeatButton with loud-placeholder degradation"
```

---

## Task 6: Install shadcn/ui accordion + button primitives

**Files:**
- Create: `components/ui/accordion.tsx`, `components/ui/button.tsx`, `lib/utils.ts`, `components.json`
- Modify: `app/globals.css` (shadcn CSS variables block), `tailwind.config.ts` if shadcn requires
- Test: none (vendor primitives; covered via Faq test in Task 13)

**Interfaces:**
- Produces: shadcn `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` and `cn()` util.

- [ ] **Step 1: Init shadcn non-interactively**

```bash
npx shadcn@latest init -d
npx shadcn@latest add accordion button
```
If the CLI prompts despite `-d`, accept defaults: style "default", base color "neutral", CSS variables yes.

- [ ] **Step 2: Verify the imports resolve**

Run: `npm run build`
Expected: build succeeds with the new `components/ui` files present.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: add shadcn/ui accordion + button primitives"
```

---

## Task 7: `Header` (sticky, single CTA) + `Hero`

**Files:**
- Create: `components/site/Header.tsx`, `components/site/Hero.tsx`
- Test: `components/site/__tests__/Hero.test.tsx`

**Interfaces:**
- Consumes: `SaveSeatButton`, `SecondaryLink`, `Section`, `copy`, `siteConfig`.
- Produces: `Header()` and `Hero()` (no props; read from config/copy).

- [ ] **Step 1: Write the failing test**

`components/site/__tests__/Hero.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/site/Hero";

describe("Hero", () => {
  it("renders the headline and a secondary link to #circles", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { name: /you were never meant to carry it alone/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore the circles/i })).toHaveAttribute("href", "#circles");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Hero`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `Header` and `Hero`**

`components/site/Header.tsx`:
```tsx
import { SaveSeatButton } from "./SaveSeatButton";
import { siteConfig } from "@/site.config";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-bone/10 bg-charcoal/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="font-serif text-lg tracking-tight">{siteConfig.name}</span>
        <SaveSeatButton className="px-4 py-2 text-sm" />
      </div>
    </header>
  );
}
```
`components/site/Hero.tsx`:
```tsx
import { Section } from "./Section";
import { SaveSeatButton } from "./SaveSeatButton";
import { SecondaryLink } from "./SecondaryLink";
import { copy } from "@/lib/copy";

export function Hero() {
  return (
    <Section className="pt-16 text-center sm:pt-24">
      <p className="mb-4 text-sm uppercase tracking-widest text-ember">{copy.hero.eyebrow}</p>
      <h1 className="font-serif text-4xl leading-tight sm:text-6xl">{copy.hero.headline}</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-bone/80">{copy.hero.subhead}</p>
      <div className="mt-10 flex flex-col items-center gap-4">
        <SaveSeatButton />
        <SecondaryLink href="#circles">{copy.hero.secondary}</SecondaryLink>
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Hero`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/site/Header.tsx components/site/Hero.tsx components/site/__tests__/Hero.test.tsx
git commit -m "feat: add sticky Header and Hero sections"
```

---

## Task 8: Prose sections — `Problem`, `Ownership`, `BeingSeen`

**Files:**
- Create: `components/site/Problem.tsx`, `components/site/Ownership.tsx`, `components/site/BeingSeen.tsx`
- Test: `components/site/__tests__/prose-sections.test.tsx`

**Interfaces:**
- Consumes: `Section`, `copy`.
- Produces: `Problem()`, `Ownership()`, `BeingSeen()`.

- [ ] **Step 1: Write the failing test**

`components/site/__tests__/prose-sections.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Problem } from "@/components/site/Problem";
import { Ownership } from "@/components/site/Ownership";
import { BeingSeen } from "@/components/site/BeingSeen";

describe("prose sections", () => {
  it("Problem renders its header", () => {
    render(<Problem />);
    expect(screen.getByRole("heading", { name: /most men are doing it alone/i })).toBeInTheDocument();
  });
  it("Ownership renders its header", () => {
    render(<Ownership />);
    expect(screen.getByRole("heading", { name: /nothing changes until you own it/i })).toBeInTheDocument();
  });
  it("BeingSeen renders its header", () => {
    render(<BeingSeen />);
    expect(screen.getByRole("heading", { name: /what it's like to actually be heard/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- prose-sections`
Expected: FAIL.

- [ ] **Step 3: Implement all three (same shape, distinct content)**

`components/site/Problem.tsx`:
```tsx
import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function Problem() {
  return (
    <Section>
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.problem.header}</h2>
      {copy.problem.body.map((p, i) => (
        <p key={i} className="mt-6 text-lg text-bone/80">{p}</p>
      ))}
    </Section>
  );
}
```
`components/site/Ownership.tsx`:
```tsx
import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function Ownership() {
  return (
    <Section className="bg-olive/10">
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.ownership.header}</h2>
      {copy.ownership.body.map((p, i) => (
        <p key={i} className="mt-6 text-lg text-bone/80">{p}</p>
      ))}
    </Section>
  );
}
```
`components/site/BeingSeen.tsx`:
```tsx
import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function BeingSeen() {
  return (
    <Section>
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.beingSeen.header}</h2>
      {copy.beingSeen.body.map((p, i) => (
        <p key={i} className="mt-6 text-lg text-bone/80">{p}</p>
      ))}
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- prose-sections`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/site/Problem.tsx components/site/Ownership.tsx components/site/BeingSeen.tsx components/site/__tests__/prose-sections.test.tsx
git commit -m "feat: add Problem, Ownership, BeingSeen sections"
```

---

## Task 9: `MonthlyCall` — details + Luma embed + loud date placeholder

**Files:**
- Create: `components/site/MonthlyCall.tsx`
- Test: `components/site/__tests__/MonthlyCall.test.tsx`

**Interfaces:**
- Consumes: `Section`, `SaveSeatButton`, `copy`, `siteConfig`, `hasCallDate`, `hasLumaUrl`.
- Produces: `MonthlyCall({ config? })`. Shows "Next date announced soon" when `!hasCallDate`. Renders the Luma iframe only when `hasLumaUrl`.

- [ ] **Step 1: Write the failing test**

`components/site/__tests__/MonthlyCall.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MonthlyCall } from "@/components/site/MonthlyCall";
import { siteConfig } from "@/site.config";

describe("MonthlyCall", () => {
  it("shows a loud date placeholder when no date is set", () => {
    render(<MonthlyCall config={{ ...siteConfig, nextCall: { date: null, time: "TBD", tz: "TBD" } }} />);
    expect(screen.getByText(/next date announced soon/i)).toBeInTheDocument();
  });
  it("renders the date when set", () => {
    render(<MonthlyCall config={{ ...siteConfig, nextCall: { date: "July 17", time: "7pm", tz: "ET" } }} />);
    expect(screen.getByText(/July 17/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- MonthlyCall`
Expected: FAIL.

- [ ] **Step 3: Implement `MonthlyCall`**

```tsx
import { Section } from "./Section";
import { SaveSeatButton } from "./SaveSeatButton";
import { copy } from "@/lib/copy";
import { siteConfig, hasCallDate, hasLumaUrl, type SiteConfig } from "@/site.config";

export function MonthlyCall({ config = siteConfig }: { config?: SiteConfig }) {
  const whenLine = hasCallDate(config)
    ? `${config.nextCall.time} ${config.nextCall.tz} — next one is ${config.nextCall.date}`
    : "Next date announced soon";
  return (
    <Section id="call">
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.monthlyCall.header}</h2>
      <p className="mt-6 text-lg text-bone/80">{copy.monthlyCall.body}</p>
      <ul className="mt-8 space-y-2 text-bone/90">
        <li><strong>When:</strong> {whenLine}</li>
        <li><strong>Where:</strong> {copy.monthlyCall.where}</li>
        <li><strong>Cost:</strong> {copy.monthlyCall.cost}</li>
        <li><strong>Who:</strong> {copy.monthlyCall.who}</li>
      </ul>
      {hasLumaUrl(config) && (
        <div className="mt-8 overflow-hidden rounded-lg border border-bone/10">
          <iframe
            title="RSVP on Luma"
            src={config.lumaUrl as string}
            className="h-[450px] w-full"
            allow="fullscreen"
          />
        </div>
      )}
      <div className="mt-8">
        <SaveSeatButton config={config} />
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- MonthlyCall`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/site/MonthlyCall.tsx components/site/__tests__/MonthlyCall.test.tsx
git commit -m "feat: add MonthlyCall with Luma embed and loud date placeholder"
```

---

## Task 10: `Circles` (anchor target) + `WhoFor` (two columns)

**Files:**
- Create: `components/site/Circles.tsx`, `components/site/WhoFor.tsx`
- Test: `components/site/__tests__/Circles.test.tsx`

**Interfaces:**
- Consumes: `Section`, `copy`. `Circles` renders `id="circles"` and an "Apply for a circle" link → `/apply`.
- Produces: `Circles()`, `WhoFor()`.

- [ ] **Step 1: Write the failing test**

`components/site/__tests__/Circles.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Circles } from "@/components/site/Circles";
import { WhoFor } from "@/components/site/WhoFor";

describe("Circles", () => {
  it("is the #circles anchor and links to /apply, with no public buy button", () => {
    render(<Circles />);
    expect(document.getElementById("circles")).not.toBeNull();
    expect(screen.getByRole("link", { name: /apply for a circle/i })).toHaveAttribute("href", "/apply");
    expect(screen.queryByRole("link", { name: /buy|checkout|subscribe/i })).toBeNull();
  });
});

describe("WhoFor", () => {
  it("renders both columns", () => {
    render(<WhoFor />);
    expect(screen.getByText(/this is for you if/i)).toBeInTheDocument();
    expect(screen.getByText(/this isn't for you if/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Circles`
Expected: FAIL.

- [ ] **Step 3: Implement `Circles` and `WhoFor`**

`components/site/Circles.tsx`:
```tsx
import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function Circles() {
  return (
    <Section id="circles" className="bg-olive/10">
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.circles.header}</h2>
      <p className="mt-6 text-lg text-bone/80">{copy.circles.body}</p>
      <ul className="mt-6 space-y-2 text-bone/90">
        {copy.circles.bullets.map((b, i) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>
      <p className="mt-6 text-bone/70">{copy.circles.note}</p>
      <a
        href="/apply"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-ember px-6 py-3 font-semibold text-charcoal transition hover:bg-ember/90"
      >
        Apply for a circle
      </a>
    </Section>
  );
}
```
`components/site/WhoFor.tsx`:
```tsx
import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function WhoFor() {
  return (
    <Section>
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="font-serif text-2xl">{copy.whoFor.forHeader}</h3>
          <ul className="mt-4 space-y-2 text-bone/80">
            {copy.whoFor.forItems.map((t, i) => <li key={i}>• {t}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-2xl">{copy.whoFor.notHeader}</h3>
          <ul className="mt-4 space-y-2 text-bone/80">
            {copy.whoFor.notItems.map((t, i) => <li key={i}>• {t}</li>)}
          </ul>
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Circles`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/site/Circles.tsx components/site/WhoFor.tsx components/site/__tests__/Circles.test.tsx
git commit -m "feat: add Circles anchor section and WhoFor two-column section"
```

---

## Task 11: `Container` (agreements) + `Host` (two co-hosts, loud bio placeholder)

**Files:**
- Create: `components/site/Container.tsx`, `components/site/Host.tsx`
- Test: `components/site/__tests__/Host.test.tsx`

**Interfaces:**
- Consumes: `Section`, `copy`, `siteConfig`, `hostHasBio`.
- Produces: `Container()`, `Host({ config? })`. Host always renders both names; when `hostHasBio` is false renders a visible "Bio coming soon" block.

- [ ] **Step 1: Write the failing test**

`components/site/__tests__/Host.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Host } from "@/components/site/Host";
import { siteConfig } from "@/site.config";

describe("Host", () => {
  it("renders both co-host names", () => {
    render(<Host />);
    expect(screen.getByText("Ccowl Humphries")).toBeInTheDocument();
    expect(screen.getByText("Charlie Grove")).toBeInTheDocument();
  });
  it("shows a loud bio placeholder when bio is null", () => {
    render(<Host />);
    expect(screen.getAllByText(/bio coming soon/i).length).toBeGreaterThanOrEqual(1);
  });
  it("renders the bio text when present", () => {
    const cfg = { ...siteConfig, hosts: [{ name: "Ccowl Humphries", bio: "Sat in circles since 2018.", photo: null }, { name: "Charlie Grove", bio: "Doing this with my brother.", photo: null }] };
    render(<Host config={cfg} />);
    expect(screen.getByText(/sat in circles since 2018/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Host`
Expected: FAIL.

- [ ] **Step 3: Implement `Container` and `Host`**

`components/site/Container.tsx`:
```tsx
import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function Container() {
  return (
    <Section className="bg-olive/10">
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.container.header}</h2>
      <p className="mt-6 text-lg text-bone/80">{copy.container.intro}</p>
      <ul className="mt-6 space-y-3">
        {copy.container.items.map(([t, d], i) => (
          <li key={i} className="text-bone/90"><strong className="text-ember">{t}</strong> {d}</li>
        ))}
      </ul>
    </Section>
  );
}
```
`components/site/Host.tsx`:
```tsx
import { Section } from "./Section";
import { copy } from "@/lib/copy";
import { siteConfig, hostHasBio, type SiteConfig } from "@/site.config";

export function Host({ config = siteConfig }: { config?: SiteConfig }) {
  return (
    <Section>
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.host.header}</h2>
      <p className="mt-6 text-lg text-bone/80">{copy.host.intro}</p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {config.hosts.map((h) => (
          <div key={h.name} className="rounded-lg border border-bone/10 p-6">
            <h3 className="font-serif text-2xl">{h.name}</h3>
            {hostHasBio(h) ? (
              <p className="mt-3 text-bone/80">{h.bio}</p>
            ) : (
              <p className="mt-3 rounded bg-ember/10 px-3 py-2 text-sm text-ember">Bio coming soon</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Host`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/site/Container.tsx components/site/Host.tsx components/site/__tests__/Host.test.tsx
git commit -m "feat: add Container agreements and Host (two co-hosts, loud bio placeholder)"
```

---

## Task 12: `Faq` (accordion) + `FinalCTA` + `Footer` (988 verbatim)

**Files:**
- Create: `components/site/Faq.tsx`, `components/site/FinalCTA.tsx`, `components/site/Footer.tsx`
- Test: `components/site/__tests__/Faq.test.tsx`, `components/site/__tests__/Footer.test.tsx`

**Interfaces:**
- Consumes: shadcn `Accordion*`, `Section`, `SaveSeatButton`, `copy`, `siteConfig`.
- Produces: `Faq()`, `FinalCTA()`, `Footer()`. Footer renders the disclaimer with `**988**` markdown rendered as bold text.

- [ ] **Step 1: Write the failing tests**

`components/site/__tests__/Faq.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Faq } from "@/components/site/Faq";

describe("Faq", () => {
  it("renders all questions including the 988 ones", () => {
    render(<Faq />);
    expect(screen.getByText("Is this therapy?")).toBeInTheDocument();
    expect(screen.getByText("What if I'm really struggling right now?")).toBeInTheDocument();
  });
});
```
`components/site/__tests__/Footer.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/site/Footer";

describe("Footer", () => {
  it("renders the disclaimer with a bold 988", () => {
    render(<Footer />);
    expect(screen.getByText(/not therapy, counseling/i)).toBeInTheDocument();
    expect(screen.getByText("988")).toBeInTheDocument(); // rendered as <strong>988</strong>
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- Faq Footer`
Expected: FAIL.

- [ ] **Step 3: Implement all three**

`components/site/Faq.tsx`:
```tsx
import { Section } from "./Section";
import { copy } from "@/lib/copy";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Faq() {
  return (
    <Section>
      <h2 className="font-serif text-3xl sm:text-4xl">Questions</h2>
      <Accordion type="single" collapsible className="mt-8">
        {copy.faq.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-bone/80">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
```
`components/site/FinalCTA.tsx`:
```tsx
import { Section } from "./Section";
import { SaveSeatButton } from "./SaveSeatButton";
import { copy } from "@/lib/copy";

export function FinalCTA() {
  return (
    <Section className="text-center">
      <h2 className="font-serif text-3xl sm:text-5xl">{copy.finalCta.header}</h2>
      <p className="mt-4 text-lg text-bone/80">{copy.finalCta.subhead}</p>
      <div className="mt-8 flex justify-center">
        <SaveSeatButton />
      </div>
    </Section>
  );
}
```
`components/site/Footer.tsx` — render `**988**` as bold without a markdown lib by splitting the known copy:
```tsx
import { copy } from "@/lib/copy";
import { siteConfig } from "@/site.config";

function Disclaimer() {
  // copy.disclaimer contains exactly one "**988**" token; render it bold.
  const parts = copy.disclaimer.split("**988**");
  return (
    <p className="text-sm text-bone/60">
      {parts[0]}
      <strong className="text-bone">988</strong>
      {parts[1]}
    </p>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-bone/10 px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <Disclaimer />
        <nav className="flex gap-6 text-sm text-bone/60">
          <a href="/privacy" className="hover:text-ember">Privacy</a>
          <a href="/terms" className="hover:text-ember">Terms</a>
          <a href="/apply" className="hover:text-ember">Apply for a circle</a>
        </nav>
        <p className="text-xs text-bone/40">© {siteConfig.name}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Faq Footer`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/site/Faq.tsx components/site/FinalCTA.tsx components/site/Footer.tsx components/site/__tests__/Faq.test.tsx components/site/__tests__/Footer.test.tsx
git commit -m "feat: add Faq accordion, FinalCTA, and Footer with verbatim 988 disclaimer"
```

---

## Task 13: Compose `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`
- Test: `app/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: every section component.
- Produces: the landing page rendering sections in spec order.

- [ ] **Step 1: Write the failing test**

`app/__tests__/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("landing page", () => {
  it("renders hero headline and the circles anchor", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: /you were never meant to carry it alone/i })).toBeInTheDocument();
    expect(document.getElementById("circles")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- page`
Expected: FAIL.

- [ ] **Step 3: Implement `app/page.tsx`**

```tsx
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Problem } from "@/components/site/Problem";
import { Ownership } from "@/components/site/Ownership";
import { BeingSeen } from "@/components/site/BeingSeen";
import { MonthlyCall } from "@/components/site/MonthlyCall";
import { Circles } from "@/components/site/Circles";
import { WhoFor } from "@/components/site/WhoFor";
import { Container } from "@/components/site/Container";
import { Host } from "@/components/site/Host";
import { Faq } from "@/components/site/Faq";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <Ownership />
        <BeingSeen />
        <MonthlyCall />
        <Circles />
        <WhoFor />
        <Container />
        <Host />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- page`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/__tests__/page.test.tsx
git commit -m "feat: compose landing page from section components"
```

---

## Task 14: `apply-schema.ts` — shared validation + honeypot

**Files:**
- Create: `lib/apply-schema.ts`
- Test: `lib/__tests__/apply-schema.test.ts`

**Interfaces:**
- Produces:
  - `ApplyInput` type and `applySchema` (zod) with fields `name`, `email`, `drawingIn`, `availability`, `priorExperience?`, `agreement` (must be `true`), and honeypot `website` (must be empty).
  - `validateApply(data): { ok: true; value: ApplyInput } | { ok: false; errors: Record<string,string>; botDetected: boolean }`.

- [ ] **Step 1: Install zod**

```bash
npm i zod
```

- [ ] **Step 2: Write the failing test**

`lib/__tests__/apply-schema.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { validateApply } from "@/lib/apply-schema";

const valid = {
  name: "John",
  email: "john@example.com",
  drawingIn: "Tired of doing it alone.",
  availability: "Weeknights",
  priorExperience: "",
  agreement: true,
  website: "",
};

describe("validateApply", () => {
  it("accepts a valid application", () => {
    const r = validateApply(valid);
    expect(r.ok).toBe(true);
  });
  it("flags a filled honeypot as a bot", () => {
    const r = validateApply({ ...valid, website: "http://spam" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.botDetected).toBe(true);
  });
  it("rejects an invalid email", () => {
    const r = validateApply({ ...valid, email: "nope" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toBeDefined();
  });
  it("rejects when agreement is not accepted", () => {
    const r = validateApply({ ...valid, agreement: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.agreement).toBeDefined();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- apply-schema`
Expected: FAIL.

- [ ] **Step 4: Implement `lib/apply-schema.ts`**

```ts
import { z } from "zod";

export const applySchema = z.object({
  name: z.string().min(1, "Your name is required."),
  email: z.string().email("Enter a valid email."),
  drawingIn: z.string().min(1, "Tell us what's drawing you in."),
  availability: z.string().min(1, "Let us know your availability."),
  priorExperience: z.string().optional().default(""),
  agreement: z.literal(true, { errorMap: () => ({ message: "Please accept the agreement." }) }),
});

export type ApplyInput = z.infer<typeof applySchema>;

type Result =
  | { ok: true; value: ApplyInput }
  | { ok: false; errors: Record<string, string>; botDetected: boolean };

export function validateApply(data: Record<string, unknown>): Result {
  // Honeypot: a hidden "website" field humans never see. Filled => bot.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return { ok: false, errors: {}, botDetected: true };
  }
  const parsed = applySchema.safeParse(data);
  if (parsed.success) return { ok: true, value: parsed.data };
  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors, botDetected: false };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- apply-schema`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/apply-schema.ts lib/__tests__/apply-schema.test.ts package.json package-lock.json
git commit -m "feat: add apply validation schema with honeypot and field errors"
```

---

## Task 15: `app/api/apply/route.ts` — Resend send with env-gated failure rule

**Files:**
- Create: `app/api/apply/route.ts`, `lib/email.ts`
- Test: `app/api/apply/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `validateApply`, `siteConfig`.
- Produces: `POST(req)` returning:
  - `200 { ok: true }` on confirmed send OR on silently-dropped bot OR on dev soft-success.
  - `400 { ok: false, errors }` on validation failure.
  - `502 { ok: false, error: "send_failed" }` in production when the key is missing or Resend throws.
- `lib/email.ts` exposes `sendApplicationEmail(input): Promise<void>` (throws on failure) and `isEmailConfigured(): boolean`.

- [ ] **Step 1: Install Resend**

```bash
npm i resend
```

- [ ] **Step 2: Write the failing test (mock the email module)**

`app/api/apply/__tests__/route.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/email", () => ({
  isEmailConfigured: vi.fn(),
  sendApplicationEmail: vi.fn(),
}));

import { POST } from "@/app/api/apply/route";
import { isEmailConfigured, sendApplicationEmail } from "@/lib/email";

const body = {
  name: "John", email: "john@example.com", drawingIn: "alone",
  availability: "nights", priorExperience: "", agreement: true, website: "",
};

function req(b: unknown) {
  return new Request("http://test/api/apply", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(b),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NODE_ENV", "production");
});

describe("POST /api/apply", () => {
  it("returns 200 on a confirmed send", async () => {
    vi.mocked(isEmailConfigured).mockReturnValue(true);
    vi.mocked(sendApplicationEmail).mockResolvedValue();
    const res = await POST(req(body));
    expect(res.status).toBe(200);
  });

  it("returns 400 on validation failure", async () => {
    const res = await POST(req({ ...body, email: "nope" }));
    expect(res.status).toBe(400);
  });

  it("silently drops a bot with 200 and no send", async () => {
    const res = await POST(req({ ...body, website: "spam" }));
    expect(res.status).toBe(200);
    expect(sendApplicationEmail).not.toHaveBeenCalled();
  });

  it("PRODUCTION: returns 502 when email is not configured (fail loud)", async () => {
    vi.mocked(isEmailConfigured).mockReturnValue(false);
    const res = await POST(req(body));
    expect(res.status).toBe(502);
    expect(sendApplicationEmail).not.toHaveBeenCalled();
  });

  it("PRODUCTION: returns 502 when send throws (fail loud)", async () => {
    vi.mocked(isEmailConfigured).mockReturnValue(true);
    vi.mocked(sendApplicationEmail).mockRejectedValue(new Error("resend down"));
    const res = await POST(req(body));
    expect(res.status).toBe(502);
  });

  it("DEV: soft-succeeds with 200 when email is not configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.mocked(isEmailConfigured).mockReturnValue(false);
    const res = await POST(req(body));
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- route`
Expected: FAIL (modules not found).

- [ ] **Step 4: Implement `lib/email.ts`**

```ts
import { Resend } from "resend";
import { siteConfig } from "@/site.config";
import type { ApplyInput } from "@/lib/apply-schema";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendApplicationEmail(input: ApplyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const resend = new Resend(apiKey);
  const from = process.env.APPLY_FROM_EMAIL ?? "applications@" + siteConfig.domain;
  const { error } = await resend.emails.send({
    from,
    to: siteConfig.contactEmail,
    replyTo: input.email,
    subject: `Circle application — ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `What's drawing you in: ${input.drawingIn}`,
      `Availability: ${input.availability}`,
      `Prior men's-work experience: ${input.priorExperience || "(none given)"}`,
    ].join("\n"),
  });
  if (error) throw new Error(error.message);
}
```

- [ ] **Step 5: Implement `app/api/apply/route.ts`**

```ts
import { NextResponse } from "next/server";
import { validateApply } from "@/lib/apply-schema";
import { isEmailConfigured, sendApplicationEmail } from "@/lib/email";

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const result = validateApply(data);
  if (!result.ok) {
    if (result.botDetected) return NextResponse.json({ ok: true }, { status: 200 }); // silently drop
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const isProd = process.env.NODE_ENV === "production";

  if (!isEmailConfigured()) {
    if (isProd) {
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    console.warn("[apply] DEV soft-success — email not configured. Payload:", result.value);
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    await sendApplicationEmail(result.value);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[apply] send failed:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- route`
Expected: PASS (all six cases).

- [ ] **Step 7: Add env documentation**

Append to `.env.example`:
```
# Resend — required in production for /apply to succeed
RESEND_API_KEY=
APPLY_FROM_EMAIL=
```

- [ ] **Step 8: Commit**

```bash
git add app/api/apply/route.ts lib/email.ts app/api/apply/__tests__/route.test.ts .env.example package.json package-lock.json
git commit -m "feat: add /api/apply route with env-gated fail-loud rule and Resend send"
```

---

## Task 16: `app/apply/page.tsx` — client form with inline errors + mailto fallback

**Files:**
- Create: `app/apply/page.tsx`, `components/site/ApplyForm.tsx`
- Test: `components/site/__tests__/ApplyForm.test.tsx`

**Interfaces:**
- Consumes: `siteConfig` (for the mailto fallback address). Posts to `/api/apply`.
- Produces: `ApplyForm()` client component. On `200` → redirects to `/thanks`. On `400` → shows field errors. On `502`/network error → shows an inline error with a `mailto:` fallback and does **not** redirect.

- [ ] **Step 1: Write the failing test (mock fetch + next/navigation)**

`components/site/__tests__/ApplyForm.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { ApplyForm } from "@/components/site/ApplyForm";

async function fill() {
  await userEvent.type(screen.getByLabelText(/your name/i), "John");
  await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
  await userEvent.type(screen.getByLabelText(/drawing you in/i), "Tired of going it alone");
  await userEvent.type(screen.getByLabelText(/availability/i), "Weeknights");
  await userEvent.click(screen.getByLabelText(/i understand/i));
}

beforeEach(() => { vi.clearAllMocks(); });

describe("ApplyForm", () => {
  it("redirects to /thanks on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 200, json: async () => ({ ok: true }) }));
    render(<ApplyForm />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /send my application/i }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/thanks"));
  });

  it("shows an error with a mailto fallback on 502 and does NOT redirect", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 502, json: async () => ({ ok: false, error: "send_failed" }) }));
    render(<ApplyForm />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /send my application/i }));
    await waitFor(() => expect(screen.getByText(/something went wrong sending/i)).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute("href", expect.stringContaining("mailto:"));
    expect(push).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ApplyForm`
Expected: FAIL.

- [ ] **Step 3: Implement `components/site/ApplyForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/site.config";

export function ApplyForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFailed(false);
    setErrors({});
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      drawingIn: form.get("drawingIn"),
      availability: form.get("availability"),
      priorExperience: form.get("priorExperience"),
      agreement: form.get("agreement") === "on",
      website: form.get("website"), // honeypot
    };
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 200) {
        router.push("/thanks");
        return;
      }
      if (res.status === 400) {
        const data = await res.json();
        setErrors(data.errors ?? {});
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  const field = "mt-1 w-full rounded-md border border-bone/20 bg-charcoal px-3 py-2 text-bone";
  const err = (k: string) => errors[k] && <p className="mt-1 text-sm text-ember">{errors[k]}</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Honeypot: visually hidden, not announced to humans */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div>
        <label htmlFor="name" className="block text-sm">Your name</label>
        <input id="name" name="name" className={field} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm">Email</label>
        <input id="email" name="email" type="email" className={field} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="drawingIn" className="block text-sm">What's drawing you in?</label>
        <textarea id="drawingIn" name="drawingIn" rows={4} className={field} />
        {err("drawingIn")}
      </div>
      <div>
        <label htmlFor="availability" className="block text-sm">Availability</label>
        <input id="availability" name="availability" className={field} />
        {err("availability")}
      </div>
      <div>
        <label htmlFor="priorExperience" className="block text-sm">Prior men's-work experience (optional)</label>
        <textarea id="priorExperience" name="priorExperience" rows={3} className={field} />
      </div>
      <div className="flex items-start gap-3">
        <input id="agreement" name="agreement" type="checkbox" className="mt-1" />
        <label htmlFor="agreement" className="text-sm text-bone/80">
          I understand circles are $99/month, month to month, cancel anytime, and by application.
        </label>
      </div>
      {err("agreement")}

      {failed && (
        <div className="rounded-md border border-ember/40 bg-ember/10 p-4 text-sm">
          Something went wrong sending your application. Please{" "}
          <a className="underline" href={`mailto:${siteConfig.contactEmail}?subject=Circle application`}>
            email {siteConfig.contactEmail}
          </a>{" "}
          directly — we don't want your message to disappear.
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-ember px-6 py-3 font-semibold text-charcoal transition hover:bg-ember/90 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send my application"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Implement `app/apply/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { ApplyForm } from "@/components/site/ApplyForm";

export const metadata: Metadata = { title: "Apply for a circle — The Conscious Brotherhood" };

export default function ApplyPage() {
  return (
    <main>
      <Section>
        <h1 className="font-serif text-4xl">Apply for a circle</h1>
        <p className="mt-4 text-bone/80">
          Circles are by application so we can keep each one safe and committed. Tell us a little about you —
          we read every application personally.
        </p>
        <div className="mt-10">
          <ApplyForm />
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- ApplyForm`
Expected: PASS (both cases).

- [ ] **Step 6: Commit**

```bash
git add app/apply/page.tsx components/site/ApplyForm.tsx components/site/__tests__/ApplyForm.test.tsx
git commit -m "feat: add /apply form with inline errors and mailto fallback on send failure"
```

---

## Task 17: `/thanks`, `/privacy`, `/terms` pages

**Files:**
- Create: `app/thanks/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`
- Test: `app/thanks/__tests__/thanks.test.tsx`

**Interfaces:**
- Consumes: `Section`, `copy` (disclaimer), `siteConfig`.
- Produces: three pages. `/thanks` copy is application-focused ("I read every application personally and reply within a few days").

- [ ] **Step 1: Write the failing test**

`app/thanks/__tests__/thanks.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Thanks from "@/app/thanks/page";

describe("/thanks", () => {
  it("confirms the application path, not a call RSVP", () => {
    render(<Thanks />);
    expect(screen.getByText(/read every application personally/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- thanks`
Expected: FAIL.

- [ ] **Step 3: Implement the three pages**

`app/thanks/page.tsx`:
```tsx
import type { Metadata } from "next";
import { Section } from "@/components/site/Section";

export const metadata: Metadata = { title: "Thank you — The Conscious Brotherhood" };

export default function Thanks() {
  return (
    <main>
      <Section className="text-center">
        <h1 className="font-serif text-4xl">Thank you — we got your application.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-bone/80">
          We read every application personally and reply within a few days. Keep an eye on your inbox
          (and your spam folder, just in case). You took a real step today — that matters.
        </p>
        <a href="/" className="mt-8 inline-block text-ember underline-offset-4 hover:underline">
          ← Back to home
        </a>
      </Section>
    </main>
  );
}
```
`app/privacy/page.tsx`:
```tsx
import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = { title: "Privacy — The Conscious Brotherhood" };

export default function Privacy() {
  return (
    <main>
      <Section>
        <h1 className="font-serif text-4xl">Privacy</h1>
        <div className="mt-6 space-y-4 text-bone/80">
          <p>We collect only what you send us through our forms — your name, email, and what you share in an application — and we use it solely to respond to you and run the brotherhood.</p>
          <p>We don't sell your information or share it outside the people running The Conscious Brotherhood. Call sign-ups are handled by our event platform under their own privacy terms.</p>
          <p>Want your information removed? Email {siteConfig.contactEmail} and we'll take care of it.</p>
        </div>
      </Section>
    </main>
  );
}
```
`app/terms/page.tsx`:
```tsx
import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { copy } from "@/lib/copy";

export const metadata: Metadata = { title: "Terms — The Conscious Brotherhood" };

export default function Terms() {
  const parts = copy.disclaimer.split("**988**");
  return (
    <main>
      <Section>
        <h1 className="font-serif text-4xl">Terms</h1>
        <div className="mt-6 space-y-4 text-bone/80">
          <p>The Conscious Brotherhood offers peer support and personal-growth experiences among men. By taking part in a call or circle, you agree to our agreements — confidentiality, ownership, consent before feedback, no rescuing, presence, and safety.</p>
          <p>Circle membership is $99/month, billed month to month, and you can cancel anytime. Participation is by application.</p>
          <p className="text-bone/60">{parts[0]}<strong className="text-bone">988</strong>{parts[1]}</p>
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- thanks`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/thanks/page.tsx app/privacy/page.tsx app/terms/page.tsx app/thanks/__tests__/thanks.test.tsx
git commit -m "feat: add /thanks (application-focused), /privacy, /terms pages"
```

---

## Task 18: Metadata, OG image, favicon, analytics

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/opengraph-image.tsx`, `app/icon.tsx`
- Test: `app/__tests__/og.test.tsx`

**Interfaces:**
- Consumes: `siteConfig`.
- Produces: full `metadata` (title, description, openGraph, twitter), a generated OG image route, a favicon route, and conditionally-mounted analytics.

- [ ] **Step 1: Install Vercel Analytics**

```bash
npm i @vercel/analytics
```

- [ ] **Step 2: Write the failing test (OG image is a real generated route)**

`app/__tests__/og.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { size, contentType } from "@/app/opengraph-image";

describe("opengraph-image", () => {
  it("declares a real 1200x630 PNG so unfurls are never blank", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- og`
Expected: FAIL.

- [ ] **Step 4: Implement `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.name;

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#15130F",
          color: "#E8E1D4",
          fontFamily: "serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 64, lineHeight: 1.1 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 30, color: "#C8651B", marginTop: 24 }}>
          You were never meant to carry it alone.
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 5: Implement `app/icon.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#15130F",
          color: "#C8651B",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        b
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 6: Expand metadata + mount analytics in `app/layout.tsx`**

Replace the metadata export and body:
```tsx
import { Analytics } from "@vercel/analytics/react";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: { default: siteConfig.name, template: `%s` },
  description: "A brotherhood for men who are done doing it alone. Start with one free monthly call.",
  openGraph: {
    title: siteConfig.name,
    description: "A brotherhood for men who are done doing it alone.",
    type: "website",
    url: `https://${siteConfig.domain}`,
  },
  twitter: { card: "summary_large_image", title: siteConfig.name },
};
```
And in the body, after `{children}`:
```tsx
{siteConfig.analytics.vercel && <Analytics />}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test -- og`
Expected: PASS.

- [ ] **Step 8: Verify the production build**

Run: `npm run build`
Expected: build succeeds; `/opengraph-image` and `/icon` appear as routes.

- [ ] **Step 9: Commit**

```bash
git add app/layout.tsx app/opengraph-image.tsx app/icon.tsx app/__tests__/og.test.tsx package.json package-lock.json
git commit -m "feat: add metadata, generated OG image + favicon, Vercel Analytics"
```

---

## Task 19: Full-suite green + build + deploy config

**Files:**
- Create: `vercel.json` (optional), `README.md` (launch + content checklist)
- Modify: none functional

**Interfaces:**
- Produces: a documented, fully green, deployable repo.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all suites pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: success, no type errors.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Write `README.md` with the content + launch checklist**

Include: how to run (`npm run dev`), the `TODO-CONTENT` list to fill in `site.config.ts` (domain, contactEmail, social handles, nextCall, lumaUrl, host bios + photos), required env vars (`RESEND_API_KEY`, `APPLY_FROM_EMAIL`), and the launch checklist from the brief (domain + handles, Luma event, Stripe link kept private, Resend wired, set DATE, host photo/bio, OG/favicon present, legal pages, phone test, analytics on).

- [ ] **Step 5: Commit**

```bash
git add README.md vercel.json
git commit -m "docs: add README with content + launch checklist"
```

- [ ] **Step 6: Push to GitHub**

```bash
git push -u origin master
```

- [ ] **Step 7: Connect to Vercel (manual, documented in README)**

In Vercel: import `github.com/ch4rlie/consciousbro`, set `RESEND_API_KEY` and `APPLY_FROM_EMAIL` env vars, deploy. Note: `/apply` will correctly fail-loud until `RESEND_API_KEY` is set.

---

## Self-Review

**Spec coverage:**
- §1 conversion architecture → Tasks 7, 9, 10, 16 (single primary CTA, secondary anchor, no buy button — asserted in Task 10 test). ✓
- §2 stack → Task 1, 6, 14, 15, 18. ✓
- §3 design system (palette/fonts) → Task 1. ✓
- §4 `site.config.ts` → Task 2. ✓
- §5 routes & components → Tasks 7–13, 16, 17. ✓
- §6 loud placeholders → Tasks 5 (button), 9 (date), 11 (host bio) with explicit tests. ✓
- §7 `/apply` + `/api/apply` env-gated rule, honeypot, validation, prior-experience field → Tasks 14, 15, 16. ✓
- §8 metadata/OG/analytics/a11y → Task 18; OG image is a real generated route asserted in test. ✓
- §9 YAGNI (anchor not standalone /circles, no buy button) → Task 10. ✓
- §10 988 verbatim → locked by tests in Tasks 3 and 12. ✓

**Placeholder scan:** No "TBD/TODO" in steps except intentional `TODO-CONTENT` markers inside `site.config.ts` (these are the deliberate fill-in-later content hooks, each with a comment) and the README checklist. No vague "add error handling" — the apply error path is fully specified. ✓

**Type consistency:** `SiteConfig`, `Host`, `hasLumaUrl`/`hasCallDate`/`hostHasBio` defined in Task 2 and used identically in Tasks 5, 9, 11. `ApplyInput`/`validateApply` defined in Task 14, consumed in Tasks 15. `sendApplicationEmail`/`isEmailConfigured` defined in Task 15 `lib/email.ts`, mocked with matching signatures in the route test. `copy` shape defined in Task 3, consumed by all sections. ✓
