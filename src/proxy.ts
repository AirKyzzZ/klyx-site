import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import {
  LEAD_MAGNET_PATH,
  findLegacyRedirect,
  isGone,
} from "./lib/legacy-urls";
import { isOutreachPath } from "./lib/outreach-paths";

const handleI18nRouting = createMiddleware(routing);

function withoutTrailingSlash(pathname: string): string {
  if (pathname === "/" || !pathname.endsWith("/")) return pathname;
  return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

// next-intl always answers 307; with locale detection off its redirects are canonical.
function permanent(response: NextResponse): NextResponse {
  if (response.status !== 307) return response;
  return new NextResponse(null, { status: 308, headers: response.headers });
}

export default function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;
  if (isGone(pathname)) return new NextResponse(null, { status: 410 });
  if (pathname === LEAD_MAGNET_PATH) return NextResponse.next();
  const canonical = withoutTrailingSlash(pathname);
  const destination =
    findLegacyRedirect(pathname, searchParams) ??
    (canonical === pathname ? null : canonical);
  if (destination) {
    // NextURL re-adds the request's trailing slash to any pathname set on it.
    return NextResponse.redirect(
      new URL(`${destination}${search}`, request.url),
      308,
    );
  }
  if (isOutreachPath(pathname)) return NextResponse.next();
  return permanent(handleI18nRouting(request));
}

export const config = {
  matcher: [
    "/((?!api/|trpc/|_next/|_vercel/|md/|.*/opengraph-image$|.*\\..*).*)",
    "/category/:path*",
    "/author/:path*",
    "/wp-admin/:path*",
    "/wp-json/:path*",
    "/wp-content/:path*",
    "/wp-login.php",
    "/xmlrpc.php",
    "/sitemap_index.xml",
    "/wp-sitemap.xml",
    "/page-sitemap.xml",
  ],
};
