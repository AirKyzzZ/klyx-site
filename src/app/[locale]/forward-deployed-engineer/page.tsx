import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { Button } from "@/components/ui/button";
import { Cta } from "@/components/sections/cta";
import { JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/sections/faq";
import { Hero, HeroList } from "@/components/sections/hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { Statement } from "@/components/sections/statement";
import { messageList, messageStrings } from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getPriceValues } from "@/lib/offers";
import { offerPageJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.fde" });
  return buildMetadata({
    locale,
    pathname: "/forward-deployed-engineer",
    title: t("title"),
    description: t("description", getPriceValues(locale)),
  });
}

export default async function FdePage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "fde" });
  const prices = getPriceValues(locale);
  const faq = messageList(t, "faq.items", ["question", "answer"], prices);
  const terms = messageStrings(t, "terms.items", prices);

  return (
    <>
      <JsonLd
        data={offerPageJsonLd({
          locale,
          pathname: "/forward-deployed-engineer",
          navKey: "fde",
          offerIds: ["fde"],
          faq,
        })}
      />
      <Background>
        <Hero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          emphasis={t("hero.titleEmphasis")}
          subtitle={t("hero.subtitle", prices)}
          primary={{ action: "book", label: t("hero.ctaPrimary") }}
          secondary={{ action: "quote", label: t("hero.ctaSecondary") }}
          aside={<HeroList items={terms.map((term) => ({ title: term }))} />}
        />
      </Background>

      <Statement
        rows={[
          { title: t("definition.title"), paragraphs: [t("definition.body")] },
          { title: t("audience.title"), paragraphs: [t("audience.body")] },
          {
            title: t("deliverables.title"),
            items: messageStrings(t, "deliverables.items"),
          },
          { title: t("limits.title"), paragraphs: [t("limits.body")] },
        ]}
      />

      <ProcessSteps
        title={t("process.title")}
        steps={messageList(t, "process.steps", ["title", "body"])}
      />

      <Statement
        className="pt-0 lg:pt-0"
        rows={[
          {
            title: t("proof.title"),
            paragraphs: [t("proof.body")],
            children: (
              <Button variant="secondary" className="shadow-md" asChild>
                <a href={site.socials.github} target="_blank" rel="noopener">
                  {t("proof.link")}
                </a>
              </Button>
            ),
          },
        ]}
      />

      <Background variant="bottom">
        <Faq
          title={t("faq.title")}
          items={faq}
          bookLabel={t("cta.ctaPrimary")}
        />
        <Cta
          title={t("cta.title")}
          body={t("cta.body")}
          primary={{ action: "book", label: t("cta.ctaPrimary") }}
          secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
        />
      </Background>
    </>
  );
}
