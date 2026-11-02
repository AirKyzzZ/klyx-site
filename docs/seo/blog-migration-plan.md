# Plan: blog.klyx.fr into klyx.fr/blog

Written 2026-11-02. Plan only. Nothing executed: no code, DNS, Vercel, Netlify or Search Console change. Sources read: `blog-klyx/content/posts/*.mdx`, live `blog.klyx.fr/sitemap.xml` and `robots.txt` (curl), `docs/KLYX_STRATEGY.md` sections 7, 9, 10, `src/lib/content.ts`, `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/[locale]/blog/**`, `src/lib/legacy-urls.ts`, `src/proxy.ts`, `docs/DEPLOY_PLAN.md`, `docs/seo/gsc-audit-2026-11-02.md`.

## 0. What the audit shows

- 12 posts, all dated 2025-11-01 to 2025-11-15 (bulk published in two weeks, no `updated` field, no `sources` field, nothing edited since). Oldest-to-newest gap vs today: about 11.5 months.
- Live sitemap has 38 URLs: `/`, `/about`, `/contact`, `/tags`, 12 posts, 22 tag pages. This matches the 38 pages Search Console reports.
- Almost no post carries a sourced fact. Stats such as "87% des Bordelais recherchent en ligne", "46% des recherches locales", "67% du parcours B2B", and every case-study result (`-65 % de temps de chargement`, `+28 % de leads`, `+240 %`) have no source. Three posts present anonymous client results (`etude-cas-site-evenements`, `roi-cache-site-web-2025`, `wordpress-vs-next-creation-site`). Treat all of it as unverified. Nothing from these posts is republished without a source or Maxime's confirmation that the project was real.
- Prices in `cout-creation-site-web` and `creation-site-web-bordeaux-2025` are generic market ranges and conflict with the klyx.fr price grid (900 / 2 900 / custom, Sprint IA 4 500 HT).
- Voice: posts say "Klyx Studio" and sell WordPress/SEO/web in Bordeaux. Strategy positions on AI agents, automation, sites for startups, agencies and SMEs.
- Google quirks seen in `site:klyx.fr` (GSC audit): `blog.klyx.fr/posts` and `blog.klyx.fr/wordpress-vs-next-creation-site` are indexed but return 404 today (curl confirmed). They need redirects too.
- Old blog property in Search Console (URL-prefix, same Google account) holds the historical clicks and impressions. Not opened. It is the source to read once Maxime approves (phase 1). Overview only so far: 19 indexed, 6 not indexed, 1 click total, which suggests traffic is near zero and most verdicts will not change.

## 1. Post-by-post verdicts

Traffic column: "to check" means the old property could change the verdict (rule: a retired post with real clicks or a referring domain gets a 301 to the closest page instead of a 410).

