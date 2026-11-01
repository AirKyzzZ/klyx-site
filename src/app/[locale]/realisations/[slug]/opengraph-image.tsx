import { getCaseStudies } from "@/lib/content";
import { OG_SIZE, renderOg, resolveOgLocale } from "@/lib/og/render-og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const locale = await resolveOgLocale(params);
  const { slug } = await params;
  const meta = (await getCaseStudies(locale)).find((c) => c.slug === slug);
  if (!meta) return renderOg({ title: site.name });
  const [lead, ...rest] = meta.title.split(", ");
  return renderOg({
    title: rest.length > 0 ? `${lead},` : meta.title,
    emphasis: rest.length > 0 ? rest.join(", ") : undefined,
  });
}
