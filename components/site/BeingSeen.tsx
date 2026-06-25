import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function BeingSeen() {
  return (
    <Section>
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.beingSeen.header}</h2>
      {copy.beingSeen.body.map((p, i) => (
        <p key={i} className="mt-6 text-lg text-bone/80">{p}</p>
      ))}
    </Section>
  );
}
