# Legacy WordPress URLs

Live klyx.fr (WordPress) was a single page, so the list is short. Redirects are 308 (permanent) from `next.config.ts` via `src/lib/legacy-urls.ts`; 410s come from `src/proxy.ts`.

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

`blog.klyx.fr` stays live on its own Vercel project and is not redirected.

Security headers on every response (ported from the old `.htaccess`): `Strict-Transport-Security: max-age=31536000`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. `X-Powered-By` is disabled.
