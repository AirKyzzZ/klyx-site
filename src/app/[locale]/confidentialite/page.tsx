import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { LegalArticle, LegalSection } from "@/components/legal-section";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const SECTIONS = [
  { key: "contactForm", id: "formulaire", paragraphs: ["body"] },
  { key: "booking", id: "rendez-vous", paragraphs: ["body"] },
  {
    key: "analytics",
    id: "cookies",
    paragraphs: ["body", "purpose", "retention", "optOut", "cookies"],
  },
  { key: "hosting", id: "hebergement", paragraphs: ["body"] },
] as const;

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
  return buildMetadata({
    locale,
    pathname: "/confidentialite",
    title: t("title"),
    description: t("description"),
  });
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
    <LegalArticle
      title={t("title")}
      updated={t("updated", { date: updated })}
      intro={t("intro", values)}
    >
      {SECTIONS.map(({ key, id, paragraphs }) => (
        <LegalSection key={key} id={id} title={t(`${key}.title`)}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{t(`${key}.${paragraph}`, values)}</p>
          ))}
        </LegalSection>
      ))}

      <LegalSection id={t("prospection.anchor")} title={t("prospection.title")}>
        {PROSPECTION_PARAGRAPHS.map((key) => (
          <p key={key}>{t(`prospection.${key}`, values)}</p>
        ))}
      </LegalSection>

      <LegalSection id="droits" title={t("rights.title")}>
        <p>{t("rights.body", values)}</p>
      </LegalSection>
    </LegalArticle>
  );
}
