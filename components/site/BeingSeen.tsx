import { Ear } from "lucide-react";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { copy } from "@/lib/copy";

export function BeingSeen() {
  const last = copy.beingSeen.body.length - 1;
  return (
    <Section grain>
      <SectionHeading icon={Ear}>{copy.beingSeen.header}</SectionHeading>
      {copy.beingSeen.body.map((p, i) => (
        <p
          key={i}
          className={
            i === last
              ? "mt-8 font-serif text-xl italic text-ember sm:text-2xl"
              : "mt-6 text-lg text-bone/80"
          }
        >
          {p}
        </p>
      ))}
    </Section>
  );
}
