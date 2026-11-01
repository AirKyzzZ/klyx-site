import type { ReactNode } from "react";

import { EmphasisTitle } from "@/components/emphasis-title";
import { cn } from "@/lib/utils";

export function Hr({ className }: { className?: string }) {
  return (
    <div className={cn("hr", className)} aria-hidden="true">
      <div className="relative container h-0">
        <span className="cross l" />
        <span className="cross r" />
      </div>
    </div>
  );
}

export function Eyebrow({
  index,
  children,
}: {
  index?: string;
  children: ReactNode;
}) {
  return (
    <p className="type-label text-text-3 flex items-center gap-2">
      {index && (
        <>
          <span className="text-text-2">{index}</span>
          <span aria-hidden="true">·</span>
        </>
      )}
      <span>{children}</span>
    </p>
  );
}

export function Section({
  id,
  index,
  eyebrow,
  tone = "dark",
  className,
  children,
}: {
  id?: string;
  index?: string;
  eyebrow?: string;
  tone?: "dark" | "sand";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-shot={id ?? eyebrow ?? "section"}
      data-tone={tone}
      className={cn(
        "relative z-1",
        id && "scroll-mt-16",
        tone === "sand" && "tone-sand",
      )}
    >
      <Hr />
      <div className={cn("py-section relative container", className)}>
        {eyebrow && (
          <div className="absolute top-5 left-(--content-x)">
            <Eyebrow index={index}>{eyebrow}</Eyebrow>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  as: Heading = "h2",
  lead,
  rest,
  serif,
  className,
}: {
  as?: "h1" | "h2";
  lead: string;
  rest?: string;
  serif?: string;
  className?: string;
}) {
  return (
    <Heading
      className={cn(
        Heading === "h1" ? "type-h1" : "type-h2",
        "max-w-[24ch]",
        className,
      )}
    >
      <EmphasisTitle title={lead} emphasis={rest} serif={serif} />
    </Heading>
  );
}
