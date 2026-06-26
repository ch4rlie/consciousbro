import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { ApplyForm } from "@/components/site/ApplyForm";

export const metadata: Metadata = { title: "Apply for a circle | The Conscious Brotherhood" };

export default function ApplyPage() {
  return (
    <main>
      <Section>
        <h1 className="font-serif text-4xl">Apply for a circle</h1>
        <p className="mt-4 text-bone/80">
          Circles are by application so we can keep each one safe and committed. Tell us a little about you.
          We read every application personally.
        </p>
        <div className="mt-10">
          <ApplyForm />
        </div>
      </Section>
    </main>
  );
}
