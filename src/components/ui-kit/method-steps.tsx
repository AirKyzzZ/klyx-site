import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type MethodStep = {
  when?: string;
  title: string;
  body: string;
  mock?: ReactNode;
};

function StepNumber({ index }: { index: number }) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full text-base font-semibold tabular-nums",
        index === 0
          ? "bg-accent text-accent-ink"
          : "border-line-strong text-text bg-surface-1 border",
      )}
    >
      {index + 1}
    </span>
  );
}

function StepColumns({
  steps,
  className,
}: {
  steps: MethodStep[];
  className?: string;
}) {
  return (
    <ol
      data-method-steps
      className={cn(
        "grid gap-x-8 gap-y-10 sm:grid-cols-2",
        steps.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {steps.map((step, i) => (
        <li key={step.title} className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <StepNumber index={i} />
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="bg-line-strong hidden h-px flex-1 lg:block"
              />
            )}
          </div>
          <div className="flex flex-col gap-2 lg:pr-4">
            {step.when && (
              <p className="text-text-3 text-[0.8125rem] font-medium">
                {step.when}
              </p>
            )}
            <h3 className="text-text text-xl leading-[1.2] font-semibold tracking-[-0.5px]">
              {step.title}
            </h3>
            <p className="text-text-2 text-[0.9375rem] leading-[1.55]">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function MethodSteps({
  steps,
  className,
}: {
  steps: MethodStep[];
  className?: string;
}) {
  if (steps.every((step) => !step.mock)) {
    return <StepColumns steps={steps} className={className} />;
  }
  return (
    <ol data-method-steps className={cn("flex flex-col", className)}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="border-line grid items-center gap-8 border-b py-10 first:pt-0 last:border-b-0 last:pb-0 lg:grid-cols-[1fr_620px] lg:gap-12"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <StepNumber index={i} />
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
