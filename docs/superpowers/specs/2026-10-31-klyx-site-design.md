# klyx.fr rebuild: design

Date: 2026-10-31
Owner: Maxime Mansiet (Klyx, Bordeaux)
Background research: `docs/KLYX_STRATEGY.md` (market, competition, ICP, offers, SEO/GEO, sources).

## Intent

Klyx is Maxime's freelance agency and its job right now is cash through services while Euthyne and CiteMe scale. klyx.fr today is a single WordPress + Elementor page on OVH hosting. It gets replaced by a Next.js site that a startup founder or an agency owner understands in 5 seconds: what Klyx ships, for how much, and why they can trust a 20-year-old solo engineer. Then OVH web hosting and WordPress go away.

## Goals

- Clear for the ICP in 5 seconds: hero states the outcome, prices are public, one CTA.
- Book calls and collect quote requests (« devis gratuit »).
- Rank and get cited for Bordeaux AI queries, price queries, and « forward deployed engineer » in French.
- Lighthouse mobile >= 95 on home. The site is itself proof for a studio that sells fast sites.
- Keep every current klyx.fr URL working (tiny redirect map, see below).

## Non-goals

- No blog migration at launch. `/blog` route and MDX pipeline exist, empty or with 1 seed post; blog.klyx.fr stays live until a later decision.
- No CMS, no database, no backend beyond the contact route handler.
- No lead engine, email sequences or tracking: a later session does the full outreach funnel.
- No DNS changes, no deploy to production. Migration is a written plan only.
- No new logo.

## Anti-goals (failure even if it works)

- Any claim Maxime cannot defend live on a call. Every number, client name and employer mention is either verified or marked `TODO(maxime)`.
- Fake proof: invented logs, invented counts, stock « +150 projets » counters.
- Buzzword copy (« révolutionner », « booster », « solutions innovantes »). Sounds AI-written.
- A showreel: heavy motion, three.js, cursor effects. Lighthouse below 95.
- Many average sections. Fewer sections done perfectly.

## Decisions made by Maxime

- Repo: new `klyx-site` (this repo), private GitHub repo `AirKyzzZ/klyx-site`, draft PR from a feature branch.
- Contact: Next route handler sending via Resend (`RESEND_API_KEY`) from a dedicated subdomain `send.klyx.fr`, so root klyx.fr SPF/DKIM/DMARC and the outreach sending reputation stay untouched. The add-only DNS records go into `MIGRATION.md` for Maxime to apply. Cal.com embed for booking. One booking provider everywhere: Cal.com.
- Languages: French and English from launch, via next-intl with `[locale]` routing. FR is default at `/` (no prefix), EN at `/en/...`. Every page ships in both; EN copy is a faithful adaptation of the FR draft (not machine-literal), same `TODO(maxime)` markers. Localised slugs for EN where it matters for SEO (e.g. `/en/services/ai-agents`), hreflang alternates and per-locale sitemap entries. MDX case studies and blog posts have a FR and an EN file.
- Design integration: if the template Maxime picks is Next/Tailwind code with an acceptable license, fork it and strip it down to the constraints below; if it is a visual reference (Framer, Webflow, gallery site, MotionSites prompt), rebuild its sections in this stack. Lighthouse >= 95 and license rules win over the template's motion; the "max 2 islands" rule can bend only if Lighthouse still passes. Template-independent work (routing, i18n, content, MDX, SEO/JSON-LD, contact, redirects, legal) starts as soon as this spec is approved, before the pick.
- Positioning: angle A, outcome. Homepage written for startups and agencies first; Bordeaux SMEs get `/agence-ia-bordeaux`.
- Hero: « Des agents IA qui tournent en production, pas des démos. » Sub: « Sites, agents et automatisations livrés au forfait pour startups et agences. Devis gratuit, prix publics. »
- Brand adjectives: direct, fiable, rapide. Copy voice: short sentences, prices and durations visible, first person singular (« je »), no fluff.
- Pricing: all public. Sprint IA 4 500 € HT is a fixed-scope deliverable. FDE from 700 €/day, 4-week minimum. Other prices per the ladder below.
- Guarantees at launch: Audit IA credited against the build; free quote. No delivery guarantee yet.
- Visual direction: editorial warm. Paper `#FAF9F5`, ink `#141413`, one accent vermilion `#E8431F`. Inter Tight (headings and UI) + Instrument Serif italic (one emphasis phrase per heading at most) + Geist Mono (proof blocks, prices, small labels). CSS-only motion by default.
  - Superseded on 2026-10-31 by `docs/DESIGN_DIRECTION.md` (Live System: warm black, burnt orange, Geist + Geist Mono + Instrument Serif).
