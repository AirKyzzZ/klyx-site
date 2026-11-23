import type { ReactNode } from "react";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export type FaqEntry = {
  question: string;
  answer: string;
  id?: string;
  more?: ReactNode;
};

export function FaqList({
  title,
  intro,
  items,
  openFirst = true,
  openAll = false,
  aside,
  className,
}: {
  title: string;
  intro?: string;
  items: FaqEntry[];
  openFirst?: boolean;
  openAll?: boolean;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-10 lg:grid-cols-[420px_minmax(0,684px)] lg:justify-between lg:gap-16",
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
        <h2 className="type-section max-w-[11ch]">{title}</h2>
        {intro && <p className="type-intro text-text-2">{intro}</p>}
        {aside}
      </div>
      <div className="border-line border-t">
        {items.map((item, i) => (
          <details
            key={item.question}
            id={item.id}
            open={openAll || (openFirst && i === 0)}
            className="faq-item border-line group scroll-mt-28 border-b"
          >
            <summary className="text-text hover:text-text-2 flex items-start justify-between gap-6 py-[22px] text-lg font-medium transition-colors duration-(--d-fast)">
              {item.question}
              <span aria-hidden="true" className="text-text-3 mt-0.5 shrink-0">
                <Plus className="size-[18px] group-open:hidden" />
                <Minus className="hidden size-[18px] group-open:block" />
              </span>
            </summary>
            <p className="text-text-2 -mt-2.5 max-w-[600px] pb-[22px] text-base leading-[1.55]">
              {item.answer}
            </p>
            {item.more && <div className="-mt-2 pb-[22px]">{item.more}</div>}
          </details>
        ))}
      </div>
    </div>
  );
}
