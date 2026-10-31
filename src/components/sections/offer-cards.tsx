import {
  ArrowRight,
  ArrowUpRight,
  CircleCheck,
  GitMerge,
  GitPullRequest,
  Globe,
  type LucideIcon,
  PenLine,
  Plug,
  SquareTerminal,
  Ticket,
  Workflow,
} from "lucide-react";

import { Section, SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/lib/scenarios";

export type OfferGlyph = "sites" | "agents" | "fde";

type OfferCard = {
  href: StaticPathname;
  glyph: OfferGlyph;
  tag: string;
  name: string;
  outcome: string;
  price: string;
  duration: string;
  steps: [string, string, string];
};

type OfferCardsProps = {
  index?: string;
  eyebrow?: string;
  title: string;
  emphasis?: string;
  subtitle: string;
  items: OfferCard[];
  also?: { label: string; items: { label: string; href: StaticPathname }[] };
};

const GLYPH_ICONS: Record<OfferGlyph, [LucideIcon, LucideIcon, LucideIcon]> = {
  sites: [PenLine, SquareTerminal, Globe],
  agents: [Plug, Workflow, CircleCheck],
  fde: [Ticket, GitPullRequest, GitMerge],
};

function Connector() {
  return (
    <svg
      viewBox="0 0 40 8"
      preserveAspectRatio="none"
      className="h-2 min-w-4 flex-1"
      aria-hidden="true"
    >
      <path
        d="M0 4H36"
        stroke="var(--line-strong)"
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M36 1.5 40 4 36 6.5Z" fill="var(--text-3)" />
    </svg>
  );
}

function FlowGlyph({
  glyph,
  steps,
}: {
  glyph: OfferGlyph;
  steps: OfferCard["steps"];
}) {
  const icons = GLYPH_ICONS[glyph];
  return (
    <div
      className="border-line bg-bg-sunken/70 flex items-center rounded-md border px-3 py-5 sm:px-4"
      aria-hidden="true"
    >
      {steps.map((step, i) => {
        const Icon = icons[i];
        const last = i === steps.length - 1;
        return (
          <div key={step} className="contents">
            {i > 0 && <Connector />}
            <span
              className={
                last
                  ? "border-accent/60 bg-surface-2 text-text flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-1.5 font-mono text-[0.75rem]"
                  : "border-line-strong bg-surface-2 text-text-2 flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-1.5 font-mono text-[0.75rem]"
              }
            >
              <Icon
                className={
                  last ? "text-accent size-3.5" : "text-text-3 size-3.5"
                }
                strokeWidth={1.5}
              />
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function OfferCards({
  index,
  eyebrow,
  title,
  emphasis,
  subtitle,
  items,
  also,
}: OfferCardsProps) {
  return (
    <Section index={index} eyebrow={eyebrow}>
      <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
        <SectionHeading
          lead={title}
          rest={emphasis}
          className="lg:col-span-7"
        />
        <p className="text-text-2 max-w-[44ch] lg:col-span-4 lg:col-start-9">
          {subtitle}
        </p>
      </div>

      <ul className="reveal border-line bg-line mt-12 grid gap-px overflow-hidden rounded-md border md:mt-16 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.href} className="bg-bg flex">
            <Link
              href={item.href}
              data-spotlight=""
              className="spotlight group hover:bg-surface-1 flex w-full flex-col p-5 transition-colors duration-(--d-fast) lg:p-7"
            >
              <span className="type-label text-text-3 flex items-center justify-between">
                <span>
                  <span className="text-text-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  / {item.tag}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="group-hover:text-text size-4 transition-transform duration-(--d-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
              <div className="mt-6">
                <FlowGlyph glyph={item.glyph} steps={item.steps} />
              </div>
              <h3 className="type-h3 mt-8">{item.name}</h3>
              <p className="text-text-2 mt-2 mb-8 max-w-[38ch] text-[0.9375rem] leading-normal">
                {item.outcome}
              </p>
              <span className="border-line mt-auto flex flex-col gap-1 border-t pt-4">
                <span className="type-data text-text">{item.price}</span>
                <span className="type-data text-text-3 text-[0.8125rem]">
                  {item.duration}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {also && (
        <div className="reveal border-line mt-4 flex flex-col gap-3 rounded-md border px-5 py-4 md:flex-row md:items-center md:gap-8 lg:px-7">
          <p className="type-label text-text-3">{also.label}</p>
          <ul className="flex flex-col gap-2 md:flex-row md:gap-6">
            {also.items.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="group type-data text-text-2 hover:text-text inline-flex items-center gap-1.5 transition-colors"
                >
                  {item.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
