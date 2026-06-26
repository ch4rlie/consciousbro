import { CalendarDays } from "lucide-react";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { SaveSeatButton } from "./SaveSeatButton";
import { copy } from "@/lib/copy";
import { siteConfig, hasCallDate, hasLumaUrl, type SiteConfig } from "@/site.config";

export function MonthlyCall({ config = siteConfig }: { config?: SiteConfig }) {
  const { date, time, tz } = hasCallDate(config) ? config.nextCall : { date: "", time: "", tz: "" };
  const timeParts = [time, tz].filter((p) => p && p !== "TBD").join(" ");
  const whenLine = hasCallDate(config)
    ? timeParts
      ? `${timeParts}, next one is ${date}`
      : `Next one is ${date}`
    : "Next date announced soon";
  return (
    <Section id="call" className="bg-charcoal-raised">
      <SectionHeading icon={CalendarDays}>{copy.monthlyCall.header}</SectionHeading>
      <p className="mt-6 text-lg text-bone/80">{copy.monthlyCall.body}</p>
      <ul className="mt-8 space-y-2 text-bone/90">
        <li><strong>When:</strong> {whenLine}</li>
        <li><strong>Where:</strong> {copy.monthlyCall.where}</li>
        <li><strong>Cost:</strong> <span className="font-semibold text-ember">{copy.monthlyCall.cost}</span></li>
        <li><strong>Who:</strong> {copy.monthlyCall.who}</li>
      </ul>
      {hasLumaUrl(config) && (
        <div className="mt-8 overflow-hidden rounded-lg border border-bone/10">
          <iframe
            title="RSVP on Luma"
            src={config.lumaUrl}
            className="h-[450px] w-full"
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      )}
      <div className="mt-8">
        <SaveSeatButton config={config} />
      </div>
    </Section>
  );
}
