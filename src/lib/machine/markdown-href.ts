import { getLocaleHref } from "@/i18n/locale-href";
import { type Locale, routing } from "@/i18n/routing";
import type { AppPathname } from "@/lib/seo";

export type MachinePage = {
  pathname: AppPathname;
  params?: Record<string, string>;
};

export const MARKDOWN_ROOT = "/md";
export const MARKDOWN_TYPE = "text/markdown";

export function markdownHref(locale: Locale, pathname: string): string {
  const prefix = `/${locale}`;
  const hasPrefix = pathname === prefix || pathname.startsWith(`${prefix}/`);
  const bare = hasPrefix ? pathname.slice(prefix.length) : pathname;
  return `${MARKDOWN_ROOT}/${locale}${bare === "/" ? "" : bare}`;
}

export function pageMarkdownHref(locale: Locale, page: MachinePage): string {
  return markdownHref(
    locale,
    getLocaleHref(locale, page.pathname, page.params ?? {}),
  );
}

export function internalPathname(
  pathname: string,
  params: Record<string, string | string[] | undefined>,
): string {
  const keys = Object.keys(routing.pathnames);
  if (keys.includes(pathname)) return pathname;
  const filled = (key: string) =>
    key.replace(/\[(\w+)\]/g, (_, name: string) => String(params[name]));
  return keys.find((key) => filled(key) === pathname) ?? pathname;
}
