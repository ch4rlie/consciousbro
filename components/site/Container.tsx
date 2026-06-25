import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function Container() {
  return (
    <Section className="bg-olive/10">
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.container.header}</h2>
      <p className="mt-6 text-lg text-bone/80">{copy.container.intro}</p>
      <ul className="mt-6 space-y-3">
        {copy.container.items.map(([t, d], i) => (
          <li key={i} className="text-bone/90"><strong className="text-ember">{t}</strong> {d}</li>
        ))}
      </ul>
    </Section>
  );
}
