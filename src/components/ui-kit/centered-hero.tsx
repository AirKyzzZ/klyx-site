import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function CenteredHero({
  title,
  subtitle,
  actions,
  backdrop,
  footer,
  intro,
  className,
  ...props
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backdrop?: ReactNode;
  footer?: ReactNode;
  intro?: boolean;
} & Omit<ComponentProps<"section">, "title">) {
  return (
    <section
      data-shot="hero"
      data-intro={intro || undefined}
      className={cn("relative z-1 overflow-hidden", className)}
      {...props}
    >
      <div className="relative container">
        <div className="relative isolate flex flex-col items-center pt-32 pb-14 text-center md:pt-40 lg:min-h-[692px] lg:pt-[222px] lg:pb-12">
          {backdrop && (
            <div className="absolute inset-y-0 right-[calc(-1*var(--content-x))] left-[calc(-1*var(--content-x))] -z-1">
              {backdrop}
            </div>
          )}
          <h1 className="type-hero max-w-[700px]">{title}</h1>
          {subtitle && (
            <p className="hero-subtitle type-subtitle text-text-2 mt-7 max-w-[580px]">
              {subtitle}
            </p>
          )}
          {actions && (
            <div className="hero-actions mt-8 flex flex-wrap items-center justify-center gap-3">
              {actions}
            </div>
          )}
        </div>
        {footer && <div className="pb-16 lg:pb-[72px]">{footer}</div>}
      </div>
    </section>
  );
}
