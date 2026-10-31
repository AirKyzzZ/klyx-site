# Deploy plan: klyx.fr on Netlify

Written 2026-11-01. Plan only, nothing in this document has been executed. Netlify docs read the same day; anything the docs do not state is marked "unverified" and has a check step.

## How this differs from MIGRATION.md

`docs/MIGRATION.md` (2026-10-31) recommended Vercel Pro ($20/month, 1 seat) mainly because Hobby forbids commercial use, Next.js 16 runs natively there, and the three subdomains already sit on Vercel. Maxime now wants Netlify. What changes: Next.js runs through the OpenNext-based Netlify adapter instead of natively, so `proxy.ts`, headers and redirect ordering need an explicit check on a deploy preview (section 3), and the plan is credit based (Free 300 / Personal $9 1,000 / Pro $20 3,000 credits per month). The OVH, Zoho, Brevo and Resend parts of MIGRATION.md are unchanged and reused below.

## DNS snapshot (dig, 2026-10-31 23:28 UTC)

Re-run the block in section 7 before the cutover and diff. Zone is at OVH (`ns20.ovh.net`, `dns20.ovh.net`).

| Name | Type | Value |
|---|---|---|
| `klyx.fr` | A | `188.165.53.185` (TTL 3551 left of 3600) |
| `klyx.fr` | AAAA | `2001:41d0:301::21` |
| `www.klyx.fr` | A/AAAA/CNAME | none |
| `klyx.fr` | MX | `10 mx.zoho.eu.`, `20 mx2.zoho.eu.`, `50 mx3.zoho.eu.` |
| `klyx.fr` | TXT | `v=spf1 include:zohomail.eu ~all`, `brevo-code:e779b965...`, `lemlist-verif=3e666b7d`, `66a9581d1ef77ed45e3d5b4634ca64e2` |
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |
| `zmail._domainkey` | TXT | Zoho DKIM |
| `brevo1._domainkey`, `brevo2._domainkey` | CNAME | `b1.klyx-fr.dkim.brevo.com.`, `b2.klyx-fr.dkim.brevo.com.` |
| `blog`, `studio`, `estate` | CNAME | Vercel (`7ce82a2a6da03495.vercel-dns-017.com.`, `cname.vercel-dns.com.` x2) |
| `send.klyx.fr` | TXT | none yet |

## 1. Go / no-go checklist

All must be true before touching DNS.

- [ ] `grep -rn "TODO(maxime)" src content messages | wc -l` is 0, or every remaining one is hidden from rendered output. Count on `feature/redesign-live-system` at ec5051e: **113** (46 in `messages/fr.json`, 46 in `messages/en.json`, 2 per case study MDX in `content/realisations/`, 1 in `src/components/sections/price-ledger.tsx`). This is the main blocker.
- [ ] Legal pages complete and linked from the footer: `/mentions-legales` (`/legal-notice`), `/confidentialite` (`/privacy`). Real company identity, SIRET, host (Netlify, Inc.), DPO/contact, processors (Resend, Netlify, Cal.com).
- [ ] Resend domain `send.klyx.fr` shows "Verified" (section 5) and a test send from the production contact form reaches `CONTACT_TO_EMAIL`. `src/actions/send-contact.ts` sends from `contact@send.klyx.fr`, so an unverified domain means the form fails with the generic error.
- [ ] Env vars set in Netlify: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_CAL_URL` (all three empty in `.env.example`). `NEXT_PUBLIC_*` is inlined at build, so changing it needs a rebuild.
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` clean; `npm run test:e2e` clean against the deploy preview URL.
- [ ] Lighthouse on the preview URL (mobile, FR home, `/tarifs`, `/contact`, one case study): Performance, Accessibility, SEO, Best Practices all >= 90. Record scores in the PR.
- [ ] Preview checks from section 3 passed (410s, redirects, headers, `llms.txt`, `.md` routes, `rss.xml`, OG images, contact form).
- [ ] Final WordPress backup exported (files, DB, uploads) and stored outside OVH.
- [ ] `lemlist`/Brevo owners aware only the web A/AAAA changes.