| # | Old URL | Topic | Date / words | Verdict | Target on klyx.fr | Reason |
|---|---|---|---|---|---|---|
| 1 | `/posts/creation-site-web-bordeaux-2025` | Website creation guide, Bordeaux | 2025-11-01 / 1753 | Merge | `/services/creation-site-web` | Query 12 and "création site web bordeaux" (saturated, strategy says one solid page only). Absorb the steps and FAQ ideas, with fresh facts. Traffic: to check |
| 2 | `/posts/cout-creation-site-web` | Website cost guide | 2025-11-02 / 967 | Rewrite | new `/blog/cout-site-internet-professionnel` (article 10) | Queries 11 and 5 family (prix landing page, winnable). Rebuild on the real price grid, dated sources, 2026. Do not reuse the old ranges. Traffic: to check |
| 3 | `/posts/choisir-agence-web-bordeaux` | How to choose a web agency, Bordeaux | 2025-11-03 / 1162 | Merge | `/agence-ia-bordeaux` | Local-intent FAQ material for the local page. The "panorama des agences" names competitors and is unverified, drop it. Traffic: to check |
| 4 | `/posts/seo-local-bordeaux` | Local SEO guide | 2025-11-04 / 907 | Retire | 410 (301 to `/agence-ia-bordeaux` if traffic or links) | Not an offer. No query in the map. Stats unsourced. Traffic: to check |
| 5 | `/posts/etude-cas-site-evenements` | Anonymous case study, events site | 2025-11-05 / 886 | Retire | 410 | Anonymous client, unverifiable results. Real proof lives in `/realisations`. If Maxime confirms it was a real project with consent, convert to a `/realisations` entry instead (then 301 there) |
| 6 | `/posts/calendrier-evenements-bordeaux-2025` | 2025 events calendar | 2025-11-06 / 976 | Retire | 410 | Time-stamped, expired, off-topic |
| 7 | `/posts/tendances-web-design-2025` | Web design trends 2025 | 2025-11-07 / 969 | Retire | 410 | Time-stamped, generic, no query fit |
| 8 | `/posts/optimiser-site-wordpress-vitesse` | WordPress speed guide | 2025-11-08 / 1042 | Retire | 410 | Not the offer, WordPress plugins and hosting claims go stale. Traffic: to check |
| 9 | `/posts/strategie-contenu-sites-b2b` | B2B content strategy | 2025-11-09 / 4451 | Retire | 410 | Off-topic, generic, stats unsourced. Longest post but no fit in the 14-query map. Traffic: to check (it is the title Google shows on `/posts`) |
| 10 | `/posts/bdx-io-2025-conference-tech-bordeaux` | BDX I/O 2025 recap | 2025-11-10 / 3043 | Retire | 308 to `/blog` (was 410) | Event recap, time-stamped, 50% speaker figures unsourced. Verdict changed: 1 click and 110 impressions on "bordeaux io" (borderline, see Traffic data) |
| 11 | `/posts/roi-cache-site-web-2025` | Hidden ROI of a website | 2025-11-14 / 1615 | Retire | 410 | Invented-looking ETI case study and KPIs, "Calendly klyx-studio" CTA outdated |
| 12 | `/posts/wordpress-vs-next-creation-site` | WordPress vs Next.js | 2025-11-15 / 1908 | Rewrite | new `/blog/wordpress-ou-nextjs-site-startup` | Fits the audience (startups, agencies) and supports queries 11 and 12. Remove the anonymous "PME industrielle" results, add sourced numbers, rewrite for "on/nous". Indexed at the root path too. Traffic: to check |

Counts after traffic data: migrate as is 0, rewrite 2, merge 2, retire 8 (7 return 410, 1 returns 308 to `/blog`). Proposed slugs for the two rewrites are suggestions; article 10 has no fixed slug in strategy section 10.

The five pillar articles (`cout-agent-ia-pme`, `audit-ia-bpifrance-diagnostic-data-ia`, `integrer-ia-pme-methode`, `forward-deployed-engineer-definition`, `etre-cite-par-chatgpt-perplexity`) are new content and are not part of this migration. The old blog adds nothing to them.

Fact re-verification before any republish (rewrites 2 and 12, merges 1 and 3): every number gets a dated source in `meta.sources`, or is deleted. No figure is carried over from the old posts.

## Traffic data (read 2026-11-02)

Source: Search Console property `https://blog.klyx.fr/` (URL-prefix), read-only, Web search type, range "16 mois" = 2025-11-01 to 2026-10-31 (the earliest data available; the property has nothing older). Last data update about 4 days before reading.

Totals: 5 clicks, 1 190 impressions (1,19 k), CTR 0,4 %, average position 20,9. 24 pages with impressions, 139 distinct queries. Impressions only really start in Aug 2026 (peak around Sep 2026); clicks are isolated single events.

Pages report: 19 indexed, 6 not indexed. One reason: "Explorée, actuellement non indexée" (Google systems, validation not started, first detected 2025-11-04). Examples: `/tags/b2b`, `/posts/etude-cas-site-evenements`, `/posts/calendrier-evenements-bordeaux-2025`, `/tags/marketing`, `/tags/technologie`, `/tags/strategie`.

