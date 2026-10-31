import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { LegalSection } from "@/components/legal-section";
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
    <Background>
      <article className="container max-w-2xl space-y-12 pt-36 pb-28 lg:pt-48 lg:pb-32">
        <header className="space-y-4">
          <h1 className="text-4xl tracking-tight md:text-5xl">{t("title")}</h1>
          <p className="text-muted-foreground font-mono text-xs">
            {t("updated", { date: updated })}
          </p>
        </header>

        <LegalSection title={t("publisher.title")}>
          <p>{t("publisher.body")}</p>
          <p>{t("publisher.siret", { siret: site.siret })}</p>
          <p>{t("publisher.vat")}</p>
          <p>{t("publisher.email", { email: site.email })}</p>
          <p>{t("publisher.director")}</p>
        </LegalSection>
        <LegalSection title={t("hosting.title")}>
          <p>{t("hosting.body")}</p>
        </LegalSection>
        <LegalSection title={t("ip.title")}>
          <p>{t("ip.body")}</p>
        </LegalSection>
        <LegalSection title={t("data.title")}>
          <p>{t("data.body")}</p>
          <p>
            <Link
              href="/confidentialite"
              className="text-foreground underline underline-offset-4"
            >
              {t("data.link")}
            </Link>
          </p>
        </LegalSection>
      </article>
    </Background>
  );
}
