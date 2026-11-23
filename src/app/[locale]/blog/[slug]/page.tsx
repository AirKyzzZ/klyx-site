import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

import { AuthorCard } from "@/components/blog/author-card";
import { PostCard } from "@/components/blog/post-card";
import { PostToc } from "@/components/blog/post-toc";
import { ServiceLinks } from "@/components/blog/service-links";
import { JsonLd } from "@/components/json-ld";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { SiteCta } from "@/components/ui-kit/site-cta";
import { getLocaleHref } from "@/i18n/locale-href";
import { Link } from "@/i18n/navigation";
import { resolvePageLocale } from "@/i18n/page-locale";
import { type Locale, routing } from "@/i18n/routing";
import { formatPostDate, getPostSummaries, postServices } from "@/lib/blog";
import { getMdxBody, getPost, getPosts, readingMinutes } from "@/lib/content";
import { bindPunctuation, markdownHeadings } from "@/lib/headings";
import { blogPostingJsonLd } from "@/lib/json-ld";
import { formatPrice, getOfferPrice } from "@/lib/offers";
import { followingItems } from "@/lib/related-content";
import { brandedTitle, buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const FOUNDER_PHOTO = "/team/maxime-mansiet.jpg";
const AUTHOR_LINK =
  "text-text hover:text-accent inline-flex items-center gap-1.5 transition-colors duration-(--d-fast)";

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
  const body = await getMdxBody("blog", slug, locale);
  const headings = markdownHeadings(body);
  const related = followingItems(await getPostSummaries(locale), slug, 3);
  const services = postServices(slug);
  const topic = services[0]?.key;

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

      <PageSection
        divider={false}
        containerClassName="pt-32 pb-12 md:pt-40 lg:pt-44 lg:pb-16"
      >
        <Link
          href="/blog"
          className="text-text-2 hover:text-text inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-(--d-fast)"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {t("back")}
        </Link>
        <h1 className="type-hero mt-8 max-w-[920px]">
          {bindPunctuation(meta.title)}
        </h1>
        <p className="type-subtitle text-text-2 mt-6 max-w-[680px]">
          {meta.summary}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
          <Link
            href="/a-propos"
            className="text-text hover:text-accent inline-flex items-center gap-2.5 font-medium transition-colors duration-(--d-fast)"
          >
            <Image
              src={FOUNDER_PHOTO}
              alt=""
              width={64}
              height={64}
              sizes="32px"
              className="size-8 rounded-full object-cover"
            />
            {t("byline", { author: site.founder })}
          </Link>
          <ul
            data-post-meta
            className="text-text-3 flex flex-wrap gap-x-2 gap-y-1"
          >
            <li>
              <time dateTime={meta.date}>
                {t("published", { date: formatPostDate(locale, meta.date) })}
              </time>
            </li>
            {meta.updated && (
              <li>
                <span aria-hidden="true">· </span>
                <time dateTime={meta.updated}>
                  {t("updated", {
                    date: formatPostDate(locale, meta.updated),
                  })}
                </time>
              </li>
            )}
            <li>
              <span aria-hidden="true">· </span>
              {t("readingTime", { minutes: readingMinutes(body) })}
            </li>
          </ul>
          {topic && (
            <span className="border-line bg-surface-1 text-text-2 rounded-full border px-3 py-1 text-[0.8125rem] font-medium">
              {t(`services.names.${topic}`)}
            </span>
          )}
        </div>
      </PageSection>

      <PageSection id="article" containerClassName="py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <article className="max-w-[68ch] space-y-6 text-[1.0625rem] leading-[1.7] sm:text-[1.125rem]">
              <Content />
            </article>

            {meta.sources && meta.sources.length > 0 && (
              <section
                aria-labelledby="sources-title"
                className="border-line mt-14 max-w-[68ch] border-t pt-8"
              >
                <h2
                  id="sources-title"
                  className="text-text text-lg font-semibold tracking-[-0.3px]"
                >
                  {t("sources.title")}
                </h2>
                <p className="text-text-3 mt-1 text-sm">{t("sources.intro")}</p>
                <ol className="marker:text-text-3 mt-5 list-decimal space-y-2.5 pl-6 text-[0.9375rem] leading-normal marker:tabular-nums">
                  {meta.sources.map((source) => (
                    <li key={source.url} className="pl-1.5 break-words">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener"
                        className="text-text-2 decoration-line-strong hover:text-text hover:decoration-accent underline underline-offset-[3px] transition-colors duration-(--d-fast)"
                      >
                        {source.title}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="ml-1 inline size-3.5 align-[-2px]"
                        />
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {services.length > 0 && (
              <ServiceLinks
                className="mt-14 max-w-[68ch]"
                title={t("services.title")}
                items={services.map(({ key, offer }) => ({
                  key,
                  name: t(`services.names.${key}`),
                  price: t("services.price", {
                    price: formatPrice(getOfferPrice(offer.id), locale),
                    unit: offer.unit,
                  }),
                  href: getLocaleHref(locale, offer.page, {}),
                }))}
              />
            )}

            <AuthorCard
              className="mt-10 max-w-[68ch]"
              label={t("author.label")}
              name={site.founder}
              role={t("author.role")}
              bio={t("author.bio")}
              photo={FOUNDER_PHOTO}
              photoAlt={t("author.photoAlt")}
              links={
                <>
                  <Link href="/a-propos" className={AUTHOR_LINK}>
                    {t("author.about")}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </Link>
                  <a
                    href={site.socials.linkedinFounder}
                    className={AUTHOR_LINK}
                  >
                    <FaLinkedin aria-hidden="true" className="size-4" />
                    LinkedIn
                  </a>
                  <a href={site.socials.github} className={AUTHOR_LINK}>
                    <FaGithub aria-hidden="true" className="size-4" />
                    GitHub
                  </a>
                </>
              }
            />
          </div>

          {headings.length > 1 && (
            <aside className="max-lg:hidden">
              <PostToc
                className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto"
                title={t("toc")}
                items={headings}
              />
            </aside>
          )}
        </div>
      </PageSection>

      {related.length > 0 && (
        <PageSection id="a-lire">
          <SectionHeader
            title={t("related.title")}
            intro={t("related.intro")}
          />
          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((post) => (
              <li key={post.slug}>
                <PostCard
                  as="h3"
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
        </PageSection>
      )}

      <SiteCta />
    </>
  );
}
