import { Footprints } from "lucide-react";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { copy } from "@/lib/copy";

export function Problem() {
  return (
    <Section>
      <SectionHeading icon={Footprints}>{copy.problem.header}</SectionHeading>
      {copy.problem.body.map((p, i) => (
        <p key={i} className="mt-6 text-lg text-bone/80">{p}</p>
      ))}
    </Section>
  );
}
