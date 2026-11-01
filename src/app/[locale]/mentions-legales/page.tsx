import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { LegalArticle, LegalSection } from "@/components/legal-section";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { CREDITS } from "@/lib/credits";
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
    <LegalArticle title={t("title")} updated={t("updated", { date: updated })}>
      <LegalSection id="editeur" title={t("publisher.title")}>
        <p>{t("publisher.body")}</p>
        <p>{t("publisher.siret", { siret: site.siret })}</p>
        <p>{t("publisher.email", { email: site.email })}</p>
        <p>{t("publisher.director")}</p>
      </LegalSection>
      <LegalSection id="hebergement" title={t("hosting.title")}>
        <p>{t("hosting.body")}</p>
      </LegalSection>
      <LegalSection id="propriete-intellectuelle" title={t("ip.title")}>
        <p>{t("ip.body")}</p>
      </LegalSection>
      <LegalSection id="credits" title={t("credits.title")}>
        <p>{t("credits.trademarks")}</p>
        <ul className="list-disc space-y-2 pl-5">
          {CREDITS.map((credit) => (
            <li key={credit.key}>
              {t(`credits.items.${credit.key}`)}{" "}
              <a
                href={credit.source}
                className="text-text underline underline-offset-4"
              >
                {t("credits.source")}
              </a>
              {credit.license && (
                <>
                  {", "}
                  <a
                    href={credit.license}
                    className="text-text underline underline-offset-4"
                  >
                    {t("credits.license")}
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
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
  );
}
