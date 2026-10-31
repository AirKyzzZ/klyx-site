import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { Hero } from "@/components/sections/hero";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getPosts } from "@/lib/content";
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
  const format = await getFormatter({ locale });
  const posts = await getPosts(locale);

  return (
    <>
      <Background>
        <Hero title={t("hero.title")} subtitle={t("hero.subtitle")} />
      </Background>

      <section className="container max-w-3xl pt-16 pb-28 lg:pb-32">
        {posts.length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border border-dashed p-10 text-center">
            {t("empty")}
          </p>
        ) : (
          <ul className="divide-y border-y">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={{
                    pathname: "/blog/[slug]",
                    params: { slug: post.slug },
                  }}
                  className="group block space-y-2 py-8"
                >
                  <p className="text-muted-foreground font-mono text-xs">
                    {format.dateTime(new Date(post.date), {
                      dateStyle: "long",
                    })}
                  </p>
                  <h2 className="text-2xl tracking-tight">{post.title}</h2>
                  <p className="text-muted-foreground">{post.summary}</p>
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    {t("readMore")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
