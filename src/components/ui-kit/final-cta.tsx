import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FinalCta({
  title,
  body,
  actions,
  aside,
  className,
}: {
  title: string;
  body: string;
  actions?: ReactNode;
  aside: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-final-cta
      className={cn(
        "border-line bg-surface-1 relative isolate grid items-center gap-10 overflow-hidden rounded-[24px] border p-6 sm:p-10 lg:grid-cols-[1fr_460px] lg:gap-14 lg:p-14",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-1 bg-[radial-gradient(45%_60%_at_72%_95%,rgb(245_79_0/0.1),transparent_100%)]"
      />
      <div className="flex flex-col gap-6">
        <h2 className="type-cta max-w-[17ch]">{title}</h2>
        <p className="text-text-2 max-w-[500px] text-lg leading-normal">
          {body}
        </p>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
      <div>{aside}</div>
    </div>
  );
}
