import type { ReactNode } from "react";

import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";

export function OfferPageHero({
  title,
  subtitle,
  actions,
  aside,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section data-shot="hero" className={cn("relative z-1", className)}>
      <div className="container pt-32 pb-16 md:pt-40 lg:pt-44 lg:pb-24">
        <div
          className={cn(
            "grid gap-10",
            aside &&
              "lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end lg:gap-16",
          )}
        >
          <div className="flex flex-col">
            <h1 className="type-hero max-w-[760px]">{title}</h1>
            <p className="type-subtitle text-text-2 mt-7 max-w-[600px]">
              {subtitle}
            </p>
            {actions && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}
          </div>
          {aside}
        </div>
        {children}
      </div>
    </section>
  );
}

export function OfferPriceCard({
  label,
  price,
  unit,
  duration,
  note,
  className,
}: {
  label: string;
  price: string;
  unit?: string;
  duration: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      data-price-card
      className={cn(
        "border-line bg-surface-1 shadow-panel flex flex-col gap-1 rounded-[16px] border p-6 lg:p-7",
        className,
      )}
    >
      <p className="text-text-3 text-[0.8125rem]">{label}</p>
      <p className="text-text flex flex-wrap items-baseline text-[2.25rem] leading-none font-semibold tracking-[-1.2px]">
        {price}
        {unit && (
          <span className="text-text-2 ml-1.5 text-base font-normal tracking-normal">
            {unit}
          </span>
        )}
      </p>
      <p className="text-text-2 flex items-center gap-1.5 pt-2 text-sm">
        <Clock aria-hidden="true" className="size-3.5 shrink-0" />
        {duration}
      </p>
      {note && (
        <p className="border-line text-text-2 mt-5 border-t pt-4 text-[0.9375rem] leading-normal">
          {note}
        </p>
      )}
    </div>
  );
}
