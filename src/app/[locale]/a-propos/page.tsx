import type { Metadata } from "next";

import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { BrowserFrame, hostOf } from "@/components/proof/browser-frame";
import { Section, SectionHeading } from "@/components/section";
import { Cta } from "@/components/sections/cta";
import { IdentityWindow } from "@/components/sections/founder";
import { Hero } from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { messageList } from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { personJsonLd } from "@/lib/json-ld";
import { getSiteShot } from "@/lib/proof";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return buildMetadata({
    locale,
    pathname: "/a-propos",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "about" });
  const founder = await getTranslations({ locale, namespace: "home.founder" });
  const facts = messageList(t, "facts.items", ["label", "value"], {
    siret: site.siret,
  });
  const sisterText = {
    "Klyx Studio": t("lines.studio"),
    "Klyx Estate": t("lines.estate"),
  };
  const citeme = getSiteShot("citeme");

  return (
    <>
      <JsonLd data={personJsonLd()} />
      <Hero
        title={t("hero.title")}
        emphasis={t("hero.titleEmphasis")}
        serif={t("hero.serif")}
        subtitle={t("hero.subtitle")}
        primary={{ action: "book", label: t("cta.ctaPrimary") }}
        secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
        aside={
          <figure>
            <IdentityWindow
              rows={[
                { key: founder("card.name"), value: site.founder },
                { key: founder("card.base"), value: founder("card.city") },
                { key: founder("card.siret"), value: site.siret },
                {
                  key: founder("card.github"),
                  value: site.socials.github.replace("https://", ""),
                },
              ]}
            />
            <figcaption className="type-label text-text-3 mt-4">
              {founder("caption")}
            </figcaption>
          </figure>
        }
      />

      <Section index="01" eyebrow={t("eyebrows.story")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="reveal lg:col-span-7">
            <SectionHeading lead={t("story.title")} />
            <div className="mt-8 max-w-[62ch] space-y-5">
              <p className="type-lead text-text">{t("story.intro")}</p>
              <p className="text-text-2">{t("story.work")}</p>
              <p className="text-text-2">{t("story.citeme")}</p>
            </div>
          </div>
          <div className="reveal lg:col-span-4 lg:col-start-9 lg:pt-3">
            <div className="border-line bg-surface-1 shadow-card rounded-md border p-5 lg:p-7">
              <h3 className="type-label text-text-3">{t("facts.title")}</h3>
              <dl className="mt-5 space-y-4">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="border-line border-t pt-4 first:border-t-0 first:pt-0"
                  >
                    <dt className="type-label text-text-3">{fact.label}</dt>
                    <dd className="type-data text-text mt-1.5">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      <Section index="02" eyebrow={t("eyebrows.products")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="reveal lg:col-span-7">
            <SectionHeading lead={founder("products")} />
            {citeme && (
              <a
                href={citeme.url}
                target="_blank"
                rel="noopener"
                className="group mt-10 block"
              >
                <BrowserFrame
                  url={citeme.url}
                  image={citeme.image}
                  alt={hostOf(citeme.url)}
                  sizes="(min-width: 1024px) 680px, 90vw"
                  className="transition-transform duration-(--d-ui) ease-(--ease-out) group-hover:-translate-y-1"
                />
              </a>
            )}
          </div>
          <div className="reveal lg:col-span-4 lg:col-start-9 lg:self-end">
            <h3 className="type-h3">{t("lines.title")}</h3>
            <ul className="border-line mt-6 border-t">
              {site.sisterSites.map((sister) => (
                <li key={sister.url} className="border-line border-b py-5">
                  <a
                    href={sister.url}
                    target="_blank"
                    rel="noopener"
                    className="type-data text-text hover:text-text-2 inline-flex items-center gap-1.5 transition-colors"
                  >
                    {new URL(sister.url).host}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </a>
                  <p className="text-text-2 mt-2 text-[0.9375rem] leading-normal">
                    {sisterText[sister.name]}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section index="03" eyebrow={t("eyebrows.trust")}>
        <div className="reveal grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="lg:col-span-7">
            <SectionHeading lead={t("trust.title")} />
            <p className="text-text-2 mt-6 max-w-[62ch]">{t("trust.body")}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:col-start-9">
            <Button variant="secondary" size="lg" asChild>
              <a href={site.socials.github} target="_blank" rel="noopener">
                {t("links.github")} <ArrowUpRight />
              </a>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a
                href={site.socials.linkedinFounder}
                target="_blank"
                rel="noopener"
              >
                {t("links.linkedin")} <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </Section>

      <Cta
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ action: "book", label: t("cta.ctaPrimary") }}
        secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
      />
    </>
  );
}
