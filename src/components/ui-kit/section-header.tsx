import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  intro,
  as: Heading = "h2",
  children,
  className,
}: {
  title: string;
  intro?: string;
  as?: "h1" | "h2";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-16",
        className,
      )}
    >
      <Heading
        className={cn(
          "max-w-[680px]",
          Heading === "h1" ? "type-hero" : "type-section",
        )}
      >
        {title}
      </Heading>
      {(intro || children) && (
        <div className="flex flex-col gap-5 lg:w-[400px] lg:shrink-0 lg:pt-1.5">
          {intro && <p className="type-intro text-text-2">{intro}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
