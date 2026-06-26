import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = { title: "Privacy | The Conscious Brotherhood" };

export default function Privacy() {
  return (
    <main>
      <Section>
        <h1 className="font-serif text-4xl">Privacy</h1>
        <div className="mt-6 space-y-4 text-bone/80">
          <p>We collect only what you send us through our forms (your name, email, and what you share in an application), and we use it solely to respond to you and run the brotherhood.</p>
          <p>We don&apos;t sell your information or share it outside the people running The Conscious Brotherhood. Call sign-ups are handled by our event platform under their own privacy terms.</p>
          <p>Want your information removed? Email {siteConfig.contactEmail} and we&apos;ll take care of it.</p>
        </div>
      </Section>
    </main>
  );
}
