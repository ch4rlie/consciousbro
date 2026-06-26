import { VenetianMask } from "lucide-react";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { SurvivalStrategyGrid } from "./SurvivalStrategyGrid";
import { copy } from "@/lib/copy";

export function SurvivalStrategy() {
  return (
    <Section className="bg-olive/10">
      <SectionHeading icon={VenetianMask}>{copy.survivalStrategy.header}</SectionHeading>
      {copy.survivalStrategy.lede.map((p, i) => (
        <p key={i} className="mt-6 text-lg text-bone/80">{p}</p>
      ))}
      <p className="mt-6 font-serif text-xl italic text-ember">{copy.survivalStrategy.prompt}</p>
      <p className="mt-3 text-bone/70">{copy.survivalStrategy.recognize}</p>
      <SurvivalStrategyGrid />
    </Section>
  );
}
