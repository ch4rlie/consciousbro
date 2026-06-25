import Link from "next/link";
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
          <Link href="/privacy" className="hover:text-ember">Privacy</Link>
          <Link href="/terms" className="hover:text-ember">Terms</Link>
          <Link href="/apply" className="hover:text-ember">Apply for a circle</Link>
        </nav>
        <p className="text-xs text-bone/40">© {siteConfig.name}</p>
      </div>
    </footer>
  );
}
