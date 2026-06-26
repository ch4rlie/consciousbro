import { HeartHandshake } from "lucide-react";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { copy } from "@/lib/copy";
import { siteConfig, hostHasBio, type SiteConfig } from "@/site.config";

export function Host({ config = siteConfig }: { config?: SiteConfig }) {
  return (
    <Section className="bg-charcoal-raised">
      <SectionHeading icon={HeartHandshake}>{copy.host.header}</SectionHeading>
      <p className="mt-6 text-lg text-bone/80">{copy.host.intro}</p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {config.hosts.map((h) => (
          <div key={h.name} className="rounded-lg border border-bone/10 bg-charcoal/40 p-6">
            <h3 className="font-serif text-2xl">{h.name}</h3>
            {hostHasBio(h) ? (
              <p className="mt-3 text-bone/80">{h.bio}</p>
            ) : (
              <p className="mt-3 rounded bg-ember/10 px-3 py-2 text-sm text-ember">Bio coming soon</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
