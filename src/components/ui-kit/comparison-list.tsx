import { cn } from "@/lib/utils";

import { type BeforeAfter, BeforeAfterRows } from "./use-case-card";

export type Comparison = {
  title: string;
  before: BeforeAfter;
  after: BeforeAfter;
};

export function ComparisonList({
  items,
  className,
}: {
  items: Comparison[];
  className?: string;
}) {
  return (
    <ul
      data-comparison-list
      className={cn(
        "border-line bg-surface-1 divide-line divide-y overflow-hidden rounded-[16px] border",
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item.title}
          className="grid gap-2 p-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-7"
        >
          <h3 className="text-text text-lg leading-tight font-semibold tracking-[-0.3px] lg:pt-3">
            {item.title}
          </h3>
          <BeforeAfterRows
            before={item.before}
            after={item.after}
            className="border-t-0"
          />
        </li>
      ))}
    </ul>
  );
}
