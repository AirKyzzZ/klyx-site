import type { Translate } from "@/i18n/message-list";
import type { Locale } from "@/i18n/routing";

import { formatPrice, getOffer, type OfferId } from "./offers";

export function getOfferCopy(t: Translate, locale: Locale, id: OfferId) {
  const offer = getOffer(id);
  const path = `items.${offer.durationKey}`;
  return {
    id,
    key: offer.durationKey,
    href: offer.page,
    name: t(`${path}.name`),
    summary: t(`${path}.summary`),
    duration: t(`${path}.duration`),
    price: offerPriceLabel(t, locale, id),
  };
}

function offerPriceLabel(t: Translate, locale: Locale, id: OfferId) {
  const offer = getOffer(id);
  if (offer.priceFrom === null) return t(`items.${offer.durationKey}.price`);
  const amount = formatPrice(offer.priceFrom, locale);
  if (offer.unit === "day") {
    return t("priceFrom", { price: t("perDay", { price: amount }) });
  }
  if (offer.unit === "month") {
    return t("priceFrom", { price: t("perMonth", { price: amount }) });
  }
  return t("priceFrom", { price: amount });
}