## 2. GitHub

- Repo `AirKyzzZ/klyx-site` exists, private, created 2026-10-31. Before any push, confirm it is still empty: `gh repo view AirKyzzZ/klyx-site --json isEmpty,defaultBranchRef,pushedAt`. **Do not push yet.**
- After Maxime reviews: an empty remote has no `main` to open a PR against. Push the base `main` first (the current local `main`, which holds only docs), then push `feature/redesign-live-system` and open a PR into `main` with the merged site. Squash-merge it so `main` ends up with the site. Push the docs branch the same way if wanted. Maxime approves each push.
- Squash-merge so the PR title is the commit. Title suggestion: `feat: klyx.fr redesign`.
- Branch protection on `main` (GitHub Settings > Branches, available on private repos only on paid plans; if unavailable, rely on Netlify deploying only `main`): require a PR, require the Netlify deploy-preview check, block force push and deletion. Solo repo, so no required reviewer count.
- Do not merge `docs/deploy-plan` automatically; it carries only this file.

## 3. Netlify setup

Sources: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/ , https://opennext.js.org/netlify

**Adapter.** Netlify uses the OpenNext adapter (`@netlify/plugin-nextjs`), zero config, auto-updated each build. Docs say it supports Next.js 13.5 and later and is tested against each stable release. Next.js 16 and `proxy.ts` are **not named** in either page, so treat them as unverified until the preview passes.

| App feature | Netlify docs | Plan |
|---|---|---|
| Server Actions (`sendContact`) | Full support | Test the form on the preview |
| Route handlers (`llms.txt`, `md/[locale]`, `blog/rss.xml`) | Full support. `rss.xml` is `force-static`, `md` uses `generateStaticParams` | Curl each on the preview |
| Static / ISR (`generateStaticParams` on blog, realisations, locale layout) | Full support | none |
| `next/image` | Full support, served by Netlify Image CDN | Check a `/_next/image?url=...` request returns 200 |
| `opengraph-image.tsx` (8 routes) | **Not mentioned** | Curl each `/<path>/opengraph-image` for 200 and `image/png`; fallback below |
| `redirects` in `next.config.ts` (`legacyRedirects`) | Full support | Verify list in section 6 |
| `headers` in `next.config.ts` | **Not explicitly listed** | Curl `-I` and compare with the 5 headers; fallback below |
| `proxy.ts` (410 + next-intl) | **Not mentioned**. Middleware is "full support" via Edge Functions, Node middleware has no `fs` / C++ addons | Test 410 and locale redirect on preview. `proxy.ts` only uses `NextResponse` and next-intl, no `fs` |
| Next-intl locale redirects vs `next.config` redirects order | Docs: "Headers and Redirects are evaluated after middleware", the reverse of plain Next.js | Real risk: `/agence-web-bordeaux` and `/category/*` match the proxy matcher, so next-intl may redirect to `/fr/...` before the 308 to `/`. Verify; fallback below |

**Workarounds if a check fails** (add `netlify.toml`, ask Maxime before adding since it is a new config file):

- Headers: `[[headers]] for = "/*"` with the same five values as `securityHeaders`.
- Legacy redirects: Netlify's docs say redirects run after middleware, so test the list in section 6 on a deploy preview first. Preferred fallback: handle the legacy redirects inside `src/proxy.ts` before the next-intl handler (reuse `legacyRedirects` from `src/lib/legacy-urls.ts`), or exclude `/agence-web-bordeaux`, `/category`, `/author` and `/feed` from the proxy matcher so Next's config redirects apply. Last option only: mirror them as `[[redirects]]` in `netlify.toml`; whether those run ahead of middleware is not confirmed by the docs read here, so it needs its own preview test.
- OG images: if not generated, pre-render to static PNG in `public/` and point metadata at them.
- If `proxy.ts` fails to build or run on the adapter: the `NETLIFY`-specific docs link above plus the adapter's e2e report (https://runtime-e2e-report.netlify.app/) is the first place to look; last resort is renaming to `middleware.ts` (deprecated in Next 16, still works).

