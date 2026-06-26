import { ShieldCheck } from "lucide-react";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { copy } from "@/lib/copy";

export function Container() {
  return (
    <Section grain>
      <SectionHeading icon={ShieldCheck}>{copy.container.header}</SectionHeading>
      <p className="mt-6 text-lg text-bone/80">{copy.container.intro}</p>
      <ul className="mt-6 space-y-3">
        {copy.container.items.map(([t, d], i) => (
          <li key={i} className="text-bone/90"><strong className="text-ember">{t}</strong> {d}</li>
        ))}
      </ul>
    </Section>
  );
}
