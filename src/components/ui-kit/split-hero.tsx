import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SplitHero({
  title,
  subtitle,
  actions,
  aside,
  breadcrumb,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
}) {
  return (
    <section data-shot="hero" className={cn("relative z-1", className)}>
      <div className="relative container grid gap-12 pt-32 pb-16 md:pt-36 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-16 lg:pt-44 lg:pb-24">
        <div className="flex min-w-0 flex-col items-start">
          {breadcrumb && <div className="mb-6">{breadcrumb}</div>}
          <h1 className="type-hero max-w-[680px]">{title}</h1>
          {subtitle && (
            <p className="type-subtitle text-text-2 mt-6 max-w-[580px]">
              {subtitle}
            </p>
          )}
          {actions && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {actions}
            </div>
          )}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </div>
    </section>
  );
}
