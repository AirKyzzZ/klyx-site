import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { LegalArticle, LegalSection } from "@/components/legal-section";
import { Hero } from "@/components/sections/hero";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.legal" });
  return buildMetadata({
    locale,
    pathname: "/mentions-legales",
    title: t("title"),
    description: t("description"),
  });
}

export default async function LegalPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "legal" });
  const format = await getFormatter({ locale });
  const updated = format.dateTime(new Date(site.legalUpdatedAt), {
    dateStyle: "long",
  });

  return (
    <>
      <Hero title={t("title")} meta={t("updated", { date: updated })} />
      <LegalArticle>
        <LegalSection id="editeur" title={t("publisher.title")}>
          <p>{t("publisher.body")}</p>
          <p>{t("publisher.siret", { siret: site.siret })}</p>
          <p>{t("publisher.vat")}</p>
          <p>{t("publisher.email", { email: site.email })}</p>
          <p>{t("publisher.director")}</p>
        </LegalSection>
        <LegalSection id="hebergement" title={t("hosting.title")}>
          <p>{t("hosting.body")}</p>
        </LegalSection>
        <LegalSection id="propriete-intellectuelle" title={t("ip.title")}>
          <p>{t("ip.body")}</p>
        </LegalSection>
        <LegalSection id="donnees-personnelles" title={t("data.title")}>
          <p>{t("data.body")}</p>
          <p>
            <Link
              href="/confidentialite"
              className="text-text underline underline-offset-4"
            >
              {t("data.link")}
            </Link>
          </p>
        </LegalSection>
      </LegalArticle>
    </>
  );
}
