import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function Ownership() {
  return (
    <Section className="bg-olive/10">
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.ownership.header}</h2>
      {copy.ownership.body.map((p, i) => (
        <p key={i} className="mt-6 text-lg text-bone/80">{p}</p>
      ))}
    </Section>
  );
}
