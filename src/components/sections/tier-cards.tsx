import type { ReactNode } from "react";

import { Check, Clock } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { OfferRow } from "@/components/ui-kit/offer-card";
import { Link } from "@/i18n/navigation";
import type { OfferPathname } from "@/lib/offer-pages";
import { cn } from "@/lib/utils";

export type Tier = {
  id: string;
  name: string;
  audience: string;
  summary: string;
  priceLabel?: string;
  price: string;
  unit?: string;
  duration: string;
  features: string[];
  href?: OfferPathname;
};

export function FeatureList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="text-text-2 flex gap-2.5 text-[0.9375rem] leading-snug"
        >
          <span
            aria-hidden="true"
            className="bg-surface-2 text-ui-ok mt-px grid size-[18px] shrink-0 place-items-center rounded-full"
          >
            <Check className="size-[11px]" strokeWidth={2.5} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function PriceBlock({
  label,
  price,
  unit,
  duration,
}: {
  label?: string;
  price: string;
  unit?: string;
  duration: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <p className="text-text-3 text-[0.8125rem]">{label}</p>}
      <p className="text-text flex flex-wrap items-baseline text-[1.875rem] leading-none font-semibold tracking-[-1px]">
        {price}
        {unit && (
          <span className="text-text-2 ml-1 text-[0.9375rem] font-normal tracking-normal">
            {unit}
          </span>
        )}
      </p>
      <p className="text-text-2 flex items-center gap-1.5 pt-1.5 text-sm">
        <Clock aria-hidden="true" className="size-3.5 shrink-0" />
        {duration}
      </p>
    </div>
  );
}

function TierCard({
  tier,
  quoteLabel,
  seeOfferLabel,
}: {
  tier: Tier;
  quoteLabel: string;
  seeOfferLabel: string;
}) {
  return (
    <article data-tier-card className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-text text-[1.375rem] leading-tight font-semibold tracking-[-0.5px]">
          {tier.name}
        </h3>
        <p className="text-text text-base leading-[1.4] font-medium">
          {tier.audience}
        </p>
        <p className="text-text-2 text-[0.9375rem] leading-normal">
          {tier.summary}
        </p>
      </div>
      <PriceBlock
        label={tier.priceLabel}
        price={tier.price}
        unit={tier.unit}
        duration={tier.duration}
      />
      <FeatureList
        items={tier.features}
        className="border-line flex-1 border-t pt-5"
      />
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <ActionButton
          trackLocation="offer_page"
          action="quote"
          variant="outline"
          className="h-10 rounded-[10px] px-4"
        >
          {quoteLabel}
        </ActionButton>
        {tier.href && (
          <Link
            href={tier.href}
            className="text-accent hover:text-accent-hover text-sm font-medium underline decoration-1 underline-offset-[3px]"
          >
            {seeOfferLabel}
          </Link>
        )}
      </div>
    </article>
  );
}

export function TierCards({
  tiers,
  quoteLabel,
  seeOfferLabel,
  className,
}: {
  tiers: Tier[];
  quoteLabel: string;
  seeOfferLabel: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      data-track-view="pricing_view"
      data-track-location="offer_page"
    >
      <OfferRow>
        {tiers.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            quoteLabel={quoteLabel}
            seeOfferLabel={seeOfferLabel}
          />
        ))}
      </OfferRow>
    </div>
  );
}

export function TermsCard({
  name,
  audience,
  features,
  termsTitle,
  terms,
  action,
  className,
}: {
  name: string;
  audience: string;
  features: string[];
  termsTitle: string;
  terms: string[];
  action: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-line bg-surface-1 divide-line grid overflow-hidden rounded-[16px] border max-lg:divide-y lg:grid-cols-2 lg:divide-x",
        className,
      )}
      data-track-view="pricing_view"
      data-track-location="offer_page"
    >
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-text text-[1.375rem] leading-tight font-semibold tracking-[-0.5px]">
            {name}
          </h3>
          <p className="text-text text-base leading-[1.4] font-medium">
            {audience}
          </p>
        </div>
        <FeatureList items={features} className="flex-1" />
        <div>{action}</div>
      </div>
      <div className="flex flex-col gap-4 p-6 lg:p-8">
        <h3 className="text-text text-base font-semibold">{termsTitle}</h3>
        <ul className="divide-line border-line divide-y border-t">
          {terms.map((term) => (
            <li
              key={term}
              className="text-text py-3.5 text-[0.9375rem] leading-normal last:pb-0"
            >
              {term}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
