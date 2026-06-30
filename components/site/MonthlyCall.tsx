import { CalendarDays } from "lucide-react";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { SaveSeatButton } from "./SaveSeatButton";
import { copy } from "@/lib/copy";
import { siteConfig, hasCallDate, type SiteConfig } from "@/site.config";

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
      <div className="mt-8">
        <SaveSeatButton config={config} />
      </div>
    </Section>
  );
}
