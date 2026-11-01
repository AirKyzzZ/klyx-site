import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { AutomationExamples } from "@/components/offer-blocks/automation-examples";
import { Section, SectionHeading } from "@/components/section";
import { CaseCard } from "@/components/sections/case-grid";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { OfferHero } from "@/components/sections/offer-hero";
import { OfferLedger } from "@/components/sections/offer-ledger";
import { ProcessLine } from "@/components/sections/process-line";
import {
  messageKeys,
  messageList,
  messageStrings,
  type Translate,
} from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCaseStudies } from "@/lib/content";
import { trailPageJsonLd } from "@/lib/json-ld";
import { getOfferCopy } from "@/lib/offer-copy";
import { getPriceValues } from "@/lib/offers";
import { getSiteShot } from "@/lib/proof";
import type { SectorPageConfig } from "@/lib/sector-pages";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

type SectionId =
  | "problems"
  | "workflows"
  | "data"
  | "terms"
  | "process"
  | "proof"
  | "pricing"
  | "faq";

const outlineLink =
  "group border-line-strong text-text hover:bg-surface-2 inline-flex h-11 items-center gap-2 rounded-sm border px-4.5 text-[0.9375rem] font-medium transition-colors duration-(--d-fast)";

export async function buildSectorMetadata(
  config: SectorPageConfig,
  locale: Locale,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `meta.${config.key}` });
  return buildMetadata({
    locale,
    pathname: config.pathname,
    title: t("title"),
    description: t("description", getPriceValues(locale)),
  });
}

