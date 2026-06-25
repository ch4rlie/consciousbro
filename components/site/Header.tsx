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
