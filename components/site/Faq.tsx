import { Section } from "./Section";
import { copy } from "@/lib/copy";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Faq() {
  return (
    <Section>
      <h2 className="font-serif text-3xl sm:text-4xl">Questions</h2>
      <Accordion type="single" collapsible className="mt-8">
        {copy.faq.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-bone/80">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
