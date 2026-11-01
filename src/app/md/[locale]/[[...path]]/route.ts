import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import {
  MARKDOWN_ROOT,
  MARKDOWN_TYPE,
  pageMarkdownHref,
} from "@/lib/machine/markdown-href";
import {
  machinePages,
  pageMarkdown,
  resolveMachinePage,
} from "@/lib/machine/page-markdown";

type RouteContext = {
  params: Promise<{ locale: string; path?: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const pages = await machinePages(locale);
      return pages.map((page) => ({
        locale,
        path: pageMarkdownHref(locale, page)
          .slice(`${MARKDOWN_ROOT}/${locale}`.length)
          .split("/")
          .filter(Boolean),
      }));
    }),
  );
  return perLocale.flat();
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { locale, path = [] } = await params;
  if (!hasLocale(routing.locales, locale)) return notFound();
  const page = resolveMachinePage(locale, path);
  if (!page) return notFound();
  const markdown = await pageMarkdown(locale, page);
  if (markdown === null) return notFound();

  return new Response(markdown, {
    headers: {
      "Content-Type": `${MARKDOWN_TYPE}; charset=utf-8`,
      "X-Robots-Tag": "noindex",
    },
  });
}

function notFound() {
  return new Response("Not found\n", {
    status: 404,
    headers: { "X-Robots-Tag": "noindex" },
  });
}
