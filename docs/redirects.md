# Legacy WordPress URLs

Live klyx.fr (WordPress) was a single page, so the list is short. Redirects are 308 (permanent), defined once in `src/lib/legacy-urls.ts`. `src/proxy.ts` answers them first, before next-intl (`findLegacyRedirect`), because on Netlify the `next.config.ts` redirects run after the proxy and next-intl would swallow the old paths. 410s also come from `src/proxy.ts`.

| Old URL | New behaviour |
|---|---|
| `/agence-web-bordeaux` (and trailing slash) | 308 to `/` |
| `/category/*` | 308 to `/` |
| `/author/*` | 308 to `/` |
| `/feed` | 308 to `/blog/rss.xml` |
| `/sitemap_index.xml` | 308 to `/sitemap.xml` |
| `/wp-sitemap.xml` | 308 to `/sitemap.xml` |
| `/page-sitemap.xml` | 308 to `/sitemap.xml` |
| `/?attachment_id=425` | 308 to `/wp-content/uploads/2025/07/guide_vitrine_essentiels.pdf` (query string is carried over, harmless) |
| `/wp-content/uploads/2025/07/guide_vitrine_essentiels.pdf` | 200, file kept in `public/` (lead magnet) |
| `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/*` | 410 Gone |
| any other `/wp-content/*` | 410 Gone |

## Canonical URLs

Also in `src/proxy.ts`, so there is one URL per page:

| Request | New behaviour |
|---|---|
| any path with a trailing slash, like `/tarifs/` | 308 to the same path without it. On Netlify the proxy runs before Next's own slash redirect, and next-intl's rewrite used to serve these with a 200 |
| `/fr/*` and wrong-locale slugs like `/en/tarifs` | 308 to the canonical URL. next-intl always answers 307, the proxy turns it into a 308 (locale detection is off, so these never vary per visitor) |
| `http://www.klyx.fr` | two 301s (HTTPS on the same host, then the apex). Netlify forces the first hop for HSTS preload, it can't be changed from the repo |

`blog.klyx.fr` stays live on its own Vercel project and is not redirected.

Security headers on every response (ported from the old `.htaccess`): `Strict-Transport-Security: max-age=31536000` (Netlify appends `includeSubDomains; preload` on `*.netlify.app`, so e2e only checks the prefix), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. `X-Powered-By` is disabled.
