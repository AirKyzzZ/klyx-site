# klyx.fr redesign (Live System) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Mainline look with art direction C, "Live System": a warm-black site whose hero shows an agent working (graph with moving packets, streaming terminal, result chip on a lit frame over a treated Bordeaux backdrop, tabs per offer), a HUMAN/MACHINE toggle that shows each page as agents read it, a restyle of every page, and three new service pages, while keeping every route, all copy and the SEO/GEO layer, and passing Lighthouse mobile ≥ 90 with CLS about 0.

**Architecture:** Same Next.js 16 App Router + next-intl app. Design tokens in `src/app/globals.css` (`:root` custom properties mapped through `@theme inline`), Geist + Geist Mono + Instrument Serif via `next/font`. Pages stay Server Components; motion is CSS (keyframes, scroll-driven `animation-timeline: view()`, view transitions) plus a short, listed set of small client islands that replay server-rendered final states. Hero scenarios are typed data in `src/lib/scenarios.ts` with strings in messages. Markdown alternates for the machine view come from a route handler that builds markdown from the same messages, offers and MDX as the pages.

**Tech Stack:** Next 16.4, React 19.3, TypeScript strict, Tailwind 4, next-intl 4.14, @next/mdx, lucide-react, Vitest 5 + Testing Library, Playwright 1.64. No new runtime dependency (no `motion`, GSAP, Lenis, three.js) without Maxime's approval.

**Spec:** `docs/DESIGN_DIRECTION.md` (design system, components, pages, assets, anti-generic rules). Product spec: `docs/superpowers/specs/2026-10-31-klyx-site-design.md`. Strategy: `docs/KLYX_STRATEGY.md` section 10 (routes, query map, GEO checklist).

## Global Constraints

- Repo `/Users/samsepiol/Downloads/GithubRepos/Work/Projets-perso/klyx-site`. Work on a new branch `feature/redesign-live-system` created from the current tip of `feature/site-foundation`, in a git worktree (other agents work in the main checkout). Conventional commits, subject only. Never push, never deploy, never touch DNS.
- Before each task: `git fetch origin` and check the base branch; rebase only if Maxime asked.
- No code comments unless one of: hidden constraint, non-obvious invariant, upstream bug workaround, surprising platform behaviour. One line max.
- Files kebab-case, named exports (Next special files keep their default export), no `any`, early returns.
- Keep all routes, all existing message keys and their FR/EN text, MDX content, metadata, JSON-LD, sitemap, robots and `llms.txt` behaviour. New copy goes into both `messages/fr.json` and `messages/en.json`; anything Maxime has not confirmed is a visible `TODO(maxime)`.
- Never invent proof. Hero scenarios carry the « Illustration » label and caption. A proof slot without verified data does not render.
- Never write « développeur embarqué ».
- Colours, type, spacing, radii, motion tokens, islands and budgets exactly as in `docs/DESIGN_DIRECTION.md`. Anti-generic rules (section 7) are acceptance criteria.
- Motion: only `transform`, `opacity`, `clip-path`, small-SVG `stroke-dashoffset`. Final state in server HTML, reduced-motion shows final state, content visible without JS, the h1 never starts at opacity 0.
- Ports are done by hand from CiteMe (`/Users/samsepiol/Downloads/GithubRepos/Work/Citeme/web-citeme/`), Euthyne (`/Users/samsepiol/Downloads/GithubRepos/Work/Euthyne/app-euthyne/`) or 21st.dev (slug noted in the spec). If `API_KEY_21ST` is set, `npx shadcn@latest add "https://21st.dev/r/<author>/<name>?api_key=$API_KEY_21ST"` may fetch a component into a scratch dir for reading; never install it straight into `src/`. Without the key, port from the component page.
- Deleting files: only those listed in a task's Files section. Anything else unused gets listed in the task report for Maxime.
- Every task ends green on: `npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e`.
- Every task that changes visible UI adds or refreshes its screenshots in `docs/screenshots/redesign/` (1440 and 390) via `e2e/screenshots.spec.ts` (created in R1).

## Review Focus

