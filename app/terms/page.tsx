import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { copy } from "@/lib/copy";

export const metadata: Metadata = { title: "Terms | The Conscious Brotherhood" };

export default function Terms() {
  const parts = copy.disclaimer.split("**988**");
  return (
    <main>
      <Section>
        <h1 className="font-serif text-4xl">Terms</h1>
        <div className="mt-6 space-y-4 text-bone/80">
          <p>The Conscious Brotherhood offers peer support and personal-growth experiences among men. By taking part in a call or circle, you agree to our agreements: confidentiality, ownership, consent before feedback, no rescuing, presence, and safety.</p>
          <p>Circle membership is $99/month, billed month to month, and you can cancel anytime. Participation is by application.</p>
          <p className="text-bone/60">{parts[0]}<strong className="text-bone">988</strong>{parts[1]}</p>
        </div>
      </Section>
    </main>
  );
}
