import { Flame } from "lucide-react";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { SaveSeatButton } from "./SaveSeatButton";
import { copy } from "@/lib/copy";

export function FinalCTA() {
  return (
    <Section className="text-center">
      <SectionHeading icon={Flame} centered>{copy.finalCta.header}</SectionHeading>
      <p className="mt-4 text-lg text-bone/80">{copy.finalCta.subhead}</p>
      <div className="mt-8 flex justify-center">
        <SaveSeatButton />
      </div>
    </Section>
  );
}