1. LCP: the home h1 is in the initial HTML, visible, never in a reveal or entrance animation; the backdrop does not become LCP on mobile. Checked in R2 and R7.
2. No-JS and reduced motion: with JS off, the hero shows the full trace, the chip and the tabs as links; with reduced motion, `document.getAnimations()` is empty and final states show. Tests in R2, gate in R7.
3. CLS: the terminal streaming, tab swaps, font swaps and machine view never shift layout (fixed heights, fallback metrics). Test in R2, R3, R7.
4. Honesty: no scenario chip or proof card shows a number that is not either real (sourced file) or labelled illustration; testimonials hidden until consent flag. Review in R2, R4, R8.
5. Machine view parity: the markdown for each page contains the page's h1, prices from `src/lib/offers.ts` and FAQ answers, so it cannot drift from the visible page. Test in R3.
6. New service routes: FR and EN slugs resolve, language switch maps between them, sitemap/hreflang/JSON-LD/`llms.txt` include them. Tests in R5.

---

### Task R1: Design tokens, fonts, base layout

**Files:**
- Modify: `src/app/globals.css` (replace Mainline tokens with the spec's tokens, `@theme inline` mapping, base styles, `.rails`, `.cross`, `.reveal` scroll-driven rules, `.hatch`, grain on `body`, focus ring, reduced-motion block)
- Modify: `src/app/fonts.ts` (`Geist` `--font-sans`, `Geist_Mono` `--font-mono`, `Instrument_Serif` italic `--font-serif`; remove DM Sans and Inter)
- Modify: `src/app/[locale]/layout.tsx` (font variables, `<div class="rails">` wrapper, dark `color-scheme`)
- Create: `src/components/section.tsx` (`Section`, `SectionHeading`, `Hr`, `Eyebrow`)
- Create: `src/components/tag.tsx`
- Modify: `src/components/ui/button.tsx` (variants `primary`, `secondary`, `ghost`; sizes `md` 36, `lg` 44)
- Modify: `src/components/site-header.tsx`, `src/components/site-nav.tsx` (pill nav, Offres menu grouped, opaque on mobile)
- Modify: `src/components/site-footer.tsx` (columns, SIRET, outlined wordmark)
- Modify: `src/components/emphasis-title.tsx` (two-tone + optional serif word, or replaced by `SectionHeading`; keep the export name used by pages)
- Create: `public/textures/grain.png` (generated by `scripts/make-grain.mjs`, committed output only)
- Create: `scripts/make-grain.mjs`, `scripts/check-contrast.mjs` (asserts every text/background pair from spec 1.1 is ≥ 4.5:1)
- Create: `e2e/screenshots.spec.ts` (iterates routes, captures each page full-page at 1440x900 and 390x844 into `docs/screenshots/redesign/<route>-<width>.png`; skipped unless `SCREENSHOTS=1`)
- Create: `docs/screenshots/references/` (copy of the reference images listed in spec header: cursor-full, raycast-full, linear-full, clerk-full, basement-hero-live, agent-pipeline, agent-trace, codeveil, network-hero)
- Modify: `docs/superpowers/specs/2026-10-31-klyx-site-design.md` (one line under "Visual direction": superseded by `docs/DESIGN_DIRECTION.md`, Live System)
- Delete: `src/components/background.tsx`, `src/components/dashed-line.tsx`, `src/components/image-placeholder.tsx`, and `src/components/blocks/*` only if `grep` shows no import left after this task

**Interfaces:**
```ts
export function Section(props: { id?: string; index?: string; eyebrow?: string; tone?: "dark" | "sand"; className?: string; children: React.ReactNode }): JSX.Element
export function SectionHeading(props: { as?: "h1" | "h2"; lead: string; rest?: string; serif?: string; className?: string }): JSX.Element
export function Eyebrow(props: { index?: string; children: React.ReactNode }): JSX.Element
export function Tag(props: { children: React.ReactNode; icon?: React.ReactNode }): JSX.Element
```

- [ ] **Step 1:** Write `src/components/section.test.tsx`: `SectionHeading` renders `lead` and `rest` in separate spans, `serif` word inside an element with the serif class, defaults to `h2`. Run `npm test`, see it fail.
- [ ] **Step 2:** Implement tokens, fonts, `Section`/`SectionHeading`/`Eyebrow`/`Tag`, button variants. Port `Hr`/`.rails`/`.cross` from `web-citeme/components/site/home/section.tsx` and `app/globals.css` (~L525-575). Tests pass.
- [ ] **Step 3:** Run `node scripts/make-grain.mjs` and `node scripts/check-contrast.mjs`; fix any token pair under 4.5:1 in both the CSS and `docs/DESIGN_DIRECTION.md`.
- [ ] **Step 4:** Restyle header and footer. Every page still renders (existing sections inherit the new tokens even if not yet redesigned).
- [ ] **Step 5:** Copy reference screenshots, add the spec supersede line, write `e2e/screenshots.spec.ts`, run `SCREENSHOTS=1 npx playwright test e2e/screenshots.spec.ts` for `/` and one offer page.

**Verification:** `npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e` green; `grep -rn "font-dm-sans\|font-inter" src` empty; screenshots show warm black, rails with crosses, pill nav, new footer.

**Commit:** `feat: add live system design tokens and base layout`

### Task R2: Hero Live System

**Files:**
- Create: `src/lib/scenarios.ts` (types + 6 scenarios: `agents`, `sites`, `fde`, `audit`, `automation`, `geo`)
- Create: `src/lib/scenarios.test.ts`
- Create: `src/lib/proof/klyx-lighthouse.json` (placeholder `{ "status": "pending" }` until R7 writes real scores; the Sites chip renders "Lighthouse · mesure en cours" only in dev, and hides the score in prod while pending)
- Create: `src/components/live-system/lit-frame.tsx`, `agent-graph.tsx`, `terminal-trace.tsx`, `result-chip.tsx`, `scenario-tabs.tsx`, `live-system.tsx` (server composition), `live-system-player.tsx` (client island), `live-system.css` (keyframes, packet dashes, vertical layout under 640px)
- Create: `src/components/live-system/live-system-player.test.tsx`
- Create: `src/components/fold-strip.tsx`
- Modify: `src/components/sections/hero.tsx` (home variant composes text block + `fold-strip` + `LiveSystem`; offer variant composes split layout + single-scenario `LiveSystem`)
- Modify: `messages/fr.json`, `messages/en.json` (`liveSystem.label`, `liveSystem.caption`, `liveSystem.tabs.*`, `liveSystem.scenarios.<id>.nodes.*`, `.trace.*`, `.chip`, `home.fold.*`)
- Create: `public/backdrop/bordeaux-1600.avif`, `bordeaux-800.avif`, `bordeaux-1600.webp`, `bordeaux-800.webp` (from the asset Maxime picks; until then a neutral warm gradient fallback in CSS, no image)
- Create: `docs/assets.md` (source, license, author, treatment of every image)
- Create: `e2e/hero.spec.ts`

**Interfaces:**
```ts
export type ScenarioId = "agents" | "sites" | "fde" | "audit" | "automation" | "geo";
export type GraphNode = { id: string; labelKey: string; icon: "inbox" | "filter" | "database" | "message" | "git" | "gauge" | "rocket" | "file" | "user-check" | "search"; x: number; y: number; mx: number; my: number };
export type GraphEdge = { from: string; to: string };
export type ScenarioStep = { at: number; node?: string; edge?: [string, string]; line?: number; chip?: true };
export type Scenario = { id: ScenarioId; href: AppPathname; nodes: GraphNode[]; edges: GraphEdge[]; trace: { t: string; key: string; tone?: "ok" | "err" | "dim" }[]; steps: ScenarioStep[]; chipKey: string; illustration: boolean };
export const scenarios: Record<ScenarioId, Scenario>;
export function LiveSystem(props: { scenarioIds: ScenarioId[]; initial: ScenarioId; priority?: boolean; locale: Locale }): Promise<JSX.Element>;
```
(`x/y` are desktop percent positions, `mx/my` the mobile vertical layout.)

- [ ] **Step 1:** Tests first: `scenarios.test.ts` asserts every edge references existing nodes, steps are time-sorted, every `labelKey`/trace `key`/`chipKey` exists in both message files, and `illustration` is true for every scenario except `sites`. `live-system-player.test.tsx` (fake timers) asserts: no timer starts when `matchMedia('(prefers-reduced-motion: reduce)')` matches; steps set `data-state` in order; the clock pauses when an injected visibility callback reports hidden; it stops after 3 loops with the final state applied. Fail.
- [ ] **Step 2:** Build server components rendering the **final state** (all nodes `done`, all trace lines shown, chip visible). Tabs are `<Link>`s to each scenario's `href`.
- [ ] **Step 3:** Build `live-system-player.tsx`: on mount (and only without reduced motion) reset to step 0, run the `setTimeout` chain, IntersectionObserver + `visibilitychange` pause, hover/focus-within pause, 3 loops max, tab click interception with `document.startViewTransition` fallback. Packets via CSS dash animation toggled by `data-state="active"` on the edge. Tests pass.
- [ ] **Step 4:** Mobile layout: vertical graph from `mx/my`, terminal 7 lines, tabs scroll-snap row. Fixed heights everywhere (`aspect-ratio` on frame and graph box, `height: calc(var(--lines) * 1lh)` on terminal body).
- [ ] **Step 5:** Wire into home hero with entrance ladder (h1 excluded) and `fold-strip`. Add copy keys FR/EN; scenario names and values are generic (no real client names). Caption: « Exemple de workflow que je construis. Noms et valeurs fictifs. »
- [ ] **Step 6:** `e2e/hero.spec.ts`: (a) h1 visible and `getComputedStyle(h1).opacity === "1"` at first paint; (b) context with `javaScriptEnabled: false`: all trace lines, chip and three tab links visible; (c) `reducedMotion: "reduce"`: after 2s `document.getAnimations().length === 0`; (d) CLS observer over 6s of playback and one tab click < 0.02; (e) tab click swaps `aria-selected` and the graph labels; (f) LCP entry's element is the h1 at 390x844.
- [ ] **Step 7:** Measure the island: `npm run build`, read the client chunk size for the player in `.next` build output; must be ≤ 10 KB gz. Record it in the commit's task report.

**Verification:** full gate green; `e2e/hero.spec.ts` green; screenshots of home hero at 1440 and 390 show the lit frame, graph, overlapping terminal, chip and tabs; manual Chrome performance trace while the hero plays shows no layout events and no long tasks.

**Commit:** `feat: add live system hero with agent graph and terminal`

### Task R3: HUMAN/MACHINE toggle and markdown alternates

**Files:**
- Create: `src/lib/machine/page-markdown.ts` (one builder per page key, reading the same translators, `offers.ts`, `site.ts`, `content.ts`)
- Create: `src/lib/machine/page-markdown.test.ts`
- Create: `src/app/md/[locale]/[[...path]]/route.ts` (`GET`, `text/markdown; charset=utf-8`, `X-Robots-Tag: noindex`, 404 for unknown paths, `generateStaticParams` over all routes)
- Modify: `src/proxy.ts` (matcher excludes `md`)
- Modify: `src/lib/seo.ts` (`alternates.types["text/markdown"]` per page)
- Modify: `src/app/llms.txt/route.ts` (list markdown alternates)
- Create: `src/components/machine-view/view-toggle.tsx` (island), `machine-view.tsx`, `machine-view.css`
- Modify: `src/app/[locale]/layout.tsx` (desktop toggle), `src/components/site-nav.tsx` (mobile sheet), `src/components/site-footer.tsx` (mobile)
- Modify: `messages/fr.json`, `messages/en.json` (`machine.human`, `machine.machine`, `machine.copy`, `machine.copied`, `machine.openRaw`, `machine.tokensApprox`)
- Create: `e2e/machine-view.spec.ts`

**Interfaces:**
```ts
export type MachinePage = { pathname: AppPathname; params?: Record<string, string> };
export async function pageMarkdown(locale: Locale, page: MachinePage): Promise<string | null>;
export function markdownHref(locale: Locale, pathname: string): string;
export function ViewToggle(props: { markdownHref: string; variant: "floating" | "inline" }): JSX.Element;
```

- [ ] **Step 1:** Tests first: for every pathname in `routing.pathnames` and both locales, `pageMarkdown` returns a string that starts with `# ` + the page's h1 text, includes every price shown on that page (formatted via `formatPrice`), includes each FAQ question and answer for pages with a FAQ, and contains no `undefined`/raw message keys. Fail.
- [ ] **Step 2:** Implement builders. Port the shape of `web-citeme/lib/site/llms/*` and `web-citeme/app/[locale]/md`. Tests pass.
- [ ] **Step 3:** Route handler, proxy matcher, `<link rel="alternate" type="text/markdown">` via metadata, `llms.txt` links. Add a unit test in `src/app/llms.txt/route.test.ts` for the new links.
- [ ] **Step 4:** Toggle island and machine view per spec 3.4 (fetch on first switch, cache in memory, hatched header with path, type, bytes and ≈ tokens, line numbers, copy button, `Esc`, `#machine` hash, scroll restore, `role="switch"`). Without JS the toggle is an `<a href>` to the markdown.
- [ ] **Step 5:** `e2e/machine-view.spec.ts`: switch to MACHINE on `/` and `/en/services/ai-agents`, the layer shows the h1 text and a price; `Esc` returns and scroll position is restored; no-JS: the toggle link returns 200 `text/markdown`; CLS < 0.02 across toggle; the markdown URL sends `X-Robots-Tag: noindex`; markdown URLs are absent from `sitemap.xml`.

**Verification:** full gate green; `curl -sI localhost:<port>/md/fr` shows `text/markdown` and `noindex`; screenshots of machine view at 1440 and 390.

**Commit:** `feat: add human machine toggle with markdown alternates`

### Task R4: Home sections

**Files:**
- Create: `src/components/proof/proof-card.tsx` (variants `lighthouse`, `run-log`, `pr-list`, `site-shot`), `src/components/proof/browser-frame.tsx`, `src/lib/proof/index.ts` (typed sources; each returns `null` unless verified)
- Create: `src/components/proof/proof-card.test.tsx` (unverified source renders nothing)
- Create: `src/components/sections/proof-strip.tsx`
- Modify: `src/components/sections/offer-cards.tsx` → spec-sheet `offer-card` + "Aussi" row; `src/components/spotlight-pointer.tsx` (island)
- Modify: `src/components/sections/case-grid.tsx` → `case-card` on sand; create `src/components/chamfer-break.tsx`
- Create: `src/components/sections/process-timeline.tsx`, `src/components/sections/process-spy.tsx` (island, desktop only)
- Modify: `src/components/sections/founder.tsx` (photo frame, products row), `testimonials.tsx` (gated by `site.flags.testimonialsConsented`), `faq.tsx` (native `<details>`, optional tabs), `cta.tsx` → `final-cta`
- Modify: `src/lib/site.ts` (`flags.testimonialsConsented: false` with `TODO(maxime)` in copy, not in code)
- Modify: `src/app/[locale]/page.tsx` (section order per spec 4.1, eyebrows 01-07)
- Modify: `messages/fr.json`, `messages/en.json` (`home.proofStrip.*`, `home.offers.also.*`, eyebrow labels)
- Create: `scripts/capture-cases.ts` (Playwright capture of live client sites at 1440 and 390 into `public/realisations/`)
- Delete: `src/components/sections/proof-card.tsx` (replaced)

**Interfaces:**
```ts
export type ProofSource =
  | { kind: "lighthouse"; url: string; date: string; scores: { performance: number; accessibility: number; bestPractices: number; seo: number } }
  | { kind: "pr-list"; repo: string; items: { title: string; number: number; mergedAt: string; href: string }[] }
  | { kind: "run-log"; title: string; rows: { t: string; text: string; tone?: "ok" | "err" | "dim" }[]; anonymised: true }
  | { kind: "site-shot"; slug: string; url: string; image: string };
export function getVerifiedProof(): ProofSource[];
export function ProofCard(props: { source: ProofSource; locale: Locale }): JSX.Element;
```

- [ ] **Step 1:** Tests first for `getVerifiedProof` (pending Lighthouse JSON excluded) and `ProofCard`/`ProofStrip` (strip renders nothing with fewer than 2 sources). Fail, implement, pass.
- [ ] **Step 2:** Offer cards with mini graph glyph and spotlight. Port spotlight from `21st:kevingirelli/spotlight` as one shared pointer handler writing `--mx`/`--my`.
- [ ] **Step 3:** Run `scripts/capture-cases.ts` against the live sites (hophopimmo.com, citeme.io, Kenzi, PKBA, VertiFlow URLs from `content/realisations/*.mdx`); skip any site that fails and list it in the report. Build case cards and the sand band with chamfers.
- [ ] **Step 4:** Process timeline + desktop spy (port `web-citeme/components/site/home/platform.tsx` + `platform-nav.tsx`); step artefacts are labelled samples.
- [ ] **Step 5:** Founder, testimonials gate, FAQ, final CTA. Recompose `page.tsx`.
- [ ] **Step 6:** Add `.reveal` to below-the-fold section contents only. Screenshots of every home section at 1440 and 390.

**Verification:** full gate green; existing `e2e/seo.spec.ts` still finds FAQPage JSON-LD with answers equal to visible text; no `ImagePlaceholder` or "TODO" box rendered on `/` in production build (`grep` the built HTML for `TODO(maxime)` in proof slots returns nothing; TODOs in copy keys may remain visible by design per the foundation spec).

**Commit:** `feat: redesign home sections with real proof cards`

### Task R5: Offer page template and three new service pages

**Files:**
- Create: `src/components/templates/offer-page.tsx`, `src/lib/offer-pages.ts` (typed config per page: pathname, message namespace, scenario id, tiers, highlighted tier, page-specific block, proof slugs, serif word)
- Create: `src/lib/offer-pages.test.ts`
- Modify: `src/app/[locale]/services/agents-ia/page.tsx`, `services/creation-site-web/page.tsx`, `forward-deployed-engineer/page.tsx` (render the template)
- Create: `src/app/[locale]/services/audit-ia/page.tsx`, `services/automatisation-ia/page.tsx`, `services/geo-referencement-ia/page.tsx`
- Modify: `src/i18n/routing.ts`:
  ```ts
  "/services/audit-ia": { fr: "/services/audit-ia", en: "/services/ai-audit" },
  "/services/automatisation-ia": { fr: "/services/automatisation-ia", en: "/services/ai-automation" },
  "/services/geo-referencement-ia": { fr: "/services/geo-referencement-ia", en: "/services/ai-search-visibility" },
  ```
- Modify: `src/i18n/routing.test.ts`, `src/lib/offers.ts` (`page` union gains the 3 paths; `audit-ia` offer moves its `page` to `/services/audit-ia`; add `automation` and `geo` offers with `priceFrom` from Maxime or `null` + `TODO(maxime)` label), `src/lib/offers.test.ts`
- Modify: `messages/fr.json`, `messages/en.json` (`audit.*`, `automation.*`, `geo.*` namespaces mirroring `agents.*`: hero, problem, deliverables, process, block, proof, faq (5-8, 40-80 words each, no duplicate of other pages), cta; `meta.audit|automation|geo`; `nav.audit|automation|geo`)
- Modify: `src/lib/json-ld.ts` (Service + Offer for new pages), `src/app/sitemap.ts`, `src/app/llms.txt/route.ts`, `src/lib/machine/page-markdown.ts`, `src/components/site-nav.tsx`, `src/components/site-footer.tsx`
- Create: `src/components/offer-blocks/` (`trace-spans.tsx`, `fde-definition.tsx`, `audit-document.tsx`, `automation-examples.tsx`, `geo-visibility.tsx`, `lighthouse-block.tsx`)

**Interfaces:**
```ts
export type OfferPageKey = "sites" | "agents" | "fde" | "audit" | "automation" | "geo";
export type OfferPageConfig = { key: OfferPageKey; pathname: AppPathname; namespace: string; scenario: ScenarioId; tiers: OfferId[]; highlighted?: OfferId; block: "trace" | "lighthouse" | "fde-definition" | "audit-document" | "automation-examples" | "geo-visibility"; proofSlugs: string[] };
export const offerPages: Record<OfferPageKey, OfferPageConfig>;
export async function OfferPage(props: { config: OfferPageConfig; locale: Locale }): Promise<JSX.Element>;
```

- [ ] **Step 1:** Tests first: routing test covers the 3 new FR/EN pathnames and language switch mapping; `offer-pages.test.ts` asserts every config's namespace has hero/problem/deliverables/process/faq/cta keys in both locales and FAQ answers are 40-80 words and unique across pages; `offers.test.ts` covers the new offers. Fail.
- [ ] **Step 2:** Build the template from spec 4.2 and migrate the 3 existing pages onto it without changing their copy. Existing e2e and SEO tests stay green.
- [ ] **Step 3:** Write FR copy for the 3 new pages from `docs/KLYX_STRATEGY.md` section 10 (queries #3, #6, #7, #13, #14) in Maxime's voice (« je », short sentences, prices visible, no buzzwords), then a faithful EN adaptation. Every unverified fact, price, the audit credit terms and the Bpifrance figures carry `TODO(maxime)`. Run the copy through the `humanizer` skill.
- [ ] **Step 4:** Page-specific blocks; GEO page includes the CiteMe co-founder disclosure.
- [ ] **Step 5:** JSON-LD, sitemap, hreflang, `llms.txt`, markdown builders, nav, footer.
- [ ] **Step 6:** Screenshots of all 6 offer pages at 1440 and 390.

**Verification:** full gate green; `e2e/routes.spec.ts` (iterates `routing.pathnames`) covers the new 6 URLs with one h1; `e2e/seo.spec.ts` sees Service JSON-LD and hreflang on the new pages.

**Commit:** `feat: add offer page template and audit, automation and geo pages`

### Task R6: Remaining pages

**Files:**
- Modify: `src/app/[locale]/tarifs/page.tsx` + create `src/components/sections/price-ledger.tsx` (+ `price-ledger.test.tsx`: every offer in `offers.ts` appears once with its formatted price)
- Modify: `src/app/[locale]/realisations/page.tsx`, `src/app/[locale]/realisations/[slug]/page.tsx`, `mdx-components.tsx` (prose styles, `TODO(maxime)` note style)
- Modify: `src/app/[locale]/a-propos/page.tsx`, `src/components/blocks/about-hero.tsx` (or replacement section)
- Modify: `src/app/[locale]/agence-ia-bordeaux/page.tsx` + create `src/components/gironde-map.tsx` (static SVG)
- Modify: `src/app/[locale]/contact/page.tsx`, `src/components/contact-form.tsx` (styles only; validation and action untouched), booking card loading Cal.com on click
- Modify: `src/app/[locale]/blog/page.tsx`, `src/app/[locale]/blog/[slug]/page.tsx`
- Modify: `src/app/[locale]/mentions-legales/page.tsx`, `src/app/[locale]/confidentialite/page.tsx`, `src/components/legal-section.tsx`
- Modify: `src/app/[locale]/not-found.tsx`
- Modify: `src/app/[locale]/opengraph-image.tsx` + create `src/lib/og/render-og.tsx` and per-offer `opengraph-image.tsx`; `public/fonts/` (Geist 600, Geist Mono 400 TTF for `ImageResponse`)

- [ ] **Step 1:** Tests first: price ledger test; contact form existing tests stay green; an e2e asserting `/contact` loads no Cal.com script until the booking button is clicked.
- [ ] **Step 2:** Build each page per spec 4.3 to 4.11, reusing R1-R5 components only (no new one-off styles except the listed files).
- [ ] **Step 3:** OG images per spec 4.12; check `/opengraph-image` returns 1200x630 PNG for `/`, `/tarifs` and two offer pages.
- [ ] **Step 4:** Screenshots of every page at 1440 and 390.

**Verification:** full gate green; `e2e/routes.spec.ts` green for all routes; no horizontal scroll at 390 on any page (`document.documentElement.scrollWidth <= 390` asserted in `e2e/screenshots.spec.ts`).

**Commit:** `feat: restyle pricing, work, about, bordeaux, contact, blog and legal pages`

### Task R7: Quality gates

**Files:**
- Modify: `e2e/screenshots.spec.ts` (every route, every `section[data-shot]` element individually at 1440 and 390, into `docs/screenshots/redesign/<route>/<section>-<width>.png`)
- Create: `e2e/quality.spec.ts` (CLS per route < 0.02; reduced motion: no running animations; no-JS: h1, prices and FAQ answers visible; no horizontal overflow at 390; every image has `alt`; one h1)
- Create: `scripts/lighthouse.mjs` (runs `npx lighthouse@12.8.2` mobile preset against `next start` for `/`, `/services/agents-ia`, `/tarifs`; writes JSON reports to `docs/lighthouse/` and the home scores to `src/lib/proof/klyx-lighthouse.json` with URL and date)
- Create: `docs/lighthouse/README.md` (how to rerun, latest scores table)

- [ ] **Step 1:** Write `e2e/quality.spec.ts`; run; fix every failure in the owning component, not with test exceptions.
- [ ] **Step 2:** `npm run build && npx next start -p 4318` then `node scripts/lighthouse.mjs`. Gate: performance ≥ 90 (target 95), accessibility ≥ 95, SEO 100 on all three. If under, fix (image sizes, font preload, island size, unused CSS) and rerun. Record before/after in the README.
- [ ] **Step 3:** 60fps check: Chrome performance trace (Playwright `page.tracing` or DevTools) on `/` at 1440, scrolling top to bottom over 6s with the hero playing, CPU throttling 4x. Gate: no long task over 50ms during scroll, no layout or paint storms from animations. Save the trace summary in `docs/lighthouse/README.md`.
- [ ] **Step 4:** Rebuild so the Sites scenario chip and the Lighthouse proof card now show the real klyx.fr score; rerun the hero e2e.
- [ ] **Step 5:** `SCREENSHOTS=1 npx playwright test e2e/screenshots.spec.ts` for the full set.

**Verification:** full gate green; Lighthouse JSON committed; screenshots for every section of every page at both widths.

**Commit:** `test: add redesign quality gates, lighthouse runs and screenshots`

### Task R8: Design review loop

**Files:**
- Create: `docs/design-review/round-<n>.md` per round (reviewer findings and the fixes made)
- Modify: whatever components the findings point at

- [ ] **Step 1:** Dispatch a fresh reviewer subagent (not the implementer) with only: `docs/DESIGN_DIRECTION.md` sections 1, 2 and 7, the reference images in `docs/screenshots/references/`, and the section screenshots in `docs/screenshots/redesign/`. Prompt: for each section at both widths, "Would this win Awwwards Site of the Day next to Cursor, Linear and Raycast? What looks generic or template-like? What breaks an anti-generic rule? What is the single change that would lift it most?" Ask for a verdict per section: `pass`, `generic`, or `broken`, with the reason and the fix.
- [ ] **Step 2:** Write the findings to `docs/design-review/round-1.md`. Fix every `broken` and `generic` item; for each, refresh the affected screenshots.
- [ ] **Step 3:** Rerun the full gate and the quality spec after fixes (Lighthouse included if the hero, fonts or images changed).
- [ ] **Step 4:** Next round with a new reviewer subagent on the refreshed screenshots. Repeat until a round returns no `generic` or `broken` verdict, or 4 rounds pass; anything still open after round 4 goes to Maxime as a decision list in the last round file.
- [ ] **Step 5:** Final honesty pass by the reviewer: list every number, name and claim visible on the site with its source (file, real data, or `TODO(maxime)`). Anything without one is removed.

**Verification:** last `docs/design-review/round-<n>.md` shows all sections `pass`; full gate green; Lighthouse still ≥ 90.

**Commit:** `fix: apply design review round <n>` (one commit per round)

---

## Decisions and inputs needed from Maxime (blocking where marked)

1. **Backdrop** (blocks the final look of R2, not the code): Vernet's 1759 *Port de Bordeaux* painting (public domain), his own Garonne photo, or a licensed photo.
2. **Founder portrait** (R4, R6): recent, warm light, 3:4.
3. **Proof data** (R4): CiteMe PR count/list he is happy to show; which client sites to screenshot; consent for testimonials and for Hop Hop Immo GEO data.
4. **Scenarios** (R2): OK with "illustration" scenarios, or a real anonymised run to base the Agents and FDE scenarios on.
5. **New pages** (R5): prices for Automatisation IA and Référencement IA, audit credit terms, phone number for the Bordeaux page.
6. **`API_KEY_21ST`** (optional): without it, components are ported by hand from the slugs.
7. **Capacity line** (R2): show « 2 places » availability or not.