**Build settings.**

- Build command `npm run build` (the adapter sets publish dir; do not set one by hand).
- Node: pin `NODE_VERSION=22` in Netlify env (matches `@types/node ^22`; Next 16 needs a modern Node). The adapter docs do not state the default, so pin it.
- Lockfile is npm (`package-lock.json`), no pnpm hoisting workaround needed.
- Production branch `main`. Deploy previews on PRs are unlimited and not metered.
- Env vars (Site configuration > Environment variables, scope Builds + Functions + Runtime): `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_CAL_URL`, `NODE_VERSION`. Mark `RESEND_API_KEY` secret. Use a different Resend key or restricted key for previews if possible.
- Function region: default is US. Contact form latency to Resend is irrelevant; static pages come from the CDN. Region choice (EU) is a Pro-level setting per Netlify, unverified here; check in Site configuration > Functions.

**Plan and pricing** (https://www.netlify.com/pricing/ , https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ )

| | Free | Personal | Pro |
|---|---|---|---|
| Price | $0 | $9/month | $20/month, unlimited members |
| Credits/month | 300 | 1,000 | 3,000 |
| Analytics | not listed | 1-day observability | 30-day analytics |

Credit costs: production deploy 15, bandwidth 20 per GB, 10,000 requests 2, functions 10 per GB-hour. Deploy previews, branch deploys and failed deploys are not metered. Free has a hard limit with no auto recharge; the docs do not say outright that the site is paused at 0, but a "Resume paused projects" guide exists. Rough budget for this site: 20 production deploys (300) leaves nothing for traffic on Free, so Free is tight. Bandwidth and invocation caps are not listed per plan.

**Commercial use: the pricing and billing pages do not address it.** Read https://www.netlify.com/legal/terms-of-use/ before choosing. Recommendation: start on **Personal ($9)** for headroom only if the ToS allows a business site, otherwise **Pro ($20)**, which is also the plan MIGRATION.md compared against. Decision for Maxime.

**Analytics.** Netlify analytics is plan-gated (Pro: 30 days). Alternative that does not touch the plan: PostHog or similar, but adding a dependency and a cookie banner is a separate decision. Not part of launch.

## 4. DNS changes at OVH

Source: https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/

1. **T minus 24 to 48 h:** in the OVH DNS zone lower the TTL of root `A`, root `AAAA` to 300 (and note `www` will be new). Wait the old 3600 out.
2. In Netlify: Domain management > add `klyx.fr`. Netlify adds both apex and `www` automatically. Make `klyx.fr` primary; `www.klyx.fr` becomes a domain alias that redirects to apex (https://docs.netlify.com/manage/domains/configure-domains/add-a-domain-alias/). Netlify will show the site's `<name>.netlify.app` subdomain for the CNAME.
3. **At T, in OVH DNS:**

| Name | Type | Action | Value |
|---|---|---|---|
| `klyx.fr` | A | change | `75.2.60.5` (Netlify load balancer, documented fallback) |
| `klyx.fr` | AAAA | **delete** | was `2001:41d0:301::21`, would keep IPv6 visitors on OVH |
| `www` | CNAME | add | `<site>.netlify.app.` |

   Pre-cutover (T minus 48 h, with the TTL change): open the OVH manager > Domains > klyx.fr > DNS zone > Add an entry and note which record types exist. If ALIAS/ANAME is offered, use it for the apex (`apex-loadbalancer.netlify.com`, Netlify's recommended option) and skip the A record. If only A is offered, use A `75.2.60.5`. Write the decision in the cutover notes. OVH's editor not offering ALIAS is unverified. The Netlify docs note an apex on external DNS cannot use direct CDN routing and recommend a subdomain as primary; accepted tradeoff, the brand domain is the apex.
4. HTTPS: Netlify can only issue the Let's Encrypt certificate **after** DNS points to Netlify, so expect HTTPS errors or the old OVH certificate for a few minutes after T (allow up to about 15 minutes for DNS plus issuance). Domain management > HTTPS > Verify DNS, then Provision; enable "Force HTTPS" once issued. If no valid certificate after 30 minutes, roll back (section 8). Troubleshooting: https://docs.netlify.com/manage/domains/troubleshooting/troubleshoot-ssl-and-https/
5. Do not enable Netlify DNS for the zone; the zone stays at OVH.

## 5. Records

**Untouched** (never edit, never delete): MX x3 (Zoho EU), root SPF TXT (do not add Resend to it), `zmail._domainkey`, `brevo1/2._domainkey`, `_dmarc` (stays `p=none`; tightening is a separate task after Resend alignment is confirmed), `brevo-code`, `lemlist-verif`, `66a9581d...` TXT, `blog`/`studio`/`estate` CNAMEs. Only root `A`, root `AAAA` and new `www` change.

**Add only, Resend** (do now, independent of the cutover): add `send.klyx.fr` in the Resend dashboard and paste exactly the names and values it shows; do not guess them. Expected shape: `send` MX (priority 10), `send` TXT SPF (`include:amazonses.com`), `resend._domainkey` TXT DKIM. Skip Resend's optional `_dmarc` record, one exists. Wait for "Verified", then send a test from the form and from the Resend dashboard to a Gmail address and a Zoho address; in the received headers check SPF and DKIM pass and align with `send.klyx.fr` (From domain), and that `contact@send.klyx.fr` does not land in spam.

## 6. Redirects from the old WordPress site

Implemented in `next.config.ts` via `src/lib/legacy-urls.ts` and `src/proxy.ts`; reference table in `docs/redirects.md`. Verify with curl after cutover, and first against the `*.netlify.app` preview:

```sh
H=https://klyx.fr
for p in /agence-web-bordeaux /agence-web-bordeaux/ /category/non-classe/ /author/x /feed /sitemap_index.xml /wp-sitemap.xml /page-sitemap.xml "/?attachment_id=425"; do
  echo "== $p"; curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "$H$p"
done
```

Run the loop with `-L` off first (single hop), then `curl -sIL` on each (full chain). Expected, per old URL:

| Old URL | Final status | Final target |
|---|---|---|
| `/agence-web-bordeaux` | 308 | `/` then 200 (or `/fr` per next-intl default, then 200) |
| `/agence-web-bordeaux/` | 308 to slash-less, then 308 | `/`, 200 |
| `/category/non-classe/` | 308 | `/`, 200 |
| `/author/x` | 308 | `/`, 200 |
| `/feed` | 308 | `/blog/rss.xml`, 200 |
| `/sitemap_index.xml`, `/wp-sitemap.xml`, `/page-sitemap.xml` | 308 | `/sitemap.xml`, 200 |
| `/?attachment_id=425` | 308 | `/wp-content/uploads/2025/07/guide_vitrine_essentiels.pdf?attachment_id=425`, 200 `application/pdf` |

```sh
for p in /wp-admin/ /wp-login.php /xmlrpc.php /wp-json/wp/v2/posts /wp-content/uploads/2024/01/x.jpg; do
  echo "== $p"; curl -s -o /dev/null -w "%{http_code}\n" "$H$p"; done
curl -sI $H/wp-content/uploads/2025/07/guide_vitrine_essentiels.pdf | head -5
```

Expect 410 for the first five, 200 `application/pdf` for the lead magnet. If any `/agence-web-bordeaux` check returns a redirect to `/fr/...` instead of `/`, apply the fallback order from section 3: `proxy.ts` handling or matcher exclusion first, `netlify.toml` only as a last option.

## 7. Cutover runbook

Choose a low-traffic window, not a Friday.

**Before (T minus 48 h):** go/no-go all green, TTL lowered, Resend verified, preview checks passed.

**Pre-flight (T minus 30 min):**

```sh
date -u
for t in NS A AAAA MX TXT; do dig +short $t klyx.fr; done
dig +short TXT _dmarc.klyx.fr; dig +short TXT zmail._domainkey.klyx.fr
dig +short CNAME brevo1._domainkey.klyx.fr; dig +short CNAME brevo2._domainkey.klyx.fr
dig +short A www.klyx.fr; dig +short TXT send.klyx.fr
curl -sI https://<site>.netlify.app | head -5
```

**At T:** apply the three OVH changes from section 4. HTTPS is not valid until Netlify issues the certificate after DNS resolves; start the 30 minute rollback clock now, and run the HTTPS curls below once the certificate is issued. Then:

```sh
dig +short A klyx.fr @ns20.ovh.net          # A case: 75.2.60.5. ALIAS case: Netlify load balancer IP(s), not 188.165.53.185 and not necessarily 75.2.60.5; also run: dig +short ALIAS/ANAME is not visible, so confirm in the OVH zone view
dig +short AAAA klyx.fr                      # empty
dig +short CNAME www.klyx.fr                 # <site>.netlify.app.
curl -sI https://klyx.fr | head -8           # 200, valid TLS, server: Netlify
curl -sI https://www.klyx.fr | head -5       # 301/308 to https://klyx.fr/
curl -sI http://klyx.fr | head -3            # redirect to https
curl -sI https://klyx.fr/en | head -5
curl -s https://klyx.fr/llms.txt | head -3
curl -sI https://klyx.fr/blog/rss.xml | head -3
curl -sI https://klyx.fr/sitemap.xml | head -3
curl -sI https://klyx.fr/opengraph-image | head -4
curl -sI https://klyx.fr | grep -iE "strict-transport|x-content-type|x-frame|referrer-policy|permissions-policy"
```

Run section 6 curls. Submit the contact form in FR and EN.

**Mail (the one that matters):** external address to `contact@klyx.fr` arrives in Zoho; Zoho to an external address shows SPF, DKIM, DMARC pass in the headers; re-run the pre-flight `dig` block and diff: only the apex address record (A, or the ALIAS/ANAME record chosen in section 4, replacing the old A), the removed AAAA and the new `www` CNAME differ.

**Monitoring, 14 days:** daily for the first 3 days then every 2 to 3 days: contact form test, Netlify deploy and function logs, Search Console (submit `https://klyx.fr/sitemap.xml`, watch coverage and crawl errors for the old WordPress URLs), credit usage in the Netlify billing page, Resend dashboard delivery and bounces, a Zoho inbound test. Keep TTL at 300 for these 14 days, raise to 3600 after.

## 8. Rollback

Trigger: site down, **no valid TLS certificate within 30 minutes of T**, broken form with no quick fix, any mail anomaly.

1. OVH DNS: root `A` back to `188.165.53.185`, re-add root `AAAA` `2001:41d0:301::21`. `www` did not exist before; delete it or leave it.
2. Wait at most 300 s (TTL). Check `dig +short A klyx.fr`, `dig +short AAAA klyx.fr`, `curl -sI https://klyx.fr` (old WordPress, OVH).
3. Check mail again (MX never changed, should be unaffected) and that `blog/studio/estate` still resolve.
4. Do not cancel OVH hosting until 14 clean days. After rollback, diagnose on the `*.netlify.app` URL and retry.

## 9. OVH cancellation

| Item | Action | When |
|---|---|---|
| Web hosting (WordPress, `188.165.53.185`) | Cancel | After 14 clean days: no rollback, mail fine, Search Console clean |
| Domain registration `klyx.fr` | Keep | Never cancel |
| DNS zone (`ns20` / `dns20.ovh.net`) | Keep | Serves MX, Zoho, Brevo, Resend and Vercel subdomain records |

Steps: (1) export WordPress backup: files, DB dump, `wp-content/uploads`, `.htaccess`, store off OVH; (2) in OVH manager confirm no mail plan, domain or DNS zone is bundled with the hosting offer; (3) check the DNS zone still lists every record from the snapshot; (4) cancel the hosting offer (end of billing period option if available); (5) re-run the `dig` block, confirm nothing changed, confirm auto-renew stays on for the domain.
