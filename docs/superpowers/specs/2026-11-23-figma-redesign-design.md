# Klyx redesign from the Figma (2026-11-23)

## Intent

Maxime's friend designed a new home for klyx.fr in Figma (file `HzQotiO9qBVjs0qYKTomG7`, frames "Klyx Home / Light" and "Klyx Home / Dark", plus a notes frame). The whole site moves to that design: light by default, dark through a switch in the nav, plain-language copy, calmer layout. Every page is redesigned, not only the home. The current footer is kept (content and structure), only restyled to the new tokens.

Maxime's own feedback, all covered by the Figma: no small mono eyebrow labels ("AGENCE IA · BORDEAUX", "01 · OFFRES"...), remove the fake terminal/window components except the GitHub contribution one, redo the agenda component, add a light/dark switch on the whole site with light as default, better copy.

Detailed section spec with exact copy and captures: `scratchpad/figma/SPEC.md` and `scratchpad/figma/*.png` (paths given to builders). This file records the decisions.

## Goals

- Home matches the Figma, light and dark, including its animations.
- Every other page uses the same vocabulary (tokens, nav, section headers, cards, before/after rows, steps, FAQ, final CTA with booking card) so the site reads as one.
- Theme switch on every page, light default, no flash of the wrong theme, choice persisted.
- No SEO regression: every URL kept, one h1 per page carrying the page's keyword, titles/meta/JSON-LD/hreflang/sitemap/llms.txt/markdown mirror kept working.
- Lighthouse and the existing quality bar hold (CLS < 0.02, no horizontal overflow at 390/768/1440, alt on images, reduced motion = no animation, prices and FAQ visible without JS).

## Non-goals / anti-goals

- No new dependencies (no motion library, no next-themes). CSS and small client islands only.
- No Figma footer.
- No fake proof: no invented numbers, testimonials or logos of non-clients. The client names in the hero proof row are real projects (Cronolyss, CiteMe, Hop Hop Immo, 2060.io, PKBA).
- No URL changes, no route removals.

## Decisions

**Theme.** `data-theme="light" | "dark"` on `<html>`. An inline blocking script in `<head>` reads `localStorage["klyx-theme"]` and sets the attribute before paint; with no stored value the theme is light (the system preference is ignored, Maxime wants light as default). Tailwind's `dark` custom variant binds to `[data-theme="dark"]`. `color-scheme` and `<meta name="theme-color">` follow the theme. The switch is the Figma's sun/moon segmented control in the nav (desktop) and in the mobile menu. Pages under `/pour` get the switch too.

**Tokens** (Figma variables, light / dark):

| Role | Light | Dark |
|---|---|---|
| bg | #FBFAF8 | #141414 |
| card (surface-1) | #FFFFFF | #1A1918 |
| inset (surface-2) | #F3F1EC | #211F1D |
| line | #E9E5DD | #282624 |
| line-strong | #D6D0C4 | #3A3632 |
| text | #1A1917 | #EDEAE3 |
| text-2 | #5E5850 | #A8A29A |
| text-3 | #8F887E | #857F77 |
| accent | #F54E00 | #F54E00 |
| ok | #00A17D | #4CC38A |
| accent tint | from SPEC.md | #2A1A11 |
| nav fill | #FFFFFF at 78% + blur | dark equivalent from SPEC.md |

Keep the existing token names (`--bg`, `--surface-1`, `--text-2`...) so the ~700 token class uses keep working; redefine values per theme. Remove the sand inversion (`tone-sand`, `tone-dark`) and hard-coded warm gradients; the Figma has no inverted band. Grain: `/textures/grain-sand.png` in light, `/textures/grain.png` in dark, 128px repeat.

**Type.** Geist stays. H1 Geist 600 62px, line-height 104%, letter-spacing -2.6px. Hero subtitle Geist 400 19px/155% text-2. Other roles from SPEC.md. The single Instrument Serif italic word per page goes away unless SPEC.md shows it.

**Layout.** Container 1232px between the two rails (already the case). Nav same width, translucent with backdrop blur, sticky.

**Removed.** `Eyebrow` and every eyebrow/index string; hero eyebrows; the Live System illustration (hero.tsx, offer-hero, outreach hero) and its CSS; `RosterWindow`/`TerminalWindow` (team.yml, `klyx --info`); the three-dot `SampleWindow` chrome everywhere; the old static `AgendaSlots`; `LitFrame` strip "Illustration · scénario type"; sand band; FoldStrip if unused. Delete code that becomes unused, with its tests and message keys.

**Kept.** GitHub contribution graph (`ContributionGraph` + `github-contributions.json`), shown inside the founder card as in the Figma, without window chrome. Machine view toggle and `/md` mirror (update `page-markdown.ts` to the new copy). JSON-LD, metadata, OG images (restyle `render-og.tsx` to the light palette), i18n FR/EN, contact form, CalBooking on /contact (pass the current theme to Cal), analytics.

