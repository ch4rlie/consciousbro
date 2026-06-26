import type { LucideIcon } from "lucide-react";

/** Small ember line-icon anchored above a section's heading. */
export function SectionHeading({
  icon: Icon,
  centered = false,
  children,
}: {
  icon: LucideIcon;
  centered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={centered ? "flex flex-col items-center text-center" : ""}>
      <Icon aria-hidden="true" strokeWidth={1.5} className="mb-4 size-7 text-ember" />
      <h2 className="font-serif text-3xl sm:text-4xl">{children}</h2>
    </div>
  );
}
