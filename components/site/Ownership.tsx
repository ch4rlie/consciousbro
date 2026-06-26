import { Compass } from "lucide-react";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { copy } from "@/lib/copy";

export function Ownership() {
  return (
    <Section className="bg-olive/10">
      <SectionHeading icon={Compass}>{copy.ownership.header}</SectionHeading>
      {copy.ownership.body.map((p, i) => (
        <p key={i} className="mt-6 text-lg text-bone/80">{p}</p>
      ))}
    </Section>
  );
}
