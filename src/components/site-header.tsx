import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { formatPrice, getOfferPrice } from "@/lib/offers";

import { SiteNav } from "./site-nav";

export async function SiteHeader() {
  const current = await getLocale();
  const locale = hasLocale(routing.locales, current)
    ? current
    : routing.defaultLocale;
  const t = await getTranslations("nav");
  const cards = await getTranslations("home.offers.cards");
  const prices = await getTranslations("offers");
  const from = (amount: number) =>
    prices("priceFrom", { price: formatPrice(amount, locale) });

  return (
    <header>
      <SiteNav
        homeLabel={t("home")}
        offersLabel={t("offers")}
        offerGroups={[
          {
            label: t("groupBuild"),
            items: [
              {
                href: "/services/creation-site-web",
                title: t("sites"),
                description: cards("sites.outcome"),
                price: from(getOfferPrice("landing")),
              },
              {
                href: "/services/agents-ia",
                title: t("agents"),
                description: cards("agents.outcome"),
                price: from(getOfferPrice("audit-ia")),
              },
            ],
          },
          {
            label: t("groupAdvise"),
            items: [
              {
                href: "/forward-deployed-engineer",
                title: t("fde"),
                description: cards("fde.outcome"),
                price: prices("perDay", {
                  price: formatPrice(getOfferPrice("fde"), locale),
                }),
              },
            ],
          },
        ]}
        links={[
          { href: "/realisations", label: t("cases") },
          { href: "/tarifs", label: t("pricing") },
          { href: "/a-propos", label: t("about") },
        ]}
        bookLabel={t("book")}
        openMenuLabel={t("openMenu")}
        closeMenuLabel={t("closeMenu")}
      />
    </header>
  );
}