Sitemaps: `/sitemap.xml`, submitted 2 Nov 2025, last read 26 Dec 2025, status "Opération effectuée", 38 pages discovered, 0 videos.

Threshold: a retired post gets a 308 if it has at least 1 click in the 16 months. Borderline = 0 clicks but 100+ impressions, or exactly 1 click.

| Old URL | Clicks | Impressions | Top query (impressions) | Verdict |
|---|---|---|---|---|
| `/` | 2 | 107 | not checked | 308 `/blog` (unchanged) |
| `/posts/choisir-agence-web-bordeaux` | 1 | 126 | agences web bordeaux (40) | 308 `/agence-ia-bordeaux` (unchanged) |
| `/posts/bdx-io-2025-conference-tech-bordeaux` | 1 | 110 | bordeaux io (27) | 410 to 308 `/blog` (changed, borderline: one click) |
| `/contact` | 1 | 55 | not checked | 308 `/contact` (unchanged) |
| `/posts/creation-site-web-bordeaux-2025` | 0 | 368 | création site web bordeaux (72) | 308 `/services/creation-site-web` (unchanged) |
| `/posts/strategie-contenu-sites-b2b` | 0 | 194 | stratégie de contenu b2b (57) | 410 (unchanged, borderline: 194 impressions, 0 clicks) |
| `/posts/optimiser-site-wordpress-vitesse` | 0 | 167 | comment optimiser wordpress avec kvm (26) | 410 (unchanged, borderline: 167 impressions, 0 clicks) |
| `/posts/wordpress-vs-next-creation-site` | 0 | 104 | guide référencement (10) | 308 to the rewrite (unchanged) |
| `/posts/tendances-web-design-2025` | 0 | 83 | tendance webdesign 2025 (32) | 410 (unchanged) |
| `/about` | 0 | 60 | not checked | 308 `/a-propos` (unchanged) |
| `/posts/etude-cas-site-evenements` | 0 | 23 | not checked | 410 (unchanged) |
| `/posts/calendrier-evenements-bordeaux-2025` | 0 | 12 | not checked | 410 (unchanged) |
| `/posts/roi-cache-site-web-2025` | 0 | 10 | not checked | 410 (unchanged) |
| `/posts/seo-local-bordeaux` | 0 | 7 | not checked | 410 (unchanged) |
| `/posts/cout-creation-site-web` | 0 | 1 | not checked | rewrite, 308 once live (unchanged) |
| `/posts` (known 404) | not in report | not in report | none | 308 `/blog` (unchanged) |
| `/wordpress-vs-next-creation-site` (known 404) | not in report | not in report | none | 308 to the rewrite (unchanged) |

Tag pages (12 with impressions, all 0 clicks, 1 to 15 impressions each, `/tags/conseils` 15 highest): 410 unchanged.

Notes: "not checked" means per-page query drill-down was skipped because impressions are under 25 or the page is not a post. The top query shown for `/posts/wordpress-vs-next-creation-site` is a malformed string from Search Console (`"guide référencement",0,10,,,0,0`), read as "guide référencement". The two known-404 URLs have no rows in the Performance report over 16 months, so they carry no traffic.

## 2. Redirect map

All rules apply to host `blog.klyx.fr`. Target host is `https://klyx.fr`. Permanent redirects use 308 (same as klyx-site; Google treats 301 and 308 alike). 410 means no equivalent page.

