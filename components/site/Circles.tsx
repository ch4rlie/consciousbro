import { Section } from "./Section";
import { copy } from "@/lib/copy";

export function Circles() {
  return (
    <Section id="circles" className="bg-olive/10">
      <h2 className="font-serif text-3xl sm:text-4xl">{copy.circles.header}</h2>
      <p className="mt-6 text-lg text-bone/80">{copy.circles.body}</p>
      <ul className="mt-6 space-y-2 text-bone/90">
        {copy.circles.bullets.map((b, i) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>
      <p className="mt-6 text-bone/70">{copy.circles.note}</p>
      <a
        href="/apply"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-ember px-6 py-3 font-semibold text-charcoal transition hover:bg-ember/90"
      >
        Apply for a circle
      </a>
    </Section>
  );
}
