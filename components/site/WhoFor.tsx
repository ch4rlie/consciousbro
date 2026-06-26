import { CircleCheck, CircleSlash } from "lucide-react";
import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function WhoFor() {
  return (
    <Section className="bg-charcoal-raised">
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-2xl">
            <CircleCheck aria-hidden="true" strokeWidth={1.5} className="size-6 shrink-0 text-ember" />
            {copy.whoFor.forHeader}
          </h3>
          <ul className="mt-4 space-y-2 text-bone/80">
            {copy.whoFor.forItems.map((t, i) => <li key={i}>• {t}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="flex items-center gap-2 font-serif text-2xl text-bone/70">
            <CircleSlash aria-hidden="true" strokeWidth={1.5} className="size-6 shrink-0 text-bone/40" />
            {copy.whoFor.notHeader}
          </h3>
          <ul className="mt-4 space-y-2 text-bone/60">
            {copy.whoFor.notItems.map((t, i) => <li key={i}>• {t}</li>)}
          </ul>
        </div>
      </div>
    </Section>
  );
}