| Old URL | Status | Target |
|---|---|---|
| `/` | 308 | `/blog` |
| `/posts` (indexed today, 404) | 308 | `/blog` |
| `/posts/creation-site-web-bordeaux-2025` | 308 | `/services/creation-site-web` |
| `/posts/cout-creation-site-web` | 308 | `/blog/cout-site-internet-professionnel` (only once live) |
| `/posts/choisir-agence-web-bordeaux` | 308 | `/agence-ia-bordeaux` |
| `/posts/wordpress-vs-next-creation-site` | 308 | `/blog/wordpress-ou-nextjs-site-startup` (only once live) |
| `/wordpress-vs-next-creation-site` (indexed today, 404) | 308 | same as above |
| `/posts/seo-local-bordeaux` | 410 | none (traffic check may turn into 308 to `/agence-ia-bordeaux`) |
| `/posts/etude-cas-site-evenements` | 410 | none |
| `/posts/calendrier-evenements-bordeaux-2025` | 410 | none |
| `/posts/tendances-web-design-2025` | 410 | none |
| `/posts/optimiser-site-wordpress-vitesse` | 410 | none |
| `/posts/strategie-contenu-sites-b2b` | 410 | none |
| `/posts/bdx-io-2025-conference-tech-bordeaux` | 308 | `/blog` (1 click in 16 months, borderline; revert to 410 if Maxime prefers) |
| `/posts/roi-cache-site-web-2025` | 410 | none |
| `/posts/<anything else>` | 404 | none |
| `/about` | 308 | `/a-propos` |
| `/contact` | 308 | `/contact` |
| `/tags` | 308 | `/blog` |
| `/tags/*` (22 pages: guide, bordeaux, tech, evenements, evenement, seo, conseils, technologie, nextjs, business, roi, site-web, marketing, b2b, strategie, wordpress, performance, design, tendances, ux, etude-de-cas, prix) | 410 | none. Thin tag listings with no equivalent, and redirecting 22 pages to one index reads as a soft 404 |
| `/rss.xml` | 308 | `/blog/rss.xml` (feed is empty until posts land; readers of the old feed lose its 12 items, accepted) |
| `/sitemap.xml` | 200, not a redirect | Keep serving a static sitemap of the old URLs for the monitoring period (section 4). Remove it when the old property is retired |
| `/robots.txt` | 200 | Keep allowing all; drop the `rss.xml` sitemap line and the unused `Host:` line |

Rules: no chains (every target is final), preserve nothing from query strings, trailing slashes normalised by Next. Cover images under `/assets/posts/**` stay served from Vercel under option (a); nothing links to them from klyx.fr.

## 3. How to serve the redirects

Both options need `blog.klyx.fr` to keep resolving and returning valid TLS for at least 12 months. Google: "Keep the redirects for as long as possible", generally at least one year.

### (a) Keep the Vercel project, redirects only

- Change in `blog-klyx` repo: add a `proxy.ts` (Next 16) with a static map of the table above (308s and 410s in one place), matcher extended to include `rss.xml` and `sitemap.xml` paths (dotted paths are excluded by default matchers), and replace `app/sitemap.ts` with a static old-URL sitemap. `vercel.json` `redirects` cannot return 410, and legacy `routes` cannot be combined with the existing `headers`, so a proxy is the clean way to get both statuses.
- DNS: no change. `blog` CNAME stays `7ce82a2a6da03495.vercel-dns-017.com.`.
- Pros: zero DNS or certificate risk, instant rollback with Vercel's deploy rollback, can still serve the old sitemap and robots, no coupling to klyx-site releases, no Netlify credits spent on old-URL crawl traffic.
- Cons: a Vercel project stays alive. Check which plan it is on: `docs/MIGRATION.md` notes Hobby forbids commercial use; a redirect-only shell is low risk but confirm. (Unknown, to check.)

### (b) Point `blog` CNAME to Netlify, host-based redirects in `src/proxy.ts`

- DNS change at OVH: `blog` CNAME from `7ce82a2a6da03495.vercel-dns-017.com.` to `<site>.netlify.app.`; add `blog.klyx.fr` as a domain alias in Netlify (domain alias doc referenced in `DEPLOY_PLAN.md` section 4); wait for the Let's Encrypt certificate, which Netlify can only issue after DNS points to it, so expect a TLS gap of up to about 15 minutes.
- Code: `src/proxy.ts` needs a host check before i18n handling, absolute redirect targets (`NextResponse.redirect` on a cloned `nextUrl` keeps the host, which is wrong here), matcher entries for `/rss.xml` and `/sitemap.xml`, and the old sitemap and robots served for that host from the same app. More moving parts in the file that already carries WordPress redirects.
- Pros: Vercel can be deleted immediately, one platform.
- Cons: introduces a TLS window and a DNS rollback on a host that currently works, mixes legacy host logic into the production proxy, and the Netlify adapter's behaviour for `proxy.ts` is still marked unverified in `DEPLOY_PLAN.md`.

