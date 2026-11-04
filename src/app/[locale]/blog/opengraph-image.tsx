import { getStaticTranslator } from "@/i18n/static-translator";
import {
  OG_SIZE,
  ogLocaleParams,
  renderOg,
  resolveOgLocale,
} from "@/lib/og/render-og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;
export const generateStaticParams = ogLocaleParams;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = getStaticTranslator(await resolveOgLocale(params), "blog");
  return renderOg({ title: t("hero.title"), emphasis: t("hero.subtitle") });
}