export async function SectorPage({
  config,
  locale,
}: {
  config: SectorPageConfig;
  locale: Locale;
}) {
  const t = (await getTranslations({
    locale,
    namespace: config.namespace,
  })) as Translate;
  const labels = await getTranslations({
    locale,
    namespace: "useCases.labels",
  });
  const eyebrows = await getTranslations({
    locale,
    namespace: "useCases.eyebrows",
  });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const offersT = (await getTranslations({
    locale,
    namespace: "offers",
  })) as Translate;
  const casesT = await getTranslations({ locale, namespace: "cases.labels" });
  const prices = getPriceValues(locale);
  const faq = messageList(t, "faq.items", ["question", "answer"], prices);
  const tiers = config.offers.map((id) => getOfferCopy(offersT, locale, id));
  const proof = config.proof;
  const cases =
    proof.kind === "cases"
      ? (await getCaseStudies(locale)).filter((study) =>
          proof.slugs.includes(study.slug),
        )
      : [];
  const firstShot = cases
    .map((study) => getSiteShot(study.slug))
    .find((shot) => shot !== null);

  const sections = (
    [
      "problems",
      "workflows",
      "data",
      config.terms && "terms",
      config.terms && "process",
      "proof",
      "pricing",
      "faq",
    ] as const
  ).filter((id): id is SectionId => Boolean(id));
  const section = (id: SectionId) => ({
    index: String(sections.indexOf(id) + 1).padStart(2, "0"),
    eyebrow: eyebrows(id),
  });

  return (
    <>
      <JsonLd
        data={trailPageJsonLd({
          locale,
          trail: [
            { name: nav("useCases"), pathname: "/cas-usage" },
            { name: nav(config.key), pathname: config.pathname },
          ],
          offerIds: config.offers,
          faq,
        })}
      />

      <OfferHero
        locale={locale}
        breadcrumbLabel={labels("breadcrumb")}
        trail={[{ href: "/cas-usage", label: nav("useCases") }]}
        current={nav(config.key)}
        anchorPrice={getOfferCopy(offersT, locale, config.anchor).price}
        title={t("hero.title")}
        emphasis={t("hero.titleEmphasis")}
        serif={t("hero.serif")}
        subtitle={t("hero.subtitle", prices)}
        primaryLabel={t("hero.ctaPrimary")}
        secondaryLabel={t("hero.ctaSecondary")}
        scenario={config.scenario}
      />

      <Section {...section("problems")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="reveal lg:col-span-8">
            <SectionHeading
              lead={t("problems.title")}
              rest={t("problems.titleEmphasis")}
              className="max-w-[28ch]"
            />
            <p className="text-text-2 mt-8 max-w-[62ch]">
              {t("problems.body")}
            </p>
          </div>
          <aside className="reveal border-line self-end border-t pt-5 lg:col-span-3 lg:col-start-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <p className="type-label text-text-3">{labels("symptoms")}</p>
            <ul className="type-data mt-4 space-y-3">
              {messageStrings(t, "problems.items").map((item, i) => (
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
        {...section("workflows")}
        namespace={`${config.namespace}.workflows`}
        labels={{
          human: labels("human"),
          tools: labels("tools"),
          illustration: config.illustrated ? labels("illustration") : undefined,
        }}
      />

      <Section {...section("data")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="reveal space-y-6 lg:col-span-5">
            <SectionHeading
              lead={t("data.title")}
              rest={t("data.titleEmphasis")}
            />
            <p className="text-text-2 max-w-[48ch]">{t("data.body")}</p>
          </div>
          <dl className="reveal border-line bg-surface-1 shadow-card self-start rounded-md border lg:col-span-6 lg:col-start-7">
            {messageKeys(t.raw("data.rows")).map((row) => (
              <div
                key={row}
                className="border-line grid gap-1 border-t px-5 py-4 first:border-t-0 sm:grid-cols-[12ch_1fr] sm:gap-4 lg:px-7"
              >
                <dt className="type-label text-text-3 sm:pt-0.5">
                  {t(`data.rows.${row}.label`)}
                </dt>
                <dd className="text-text text-[0.9375rem] leading-snug">
                  {t(`data.rows.${row}.value`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {config.terms && (
        <Section {...section("terms")}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="reveal space-y-6 lg:col-span-5">
              <SectionHeading
                lead={t("terms.title")}
                rest={t("terms.titleEmphasis")}
              />
              <p className="text-text-2 max-w-[44ch]">{t("terms.body")}</p>
            </div>
            <table className="reveal type-data w-full self-start lg:col-span-6 lg:col-start-7">
              <tbody>
                {messageStrings(t, "terms.items").map((term, i) => (
                  <tr
                    key={term}
                    className="border-line border-b first:border-t"
                  >
                    <td className="text-accent w-10 py-3.5 align-top">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="text-text py-3.5">{term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {config.terms && (
        <ProcessLine
          {...section("process")}
          title={t("process.title")}
          emphasis={t("process.titleEmphasis")}
          steps={messageList(t, "process.steps", ["title", "body"])}
        />
      )}

      <Section {...section("proof")}>
        <div
          className={cn(
            "reveal relative grid gap-10 lg:grid-cols-12 lg:gap-6",
            cases.length > 0 && "tone-sand rounded-xl p-6 md:p-10 lg:p-12",
          )}
        >
          <div
            className={cn(
              "content-start space-y-6",
              cases.length > 1 ? "lg:col-span-7" : "lg:col-span-5",
            )}
          >
            <SectionHeading
              lead={t("proof.title")}
              rest={t("proof.titleEmphasis")}
            />
            <p className="text-text-2 max-w-[48ch]">{t("proof.body")}</p>
            <Link
              href={proof.kind === "none" ? proof.href : "/realisations"}
              className={cn(
                outlineLink,
                cases.length > 0 && "border-ink/20 hover:bg-sand-200",
              )}
            >
              {t("proof.link")}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          {cases.length > 0 && (
            <ul
              className={cn(
                "grid gap-x-6 gap-y-12",
                cases.length > 1
                  ? "md:grid-cols-2 lg:col-span-12"
                  : "lg:col-span-6 lg:col-start-7",
              )}
            >
              {cases.map((study) => (
                <li key={study.slug}>
                  <CaseCard
                    item={study}
                    readLabel={casesT("read")}
                    sizes="(min-width: 1024px) 540px, 90vw"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section {...section("pricing")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="reveal space-y-6 lg:col-span-5">
            <SectionHeading
              lead={t("pricing.title")}
              rest={t("pricing.titleEmphasis")}
            />
            <p className="text-text-2 max-w-[48ch]">
              {t("pricing.body", prices)}
            </p>
          </div>
          <div className="reveal lg:col-span-6 lg:col-start-7">
            <OfferLedger
              rows={tiers}
              labels={{
                offer: labels("offer"),
                duration: labels("duration"),
                price: labels("amount"),
              }}
              caption={offersT("vatNote")}
            />
            <Link
              href="/tarifs"
              className="group text-text-2 hover:text-text mt-6 inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              {t("pricing.link")}
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </Section>

      <Faq
        {...section("faq")}
        title={t("faq.title")}
        emphasis={t("faq.titleEmphasis")}
        items={faq}
        bookLabel={t("cta.ctaPrimary")}
        openFirst
      />

      <Cta
        title={t("cta.title")}
        emphasis={t("cta.titleEmphasis")}
        body={t("cta.body")}
        primary={{ action: "book", label: t("cta.ctaPrimary") }}
        secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
        shot={firstShot ?? null}
      />
    </>
  );
}
