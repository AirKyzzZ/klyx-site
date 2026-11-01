import type { Metadata } from "next";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { BrowserFrame, hostOf } from "@/components/proof/browser-frame";
import { Section, SectionHeading } from "@/components/section";
import { Cta } from "@/components/sections/cta";
import {
  FactRows,
  RosterWindow,
  TerminalWindow,
} from "@/components/sections/founder";
import { Hero } from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { messageKeys, messageList } from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { personJsonLd } from "@/lib/json-ld";
import { getSiteShot } from "@/lib/proof";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { teamRoster } from "@/lib/team-roster";

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
  const facts = messageList(t, "facts.items", ["label", "value"]);
  const trustValues = {
    github: site.socials.github.replace("https://", ""),
  };
  const trustKeys = messageKeys(t.raw("trust.items"));
  const sisterText: Partial<
    Record<(typeof site.sisterSites)[number]["name"], string>
  > = {
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
            <TerminalWindow
              title={t("info.window")}
              command={t("info.command")}
            >
              <FactRows
                rows={facts.map((fact) => ({
                  key: fact.label,
                  value: fact.value,
                }))}
              />
            </TerminalWindow>
            <figcaption className="type-label text-text-3 mt-4">
              {t("info.caption")}
            </figcaption>
          </figure>
        }
      />

      <Section index="01" eyebrow={t("eyebrows.team")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="reveal lg:col-span-5 lg:pt-3">
            <RosterWindow {...teamRoster(founder, "roster")} />
          </div>
          <div className="reveal lg:col-span-6 lg:col-start-7">
            <SectionHeading
              lead={t("team.title")}
              rest={t("team.titleEmphasis")}
            />
            <div className="mt-8 max-w-[58ch] space-y-5">
              <p className="type-lead text-text">{t("team.intro")}</p>
              <p className="text-text-2">{t("team.agents")}</p>
              <p className="text-text-2">{t("team.partners")}</p>
              <p className="text-text-2">{t("team.handover")}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section index="02" eyebrow={t("eyebrows.story")}>
        <div className="reveal grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="lg:col-span-7">
            <SectionHeading
              lead={t("story.title")}
              rest={t("story.titleEmphasis")}
            />
            <div className="mt-8 max-w-[62ch] space-y-5">
              <p className="type-lead text-text">{t("story.intro")}</p>
              <p className="text-text-2">{t("story.work")}</p>
              <p className="text-text-2">{t("story.citeme")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:col-start-9">
            <Button variant="secondary" size="lg" asChild>
              <a href={site.socials.github} target="_blank" rel="noopener">
                {founder("github")} <ArrowUpRight />
              </a>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a
                href={site.socials.linkedinFounder}
                target="_blank"
                rel="noopener"
              >
                {founder("linkedin")} <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </Section>

      <Section index="03" eyebrow={t("eyebrows.products")}>
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
                  {sisterText[sister.name] && (
                    <p className="text-text-2 mt-2 text-[0.9375rem] leading-normal">
                      {sisterText[sister.name]}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section index="04" eyebrow={t("eyebrows.trust")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="reveal lg:col-span-7">
            <SectionHeading
              lead={t("trust.title")}
              rest={t("trust.titleEmphasis")}
            />
            <p className="text-text-2 mt-6 max-w-[62ch]">{t("trust.body")}</p>
          </div>
          <div className="reveal lg:col-span-4 lg:col-start-9 lg:pt-3">
            <dl className="border-line bg-surface-1 shadow-card rounded-md border p-5 lg:p-7">
              {trustKeys.map((key) => {
                const value = t(`trust.items.${key}.value`, trustValues);
                return (
                  <div
                    key={key}
                    className="border-line border-t pt-4 not-first:mt-4 first:border-t-0 first:pt-0"
                  >
                    <dt className="type-label text-text-3">
                      {t(`trust.items.${key}.label`)}
                    </dt>
                    <dd className="type-data text-text mt-1.5">
                      {key === "code" && (
                        <a
                          href={site.socials.github}
                          target="_blank"
                          rel="noopener"
                          className="hover:text-text-2 inline-flex items-center gap-1.5 transition-colors"
                        >
                          {value}
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-3.5"
                          />
                        </a>
                      )}
                      {key === "prices" && (
                        <Link
                          href="/tarifs"
                          className="hover:text-text-2 inline-flex items-center gap-1.5 transition-colors"
                        >
                          {value}
                          <ArrowRight aria-hidden="true" className="size-3.5" />
                        </Link>
                      )}
                      {key !== "code" && key !== "prices" && value}
                    </dd>
                  </div>
                );
              })}
            </dl>
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
