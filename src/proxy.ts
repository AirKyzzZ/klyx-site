import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import { LEAD_MAGNET_PATH, isGone } from "./lib/legacy-urls";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isGone(pathname)) return new NextResponse(null, { status: 410 });
  if (pathname === LEAD_MAGNET_PATH) return NextResponse.next();
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*/opengraph-image|.*\\..*).*)",
    "/wp-admin/:path*",
    "/wp-json/:path*",
    "/wp-content/:path*",
    "/wp-login.php",
    "/xmlrpc.php",
  ],
};
