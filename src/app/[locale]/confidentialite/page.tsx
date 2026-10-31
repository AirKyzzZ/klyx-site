import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { LegalSection } from "@/components/legal-section";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { site } from "@/lib/site";

const SECTIONS = ["contactForm", "booking", "analytics", "hosting"] as const;

const PROSPECTION_PARAGRAPHS = [
  "intro",
  "legalBasis",
  "sources",
  "retention",
  "optOut",
] as const;

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.privacy" });
  return { title: { absolute: t("title") }, description: t("description") };
}

export default async function PrivacyPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "privacy" });
  const format = await getFormatter({ locale });
  const values = { email: site.email };
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
          <p className="text-muted-foreground leading-relaxed">
            {t("intro", values)}
          </p>
        </header>

        {SECTIONS.map((key) => (
          <LegalSection key={key} title={t(`${key}.title`)}>
            <p>{t(`${key}.body`)}</p>
          </LegalSection>
        ))}

        <LegalSection
          id={t("prospection.anchor")}
          title={t("prospection.title")}
        >
          {PROSPECTION_PARAGRAPHS.map((key) => (
            <p key={key}>{t(`prospection.${key}`, values)}</p>
          ))}
        </LegalSection>

        <LegalSection title={t("rights.title")}>
          <p>{t("rights.body", values)}</p>
        </LegalSection>
      </article>
    </Background>
  );
}
