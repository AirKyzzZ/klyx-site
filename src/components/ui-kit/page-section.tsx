import type { ReactNode } from "react";

import { Hr } from "@/components/section";
import { cn } from "@/lib/utils";

export function PageSection({
  id,
  divider = true,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  divider?: boolean;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-shot={id ?? "section"}
      className={cn("relative z-1", id && "scroll-mt-20", className)}
    >
      {divider && <Hr />}
      <div
        className={cn("relative container py-20 lg:py-28", containerClassName)}
      >
        {children}
      </div>
    </section>
  );
}
