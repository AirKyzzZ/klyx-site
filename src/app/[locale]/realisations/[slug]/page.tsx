import type { CSSProperties } from "react";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { ChamferBreak } from "@/components/chamfer-break";
import { BrowserFrame, hostOf } from "@/components/proof/browser-frame";
import { Section } from "@/components/section";
import { BandPicture, CaseCard } from "@/components/sections/case-grid";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { Link } from "@/i18n/navigation";
import { resolvePageLocale } from "@/i18n/page-locale";
import { type Locale, routing } from "@/i18n/routing";
import { getCaseStudies, getCaseStudy } from "@/lib/content";
import { getSiteShot } from "@/lib/proof";
import { brandedTitle, buildMetadata } from "@/lib/seo";

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
  const index = cases.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  const study = await getCaseStudy(slug, locale);
  const next = cases.length > 1 ? cases[(index + 1) % cases.length] : null;
  return { ...study, next };
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
  });
}

export default async function CasePage({ params }: CasePageProps) {
  const locale = await resolvePageLocale(params);
  const { slug } = await params;
  const { meta, Content, next } = await loadCase(locale, slug);
  const t = await getTranslations({ locale, namespace: "cases" });
  const shot = getSiteShot(meta.slug);

  const facts = [
    { label: t("labels.client"), value: meta.client },
    { label: t("labels.year"), value: String(meta.year) },
    { label: t("labels.stack"), value: meta.stack.join(", ") },
  ];

  return (
    <>
      <Hero
        eyebrow={
          <Link
            href="/realisations"
            className="hover:text-text inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            {t("labels.back")}
          </Link>
        }
        title={meta.title}
        subtitle={meta.summary}
      />

      <ChamferBreak edge="top" />
      <section data-tone="sand" className="tone-sand relative z-1">
        <div className="relative container pt-6 pb-12 md:pt-10 md:pb-16">
          <div
            className="case-cover tone-dark border-line-strong aspect-[4/3] rounded-xl border shadow-[0_0_0_1px_var(--line),0_40px_160px_-40px_var(--glow)] sm:aspect-[16/10] lg:aspect-[16/8]"
            style={{ "--band-x": "38%" } as CSSProperties}
          >
            <BandPicture />
            <div className="absolute inset-x-[6%] top-[8%] lg:right-[16%] lg:left-[6%]">
              <BrowserFrame
                url={meta.url}
                image={shot?.image ?? meta.image}
                alt={meta.client}
                sizes="(min-width: 1024px) 820px, 90vw"
              />
            </div>
            {shot && (
              <div className="absolute top-[34%] right-[5%] z-1 hidden w-[19%] lg:block">
                <BrowserFrame
                  url={meta.url}
                  image={`/realisations/${meta.slug}-390.png`}
                  alt=""
                  sizes="200px"
                  imageClassName="aspect-[390/844]"
                  compact
                />
              </div>
            )}
          </div>

          <dl className="border-ink/15 mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-6 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="type-label text-text-3">{fact.label}</dt>
                <dd className="type-data text-text mt-2">{fact.value}</dd>
              </div>
            ))}
            <div>
              <dt className="type-label text-text-3">{t("labels.url")}</dt>
              <dd className="type-data mt-2">
                <a
                  href={meta.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${t("labels.visit")} ${hostOf(meta.url)}`}
                  className="text-text hover:text-text-2 inline-flex items-center gap-1 underline underline-offset-4 transition-colors"
                >
                  {hostOf(meta.url)}
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <ChamferBreak edge="bottom" />

      <section className="relative z-1">
        <div className="container py-16 md:py-24">
          <article className="max-w-[64ch] space-y-5">
            <Content />
          </article>
        </div>
      </section>

      {next && (
        <Section index="01" eyebrow={t("labels.next")}>
          <div className="reveal">
            <CaseCard
              item={next}
              readLabel={t("labels.read")}
              layout="wide"
              sizes="(min-width: 1024px) 680px, 90vw"
            />
          </div>
        </Section>
      )}

      <Cta
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ action: "book", label: t("cta.ctaPrimary") }}
        secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
      />
    </>
  );
}