### Recommendation: (a)

Lower risk, no DNS touch, easy rollback, and it keeps the old sitemap and robots under our control. Revisit (b) only at the 12-month mark if Vercel becomes a cost or a plan problem.

Stays untouched in OVH under either option: apex A, `www` CNAME, MX x3 (Zoho EU), SPF, `zmail._domainkey`, `brevo1/2._domainkey`, `_dmarc`, `brevo-code`, `lemlist-verif`, the `66a9...` TXT, the `google-site-verification` TXT (removing it loses Search Console ownership), and the `studio` and `estate` CNAMEs. Under (a), the `blog` CNAME is untouched as well.

## 4. Sequencing

1. Read the old property (needs Maxime's OK). Pull Performance for 16 months by page and query, the Links report (top linking sites), and Pages (the 6 not indexed). Fill the "to check" cells. A verdict flips to a 308 when a retired URL has meaningful clicks, impressions on a target query, or a referring domain. Also check the Vercel plan. Effort 1 to 2 h.
2. Write and publish target pages on klyx.fr: merge material into `/services/creation-site-web` and `/agence-ia-bordeaux`; write rewrites 2 and 12 with sourced facts. Each new URL gets a self-referencing canonical (Google's site-move guidance). Includes the code fix in section 5.
3. Ship redirects (option a). Release in two steps: first everything whose target already exists plus the 410s; the two rewrite URLs stay served as normal pages until their replacement is live, then a second release adds them. Optional low-cost safety: ship as 307 for 24 h, test, then flip to 308 (browsers cache 308 permanently).
4. Search Console steps:
   - Change of Address does not apply. Evidence: Google's help page says the tool "can be used only on properties at the domain level" and "You cannot move properties at the path level"; the blog property is a URL-prefix property and the destination is a path (`klyx.fr/blog`). Google's site-move guide says you need the tool "when moving from one domain or subdomain to another", and does not address subdomain to subdirectory. So: not available for this case per the docs, and it is only an optional hint anyway. Do not rely on it.
   - Submit `https://klyx.fr/sitemap.xml` (domain property `sc-domain:klyx.fr` covers both hosts, so one property shows both sides).
   - Keep `https://blog.klyx.fr/sitemap.xml` submitted (static old-URL list) for monitoring. Google expects warnings for redirected URLs in it and says to ignore them.
   - Inspect the key URLs live: the 4 redirected posts, `/`, `/about`, one 410 post, `/rss.xml`, and each new target. Request indexing for the new blog pages.
   - No removal requests.
5. Update internal and external links where possible: klyx.fr footer or nav to `/blog`, LinkedIn drafts that point to blog.klyx.fr, email signature, Brevo templates, `studio` and `estate` sites if they link to the blog (to check with grep).
6. Monitor 90 days: weekly in the domain property, clicks and impressions per old URL group vs new, Pages report (expect the 410s to move to "Not found 404/410" and old URLs to drop), crawl stats, plus daily curl of the redirect table for the first week. Keep a crawl-error alert on 5xx from `blog.klyx.fr`.
7. Rollback: Vercel instant rollback to the previous deployment, or revert the proxy commit. Under (a) there is no DNS to undo. If a 308 was cached by browsers, nothing to do server-side; Google re-evaluates on recrawl. Rollback trigger: any redirect to a wrong or 404 target, or 5xx on the old host.
8. Retire the Vercel project: not before 12 months of live redirects, and only when the old property shows near-zero crawl and click traffic on old URLs. If retiring earlier is wanted, switch to option (b) first (DNS change, then delete Vercel). Then delete the `blog` CNAME only after the redirect is no longer needed, which drops all old-URL answers (404 at that point).

## 5. EN versions and hreflang

Recommendation: FR only. The old posts are French, the queries are French, and none of the 12 earns an EN twin. Write EN only for a future post that ranks or is cited, or for an English-first ICP.

Current code assumes both locales exist:

- `src/lib/seo.ts`: `buildMetadata` always emits hreflang for every locale plus `x-default` via `languageAlternates`. For a FR-only post the `en` alternate points to a 404.
- `src/app/sitemap.ts`: posts use `sharedSlugs`, which keeps only slugs present in both locales. A FR-only post would be left out of the sitemap entirely. (`sharedSlugs` is correct for case studies if they are always bilingual; it must not be used for posts.)
- `generateStaticParams` and `loadPost` already work per locale, so `/en/blog/<fr-only>` returns 404, which is correct.
- `src/components/language-switcher.tsx` would link a FR-only post to its missing EN URL (check the component).
- `/en/blog` would list zero posts and show the empty state.

Required change (small, one PR):

1. `languageAlternates` and `buildMetadata` accept an optional `locales` list; post pages pass the locales where `<slug>.<locale>.mdx` exists. Single-locale post: no `alternates.languages` entry for the missing locale, and `x-default` points to the existing one. Canonical stays self-referencing.
2. `sitemap.ts`: for posts, iterate each locale's own list; add `alternates.languages` only when both exist.
3. Language switcher: on a FR-only post, link to `/en/blog` or hide it.
4. `/en/blog` while it has no posts: `robots: noindex`, excluded from the sitemap, hidden from the EN nav.
5. Add tests next to `sitemap.test.ts` for a FR-only post (in sitemap, no hreflang for `en`).

Frontmatter note: blog-klyx uses YAML frontmatter (`title`, `date`, `slug`, `tags`, `keywords`, `coverImage`). klyx-site uses `export const metadata = { title, date, updated?, summary, sources? }` at the top of `content/blog/<slug>.<locale>.mdx`; the slug comes from the filename. Rewritten posts use the latter, `summary` replaces `description`, and `sources` takes the dated source list. `content/blog/_placeholder.draft.mdx` keeps the import glob non-empty and has no locale suffix, so it is never listed.

## 6. Decisions for Maxime (max 4)

1. Open the old Search Console property read-only? Recommend yes, before any code: it can flip verdicts and costs one hour.
2. Retire 8 posts with 410, instead of redirecting everything to `/blog`? Recommend yes: they have no equivalent and a blanket redirect looks like a soft 404. Exception: any retired URL with real traffic or links gets a 308.
3. Redirect hosting: option (a), keep the Vercel project as a redirect shell for 12 months? Recommend yes; confirm the Vercel plan is acceptable for it.
4. Anonymous case studies (`etude-cas-site-evenements`, `roi-cache-site-web-2025`, the "PME industrielle" in `wordpress-vs-next-creation-site`): were any real? Recommend treating all as unverifiable and not republishing them, unless you confirm a project and give consent.

## 7. Effort per phase

| Phase | Effort |
|---|---|
| 1. Read old property, fill traffic cells | 1 to 2 h |
| 2a. i18n/hreflang fix and tests (section 5) | 3 to 4 h |
| 2b. Merge material into two service/local pages | 2 to 3 h |
| 2c. Rewrite two posts, with sources | 3 to 4 h each, 6 to 8 h total |
| 3. Redirect proxy in blog-klyx, static sitemap, tests, deploy | 2 to 3 h |
| 4. Search Console steps and key URL inspection | 1 h |
| 5. Link updates | 1 h |
| 6. Monitoring | 15 min per week for 90 days |
| 8. Retirement | 30 min at month 12 |

Total build effort about 16 to 22 h, plus monitoring.

## Decisions (Maxime, 2026-11-02)

1. Old blog Search Console property: read it, read-only, before any verdict is final.
2. The 8 retired posts: 410, unless traffic data justifies a 308 to the closest page.
3. Vercel redirect shell: keep 12 months (check which Vercel plan it's on).
4. Anonymous case studies in old posts: real, can be reused, still anonymous.
