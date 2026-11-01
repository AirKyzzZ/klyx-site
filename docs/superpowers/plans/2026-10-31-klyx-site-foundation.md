# klyx.fr foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build every template-independent part of the new klyx.fr (FR + EN routing, content, MDX, SEO/GEO, contact, redirects, legal) plus `MIGRATION.md` and the Phase 4 sales assets, so the chosen design template can be layered on afterwards.

**Architecture:** Next.js 16 App Router with next-intl `[locale]` routing (FR default without prefix, EN under `/en` with localized slugs). All copy lives in `messages/{fr,en}.json` and MDX files; pages are statically generated per locale and styled only with neutral, semantic Tailwind until the design plan (separate, after Maxime's template pick) restyles them. The only server code is a Server Action that sends the contact form through Resend.

**Tech Stack:** Next 16.4, React 19, TypeScript strict, Tailwind 4.3, next-intl 4.14, @next/mdx 16.4, zod 4, resend 6, Vitest 5, Playwright 1.64.

**Spec:** `docs/superpowers/specs/2026-10-31-klyx-site-design.md` (research: `docs/KLYX_STRATEGY.md`)

## Global Constraints

- Repo: `/Users/samsepiol/Downloads/GithubRepos/Work/Projets-perso/klyx-site`, branch `feature/site-foundation`, conventional commits, subject only. Never push to `main`, never deploy, never touch DNS.
- No code comments unless a hidden constraint / invariant / upstream workaround / surprising platform behaviour; one line max.
- Files kebab-case, named exports (Next special files `page.tsx`, `layout.tsx` etc. use the required default export), no `any`, early returns.
- Locales: `fr` (default, no prefix) and `en` (`/en`). Every page exists in both.
- Never write « développeur embarqué ». Never invent proof; every unverified claim, number, client or employer name is wrapped in a visible `TODO(maxime)` marker in copy.
- Prices (€ HT, « à partir de »): landing page 900; Site IA 2 900; site sur mesure 5 700; Audit IA 1 500 (credited against the build, terms TODO(maxime)); Sprint IA 4 500 (2 weeks, fixed scope); retainer TODO(maxime); FDE 700/day, 2-3 days a week, 4-week minimum (from ~5 600), capacity 2 clients.
- Hero FR: « Des agents IA qui tournent en production, pas des démos. » Sub FR: « Sites, agents et automatisations livrés au forfait pour startups et agences. Devis gratuit, prix publics. »
- Voice: direct, fiable, rapide; first person singular; no buzzwords.
- Contact mail: from `Klyx <contact@send.klyx.fr>`, to `CONTACT_TO_EMAIL` (contact@klyx.fr), reply-to the visitor. Env: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_CAL_URL`. Missing env throws at send time with a clear message.
- Booking: Cal.com only.
- Motion: none in this plan.
- Every task ends with `npm run lint && npm run typecheck && npm test` green.

## Review Focus

1. A visitor on `/en/...` who switches language lands on the FR equivalent page (localized slug), not a 404. Test in Task 2.
2. A bot fills the honeypot or posts garbage to the contact action: no email sent, no crash, generic success shown to the bot. Test in Task 6.
3. `RESEND_API_KEY` missing in production: the form shows a helpful error and the server logs a clear message, never a silent success. Test in Task 6.
4. Old WordPress URLs (`/agence-web-bordeaux/`, `/feed/`, `/?attachment_id=425`, `/wp-login.php`) resolve to a redirect or a 410, never a 200 of a wrong page or a 404. Test in Task 7.
5. FR and EN message files drift (a key added in one only), rendering raw keys on the page. Test in Task 2.

---

### Task 1: Scaffold the repo

**Files:**
- Create: project via `npx create-next-app@16.4.3 . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack` (run in a temp dir and move in, since `docs/` exists)
- Create: `vitest.config.ts`, `src/test/setup.ts`
- Modify: `package.json` scripts: `typecheck: tsc --noEmit`, `test: vitest run`, `test:e2e: playwright test`
- Create: `src/app/fonts.ts` (next/font/google: `Inter_Tight` var `--font-sans`, `Instrument_Serif` italic 400 var `--font-serif`, `Geist_Mono` var `--font-mono`)
- Create: `src/app/globals.css` tokens under `@theme`: `--color-paper #FAF9F5`, `--color-ink #141413`, `--color-accent #E8431F`, `--color-muted #6B6A65`, `--color-line #E6E3DA` (provisional, design plan may replace)
- Create: `.env.example` with the three env names, `.gitignore` includes `.env*` except `.env.example`

- [ ] **Step 1:** `git init -b main`, commit `docs/` alone: `docs: add strategy, spec and plan`. Then `git checkout -b feature/site-foundation`.
- [ ] **Step 2:** Scaffold, add vitest + @vitejs/plugin-react + jsdom + @testing-library/react, prettier with prettier-plugin-tailwindcss.
- [ ] **Step 3:** Write `src/test/smoke.test.ts` asserting `1 + 1 === 2`; run `npm test` → PASS. Delete it after Task 2 adds real tests.
- [ ] **Step 4:** `npm run lint && npm run typecheck && npm run build` → all succeed.
- [ ] **Step 5:** Create private GitHub repo: `gh repo create AirKyzzZ/klyx-site --private --source . --remote origin` (do not push yet). Commit `chore: scaffold next 16 app with tailwind and vitest`.

### Task 1b: Adopt the Mainline design base

**Files:**
- Create: `src/components/ui/*` (shadcn primitives Mainline uses), `src/components/layout/navbar.tsx`, `src/components/layout/footer.tsx`, `src/components/blocks/*` (each Mainline section as its own file, kebab-case), `components.json`
- Modify: `src/app/globals.css` (Mainline theme tokens replace the provisional Task 1 tokens; keep `--font-serif` and `--font-mono` variables), `src/app/fonts.ts` (Mainline's sans + Instrument Serif + Geist Mono), `package.json` (Mainline runtime deps such as `motion`, `lucide-react`, Radix packages, at versions compatible with Next 16.4 / React 19)
- Create: `src/app/design-preview/page.tsx` rendering every ported block once with Mainline's demo content (deleted in Task 5)
- Create: `docs/design-base.md`: source repo + commit SHA, license text, which blocks were ported, which Tailark free blocks are available for gaps and how to add them (`npx shadcn add` registry URL)

Clone `https://github.com/shadcnblocks/mainline-nextjs-template` into the session scratchpad (not the repo), read it, and port its components into our structure. Keep its look as-is. Convert default exports to named exports and strip comments per Global Constraints. Do not port its pages, content, analytics or Mainline-specific images.

- [ ] **Step 1:** Port components, theme and fonts.
- [ ] **Step 2:** `npm run lint && npm run typecheck && npm test && npm run build` → green.
- [ ] **Step 3:** Screenshot `/design-preview` at 1440 and 390 wide (headless Chrome: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --screenshot=<file> --window-size=1440,4000 http://localhost:3000/design-preview`) next to the Mainline demo; save both to `docs/screenshots/design-base/`; they must look like the same design.
- [ ] **Step 4:** Commit `feat: adopt mainline design base`.

### Task 2: i18n routing (next-intl)

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `src/proxy.ts`
- Create: `messages/fr.json`, `messages/en.json` (namespaces: `nav`, `footer`, `home`, `offers`, `sites`, `agents`, `fde`, `pricing`, `cases`, `about`, `bordeaux`, `contact`, `blog`, `legal`, `privacy`, `meta`; placeholder strings until Task 4)
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/not-found.tsx`, `src/components/language-switcher.tsx`
- Test: `src/i18n/routing.test.ts`, `src/i18n/messages.test.ts`

**Interfaces:**
- Produces: `routing` with `locales = ['fr','en'] as const`, `defaultLocale = 'fr'`, `localePrefix = 'as-needed'`, and `pathnames`:

| key (FR) | EN |
|---|---|
| `/` | `/` |
| `/services/creation-site-web` | `/services/websites` |
| `/services/agents-ia` | `/services/ai-agents` |
| `/forward-deployed-engineer` | `/forward-deployed-engineer` |
| `/tarifs` | `/pricing` |
| `/realisations` | `/work` |
| `/realisations/[slug]` | `/work/[slug]` |
| `/a-propos` | `/about` |
| `/agence-ia-bordeaux` | `/ai-agency-bordeaux` |
| `/contact` | `/contact` |
| `/blog` | `/blog` |
| `/blog/[slug]` | `/blog/[slug]` |
| `/mentions-legales` | `/legal-notice` |
| `/confidentialite` | `/privacy` |

- Produces: `Link`, `redirect`, `usePathname`, `getPathname` from `src/i18n/navigation.ts`; `type Locale = (typeof routing.locales)[number]`.

- [ ] **Step 1: Write failing tests.** `messages.test.ts`: `flattenKeys(fr)` deep-equals `flattenKeys(en)`; no value in either is an empty string. `routing.test.ts`: every pathname key has an `en` entry; `getPathname({ locale: 'en', href: '/tarifs' })` → `/en/pricing`; `getPathname({ locale: 'fr', href: '/tarifs' })` → `/tarifs`.
- [ ] **Step 2:** `npm test` → FAIL (modules missing).
- [ ] **Step 3:** Implement per next-intl 4 App Router docs (use context7 for current API). Layout calls `setRequestLocale`, exports `generateStaticParams` over locales, sets `<html lang>`, applies the three font variables. Language switcher keeps the current route and params.
- [ ] **Step 4:** `npm test` → PASS; `npm run build` shows `/` and `/en` prerendered as static.
- [ ] **Step 5:** Commit `feat: add fr/en routing with next-intl`.

### Task 3: Site config, offers and MDX content

**Files:**
- Create: `src/lib/site.ts`, `src/lib/offers.ts`, `src/lib/content.ts`, `mdx-components.tsx`
- Modify: `next.config.ts` (wrap with `@next/mdx`, `pageExtensions` include `mdx`)
- Create: `content/realisations/{hop-hop-immo,citeme,kenzi,pkba,vertiflow}.{fr,en}.mdx`, `content/blog/` (empty `.gitkeep`)
- Create: `public/realisations/*.png` (screenshots downloaded from klyx.fr WP uploads: `2026/10/hoppy.png`, `2026/10/citeme.png`, `2025/07/kenzi_klyx.png`, `2025/08/pkba_site_screenshot.png`, `2025/05/screen_vertiflow.png`), `public/brand/klyx-black.png`, `public/brand/klyx-white.png` (from `../KlyxAI/images/`)
- Test: `src/lib/offers.test.ts`, `src/lib/content.test.ts`

**Interfaces:**
- Produces: `site` const: `{ name: 'Klyx', url: 'https://klyx.fr', email: 'contact@klyx.fr', founder: 'Maxime Mansiet', siret: '941 572 364 00029', city: 'Bordeaux', calUrl: process.env.NEXT_PUBLIC_CAL_URL, socials: { linkedinCompany, linkedinFounder, instagram, github: 'https://github.com/AirKyzzZ' }, sisterSites: [{ name: 'Klyx Studio', url: 'https://studio.klyx.fr' }, { name: 'Klyx Estate', url: 'https://estate.klyx.fr' }] }` (social URLs from `docs/KLYX_STRATEGY.md`/recon).
- Produces: `type OfferId = 'landing' | 'site-ia' | 'site-custom' | 'audit-ia' | 'sprint-ia' | 'retainer' | 'fde'`; `offers: Offer[]` with `{ id, page: '/services/creation-site-web' | '/services/agents-ia' | '/forward-deployed-engineer', priceFrom: number | null, unit: 'project' | 'day' | 'month', durationKey: string }`; `formatPrice(amount: number, locale: Locale): string` (`fr` → `2 900 € HT`, `en` → `€2,900 excl. VAT`).
- Produces: `getCaseStudies(locale): Promise<CaseStudyMeta[]>`, `getCaseStudy(slug, locale): Promise<{ meta: CaseStudyMeta; Content: MDXContent }>`, `getPosts(locale)`, `getPost(slug, locale)`; `CaseStudyMeta = { slug, title, client, url, year, summary, stack: string[], image, order }`. MDX exports `metadata` object (no gray-matter).

- [ ] **Step 1: Failing tests.** `offers.test.ts`: prices equal `{ landing: 900, 'site-ia': 2900, 'site-custom': 5700, 'audit-ia': 1500, 'sprint-ia': 4500, retainer: null, fde: 700 }`; `formatPrice(2900,'fr')` → `'2 900 € HT'` (narrow no-break space acceptable, assert with normalized spaces); `formatPrice(2900,'en')` → `'€2,900 excl. VAT'`. `content.test.ts`: every case slug has both `fr` and `en` files; metadata fields non-empty; `getCaseStudies('fr')` sorted by `order`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement. Case study prose: what was actually built (from live klyx.fr copy and the projects' public sites), each with a `TODO(maxime)` line where facts are unverified.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: add site config, offers and mdx case studies`.

### Task 4: French and English copy

**Files:**
- Modify: `messages/fr.json`, `messages/en.json` (all namespaces from Task 2)
- Create: `docs/copy/TODO-maxime.md` (every `TODO(maxime)` with page, claim, what to confirm)

Write with the `copywriting` skill, then pass FR and EN through the `humanizer` skill. Sources: spec, `docs/KLYX_STRATEGY.md`, `../klyx-wordpress/docs/superpowers/specs/2026-10-05-klyx-pivot-copy-design.md` (reuse live process wording and the 3 testimonials verbatim, marked TODO(maxime) for reuse consent).

Per page content: home (sections in spec order), each offer page (problem, deliverables, process, price anchor, proof, FAQ 4-6, CTA), tarifs (one table + short market context, no Bpifrance eligibility claim), à propos (Person entity facts), agence-ia-bordeaux (SME plain language), contact (form labels, budget bands: `< 3 k€`, `3-10 k€`, `10-30 k€`, `> 30 k€`, `Je ne sais pas encore`), legal + privacy (from `../klyx-estate/src/app/mentions-legales/page.tsx`, plus a `prospection` section), meta titles/descriptions per page (title ≤ 60 chars, description ≤ 155).

- [ ] **Step 1:** Draft FR. **Step 2:** Adapt EN (not literal). **Step 3:** Humanizer pass on both; no em dashes in copy. **Step 4:** `npm test` (key parity) → PASS. **Step 5:** Commit `feat: add fr and en copy drafts`.

### Task 5: Pages (structural, neutral styling)

**Files:**
- Create under `src/app/[locale]/`: `services/creation-site-web/page.tsx`, `services/agents-ia/page.tsx`, `forward-deployed-engineer/page.tsx`, `tarifs/page.tsx`, `realisations/page.tsx`, `realisations/[slug]/page.tsx`, `a-propos/page.tsx`, `agence-ia-bordeaux/page.tsx`, `contact/page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`, `mentions-legales/page.tsx`, `confidentialite/page.tsx`
- Create: `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/components/sections/*.tsx` (one file per reusable section: `hero`, `offer-cards`, `case-grid`, `process-steps`, `founder`, `testimonials`, `faq`, `cta`, `price-table`, `proof-card`)
- Test: `e2e/routes.spec.ts`

Folder names are the FR pathname keys; next-intl `pathnames` serves the EN slugs. Each page: `generateStaticParams`, `setRequestLocale`, `generateMetadata` (Task 6 helper), content only from messages/MDX. Sections are built from the Task 1b Mainline blocks (adapted to Klyx content) and, where Mainline has no fitting block, Tailark free blocks restyled to Mainline's tokens; no section designed from scratch. Home follows the spec section order; the hero keeps Mainline's hero layout with the key phrase in Instrument Serif italic. Delete `src/app/design-preview`. Semantic HTML, one `h1` per page. Proof card renders `TODO(maxime)` content until real artefacts exist. Footer links sister sites, legal, privacy.

- [ ] **Step 1: Failing e2e.** `routes.spec.ts`: for every FR and EN path in the Task 2 table (slugs resolved with `hop-hop-immo`), `GET` returns 200 and has exactly one `h1`; `/en/pricing` language switch link points to `/tarifs`; `/realisations/does-not-exist` returns 404.
- [ ] **Step 2:** `npm run build && npx playwright test` → FAIL.
- [ ] **Step 3:** Implement pages and sections.
- [ ] **Step 4:** Rerun → PASS.
- [ ] **Step 5:** Commit `feat: add all pages with structural layout`.

### Task 6: SEO/GEO and contact

**Files:**
- Create: `src/lib/seo.ts`, `src/lib/json-ld.ts`, `src/components/json-ld.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, `src/app/[locale]/opengraph-image.tsx`
- Create: `src/lib/contact-schema.ts`, `src/actions/send-contact.ts`, `src/components/contact-form.tsx`
- Test: `src/lib/seo.test.ts`, `src/lib/json-ld.test.ts`, `src/actions/send-contact.test.ts`

**Interfaces:**
- Produces: `buildMetadata({ locale, pathname, title, description }): Metadata` with canonical and `alternates.languages` `{ fr, en, 'x-default': fr }`.
- Produces: `organizationJsonLd()`, `personJsonLd()`, `serviceJsonLd(offerIds: OfferId[], locale)`, `faqJsonLd(items: { q: string; a: string }[])`, `breadcrumbJsonLd(items: { name: string; url: string }[])`; Organization typed `['Organization','ProfessionalService']`, `areaServed` Bordeaux/Nouvelle-Aquitaine/France, `founder` Person, `sameAs` from `site.socials`; Offer `priceCurrency: 'EUR'`, `priceSpecification.valueAddedTaxIncluded: false`.
- Produces: `contactSchema` (zod): `name` 2-100, `email` email, `company` ≤ 120 optional, `need` enum `['site','agents','fde','other']`, `budget` enum of 5 bands, `message` 10-5000, `website` honeypot must be empty. `sendContact(prev: ContactState, formData: FormData): Promise<ContactState>`, `ContactState = { status: 'idle' | 'success' | 'error'; fieldErrors?: Record<string, string>; message?: string }`.

- [ ] **Step 1: Failing tests.**
  - `seo.test.ts`: `buildMetadata({locale:'en', pathname:'/tarifs',...}).alternates` → canonical `https://klyx.fr/en/pricing`, languages fr `https://klyx.fr/tarifs`.
  - `json-ld.test.ts`: `serviceJsonLd(['sprint-ia'],'fr')` offer price `4500`, `valueAddedTaxIncluded` false; `faqJsonLd` maps to `Question`/`acceptedAnswer`.
  - sitemap: contains both locale URLs for every static route and every case study, each with `alternates.languages`.
  - robots: allows `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Claude-SearchBot`, `Google-Extended`, `Bingbot`; sitemap URL set.
  - `send-contact.test.ts` (mock `resend`): valid data → `status 'success'`, `emails.send` called once with from `Klyx <contact@send.klyx.fr>`, `replyTo` visitor email; filled honeypot → `success` and `send` not called; invalid email → `error` with `fieldErrors.email`; missing `RESEND_API_KEY` → `error` with user message and `console.error` called; Resend returns `{ error }` → `error`, never success.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement. `llms.txt` lists offers with prices, key pages (both locales), contact. Contact form is a client component using `useActionState`; Cal.com shown as a link button (`NEXT_PUBLIC_CAL_URL`), no embed script. JSON-LD injected on home (Organization), offer pages (Service, FAQPage, Breadcrumb), à propos (Person).
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: add seo, json-ld, llms.txt and contact action`.

### Task 7: Redirects, 410s and security headers

**Files:**
- Modify: `next.config.ts` (`redirects()`, `headers()`), `src/proxy.ts` (410 handling before next-intl)
- Create: `src/lib/legacy-urls.ts`, `public/wp-content/uploads/2025/07/guide_vitrine_essentiels.pdf` (download from live), `docs/redirects.md`
- Test: `src/lib/legacy-urls.test.ts`, extend `e2e/routes.spec.ts`

**Interfaces:**
- Produces: `legacyRedirects: { source: string; destination: string; permanent: true }[]` = `/agence-web-bordeaux` → `/`, `/category/:path*` → `/`, `/author/:path*` → `/`, `/feed` → `/blog/rss.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml`, `/page-sitemap.xml` → `/sitemap.xml`; `/` with query `attachment_id=425` → the PDF path (`has` query matcher). `isGone(pathname: string): boolean` true for `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/*`, `/wp-content/*` except the PDF path.
- Security headers copied from `../klyx-wordpress/server/www/.htaccess` (HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy).

- [ ] **Step 1: Failing tests.** `isGone('/wp-login.php')` true; `isGone('/wp-content/uploads/2025/07/guide_vitrine_essentiels.pdf')` false; `isGone('/tarifs')` false. e2e: `/agence-web-bordeaux/` → 308/301 to `/`; `/?attachment_id=425` → PDF; `/wp-login.php` → 410; PDF path → 200 `application/pdf`; response has `strict-transport-security`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement; also add `/rss.xml` route at `/blog/rss.xml` (empty feed OK). **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: add legacy redirects, 410s and security headers`.

### Task 8: MIGRATION.md (independent, docs only)

**Files:** Create `docs/MIGRATION.md`.

Research (cite pricing pages, current as of 2026-10): Vercel Hobby vs Pro (Hobby forbids commercial use), Cloudflare (OpenNext adapter, image optimization), Netlify; criteria: cost/month, FR latency (Paris PoP), Server Actions support, image optimization, analytics, forms. Recommend one. Then: current DNS snapshot (from spec/recon: OVH NS, A 188.165.53.185, AAAA 2001:41d0:301::21, MX Zoho EU, SPF, DKIM Zoho + Brevo, DMARC p=none); flag MX/SPF/DKIM/DMARC as do-not-touch; add-only Resend records for `send.klyx.fr` (exact records come from the Resend dashboard, list their shape); steps: lower TTL 24 h before, add `www`, switch A/AAAA, verify (curl, mail test to/from Zoho), keep OVH hosting 14 days; rollback = restore A/AAAA; what to cancel at OVH and when (web hosting yes after 14 clean days; domain registration and DNS zone no). Note blog.klyx.fr stays as is.

- [ ] **Step 1:** Write. **Step 2:** Commit `docs: add hosting migration plan`.

### Task 9: Phase 4 sales assets (independent, docs only)

**Files:** Create `docs/sales/discovery-call.md`, `docs/sales/offer-one-pager.md` + `docs/sales/offer-one-pager.pdf`, `docs/sales/linkedin-dm.md`, `docs/sales/video-script.md`.

French, for startups and agencies, on the outcome angle and the price ladder from Global Constraints. Discovery call: 20-30 min structure, qualifying questions (budget, timing, decision-maker, current stack), objection handling (age/solo: code in their repo, public GitHub, free quote, audit credited), close to audit or sprint. One-pager: ladder + process + contact, rendered to PDF with the `anthropic-skills:pdf` skill. LinkedIn DM: first message (≤ 300 chars) + 1 follow-up, separate variants for agency and startup. Video script: 60-90 s Loom. Humanizer pass on all. Nothing is sent.

- [ ] **Step 1:** Write. **Step 2:** Commit `docs: add sales assets`.

### Task 10: Verification and draft PR

- [ ] **Step 1:** `npm run lint && npm run typecheck && npm test && npm run build && npx playwright test` → all green; paste tails.
- [ ] **Step 2:** Desktop (1440) and mobile (390) screenshots of `/`, `/forward-deployed-engineer` and `/en` saved to `docs/screenshots/foundation/`, inspected.
- [ ] **Step 3:** Lighthouse mobile on `/` (`npx lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --quiet --chrome-flags="--headless=new"`), record score (target ≥ 95; final check repeats after the design plan).
- [ ] **Step 4:** `git push -u origin feature/site-foundation`, `gh pr create --draft` with a short body in Maxime's PR style.

Execution order: Task 1 → Task 1b → Task 2 → Tasks 3 and 4 in parallel → Task 5 → Tasks 6 and 7 → Task 10. Tasks 8 and 9 run in parallel from the start.
