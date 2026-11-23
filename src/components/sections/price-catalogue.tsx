import type { ReactNode } from "react";

import { OfferCard } from "@/components/ui-kit/offer-card";
import type { Locale } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { getOfferCopy } from "@/lib/offer-copy";
import {
  type CatalogueEntry,
  formatPrice,
  getOffer,
  getOfferPrice,
  PRICE_CATALOGUE,
  type PriceGroupKey,
} from "@/lib/offers";
import { cn } from "@/lib/utils";

const COLUMNS: Record<number, string> = {
  1: "",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "sm:grid-cols-2",
};

export function PriceCatalogue({
  locale,
  notes,
  asides,
  className,
}: {
  locale: Locale;
  notes?: Partial<Record<PriceGroupKey, ReactNode>>;
  asides?: Partial<Record<PriceGroupKey, ReactNode>>;
  className?: string;
}) {
  const t = getStaticTranslator(locale, "pricing");

  return (
    <div className={cn("flex flex-col gap-14 lg:gap-16", className)}>
      {PRICE_CATALOGUE.map((group) => {
        const aside = asides?.[group.key];
        const cells = group.cards.length + (aside ? 1 : 0);
        return (
          <div key={group.key} data-price-group={group.key}>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
              <h3 className="text-text text-[1.625rem] leading-[1.15] font-semibold tracking-[-0.6px]">
                {t(`catalogue.groups.${group.key}`)}
              </h3>
              {notes?.[group.key] && (
                <p className="text-text-2 max-w-[460px] text-[0.9375rem] leading-normal">
                  {notes[group.key]}
                </p>
              )}
            </div>
            <div
              className={cn(
                "border-line bg-line mt-6 grid gap-px overflow-hidden rounded-[16px] border",
                COLUMNS[cells],
              )}
            >
              {group.cards.map((entry) => (
                <CatalogueCard key={entry.id} locale={locale} entry={entry} />
              ))}
              {aside}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CatalogueCard({
  locale,
  entry,
}: {
  locale: Locale;
  entry: CatalogueEntry;
}) {
  const t = getStaticTranslator(locale, "pricing");
  const home = getStaticTranslator(locale, "home");
  const offersT = getStaticTranslator(locale, "offers");
  const offer = getOffer(entry.id);
  const copy = getOfferCopy(offersT, locale, entry.id);
  const care = entry.care && getOfferCopy(offersT, locale, entry.care);

  return (
    <OfferCard
      as="h4"
      className="bg-surface-1"
      name={copy.name}
      audience={t(`catalogue.audience.${offer.durationKey}`)}
      body={copy.summary}
      priceLabel={home("offers.from")}
      price={formatPrice(getOfferPrice(entry.id), locale)}
      unit={
        offer.unit === "project"
          ? undefined
          : t(`catalogue.units.${offer.unit}`)
      }
      duration={copy.duration}
      href={offer.page}
      linkLabel={home("offers.link")}
      extra={
        care && (
          <div
            data-price-option
            className="bg-surface-2 flex flex-col gap-0.5 rounded-[12px] px-4 py-3"
          >
            <p className="text-text-3 text-[0.8125rem]">
              {t("catalogue.option")}
            </p>
            <p className="text-text text-sm font-medium">{care.name}</p>
            <p className="text-text-2 text-sm">{care.price}</p>
            <p className="text-text-3 text-[0.8125rem]">{care.duration}</p>
          </div>
        )
      }
    />
  );
}
