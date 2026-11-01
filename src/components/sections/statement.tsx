import type { ReactNode } from "react";

import { Check } from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { cn } from "@/lib/utils";

import { DashedLabel } from "./section-header";

export type StatementRow = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  children?: ReactNode;
};

type StatementProps = {
  rows: StatementRow[];
  label?: string;
  className?: string;
};

export function Statement({ rows, label, className }: StatementProps) {
  return (
    <section data-shot="statement" className={cn("py-20 lg:py-28", className)}>
      <div className="container">
        {label && <DashedLabel label={label} />}
        <div className="mx-auto max-w-5xl">
          {rows.map((row, i) => (
            <div key={row.title}>
              {i > 0 && <DashedLine className="my-12 lg:my-16" />}
              <div className="grid gap-6 md:gap-10 lg:grid-cols-2">
                <h2 className="text-3xl tracking-tight text-balance md:text-4xl">
                  {row.title}
                </h2>
                <div className="space-y-5">
                  {row.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {row.items && (
                    <ul className="space-y-3">
                      {row.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check className="mt-1 size-4 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {row.children}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
