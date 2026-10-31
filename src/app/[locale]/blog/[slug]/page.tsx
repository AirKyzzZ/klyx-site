import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { Link } from "@/i18n/navigation";
import { resolvePageLocale } from "@/i18n/page-locale";
import { type Locale, routing } from "@/i18n/routing";
import { getPost, getPosts } from "@/lib/content";
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
  return { title: `${meta.title} | Klyx`, description: meta.summary };
}

export default async function PostPage({ params }: PostPageProps) {
  const locale = await resolvePageLocale(params);
  const { slug } = await params;
  const { meta, Content } = await loadPost(locale, slug);
  const t = await getTranslations({ locale, namespace: "blog" });
  const format = await getFormatter({ locale });

  return (
    <Background>
      <article className="container max-w-2xl pt-36 pb-28 lg:pt-48 lg:pb-32">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" />
          {t("back")}
        </Link>
        <h1 className="text-4xl leading-[1.05] tracking-tight text-balance md:text-5xl">
          {meta.title}
        </h1>
        <p className="text-muted-foreground mt-6 font-mono text-xs">
          {t("byline", { author: site.founder })} ·{" "}
          {t("published", {
            date: format.dateTime(new Date(meta.date), { dateStyle: "long" }),
          })}
        </p>
        <div className="[&_p]:text-muted-foreground mt-12 space-y-5 leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:tracking-tight [&_li]:ms-5 [&_li]:list-disc">
          <Content />
        </div>
      </article>
    </Background>
  );
}
