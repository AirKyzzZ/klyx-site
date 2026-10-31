# Design direction (2026-10-31)

Layered on the Mainline base (`docs/design-base.md`) and the spec (`docs/superpowers/specs/2026-10-31-klyx-site-design.md`). Mainline stays the look; these rules decide what goes on top. Source teardown: CiteMe preprod and Euthyne (both Maxime's own code, portable without license issues). Strip CiteMe's Sanity and i18n wiring when porting.

Path shorthands:
- `CM/` = `/Users/samsepiol/Downloads/GithubRepos/Work/Citeme/web-citeme/`
- `EU/` = `/Users/samsepiol/Downloads/GithubRepos/Work/Euthyne/app-euthyne/`

Settled, not reopened: hero « Des agents IA qui tournent en production, pas des démos. », Sprint IA 4 500 € HT (fixed scope) and FDE 700 €/day (time) as two separate products, Mainline + Tailark, FR + EN, no fake proof ever.

## Rules

### 1. Type

DM Sans 600 for display (Mainline's `--font-dm-sans`), tracking -0.04em, line-height 1.02 to 1.06. Inter for body at 17 to 19px, line-height 1.6. One Instrument Serif italic accent word or phrase per heading at most, through the existing `src/components/emphasis-title.tsx`. Geist Mono only for eyebrows, prices, timestamps, metrics and code.

Port from: `EU/src/components/features/hero.tsx` (the single italic accent inside a grotesk headline).

### 2. Two-tone headings

Every h1/h2: the lead clause in ink, the continuation in `text-muted-foreground`. One voice, one confident sentence, then the qualifier. Example: « Des agents IA qui tournent en production, / pas des démos. » Combine with rule 1 sparingly: a heading gets the italic accent or the two-tone split as its emphasis, ideally not both.

Port from: `CM/components/site/home/section.tsx` (`SectionHeading`), as `src/components/section-heading.tsx`.

### 3. Color

Mainline's warm canvas and ink stay. Exactly one brand accent, used only for the primary CTA, active states and data highlights inside proof cards. No second accent, no gradient text. Proof cards are white on a soft warm grain panel (Mainline's `src/components/background.tsx`, the CiteMe "stage" move in Klyx's palette, not lavender). At most one dark surface on the page: the final CTA card.

Port from: `CM/public/gradients/` (grain technique only, recolor warm).

### 4. Grid and guides

One container around 1200px. Upgrade Mainline's `src/components/dashed-line.tsx` rules to vertical rails plus small `+` crosses where section rules meet the rails. Sections open with a mono dashed-rule eyebrow (« 01 · Offres », « 02 · Réalisations », « 03 · Méthode »).

Port from: `CM/components/site/home/section.tsx` (`Hr`, `Section`), `.rails`, `.cross`, `.container-x` in `CM/app/globals.css` (~L525-575).

### 5. Hero at mobile

At 390 to 500px, without scrolling: offer line (eyebrow), two-tone h1, sub, the CTA pair, and one proof line. Three inline tag chips may name the offers (Sites, Agents IA, FDE) inside the sub. Below the CTAs, a fold strip of three verifiable claims (Euthyne style), each one `TODO(maxime)` until sourced: for example a Lighthouse score of a named live site, « Code dans votre repo dès le jour 1 », « Bordeaux · SIRET ». No dark void, no image above the h1. The h1 is the LCP element and never starts at opacity 0.

Port from: `EU/src/components/features/hero.tsx` + `hero.module.css` (badge, fold stat strip), `.tag` in `CM/app/globals.css`.

### 6. Proof cards are real artefacts

Replace every Mainline `ImagePlaceholder` with a small UI card built from real work:
- Lighthouse / Core Web Vitals card for a named live client site, with date.
- Agent run log in mono with timestamps and status pills, from a real run (anonymised if needed, never invented).
- PR list card: real merged PRs with repo, title, date, link.
- Mini screenshot of a shipped site with its live URL and a one-line « ce que j'ai construit ».

Every number names its client and date. No logo wall, no « +X projets », no testimonial without consent. CiteMe preprod's fictional logos and wall of love (`CM/components/site/home/customer-logos.tsx`) are the counter-example. Cap card visual height on mobile (two columns or a carousel, not five tall stacked cells).

Port from: `CM/components/site/home/visuals/*` (card patterns: run log, bars, gauge), `CM/components/site/home/metrics.tsx` (layout only, fix its mobile).

### 7. Founder block

One section with Maxime's real photo, name, role, Bordeaux, and « construit par les mêmes mains »: CiteMe (« co-fondateur ») and Euthyne linked to the live sites, GitHub and LinkedIn links. Employer names (Verana, 2060.io) and Credo-ts stay behind `TODO(maxime)`. This is what neither CiteMe nor Euthyne has, and it is what a solo agency sells.

Lives in: `src/components/sections/founder.tsx`. No external port.

### 8. Process

« Comment se passe une mission »: 4 steps (appel, audit ou devis, build, mesure), each with one proof card (sample scope, sample weekly update, run log, Lighthouse). Desktop: sticky numbered scroll-spy. Mobile: plain stacked cards, capped height.

Port from: `CM/components/site/home/platform.tsx` + `platform-nav.tsx`. Scroll-spy is an IntersectionObserver island; if the island budget is spent, ship the stacked version everywhere.

### 9. Motion budget

CSS only by default. Allowed:
- Scroll reveal: 14px translate + opacity, 0.7s, `cubic-bezier(.2,.7,.2,1)`, via one IntersectionObserver that adds `.in`. Content is visible without JS.
- Hero entrance: delay ladder (eyebrow, h1 lines, sub, CTAs, fold strip), total at most 1.1s, h1 visible from the first paint.
- One ambient loop at most (a marquee), none if it costs anything.

Not allowed without a decision: GSAP, Lenis, scrubbed tilt, count-ups. `prefers-reduced-motion: reduce` removes all transforms and delays. Gate: Lighthouse mobile >= 95 on home and one offer page, CLS 0, at most 2 client islands total.

Port from: `CM/components/site/reveal-observer.tsx` + `.reveal` rules in `CM/app/globals.css` (~L577-586), delay ladder in `EU/src/components/features/hero.module.css`. Only if GSAP is approved: `EU/src/components/features/scroll-motion.tsx` + `EU/src/lib/device-capability.ts` (lazy import after first paint, skipped on reduced motion and low-end devices).

### 10. CTA pair

Primary everywhere: solid accent « Réserver un appel » with an arrow, opens Cal.com. Secondary: outline « Demander un devis gratuit » to `/contact`. Same pair in the hero, after the proof, and in the final dark CTA card (with a tilted screenshot of a real client site). Prices show « à partir de » anchors with a one-line audience per offer and an honest note (solo, 2 clients max).

Port from: `CM/components/site/final-cta.tsx`, `EU/src/components/ui/bordered-cta.tsx`.

### 11. FAQ

Framed by audience: « Les questions qu'on me pose d'abord », tabbed by Sites / Agents IA / Travailler ensemble. Answers are server-rendered and stay in the DOM when collapsed. The same data array feeds the FAQPage JSON-LD (answer text equals visible text). 40 to 80 words per answer, first sentence answers, one number or named entity.

Port from: `EU/src/components/ui/faq-tabs.tsx`, `EU/src/components/features/faq-data.ts` (data shape). Lands in `src/components/sections/faq.tsx`.

### 12. Machine-readable layer

Klyx sells GEO, so the site is the demo: JSON-LD `@graph` (Organization + ProfessionalService with Bordeaux address and SIRET, Person, Service + Offer per offer with `valueAddedTaxIncluded: false`, FAQPage, BreadcrumbList), `/llms.txt` generated from the same data as `/tarifs`, `.md` alternates later.

Port from: `CM/components/site/seo/schema.tsx`, `CM/app/llms.txt/route.ts`, `CM/lib/site/llms/*`, `EU/src/lib/structured-data.ts` (`graph()` helper). Data source: `src/lib/site.ts`, `src/lib/offers.ts`.

## Outreach landing pages (`/pour/*`)

For traffic from the LinkedIn relance (first DM has no link) and the email signature. Per-prospect audit pages stay on `go.klyx.fr`.

Template:
- `noindex, follow`, out of the sitemap, not linked from the nav, canonical to self. They duplicate service pages and are written for one message.
- No header menu: logo + the CTA button only. Footer keeps mentions légales, confidentialité and `/confidentialite#prospection`.
- One CTA, « Réserver 20 minutes », repeated 3 times. Hero and mid buttons open Cal.com in a modal (no calendar JS at load, Lighthouse stays >= 95). Inline Cal.com embed only in the last section. One Cal.com event type per page for attribution. The contact email is the only alternative.
- Message match: the H1 reuses the noun phrase of the DM or email.
- Proof line directly under the CTA (consented client names, Bordeaux, SIRET).
- 4 to 6 sections, 400 to 600 words.
- URL params: `?ref=&utm_source=&utm_campaign=`. Only segment or first name may be personalised, never a company claim in the H1, never an email in the URL. Missing params fall back to the generic page with no visible placeholder.
- Pre-send check: 5-second test with 5 people per ICP (4 of 5 must say what, for whom, next step), every number sourced or deleted, every `TODO(maxime)` cleared.

The four pages:

| Slug | ICP | H1 | Offer and price | Cal.com event |
|---|---|---|---|---|
| `/pour/agences` | Web agencies | « Vos clients demandent de l'IA. Je la livre sous votre marque. » | White-label agents + Next.js sites, price table (Sprint 4 500, site IA 2 900, landing 900, paid test mission), white-label/NDA block | `klyx-agences` |
| `/pour/startups-sprint-ia` | Funded startups, one feature | « Votre feature IA en production en 2 semaines, pas dans un prototype. » | Sprint IA 4 500 € HT, fixed scope, deliverable list, 2-week timeline, honest limits. Never shows the day rate | `klyx-startups` |
| `/pour/equipe-tech-temps-partage` | Startups with a hiring gap | « Un développeur IA dans votre équipe, 2 à 3 jours par semaine. » | FDE 700 €/day, 4 weeks min (from ~5 600 € HT), 2 clients max. « FDE » in prose only, never « développeur embarqué » | `klyx-fde` |
| `/pour/pme-bordeaux` | Bordeaux SMEs 10-100 staff | « Un premier processus automatisé dans votre entreprise, avec un développeur de Bordeaux. » | Audit IA 1 500 € HT, credited if the build follows (terms `TODO(maxime)`), no LLM jargon, phone number as equal CTA. Never presents Klyx as a Bpifrance provider | `klyx-pme` |

Build order: startups Sprint, then agences (ICP 1 and 2 can verify GitHub and are contacted first), FDE, then PME once Google reviews exist.

## Proof production order

Nothing above ships without these, in this order:

1. Clear strategy section 8 with Maxime: consent and exact scope per client (Hop Hop Immo, Kenzi, PKBA, VertiFlow, Reciproq), CiteMe wording, Verana / 2060.io / Credo-ts status, testimonial reuse.
2. Legal: mentions légales, confidentialité, prospecting notice, SIRET in the footer.
3. Founder photo (real, recent, warm light) for the founder block, Cal.com profile and `/pour/*` proof strip.
4. Lighthouse / CWV runs on each live client site, dated, saved as JSON: feeds the score cards.
5. One real agent run log (CiteMe or a client workflow, anonymised): feeds the hero artefact and the « en production, pas en démo » block.
6. GitHub cleanup: pin 3 repos with READMEs, count real merged PRs: feeds the PR list card.
7. Screenshots of each shipped site at 1440 and 390: feeds réalisations and the final CTA tilt shot.
8. Cal.com: one event type per page, one intake question.
9. Google reviews and 2-sentence testimonials from 5 past clients (send a template).
10. Sample deliverable pack (anonymised weekly update, handover doc, scope + quote, eval set): feeds the process cards.
11. Two 90-second Looms (agencies, startups).
12. One case study with numbers, only once consent exists (Hop Hop Immo GEO data is the candidate).
