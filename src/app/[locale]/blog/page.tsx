import type { Metadata } from "next";

import { Rss } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PostCard } from "@/components/blog/post-card";
import { JsonLd } from "@/components/json-ld";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { SiteCta } from "@/components/ui-kit/site-cta";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { formatPostDate, getPostSummaries } from "@/lib/blog";
import { blogJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.blog" });
  return buildMetadata({
    locale,
    pathname: "/blog",
    title: t("title"),
    description: t("description"),
  });
}

export default async function BlogPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getPostSummaries(locale);

  return (
    <>
      <JsonLd data={blogJsonLd(locale, posts)} />
      <PageSection
        divider={false}
        containerClassName="pt-32 pb-14 md:pt-40 lg:pt-44 lg:pb-20"
      >
        <SectionHeader as="h1" title={t("hero.title")} intro={t("hero.intro")}>
          <a
            href="/blog/rss.xml"
            className="text-text-2 hover:text-text inline-flex w-fit items-center gap-2 text-[0.9375rem] font-medium transition-colors duration-(--d-fast)"
          >
            <Rss aria-hidden="true" className="text-accent size-4" />
            {t("rss")}
          </a>
        </SectionHeader>
      </PageSection>

      <PageSection id="articles" containerClassName="lg:py-20">
        {posts.length === 0 ? (
          <p className="border-line bg-surface-1 text-text-2 rounded-[16px] border p-7">
            {t("empty")}
          </p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard
                  slug={post.slug}
                  title={post.title}
                  summary={post.summary}
                  date={post.date}
                  dateLabel={formatPostDate(locale, post.date)}
                  readingTime={t("readingTime", { minutes: post.minutes })}
                  tag={post.topic && t(`services.names.${post.topic}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </PageSection>

      <SiteCta />
    </>
  );
}
