import type { Metadata } from "next";

import { ArrowRight, Rss } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { Hero } from "@/components/sections/hero";
import { SampleWindow } from "@/components/sections/process-timeline";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getMdxBody, getPosts, readingMinutes } from "@/lib/content";
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
  const posts = await Promise.all(
    (await getPosts(locale)).map(async (post) => ({
      ...post,
      minutes: readingMinutes(await getMdxBody("blog", post.slug, locale)),
    })),
  );

  return (
    <Hero
      title={t("hero.title")}
      subtitle={t("hero.subtitle")}
      className="pb-24 md:pb-32"
    >
      <JsonLd data={blogJsonLd(locale, posts)} />
      {posts.length === 0 ? (
        <div className="max-w-[640px]">
          <SampleWindow file="~/klyx">
            <p className="text-text-3">
              <span aria-hidden="true">$ </span>ls content/blog
            </p>
            <p className="text-text mt-2">{t("emptyCount")}</p>
            <p className="text-text-2">{t("empty")}</p>
            <a
              href="/blog/rss.xml"
              className="text-text-2 hover:text-text mt-4 inline-flex items-center gap-1.5 underline underline-offset-4 transition-colors"
            >
              <Rss aria-hidden="true" className="size-3.5" />
              {t("rss")}
            </a>
          </SampleWindow>
        </div>
      ) : (
        <ul className="border-line border-t">
          {posts.map((post) => (
            <li key={post.slug} className="border-line border-b">
              <Link
                href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                className="group hover:bg-surface-3 grid gap-2 px-2 py-6 transition-colors duration-(--d-fast) md:grid-cols-12 md:items-baseline md:gap-6 md:px-4"
              >
                <p className="type-label text-text-3 md:col-span-3">
                  {post.date} · {t("readingTime", { minutes: post.minutes })}
                </p>
                <div className="md:col-span-8">
                  <h2 className="type-h3">{post.title}</h2>
                  <p className="text-text-2 mt-1">{post.summary}</p>
                </div>
                <ArrowRight
                  aria-hidden="true"
                  className="text-text-3 group-hover:text-text hidden size-4 justify-self-end transition-[color,translate] duration-(--d-fast) group-hover:translate-x-0.5 md:col-span-1 md:block"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Hero>
  );
}
