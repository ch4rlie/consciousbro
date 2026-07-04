import Link from "next/link";
import { HeaderNav } from "./HeaderNav";
import { Logo } from "./Logo";
import { siteConfig } from "@/site.config";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-bone/10 bg-charcoal/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-bone transition hover:text-ember"
        >
          <Logo className="size-8 shrink-0" />
          <span className="font-serif text-lg tracking-tight">
            {siteConfig.name.replace(/^The\s+/i, "")}
          </span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
