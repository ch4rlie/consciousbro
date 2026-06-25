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
