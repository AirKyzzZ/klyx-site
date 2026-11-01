import type { ReactNode } from "react";

import { ArrowRight, Plus } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { Section, SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import type { OfferPathname } from "@/lib/offer-pages";

const VISIBLE_FEATURES = 4;

export type Tier = {
  id: string;
  name: string;
  price: string;
  duration: string;
  summary: string;
  features: string[];
  highlighted: boolean;
  href?: OfferPathname;
};

type TierCardsProps = {
  index: string;
  eyebrow: string;
  title: string;
  emphasis?: string;
  subtitle?: string;
  tiers: Tier[];
  quoteLabel: string;
  seeOfferLabel: string;
  moreLabel: (count: number) => string;
  footnote: string;
  children?: ReactNode;
};

export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((feature) => (
        <li key={feature} className="flex gap-2.5 text-[0.9375rem]">
          <Plus
            aria-hidden="true"
            className="text-text-3 mt-1 size-3.5 shrink-0"
          />
          <span className="text-text-2 leading-snug">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function TierCard({
  tier,
  position,
  quoteLabel,
  seeOfferLabel,
  moreLabel,
}: {
  tier: Tier;
  position: number;
  quoteLabel: string;
  seeOfferLabel: string;
  moreLabel: (count: number) => string;
}) {
  const visible = tier.features.slice(0, VISIBLE_FEATURES);
  const rest = tier.features.slice(VISIBLE_FEATURES);
  return (
    <article className="flex h-full flex-col p-5 lg:p-7">
      <p className="type-label text-text-3">
        <span className="text-text-2">{String(position).padStart(2, "0")}</span>{" "}
        / {tier.duration}
      </p>
      <h3 className="type-h3 mt-6">{tier.name}</h3>
      <p className="text-text-2 mt-2 max-w-[40ch] text-[0.9375rem] leading-normal">
        {tier.summary}
      </p>
      <p className="border-line type-data text-text mt-6 border-y py-4 text-[0.9375rem]">
        {tier.price}
      </p>
      <div className="mt-6 flex-1">
        <FeatureList items={visible} />
        {rest.length > 0 && (
          <>
            <div className="mt-2.5 hidden md:block">
              <FeatureList items={rest} />
            </div>
            <details className="mt-3 md:hidden">
              <summary className="type-label text-text-3 hover:text-text cursor-pointer list-none">
                + {moreLabel(rest.length)}
              </summary>
              <div className="mt-2.5">
                <FeatureList items={rest} />
              </div>
            </details>
          </>
        )}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <ActionButton
          action="quote"
          variant={tier.highlighted ? "primary" : "secondary"}
        >
          {quoteLabel}
        </ActionButton>
        {tier.href && (
          <Link
            href={tier.href}
            className="group text-text-2 hover:text-text inline-flex items-center gap-1.5 text-sm transition-colors duration-(--d-fast)"
          >
            {seeOfferLabel}
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>
    </article>
  );
}

export function TierCards({
  index,
  eyebrow,
  title,
  emphasis,
  subtitle,
  tiers,
  quoteLabel,
  seeOfferLabel,
  moreLabel,
  footnote,
  children,
}: TierCardsProps) {
  return (
    <Section index={index} eyebrow={eyebrow}>
      <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
        <SectionHeading
          lead={title}
          rest={emphasis}
          className="lg:col-span-7"
        />
        {subtitle && (
          <p className="text-text-2 max-w-[44ch] lg:col-span-4 lg:col-start-9">
            {subtitle}
          </p>
        )}
      </div>
      {children ?? (
        <ul className="reveal border-line-strong bg-surface-1 shadow-card mt-12 grid items-stretch overflow-hidden rounded-md border md:mt-16 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <li
              key={tier.id}
              className="border-line border-t first:border-t-0 lg:border-t-0 lg:border-l lg:first:border-l-0"
            >
              <TierCard
                tier={tier}
                position={i + 1}
                quoteLabel={quoteLabel}
                seeOfferLabel={seeOfferLabel}
                moreLabel={moreLabel}
              />
            </li>
          ))}
        </ul>
      )}
      <p className="type-label text-text-3 mt-6">{footnote}</p>
    </Section>
  );
}
