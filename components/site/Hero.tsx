import { Section } from "./Section";
import { SaveSeatButton } from "./SaveSeatButton";
import { SecondaryLink } from "./SecondaryLink";
import { copy } from "@/lib/copy";

export function Hero() {
  return (
    <Section className="pt-16 text-center sm:pt-24">
      <p className="mb-4 text-sm uppercase tracking-widest text-ember">{copy.hero.eyebrow}</p>
      <h1 className="font-serif text-4xl leading-tight sm:text-6xl">{copy.hero.headline}</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-bone/80">{copy.hero.subhead}</p>
      <div className="mt-10 flex flex-col items-center gap-4">
        <SaveSeatButton />
        <SecondaryLink href="#circles">{copy.hero.secondary}</SecondaryLink>
      </div>
    </Section>
  );
}
