import { getTranslations } from "next-intl/server";

import { SiteNav } from "./site-nav";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const cards = await getTranslations("home.offers.cards");

  return (
    <header>
      <SiteNav
        homeLabel={t("home")}
        offersLabel={t("offers")}
        offers={[
          {
            href: "/services/creation-site-web",
            title: t("sites"),
            description: cards("sites.outcome"),
          },
          {
            href: "/services/agents-ia",
            title: t("agents"),
            description: cards("agents.outcome"),
          },
          {
            href: "/forward-deployed-engineer",
            title: t("fde"),
            description: cards("fde.outcome"),
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
