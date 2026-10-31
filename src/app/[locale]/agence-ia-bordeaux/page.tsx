import type { CSSProperties } from "react";

import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { EmphasisTitle } from "@/components/emphasis-title";
import { GirondeMap } from "@/components/gironde-map";
import { AutomationExamples } from "@/components/offer-blocks/automation-examples";
import { Section, SectionHeading } from "@/components/section";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { ProcessLine } from "@/components/sections/process-line";
import { messageList, messageStrings } from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getPriceValues } from "@/lib/offers";
import { buildMetadata } from "@/lib/seo";

const LOCAL_FACTS = ["city", "zone", "travel"] as const;

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.bordeaux" });
  return buildMetadata({
    locale,
    pathname: "/agence-ia-bordeaux",
    title: t("title"),
    description: t("description"),
  });
}

export default async function BordeauxPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "bordeaux" });
  const prices = getPriceValues(locale);

  return (
    <>
      <section className="relative pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="container">
          <div className="lg:border-line-strong relative isolate lg:flex lg:min-h-[600px] lg:items-center lg:overflow-hidden lg:rounded-xl lg:border lg:shadow-[0_0_0_1px_var(--line),0_40px_160px_-40px_var(--glow)] lg:after:absolute lg:after:inset-0 lg:after:-z-1 lg:after:bg-[url(/textures/grain.png)] lg:after:bg-size-[128px] lg:after:mix-blend-overlay">
            <div className="relative lg:flex lg:h-full lg:w-[52%] lg:flex-col lg:justify-center lg:bg-[linear-gradient(90deg,rgb(20_20_20/0.94)_0%,rgb(20_20_20/0.88)_72%,rgb(20_20_20/0))] lg:py-12 lg:pr-16 lg:pl-12">
              <p className="hero-in type-label text-text-3" style={delay(0)}>
                {t("hero.eyebrow")}
              </p>
              <h1 className="type-h1 mt-4 max-w-[16ch]">
                <EmphasisTitle
                  title={t("hero.title")}
                  emphasis={t("hero.titleEmphasis")}
                  serif={t("hero.serif")}
                />
              </h1>
              <p
                className="hero-in type-lead text-text-2 mt-5 max-w-[46ch]"
                style={delay(0.15)}
              >
                {t("hero.subtitle")}
              </p>
              <div
                className="hero-in mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
                style={delay(0.3)}
              >
                <ActionButton
                  action="book"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {t("hero.ctaPrimary")}
                </ActionButton>
                <ActionButton
                  action="quote"
                  variant="secondary"
                  size="lg"
                  className="bg-bg/40 w-full sm:w-auto"
                >
                  {t("hero.ctaSecondary")}
                  <ArrowRight />
                </ActionButton>
              </div>
            </div>
            <picture>
              <source
                type="image/avif"
                srcSet="/backdrop/bordeaux-800.avif 800w, /backdrop/bordeaux-1600.avif 1600w"
                sizes="(min-width: 1280px) 1168px, 100vw"
              />
              <source
                type="image/webp"
                srcSet="/backdrop/bordeaux-800.webp 800w, /backdrop/bordeaux-1600.webp 1600w"
                sizes="(min-width: 1280px) 1168px, 100vw"
              />
              <img
                src="/backdrop/bordeaux-800.webp"
                alt=""
                width={1600}
                height={900}
                decoding="async"
                className="hero-in border-line-strong mt-10 aspect-[4/3] w-full rounded-lg border object-cover lg:absolute lg:inset-0 lg:-z-2 lg:mt-0 lg:aspect-auto lg:h-full lg:rounded-none lg:border-0"
                style={delay(0.45)}
              />
            </picture>
          </div>
        </div>
      </section>

      <Section index="01" eyebrow={t("eyebrows.problem")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="reveal lg:col-span-8">
            <SectionHeading
              lead={t("problem.title")}
              className="max-w-[28ch]"
            />
            <p className="text-text-2 mt-8 max-w-[62ch]">{t("problem.body")}</p>
          </div>
          <aside className="reveal border-line self-end border-t pt-5 lg:col-span-3 lg:col-start-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <p className="type-label text-text-3">{t("examples.title")}</p>
            <ul className="type-data mt-4 space-y-3">
              {messageStrings(t, "examples.items").map((item, i) => (
                <li key={item} className="text-text-2 flex gap-3">
                  <span className="text-text-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <AutomationExamples
        locale={locale}
        index="02"
        eyebrow={t("eyebrows.examples")}
      />

      <ProcessLine
        index="03"
        eyebrow={t("eyebrows.process")}
        title={t("process.title")}
        steps={messageList(t, "process.steps", ["title", "body"])}
      />

      <Section index="04" eyebrow={t("eyebrows.local")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div className="reveal lg:col-span-6">
            <SectionHeading lead={t("local.title")} />
            <p className="text-text-2 mt-6 max-w-[54ch]">{t("local.body")}</p>
            <dl className="border-line bg-surface-1 shadow-card mt-10 rounded-md border">
              {LOCAL_FACTS.map((key) => (
                <div
                  key={key}
                  className="border-line grid gap-1 border-t px-5 py-4 first:border-t-0 sm:grid-cols-[14ch_1fr] sm:gap-4 lg:px-7"
                >
                  <dt className="type-label text-text-3 sm:pt-0.5">
                    {t(`local.card.${key}.label`)}
                  </dt>
                  <dd className="type-data text-text">
                    {t(`local.card.${key}.value`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="reveal lg:col-span-5 lg:col-start-8">
            <GirondeMap
              label={t("local.map")}
              className="mx-auto h-auto w-full max-w-[360px]"
            />
          </div>
        </div>
      </Section>

      <Section index="05" eyebrow={t("eyebrows.trust")}>
        <div className="reveal grid gap-8 lg:grid-cols-12 lg:gap-6">
          <SectionHeading lead={t("trust.title")} className="lg:col-span-5" />
          <p className="text-text-2 max-w-[62ch] lg:col-span-6 lg:col-start-7">
            {t("trust.body")}
          </p>
        </div>
      </Section>

      <Faq
        index="06"
        eyebrow={t("eyebrows.faq")}
        title={t("faq.title")}
        items={messageList(t, "faq.items", ["question", "answer"], prices)}
        bookLabel={t("cta.ctaPrimary")}
        openFirst
      />

      <Cta
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ action: "book", label: t("cta.ctaPrimary") }}
        secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
      />
    </>
  );
}
