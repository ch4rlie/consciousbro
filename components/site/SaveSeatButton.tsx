import { cn } from "@/lib/utils";
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
        className={cn(base, "cursor-not-allowed bg-olive/40 text-bone/60", className)}
      >
        Dates announced soon
      </button>
    );
  }
  const label = hasCallDate(config)
    ? `Save your seat for ${config.nextCall.date}`
    : "Save your seat";
  return (
    <a
      href={config.lumaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, "bg-ember text-charcoal hover:bg-ember/90", className)}
    >
      {label}
    </a>
  );
}
