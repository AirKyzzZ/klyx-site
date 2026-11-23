import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type MethodStep = {
  when?: string;
  title: string;
  body: string;
  mock?: ReactNode;
};

export function MethodSteps({
  steps,
  className,
}: {
  steps: MethodStep[];
  className?: string;
}) {
  return (
    <ol data-method-steps className={cn("flex flex-col", className)}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="border-line grid items-center gap-8 border-b py-10 first:pt-0 last:border-b-0 last:pb-0 lg:grid-cols-[1fr_620px] lg:gap-12"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full text-base font-semibold tabular-nums",
                i === 0
                  ? "bg-accent text-accent-ink"
                  : "border-line-strong text-text bg-surface-1 border",
              )}
            >
              {i + 1}
            </span>
            <div className="flex max-w-[400px] flex-col gap-2 pt-2">
              {step.when && (
                <p className="text-text-3 text-[0.8125rem] font-medium">
                  {step.when}
                </p>
              )}
              <h3 className="text-text text-2xl leading-[1.15] font-semibold tracking-[-0.7px] sm:text-[1.625rem]">
                {step.title}
              </h3>
              <p className="text-text-2 text-base leading-[1.55]">
                {step.body}
              </p>
            </div>
          </div>
          {step.mock && (
            <div
              aria-hidden="true"
              className="bg-surface-2 grid place-items-center rounded-[20px] px-5 py-9 sm:px-10"
            >
              {step.mock}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
