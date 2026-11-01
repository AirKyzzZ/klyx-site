import { getPathname } from "./navigation";
import type { Locale } from "./routing";

type Href = Parameters<typeof getPathname>[0]["href"];

export function getLocaleHref(
  locale: Locale,
  pathname: string,
  params: Record<string, string | string[] | undefined>,
) {
  const segments = Object.fromEntries(
    Object.entries(params).filter(([key]) => key !== "locale"),
  );
  return getPathname({
    locale,
    href: { pathname, params: segments } as Href,
  });
}
