import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/site/Section";

export const metadata: Metadata = { title: "Thank you — The Conscious Brotherhood" };

export default function Thanks() {
  return (
    <main>
      <Section className="text-center">
        <h1 className="font-serif text-4xl">Thank you — we got your application.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-bone/80">
          We read every application personally and reply within a few days. Keep an eye on your inbox
          (and your spam folder, just in case). You took a real step today — that matters.
        </p>
        <Link href="/" className="mt-8 inline-block text-ember underline-offset-4 hover:underline">
          ← Back to home
        </Link>
      </Section>
    </main>
  );
}
