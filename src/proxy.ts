import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import {
  LEAD_MAGNET_PATH,
  findLegacyRedirect,
  isGone,
} from "./lib/legacy-urls";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (isGone(pathname)) return new NextResponse(null, { status: 410 });
  if (pathname === LEAD_MAGNET_PATH) return NextResponse.next();
  const destination = findLegacyRedirect(pathname, searchParams);
  if (destination) {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    return NextResponse.redirect(url, 308);
  }
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|md/|.*/opengraph-image|.*\\..*).*)",
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
