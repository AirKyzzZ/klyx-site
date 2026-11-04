import { routing } from "@/i18n/routing";
import { getPosts } from "@/lib/content";
import { OG_SIZE, renderOg, resolveOgLocale } from "@/lib/og/render-og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) =>
      (await getPosts(locale)).map(({ slug }) => ({ locale, slug })),
    ),
  );
  return perLocale.flat();
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const locale = await resolveOgLocale(params);
  const { slug } = await params;
  const post = (await getPosts(locale)).find((p) => p.slug === slug);
  return renderOg({ title: post?.title ?? site.name });
}
