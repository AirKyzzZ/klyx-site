import { getTranslations } from "next-intl/server";

import { OfferCard, OfferRow } from "@/components/ui-kit/offer-card";
import type { Translate } from "@/i18n/message-list";
import type { Locale } from "@/i18n/routing";
import { getOfferCopy } from "@/lib/offer-copy";
import {
  formatPrice,
  getOffer,
  getOfferPrice,
  type OfferId,
} from "@/lib/offers";

export type PriceCardCopy = { id: OfferId; audience: string; body: string };

export async function PriceCards({
  locale,
  cards,
  labels,
  className,
}: {
  locale: Locale;
  cards: PriceCardCopy[];
  labels: { from: string; perDay: string; viewOffer: string };
  className?: string;
}) {
  const offersT = (await getTranslations({
    locale,
    namespace: "offers",
  })) as Translate;

  return (
    <OfferRow className={className}>
      {cards.map(({ id, audience, body }) => {
        const offer = getOffer(id);
        const copy = getOfferCopy(offersT, locale, id);
        return (
          <OfferCard
            key={id}
            name={copy.name}
            audience={audience}
            body={body}
            priceLabel={labels.from}
            price={formatPrice(getOfferPrice(id), locale)}
            unit={offer.unit === "day" ? labels.perDay : undefined}
            duration={copy.duration}
            href={offer.page}
            linkLabel={labels.viewOffer}
          />
        );
      })}
    </OfferRow>
  );
}
