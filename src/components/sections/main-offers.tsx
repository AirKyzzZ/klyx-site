import { FOUNDER_PHOTO } from "@/components/sections/founder-panel";
import { OfferCard, OfferRow } from "@/components/ui-kit/offer-card";
import {
  AgentIllustration,
  SiteIllustration,
  TeamIllustration,
} from "@/components/ui-kit/offer-illustrations";
import type { Locale } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { HOME_OFFER_CARDS } from "@/lib/home-sections";
import { formatPrice, getOfferPrice } from "@/lib/offers";

export function MainOffers({
  locale,
  as,
  className,
}: {
  locale: Locale;
  as?: "h2" | "h3";
  className?: string;
}) {
  const t = getStaticTranslator(locale, "home");
  const illustrations = {
    sites: <SiteIllustration domain={t("offers.art.domain")} />,
    agents: (
      <AgentIllustration
        from="gmail"
        to="hubspot"
        label={t("offers.art.agent")}
        caption={t("offers.art.agentCaption")}
      />
    ),
    fde: (
      <TeamIllustration
        photo={FOUNDER_PHOTO}
        caption={t("offers.art.teamCaption")}
      />
    ),
  };

  return (
    <OfferRow className={className}>
      {HOME_OFFER_CARDS.map(({ key, href, offer }) => (
        <OfferCard
          key={key}
          as={as}
          name={t(`offers.cards.${key}.name`)}
          audience={t(`offers.cards.${key}.audience`)}
          body={t(`offers.cards.${key}.body`)}
          priceLabel={t("offers.from")}
          price={t(`offers.cards.${key}.price`, {
            price: formatPrice(getOfferPrice(offer), locale),
          })}
          unit={key === "fde" ? t("offers.cards.fde.unit") : undefined}
          duration={t(`offers.cards.${key}.duration`)}
          href={href}
          linkLabel={t("offers.link")}
          illustration={illustrations[key]}
        />
      ))}
    </OfferRow>
  );
}
