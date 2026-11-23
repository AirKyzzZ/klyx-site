import type { ToolLogoId } from "@/lib/tools";
import { cn } from "@/lib/utils";

import { FlowRow } from "./flow-row";

export type BeforeAfter = { label: string; text: string };

export function BeforeAfterRows({
  before,
  after,
  className,
}: {
  before: BeforeAfter;
  after: BeforeAfter;
  className?: string;
}) {
  return (
    <dl className={cn("divide-line border-line divide-y border-t", className)}>
      {[
        { row: before, tone: "text-text-2" },
        { row: after, tone: "text-text" },
      ].map(({ row, tone }) => (
        <div
          key={row.label}
          className="grid gap-1 py-3 last:pb-0 sm:grid-cols-[90px_1fr] sm:gap-4"
        >
          <dt className="text-text-3 pt-0.5 text-[0.8125rem] font-medium">
            {row.label}
          </dt>
          <dd className={cn("text-[0.9375rem] leading-normal", tone)}>
            {row.text}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function UseCaseCard({
  category,
  title,
  from,
  to,
  agentLabel,
  before,
  after,
  className,
}: {
  category: string;
  title: string;
  from: readonly ToolLogoId[];
  to: readonly ToolLogoId[];
  agentLabel: string;
  before: BeforeAfter;
  after: BeforeAfter;
  className?: string;
}) {
  return (
    <article
      data-use-case
      className={cn(
        "border-line bg-surface-1 shadow-panel flex flex-col gap-5 rounded-[16px] border p-6 sm:p-7",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="bg-surface-2 overflow-hidden rounded-[12px] p-4"
      >
        <FlowRow from={from} to={to} agentLabel={agentLabel} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-accent text-[0.8125rem] font-medium">{category}</p>
        <h3 className="text-text text-[1.3125rem] leading-tight font-semibold tracking-[-0.4px]">
          {title}
        </h3>
      </div>
      <BeforeAfterRows before={before} after={after} />
    </article>
  );
}
