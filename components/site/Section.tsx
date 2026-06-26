import { cn } from "@/lib/utils";

export function Section({
  id,
  className = "",
  grain = false,
  background,
  children,
}: {
  id?: string;
  className?: string;
  grain?: boolean;
  background?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative px-6 py-20 sm:py-28", grain && "section-grain", className)}
    >
      {background}
      <div className="relative z-10 mx-auto w-full max-w-3xl">{children}</div>
    </section>
  );
}
