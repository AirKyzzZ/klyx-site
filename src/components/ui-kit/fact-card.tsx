import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type Fact = { label: string; value: string };

export type FactPrice = {
  label: string;
  value: string;
  unit?: string;
  note?: string;
};

export function FactCard({
  visual,
  facts,
  price,
  className,
}: {
  visual?: ReactNode;
  facts: Fact[];
  price?: FactPrice;
  className?: string;
}) {
  return (
    <div
      data-fact-card
      className={cn(
        "border-line bg-surface-1 shadow-panel flex flex-col gap-4 rounded-[20px] border p-5 sm:p-6",
        className,
      )}
    >
      {visual && (
        <div className="bg-surface-2 grid place-items-center overflow-hidden rounded-[12px] p-4">
          {visual}
        </div>
      )}
      <dl className="divide-line divide-y">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="grid gap-1 py-3 first:pt-1 sm:grid-cols-[104px_1fr] sm:gap-4"
          >
            <dt className="text-text-3 pt-0.5 text-[0.8125rem] font-medium">
              {fact.label}
            </dt>
            <dd className="text-text text-[0.9375rem] leading-normal">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
      {price && (
        <div className="border-line flex flex-col gap-1 border-t pt-4">
          <p className="text-text-3 text-[0.8125rem]">{price.label}</p>
          <p className="text-text flex items-baseline text-[1.875rem] leading-none font-semibold tracking-[-1px]">
            {price.value}
            {price.unit && (
              <span className="text-text-2 ml-1 text-[0.9375rem] font-normal tracking-normal">
                {price.unit}
              </span>
            )}
          </p>
          {price.note && (
            <p className="text-text-2 pt-1.5 text-sm">{price.note}</p>
          )}
        </div>
      )}
    </div>
  );
}
