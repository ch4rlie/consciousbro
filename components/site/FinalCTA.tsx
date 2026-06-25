import { Section } from "./Section";
import { SaveSeatButton } from "./SaveSeatButton";
import { copy } from "@/lib/copy";

export function FinalCTA() {
  return (
    <Section className="text-center">
      <h2 className="font-serif text-3xl sm:text-5xl">{copy.finalCta.header}</h2>
      <p className="mt-4 text-lg text-bone/80">{copy.finalCta.subhead}</p>
      <div className="mt-8 flex justify-center">
        <SaveSeatButton />
      </div>
    </Section>
  );
}
