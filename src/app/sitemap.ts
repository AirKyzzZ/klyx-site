import type { MetadataRoute } from "next";

import { type Locale, routing } from "@/i18n/routing";
import { getCaseStudies, getPosts } from "@/lib/content";
import { type AppPathname, absoluteUrl, languageAlternates } from "@/lib/seo";
import { site } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

const LEGAL_PATHNAMES: AppPathname[] = [
  "/mentions-legales",
  "/confidentialite",
];

function localizedEntries(
  pathname: AppPathname,
  params: Record<string, string> = {},
  lastModified?: string,
): Entry[] {
  const languages = languageAlternates(pathname, params);
  return routing.locales.map((locale) => ({
    url: absoluteUrl(locale, pathname, params),
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages },
  }));
}

async function sharedSlugs<T extends { slug: string }>(
  load: (locale: Locale) => Promise<T[]>,
): Promise<T[]> {
  const [first, ...others] = await Promise.all(routing.locales.map(load));
  const otherSlugs = others.map((items) => new Set(items.map((i) => i.slug)));
  return first.filter((item) =>
    otherSlugs.every((slugs) => slugs.has(item.slug)),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPathnames = (
    Object.keys(routing.pathnames) as AppPathname[]
  ).filter((pathname) => !pathname.includes("["));
  const cases = await sharedSlugs(getCaseStudies);
  const posts = await sharedSlugs(getPosts);

  return [
    ...staticPathnames.flatMap((pathname) =>
      localizedEntries(
        pathname,
        {},
        LEGAL_PATHNAMES.includes(pathname) ? site.legalUpdatedAt : undefined,
      ),
    ),
    ...cases.flatMap((study) =>
      localizedEntries("/realisations/[slug]", { slug: study.slug }),
    ),
    ...posts.flatMap((post) =>
      localizedEntries("/blog/[slug]", { slug: post.slug }, post.date),
    ),
  ];
}
