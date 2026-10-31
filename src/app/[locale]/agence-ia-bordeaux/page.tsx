import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Hero, HeroList } from "@/components/sections/hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { Statement } from "@/components/sections/statement";
import { messageList, messageStrings } from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getPriceValues } from "@/lib/offers";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.bordeaux" });
  return { title: { absolute: t("title") }, description: t("description") };
}

export default async function BordeauxPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "bordeaux" });
  const prices = getPriceValues(locale);

  return (
    <>
      <Background>
        <Hero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          emphasis={t("hero.titleEmphasis")}
          subtitle={t("hero.subtitle")}
          primary={{ action: "book", label: t("hero.ctaPrimary") }}
          secondary={{ action: "quote", label: t("hero.ctaSecondary") }}
          aside={
            <div className="space-y-5">
              <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {t("examples.title")}
              </h2>
              <HeroList
                items={messageStrings(t, "examples.items").map((item) => ({
                  title: item,
                }))}
              />
            </div>
          }
        />
      </Background>

      <Statement
        rows={[{ title: t("problem.title"), paragraphs: [t("problem.body")] }]}
      />

      <ProcessSteps
        title={t("process.title")}
        steps={messageList(t, "process.steps", ["title", "body"])}
      />

      <Statement
        className="pt-0 lg:pt-0"
        rows={[
          { title: t("local.title"), paragraphs: [t("local.body")] },
          { title: t("trust.title"), paragraphs: [t("trust.body")] },
        ]}
      />

      <Background variant="bottom">
        <Faq
          title={t("faq.title")}
          items={messageList(t, "faq.items", ["question", "answer"], prices)}
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
