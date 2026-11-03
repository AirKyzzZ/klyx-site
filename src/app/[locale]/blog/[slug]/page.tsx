import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { Link } from "@/i18n/navigation";
import { resolvePageLocale } from "@/i18n/page-locale";
import { type Locale, routing } from "@/i18n/routing";
import { getMdxBody, getPost, getPosts, readingMinutes } from "@/lib/content";
import { blogPostingJsonLd } from "@/lib/json-ld";
import { brandedTitle, buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type PostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  if (!hasLocale(routing.locales, params.locale)) return [];
  const posts = await getPosts(params.locale);
  return posts.map((post) => ({ slug: post.slug }));
}

async function loadPost(locale: Locale, slug: string) {
  const posts = await getPosts(locale);
  if (!posts.some((post) => post.slug === slug)) notFound();
  return getPost(slug, locale);
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const { slug } = await params;
  const { meta } = await loadPost(locale, slug);
  return buildMetadata({
    locale,
    pathname: "/blog/[slug]",
    params: { slug },
    title: brandedTitle(meta.title),
    description: meta.summary,
    type: "article",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const locale = await resolvePageLocale(params);
  const { slug } = await params;
  const { meta, Content } = await loadPost(locale, slug);
  const t = await getTranslations({ locale, namespace: "blog" });
  const cta = await getTranslations({ locale, namespace: "home.finalCta" });
  const minutes = readingMinutes(await getMdxBody("blog", slug, locale));

  return (
    <>
      <JsonLd
        data={blogPostingJsonLd({
          locale,
          slug,
          title: meta.title,
          summary: meta.summary,
          date: meta.date,
          updated: meta.updated,
          sources: meta.sources,
        })}
      />
      <Hero
        eyebrow={
          <Link
            href="/blog"
            className="hover:text-text inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            {t("back")}
          </Link>
        }
        title={meta.title}
        meta={
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            <li>{t("published", { date: meta.date })}</li>
            {meta.updated && (
              <li>
                <span aria-hidden="true">· </span>
                {t("updated", { date: meta.updated })}
              </li>
            )}
            <li>
              <span aria-hidden="true">· </span>
              {t("readingTime", { minutes })}
            </li>
            <li>
              <span aria-hidden="true">· </span>
              <Link
                href="/a-propos"
                className="hover:text-text underline underline-offset-4 transition-colors"
              >
                {t("byline", { author: site.founder })}
              </Link>
            </li>
          </ul>
        }
      />

      <section data-shot="article" className="relative z-1">
        <div className="container pb-16 md:pb-24">
          <article className="max-w-[66ch] space-y-6 text-[1.125rem] leading-[1.7]">
            <Content />
          </article>
          {meta.sources && meta.sources.length > 0 && (
            <aside className="border-line mt-16 max-w-[66ch] border-t pt-6">
              <h2 className="type-label text-text-3">{t("sources")}</h2>
              <ol className="type-data mt-4 space-y-2">
                {meta.sources.map((source, i) => (
                  <li key={source.url} className="flex gap-3">
                    <span className="text-text-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener"
                      className="text-text-2 hover:text-text inline-flex items-center gap-1 underline underline-offset-4 transition-colors"
                    >
                      {source.title}
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </div>
      </section>

      <Cta
        title={cta("title")}
        emphasis={cta("titleEmphasis")}
        body={cta("body")}
        primary={{ action: "book", label: cta("ctaPrimary") }}
        secondary={{ action: "quote", label: cta("ctaSecondary") }}
      />
    </>
  );
}
