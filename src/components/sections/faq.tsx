import type { ReactNode } from "react";

import { Plus } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { Section, SectionHeading } from "@/components/section";

type FaqItem = {
  question: string;
  answer: string;
  id?: string;
  more?: ReactNode;
};

type FaqProps = {
  id?: string;
  index?: string;
  eyebrow?: string;
  title: string;
  emphasis?: string;
  items: FaqItem[];
  bookLabel?: string;
  openFirst?: boolean;
  openAll?: boolean;
  className?: string;
};

export function Faq({
  id,
  index,
  eyebrow,
  title,
  emphasis,
  items,
  bookLabel,
  openFirst = false,
  openAll = false,
  className,
}: FaqProps) {
  return (
    <Section id={id} index={index} eyebrow={eyebrow} className={className}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="reveal space-y-8 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <SectionHeading lead={title} rest={emphasis} />
          {bookLabel && (
            <ActionButton action="book" variant="secondary" size="lg">
              {bookLabel}
            </ActionButton>
          )}
        </div>

        <div className="reveal border-line border-t lg:col-span-7 lg:col-start-6">
          {items.map((item, i) => (
            <details
              key={item.question}
              id={item.id}
              open={openAll || (openFirst && i === 0)}
              className="faq-item border-line group scroll-mt-28 border-b"
            >
              <summary className="text-text hover:text-text-2 flex items-start justify-between gap-6 py-5 text-[1.0625rem] font-medium tracking-[-0.01em] transition-colors duration-(--d-fast)">
                {item.question}
                <Plus
                  aria-hidden="true"
                  className="faq-icon text-text-3 mt-1 size-4 shrink-0"
                />
              </summary>
              <p className="text-text-2 max-w-[62ch] pb-6">{item.answer}</p>
              {item.more && <div className="-mt-2 pb-6">{item.more}</div>}
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
