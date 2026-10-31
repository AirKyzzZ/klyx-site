import { ActionButton } from "@/components/action-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type FaqProps = {
  title: string;
  items: { question: string; answer: string }[];
  bookLabel?: string;
  className?: string;
};

export function Faq({ title, items, bookLabel, className }: FaqProps) {
  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl tracking-tight md:text-4xl lg:text-5xl">
              {title}
            </h2>
            {bookLabel && (
              <ActionButton
                action="book"
                variant="secondary"
                className="shadow-md"
              >
                {bookLabel}
              </ActionButton>
            )}
          </div>

          <Accordion type="single" collapsible className="w-full text-start">
            {items.map((item, i) => (
              <AccordionItem key={item.question} value={`faq-${i}`}>
                <AccordionTrigger className="text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
