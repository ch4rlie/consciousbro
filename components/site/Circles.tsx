import Link from "next/link";
import { UsersRound } from "lucide-react";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { copy } from "@/lib/copy";

const PRICE = "$99/month";

export function Circles() {
  return (
    <Section id="circles" className="bg-olive/10">
      <SectionHeading icon={UsersRound}>{copy.circles.header}</SectionHeading>
      <p className="mt-6 text-lg text-bone/80">{copy.circles.body}</p>
      <ul className="mt-6 space-y-2 text-bone/90">
        {copy.circles.bullets.map((b, i) => {
          const idx = b.indexOf(PRICE);
          if (idx === -1) return <li key={i}>• {b}</li>;
          return (
            <li key={i}>
              • {b.slice(0, idx)}
              <strong className="font-semibold text-ember">{PRICE}</strong>
              {b.slice(idx + PRICE.length)}
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-bone/70">{copy.circles.note}</p>
      <Link
        href="/apply"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-ember px-6 py-3 font-semibold text-charcoal transition hover:bg-ember/90"
      >
        Apply for a circle
      </Link>
    </Section>
  );
}
