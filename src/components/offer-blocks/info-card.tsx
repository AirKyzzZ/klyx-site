import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function InfoCard({
  title,
  body,
  children,
  className,
}: {
  title: string;
  body?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-line bg-surface-1 flex flex-col gap-2 rounded-[16px] border p-6",
        className,
      )}
    >
      <h3 className="text-text text-lg leading-tight font-semibold tracking-[-0.3px]">
        {title}
      </h3>
      {body && (
        <p className="text-text-2 text-[0.9375rem] leading-[1.55]">{body}</p>
      )}
      {children}
    </div>
  );
}

export function SampleBadge({ label }: { label: string }) {
  return (
    <span className="bg-surface-2 text-text-2 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium">
      {label}
    </span>
  );
}
