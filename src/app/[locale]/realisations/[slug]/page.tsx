import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { DashedLine } from "@/components/dashed-line";
import { Cta } from "@/components/sections/cta";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { resolvePageLocale } from "@/i18n/page-locale";
import { type Locale, routing } from "@/i18n/routing";
import { getCaseStudies, getCaseStudy } from "@/lib/content";
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
  if (!cases.some((c) => c.slug === slug)) notFound();
  return getCaseStudy(slug, locale);
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
  const { meta, Content } = await loadCase(locale, slug);
  const t = await getTranslations({ locale, namespace: "cases" });

  const facts = [
    { label: t("labels.client"), value: meta.client },
    { label: t("labels.year"), value: String(meta.year) },
    { label: t("labels.stack"), value: meta.stack.join(", ") },
  ];

  return (
    <>
      <Background className="via-muted to-muted/80">
        <section className="container max-w-5xl pt-36 pb-16 lg:pt-48 lg:pb-20">
          <Link
            href="/realisations"
            className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" />
            {t("labels.back")}
          </Link>
          <h1 className="max-w-3xl text-4xl leading-[1.05] tracking-tight text-balance md:text-5xl lg:text-6xl">
            {meta.title}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-snug md:text-xl">
            {meta.summary}
          </p>

          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="space-y-1">
                <dt className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                  {fact.label}
                </dt>
                <dd className="font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <Button variant="secondary" className="mt-8 shadow-md" asChild>
            <a href={meta.url} target="_blank" rel="noopener">
              {t("labels.visit")} <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </section>
      </Background>

      <section className="container max-w-5xl py-16 lg:py-20">
        <div className="bg-muted relative aspect-[16/10] overflow-hidden rounded-2xl border shadow-lg">
          <Image
            src={meta.image}
            alt={meta.client}
            fill
            priority
            sizes="(min-width: 1024px) 976px, 100vw"
            className="object-cover object-top"
          />
        </div>
        <DashedLine className="my-12 lg:my-16" />
        <article className="[&_p]:text-muted-foreground mx-auto max-w-2xl space-y-5 leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:tracking-tight [&_li]:ms-5 [&_li]:list-disc">
          <Content />
        </article>
      </section>

      <Background variant="bottom">
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
