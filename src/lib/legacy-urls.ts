export const LEAD_MAGNET_PATH =
  "/wp-content/uploads/2025/07/guide_vitrine_essentiels.pdf";

type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
  has?: { type: "query"; key: string; value: string }[];
};

export const legacyRedirects: LegacyRedirect[] = [
  { source: "/agence-web-bordeaux", destination: "/", permanent: true },
  { source: "/category/:path*", destination: "/", permanent: true },
  { source: "/author/:path*", destination: "/", permanent: true },
  { source: "/feed", destination: "/blog/rss.xml", permanent: true },
  {
    source: "/sitemap_index.xml",
    destination: "/sitemap.xml",
    permanent: true,
  },
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
  { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
  {
    source: "/",
    has: [{ type: "query", key: "attachment_id", value: "425" }],
    destination: LEAD_MAGNET_PATH,
    permanent: true,
  },
];

function matchesSource(source: string, pathname: string): boolean {
  if (!source.endsWith("/:path*")) return pathname === source;
  const base = source.slice(0, -"/:path*".length);
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function findLegacyRedirect(
  pathname: string,
  searchParams: URLSearchParams,
): string | null {
  const path =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  const rule = legacyRedirects.find(
    ({ source, has = [] }) =>
      matchesSource(source, path) &&
      has.every(({ key, value }) => searchParams.get(key) === value),
  );
  return rule?.destination ?? null;
}

const GONE_PATTERN =
  /^\/(wp-admin|wp-json|wp-content)(\/|$)|^\/(wp-login|xmlrpc)\.php$/;

export function isGone(pathname: string): boolean {
  if (pathname === LEAD_MAGNET_PATH) return false;
  return GONE_PATTERN.test(pathname);
}
