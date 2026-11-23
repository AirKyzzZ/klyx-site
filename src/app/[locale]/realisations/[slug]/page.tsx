import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArrowUpRight } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { hostOf, ShotFrame } from "@/components/proof/shot-frame";
import { CaseStatusBadge } from "@/components/sections/case-grid";
import { caseProseComponents } from "@/components/sections/case-prose";
import { Button } from "@/components/ui/button";
import { CaseRow } from "@/components/ui-kit/case-row";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { SiteCta } from "@/components/ui-kit/site-cta";
import { Link } from "@/i18n/navigation";
import { resolvePageLocale } from "@/i18n/page-locale";
import { type Locale, routing } from "@/i18n/routing";
import { getCaseStudies, getCaseStudy } from "@/lib/content";
import { caseStudyJsonLd } from "@/lib/json-ld";
import { getSiteShot } from "@/lib/proof";
import { followingItems } from "@/lib/related-content";
import { brandedTitle, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

type CasePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  if (!hasLocale(routing.locales, params.locale)) return [];
  const cases = await getCaseStudies(params.locale);
  return cases.map((c) => ({ slug: c.slug }));
}

async function loadCase(locale: Locale, slug: string) {
  const cases = await getCaseStudies(locale);
  if (!cases.some((c) => c.slug === slug)) notFound();
  const study = await getCaseStudy(slug, locale);
  return { ...study, following: followingItems(cases, slug, 3) };
}

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const { slug } = await params;
  const { meta } = await loadCase(locale, slug);
  return buildMetadata({
    locale,
    pathname: "/realisations/[slug]",
    params: { slug },
    title: brandedTitle(meta.title),
    description: meta.summary,
    type: "article",
  });
}

export default async function CasePage({ params }: CasePageProps) {
  const locale = await resolvePageLocale(params);
  const { slug } = await params;
  const { meta, Content, following } = await loadCase(locale, slug);
  const t = await getTranslations({ locale, namespace: "cases" });
  const shot = getSiteShot(meta.slug);
  const liveUrl = meta.live === false ? null : meta.url;

  const facts = [
    { label: t("labels.client"), value: meta.client },
    { label: t("labels.year"), value: String(meta.year) },
    { label: t("labels.stack"), value: meta.stack.join(", ") },
    { label: t("labels.outcome"), value: t("labels.noOutcome") },
    ...(meta.status
      ? [{ label: t("labels.status"), value: t(`status.${meta.status}`) }]
      : []),
  ];

  return (
    <>
      <JsonLd data={caseStudyJsonLd(locale, meta)} />
      <PageSection
        id="hero"
        divider={false}
        containerClassName="pt-32 md:pt-40 lg:pt-44"
      >
        <SectionHeader as="h1" title={meta.title} intro={meta.summary}>
          {(meta.status || liveUrl) && (
            <div className="flex flex-wrap items-center gap-3">
              {meta.status && <CaseStatusBadge status={meta.status} />}
              {liveUrl && (
                <Button
                  variant="outline"
                  asChild
                  className="h-11 rounded-[10px] px-5"
                >
                  <a href={liveUrl} target="_blank" rel="noopener">
                    {t("labels.visit")}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </SectionHeader>
        <div
          data-shot="case-hero"
          className="bg-surface-2 border-line mt-12 flex items-end justify-center gap-6 overflow-hidden rounded-[20px] border px-5 pt-5 sm:px-10 sm:pt-10 lg:mt-16 lg:gap-10 lg:px-14 lg:pt-14"
        >
          <ShotFrame
            image={shot?.image ?? meta.image}
            alt={t("labels.shot", { name: meta.name })}
            sizes="(min-width: 1024px) 820px, 90vw"
            eager
            className="max-w-[880px] min-w-0 flex-1 rounded-b-none border-b-0"
          />
          {shot && (
            <ShotFrame
              device="mobile"
              image={`/realisations/${meta.slug}-390.png`}
              alt={t("labels.mobileShot", { name: meta.name })}
              sizes="240px"
              className="hidden w-[22%] max-w-60 shrink-0 rounded-b-none border-b-0 sm:block"
            />
          )}
        </div>
      </PageSection>

      <PageSection id="projet">
        <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,684px)] lg:justify-between lg:gap-16">
          <dl className="border-line bg-surface-1 flex flex-col self-start rounded-[16px] border px-6 py-2 lg:sticky lg:top-28">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="border-line flex flex-col gap-1 border-t py-4 first:border-t-0"
              >
                <dt className="text-text-3 text-[0.8125rem]">{fact.label}</dt>
                <dd className="text-text text-[0.9375rem]">{fact.value}</dd>
              </div>
            ))}
            {liveUrl && (
              <div className="border-line flex flex-col gap-1 border-t py-4">
                <dt className="text-text-3 text-[0.8125rem]">
                  {t("labels.url")}
                </dt>
                <dd className="text-[0.9375rem]">
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener"
                    className="text-text hover:text-accent inline-flex items-center gap-1 underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)"
                  >
                    {hostOf(liveUrl)}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <article data-shot="case-body">
            <Content components={caseProseComponents} />
          </article>
        </div>
      </PageSection>

      {meta.flow && (
        <PageSection id="captures">
          <SectionHeader title={meta.flow.title} intro={meta.flow.caption} />
          <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_200px]">
            {meta.flow.steps.map((step) => {
              const mobile = step.device === "mobile";
              return (
                <li key={step.image}>
                  <figure>
                    <ShotFrame
                      image={step.image}
                      alt={step.caption}
                      device={step.device}
                      sizes={
                        mobile ? "240px" : "(min-width: 1024px) 460px, 90vw"
                      }
                      className={cn(mobile && "mx-auto max-w-60 sm:mx-0")}
                    />
                    <figcaption className="text-text-2 mt-4 text-[0.9375rem] leading-normal">
                      {step.caption}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ol>
        </PageSection>
      )}

      {following.length > 0 && (
        <PageSection id="autres-projets">
          <SectionHeader title={t("labels.next")} intro={t("labels.nextIntro")}>
            <Button
              variant="outline"
              asChild
              className="h-11 self-start rounded-[10px] px-5"
            >
              <Link href="/realisations">{t("labels.all")}</Link>
            </Button>
          </SectionHeader>
          <div className="mt-8 flex flex-col">
            {following.map((item) => (
              <CaseRow
                key={item.slug}
                slug={item.slug}
                name={item.name}
                kind={item.kind}
                summary={item.summary}
                meta={[...item.stack.slice(0, 2), item.year].join(", ")}
                image={getSiteShot(item.slug)?.image ?? item.image}
              />
            ))}
          </div>
        </PageSection>
      )}

      <SiteCta
        title={t("cta.title")}
        body={t("cta.body")}
        secondaryLabel={t("cta.secondary")}
      />
    </>
  );
}
