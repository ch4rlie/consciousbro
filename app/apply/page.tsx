import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/site/Section";
import { ApplyForm } from "@/components/site/ApplyForm";

export const metadata: Metadata = { title: "Apply for a circle | The Conscious Brotherhood" };

export default function ApplyPage() {
  return (
    <main>
      <Section>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-bone/70 underline-offset-4 transition hover:text-ember hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to home
        </Link>
        <h1 className="mt-6 font-serif text-4xl">Apply for a circle</h1>
        <p className="mt-4 text-bone/80">
          Circles are by application so we can keep each one safe and committed. Tell us a little about you.
          We read every application personally.
        </p>
        <div className="mt-10">
          <ApplyForm />
        </div>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-1.5 text-sm text-bone/70 underline-offset-4 transition hover:text-ember hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to home
        </Link>
      </Section>
    </main>
  );
}
