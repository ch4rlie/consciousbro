import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo-path";

/**
 * The Conscious Brotherhood emblem. Inlined so it inherits the current text
 * color via `fill="currentColor"` — e.g. `text-bone` renders it off-white,
 * `text-ember` renders it amber. Decorative (paired with the wordmark text).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} fill="currentColor" aria-hidden="true" className={className}>
      <path d={LOGO_PATH} />
    </svg>
  );
}