- Design base (picked 2026-10-31): shadcnblocks Mainline (https://github.com/shadcnblocks/mainline-nextjs-template, MIT + Commons Clause, fine for our own site) as the base, plus Tailark free blocks (https://github.com/tailark/blocks, MIT) for sections Mainline lacks. Mainline's own look (warm background, spacing, components) is kept; we layer on only the Instrument Serif italic hero phrase and Geist Mono proof blocks. Mainline's app screenshots are replaced by real Klyx artefacts.
- Design source: the site is NOT designed from scratch by the agent (Maxime: it would read as AI slop). Layout, section designs and integration come from a real template or a closely followed reference site that Maxime picks from a screenshot shortlist (galleries, MotionSites, 21st.dev, Tailark/Magic UI/Aceternity, curated studio sites). The direction above is the filter for that shortlist; the picked template can override palette/type details if Maxime prefers it as-is. A paid template is fine only after Maxime approves the purchase.
- Logo: keep the current Klyx mark. Use the black variant on paper (`klyx-wordpress` uploads `2025/04/black_transparent.png`, same as `../KlyxAI/images/`); export a clean SVG if vectorising is straightforward, otherwise optimised PNG.
- studio.klyx.fr and estate.klyx.fr stay live and are linked from klyx.fr as distinct Klyx lines (one sentence each).
- Phase 4 in this session is assets only, in French, for startups and agencies on the new positioning (the Bordeaux-SME cold email system is a separate, later project): discovery-call script, one-page offer PDF covering the ladder, LinkedIn DM + follow-up, short video script.

## Offer ladder (all € HT, « à partir de »)

| Offer | Price | Duration | Page |
|---|---|---|---|
| Landing page (one-pager) | 900 | 1-2 weeks | `/services/creation-site-web` |
| Site IA (5-8 pages, SEO + GEO) | 2 900 | 3-4 weeks | same |
| Site sur mesure | 5 700 | TODO(maxime) | same |
| Audit IA + roadmap | 1 500 | 1-2 weeks | `/services/agents-ia` |
| Sprint IA, one workflow in production | 4 500 | 2 weeks | same |
| Retainer run-and-improve | TODO(maxime), research suggests from 300/month | monthly | same |
| Forward Deployed Engineer, shared time (« temps partagé ») | 700/day, 2-3 days a week, 4-week minimum (from ~5 600 HT); no trial-week guarantee at launch; capacity 2 clients | weeks | `/forward-deployed-engineer` |

Audit credit rule: TODO(maxime) on the exact terms (research suggests 100% credited if the Sprint is signed within 60 days).

## Pages at launch

Navigation: Offres (3), Réalisations, Tarifs, À propos, [Réserver un appel].

1. `/` Home. Sections, in order, and nothing more:
   - Hero (copy above), primary CTA « Réserver un appel » (Cal.com), secondary « Demander un devis gratuit » (`/contact`).
   - Proof artefact next to or below the hero: a real deliverable in a mono card (e.g. a CiteMe PR list, a Lighthouse score of a shipped client site, an agent run log from a real project). Content is `TODO(maxime)`; never invented.
   - The 3 offers as 3 cards: name, one-line outcome, « à partir de » price, link.
   - Réalisations: 3-4 projects with screenshot, what was built, link.
   - How it works: 4 steps (appel, audit ou devis, build, mesure). Reuse the live wording.
   - Founder block: who Maxime is, with verifiable links (GitHub, LinkedIn). Employer and project names gated by `TODO(maxime)`.
   - Testimonials: the 3 live quotes verbatim (David A., Antoni V., Clément D.) if Maxime confirms reuse.
   - FAQ (5-6 Q&As, FAQPage JSON-LD).
   - Final CTA.
2. `/services/creation-site-web`: Sites & landing pages.
3. `/services/agents-ia`: IA & agents pour startups, agences et PME (audit, sprint, retainer).
4. `/forward-deployed-engineer`: FDE offer page that also defines the term in French. Never use « développeur embarqué ».
   Each offer page: problem, deliverables, process, price anchor, proof, FAQ, CTA.
5. `/realisations` + `/realisations/<slug>` from MDX: hop-hop-immo, citeme, kenzi, pkba, vertiflow (screenshots from WP uploads). What was built per project, no implied AI where there was none.
6. `/tarifs`: every price in one table + short market context. Key GEO page.
7. `/a-propos`: Person + Organization entity page; links to studio.klyx.fr and estate.klyx.fr.
8. `/agence-ia-bordeaux`: local page for SME owners, plain language, address/area, FAQ.
9. `/contact`: form (name, email, company, need, budget band, message; honeypot + server-side validation) and Cal.com embed. Sends to contact@klyx.fr via Resend.
10. `/blog`, `/blog/<slug>`: MDX pipeline (reuse patterns from `../blog-klyx`: lib/posts, json-ld, rss), launch empty or one seed post.
11. `/mentions-legales`, `/confidentialite`: from `../klyx-estate/src/app/mentions-legales/page.tsx` (SIRET 941 572 364 00029), plus the prospecting notice the outreach design requires, as its own section with a stable anchor (`/confidentialite#prospection`); if the outreach system has already published the notice on WordPress under another path, that path redirects here.
12. `/llms.txt`, `sitemap.xml`, `robots.txt` (allow AI crawlers listed in the strategy GEO checklist), OpenGraph image.

Later, not now: `/services/audit-ia`, `/services/automatisation-ia`, `/services/geo-referencement-ia`.

## Redirects (from the live site)

- `/agence-web-bordeaux/` -> `/` (301)
- `/category/non-classe/`, `/author/airkyzzz/` -> `/` (301)
- `/feed/` -> `/blog/rss.xml` (301)
- `/sitemap_index.xml`, `/wp-sitemap.xml`, `/page-sitemap.xml` -> `/sitemap.xml` (301)
- `/wp-content/uploads/2025/07/guide_vitrine_essentiels.pdf`: keep the file at the same path (self-hosted in `public/`), and `/?attachment_id=425` -> that path.
- Other `/wp-content/*`, `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php` -> 410.
Output as `redirects.md` table plus code in `next.config`.

## Technical constraints

- Next.js 16 App Router, TypeScript strict, Tailwind v4, shadcn/ui primitives, Tailark free blocks (MIT) restyled, at most 2 Magic UI-style components ported to CSS. No CC BY-NC or GPL code.
- MDX for réalisations and blog. UI strings in next-intl message files (`messages/fr.json`, `messages/en.json`); see `../klyx-partner-site` for a working next-intl setup. All pages statically generated per locale (`generateStaticParams` + `setRequestLocale`).
- Static by default; the only dynamic piece is the contact route.
- Motion: CSS only, transform/opacity, `prefers-reduced-motion` respected, content visible without JS, LCP element never starts at opacity 0. At most 2 client islands.
- SEO/GEO: metadata per page, OpenGraph, JSON-LD (Organization, ProfessionalService, Person, Service + Offer with `valueAddedTaxIncluded: false`, FAQPage, BreadcrumbList), matching visible text.
- Security headers from `../klyx-wordpress/server/www/.htaccess` ported to `next.config`.
- Analytics: TODO(maxime), default none at launch (or PostHog as in klyx-estate if he wants it).
- Follow Maxime's conventions: kebab-case files, named exports, no comments, no `any`.

## Hosting (plan only)

`MIGRATION.md`: compare Vercel Hobby/Pro, Cloudflare, Netlify; recommend one. Note: Vercel Hobby forbids commercial use, so a business site needs Pro or another host. Steps: add the Resend records for `send.klyx.fr` (add-only), change only root A/AAAA, add `www`, keep MX (Zoho EU), SPF, DKIM (Zoho + Brevo), DMARC untouched; rollback = restore OVH A/AAAA; cancel OVH web hosting only after N days of clean traffic, keep the domain registration.

## Done when

Repo builds; lint, typecheck and build pass; Lighthouse mobile >= 95 on home; desktop and mobile screenshots of home and one offer page; `redirects.md` and `MIGRATION.md` written; Phase 4 assets drafted; `TODO(maxime)` list collected.

## Left to the builder

Section layouts within the direction, component choice from the kits, exact spacing/type scale, FAQ wording, case-study prose from available material, OG image design, file structure.