**New shared pieces** (names indicative): `ThemeToggle`, `SectionHeader` (H2 left, short intro right, as in every Figma section), `ConstellationBackdrop` (40px grid, dotted wires, nodes, real logos from `components/logos`, left = where requests come from, right = where the AI sends work), `ClientsRow` ("Ils nous ont confié un projet"), `ToolsStrip`, `OfferCard` with illustration, `UseCaseCard` (flow row + Avant / Avec l'agent), `CaseCarousel`, `MethodSteps` with mock cards, `TrustGrid` (Données et sécurité), `FounderCard`, `FaqList` (two columns), `BookingCard` (CTA final: Maxime bubble, day/slot picker marked "Exemple", orange button opening `site.calUrl` or /contact).

**Animations** (CSS keyframes, all disabled under `prefers-reduced-motion`, hero h1 never animated for LCP): orange light descending both rails on a loop; hero logos float gently, each with its own duration and delay; orange dots on the wires pulse; réalisations carousel Cronolyss → CiteMe → Hoppy with fade, screenshot rising, progress bar under the active tab, auto-advance paused on hover/focus/offscreen, tabs clickable; existing `.reveal` on scroll is fine. Timings from SPEC.md (12 s master loop in Figma).

**Copy.** Figma copy is the base for the home. Rules from the Figma notes: short sentences, no jargon in visible copy (no "FDE", "workflow", "repo", "prod"), each block says who it is for, what we do and what it costs. "Forward Deployed Engineer" is shown as "Développeur dédié"; the `/forward-deployed-engineer` URL stays and the term may appear once in that page's title/meta for search. Prices: site from 900 € HT, audit IA 1 500 € HT, agent IA from 4 500 € HT, développeur dédié 700 € HT/jour (4 semaines minimum). Fix the nav dropdown showing 1 500 € on Agents IA. Speak honestly about the setup: one lead engineer (Maxime), AI coding agents on scoped tasks, specialists case by case. English copy mirrors the French in natural English.

**SEO guardrails.** Home `<title>` and meta keep "Agence IA à Bordeaux"; the h1 follows the Figma. Each inner page h1 keeps its target keyword (e.g. "Création de site web à Bordeaux", "Agence IA à Bordeaux"). Keep FAQPage/Service/Offer JSON-LD in sync with the visible copy.

**SEO fixes folded into the redesign** (from the 2026-11-23 audit, because these pages are rewritten anyway):
- `/a-propos` stops competing for "agence IA Bordeaux": its title/h1 describe the person and the way of working. `/agence-ia-bordeaux` owns the keyword: h1 with "Agence IA à Bordeaux", an H2 and FAQ entries for "consultant IA à Bordeaux", a zone served (Bordeaux, Mérignac, Pessac, Talence, Bassin d'Arcachon, Gironde), a local work block linking real cases (PKBA and VertiFlow on the Bassin, Lady Gallery in Bordeaux, Hop Hop Immo in the Sud-Ouest), links to the blog pillar `integrer-ia-pme-methode`.
- `/forward-deployed-engineer` meta description is commercial (développeur dédié à temps partagé, 700 € HT/jour), the definition block shrinks to two sentences plus a link to `/blog/forward-deployed-engineer-definition`.
- `/services/agents-ia` title targets "agent IA entreprise", not "automatisation" (owned by `/services/automatisation-ia`).
- Internal links: `/tarifs` links `/blog/cout-agent-ia-pme`; home links two blog pillars; thin case studies get linked from relevant service and sector pages.
- Nav logo: stop preloading the 801×759 PNG at 20px (use an SVG or proper `sizes`).
- Home payload: the Live System removal already trims the RSC payload; keep logo SVGs shared, not duplicated inline.

**Tests.** Update unit and e2e tests to the new structure instead of deleting coverage. Keep the quality.spec invariants. Add: theme defaults to light, switch persists across navigation and reload, `data-theme` is set before first paint (no flash), both themes pass the overflow/CLS checks.

**Docs.** Rewrite `docs/DESIGN_DIRECTION.md` for the new direction (it currently forbids a theme switch, glass and motion beyond CSS).

## Delivery

One branch `feature/figma-redesign`, merged to main once all pages are done, build and tests are green, and a visual pass in both themes at 390 and 1440 is done. Phase A: foundation + home. Phase B: inner pages in parallel by template. Phase C: review, tests, visual pass, PR. SEO/GEO fixes ship in a separate PR.

## Left to the builder

Exact spacing and component APIs, how to split client islands, mobile layouts (the Figma is desktop only: stack columns, keep the hero readable, hide or reduce constellation logos under 768px), illustration details for inner-page heroes, EN wording.
