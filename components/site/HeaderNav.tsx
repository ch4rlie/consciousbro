"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SaveSeatButton } from "./SaveSeatButton";

const links = [
  { href: "#call", label: "The call" },
  { href: "#circles", label: "The circles" },
  { href: "#faq", label: "FAQ" },
  { href: "/apply", label: "Apply" },
];

export function HeaderNav() {
  const [open, setOpen] = useState(false);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Desktop: inline links + compact CTA */}
      <nav className="hidden items-center gap-6 md:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-bone/80 transition hover:text-ember"
          >
            {l.label}
          </Link>
        ))}
        <SaveSeatButton className="px-4 py-2 text-sm" label="Save your seat" />
      </nav>

      {/* Mobile: hamburger toggle */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="-mr-1 inline-flex items-center justify-center rounded-md p-2 text-bone transition hover:text-ember md:hidden"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Mobile: dropdown panel */}
      <div
        id="mobile-menu"
        className={cn(
          "absolute inset-x-0 top-full origin-top border-b border-bone/10 bg-charcoal/95 backdrop-blur transition md:hidden",
          open ? "visible opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <nav className="mx-auto flex max-w-5xl flex-col px-6 py-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-bone/5 py-3 text-bone/90 transition hover:text-ember"
            >
              {l.label}
            </Link>
          ))}
          <SaveSeatButton
            className="mt-4 w-full"
            label="Save your seat"
            onClick={() => setOpen(false)}
          />
        </nav>
      </div>
    </>
  );
}
