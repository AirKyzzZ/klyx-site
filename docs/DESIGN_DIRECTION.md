# Design direction: Figma redesign (2026-11-23)

Replaces the "Live System" direction. The source of truth is the Figma file `HzQotiO9qBVjs0qYKTomG7` (frames "Klyx Home / Light" and "Klyx Home / Dark"). Decisions are recorded in `docs/superpowers/specs/2026-11-23-figma-redesign-design.md`; this file is the working design system for anyone building a page.

The idea in one line: **a calm, light site that says plainly who it is for, what we do and what it costs.** Light by default, dark on demand, one orange accent, real logos and real projects, no fake terminals.

Not reopened: every route, SEO/GEO plumbing (metadata, JSON-LD, sitemap, `llms.txt`, the `/md` mirror), the offer ladder and prices, the contact flow, analytics, "no fake proof ever".

---

## 1. Theme

- `data-theme="light" | "dark"` on `<html>`. Server HTML always ships `light`; the inline script in `<head>` (`ThemeScript`, `src/lib/theme.ts`) reads `localStorage["klyx-theme"]` and switches before first paint. The system preference is ignored on purpose: light is the default.
- Tailwind's `dark:` variant is bound to `[data-theme="dark"]`. Prefer tokens over `dark:`; reach for `dark:` only when a component genuinely changes shape between themes.
- `color-scheme` follows the attribute in CSS; `<meta name="theme-color">` is updated by the script and by the switch.
- The switch is `ThemeToggle` (sun/moon segmented control). Its visual state is CSS-driven from the attribute, so it never flashes; `aria-pressed` catches up after hydration.

## 2. Tokens

All in `src/app/globals.css`, light on `:root`, dark under `[data-theme="dark"]`, exposed to Tailwind via `@theme inline`. Names predate the redesign and are kept so older pages keep working.

| Token | Light | Dark | Figma variable / use |
|---|---|---|---|
| `--bg` | `#FBFAF8` | `#141414` | `color/bg`, page, booking card |
| `--surface-1` | `#FFFFFF` | `#1A1918` | `color/surface`, cards, panels, secondary buttons |
| `--surface-2` | `#F3F1EC` | `#211F1D` | `color/surface-2`, insets: illustrations, flow rows, mock panels |
| `--surface-3` | `#ECE9E2` | `#2A2825` | hover only |
| `--line` | `#E9E5DD` | `#282624` | 1px borders, separators, rails |
| `--line-strong` | `#D6D0C4` | `#3A3632` | button borders, carousel tracks, number circles |
| `--text` | `#1A1917` | `#EDEAE3` | headings, primary text |
| `--text-2` | `#5E5850` | `#A8A29A` | body |
| `--text-3` | `#6F685F` | `#948E85` | labels, meta. Darker than the Figma (`#8F887E` / `#857F77`) so small text reaches 4.5:1 on every surface |
| `--accent` | `#F54E00` | `#F54E00` | primary buttons, links, Agent IA pill |
| `--accent-ink` | `#FFFFFF` | `#141414` | `color/on-accent`, text on orange (dark text in dark mode) |
| `--accent-tint` | `#FFF0E8` | `#2A1A11` | `color/accent-soft`, icon tiles, date tile, selected slot |
| `--accent-text` | `#C23D00` | `#F54E00` | small orange text (links, category labels, tags, selected slot): 4.5:1 on bg, surfaces and accent tint. Buttons and the Agent IA pill keep `--accent` |
| `--ui-ok` | `#1F9D63` | `#4CC38A` | "En ligne", online dot, checks |
| `--inverse` / `--inverse-ink` | `#1A1917` / `#FBFAF8` | `#EDEAE3` / `#141414` | nav CTA (dark button in light, light button in dark) |
| `--nav-fill` | white 78% | `#1A1918` 78% | nav bar, with 16px backdrop blur |
| `--grain` | `grain-sand.png` | `grain.png` | body texture, 128px repeat |

Shadows (ink `#1F170D` in both themes): `shadow-nav`, `shadow-panel` (cards), `shadow-tile` (floating logo tiles), `shadow-float` (booking card), `shadow-accent` (primary button). Radii: 8 (thumbnails, slots), 10 (nav CTA, icon tiles, day chips), 12 (hero buttons, illustrations, flow rows, link cards), 14 (nav bar), 16 (offer table, cards, photo), 20 (carousel, mock panels, data panel, booking card), 24 (founder and CTA panels), 999 (pills).

Brand logo tiles are white in both themes (`LogoTile`), with brand colours from `src/components/logos/brand-colors.ts`.

## 3. Type

Geist everywhere, Geist Mono only where data is shown. No serif italic word, no mono eyebrows.

| Utility | Spec |
|---|---|
| `type-hero` | 600, 62/104%, -2.6px (clamped down on phones). Never animated: it is the LCP. |
| `type-section` | 600, 44/108%, -1.6px, section H2 |
| `type-cta` | 600, 48/106%, -1.8px, final CTA H2 |
| `type-subtitle` | 400, 19/155%, hero subtitle |
| `type-intro` | 400, 17/150%, section intro (right column) |

Card titles, prices and labels use plain Tailwind sizes from the Figma (`text-[1.375rem]` offer title, `text-[1.875rem]` price, `text-[0.8125rem]` labels). French copy uses a non-breaking space before `? : ! ;`; prices come from `formatPrice`, which uses non-breaking spaces (`4 500 € HT`).

## 4. Layout

- Container 1232px between two 1px rails (`Rails`), content 1168px (`--content-x` 32px on desktop).
- Every section starts with a 1px separator and the two `+` markers where it meets the rails (`PageSection` renders `Hr`). Padding 112px top and bottom (120 on Offres and Réalisations, 44 on the tools strip). Header to content: 32-48px.
- Section header: H2 left (max 680px), short intro right (400px), top-aligned.
- Nav: fixed, 16px from the top, 1232px wide, 56px tall, translucent with blur.
- Mobile (the Figma is desktop only): columns stack, the constellation logos and wires hide under 1024px (the grid stays), the hero h1 and both CTAs fit the first screen at 390.

## 5. Motion

CSS only. Everything is off under `prefers-reduced-motion` (global rule in `globals.css`), and decorative elements rest in a static state.

- Rail light: a 1x200 orange line with a 9x260 blurred halo descends each rail in a 6s loop, the right rail half a cycle behind. It travels the viewport (sticky), so it is visible wherever you are on the page.
- Hero: logo tiles float on their own rhythm (5 to 7.8s, alternate), orange dots pulse (2.4s).
- Réalisations carousel: 4s per slide (12s loop), crossfade, screenshot rises, the progress bar under the active tab drives the advance (`animationend`). Pauses on hover, focus and when offscreen; tabs are clickable and arrow-key operable; no auto-advance with reduced motion.
- `.reveal` on scroll is allowed for inner pages; the home does not use it.

## 6. Shared components (`src/components/ui-kit/`)

Server components unless noted. All take `className`.

| Component | File | Props | Notes |
|---|---|---|---|
| `PageSection` | `page-section.tsx` | `id?`, `divider?` (default true), `containerClassName?`, `children` | Section wrapper with separator, rail markers and default padding. Override padding through `containerClassName` (e.g. `lg:pt-30`). |
| `SectionHeader` | `section-header.tsx` | `title`, `intro?`, `as?` (`h2` default, `h1` for inner-page heroes), `children?` | H2 left, intro right. `children` go under the intro (buttons, links). |
| `CenteredHero` | `centered-hero.tsx` | `title` (h1), `subtitle?`, `actions?`, `backdrop?`, `footer?`, any `<section>` attribute | Home hero layout; reuse for inner pages with another backdrop. |
| `SplitHero` | `split-hero.tsx` | `title` (h1), `subtitle?`, `actions?`, `aside?`, `breadcrumb?` | Text left, 440px aside right (stacks under `lg`). Inner-page hero for `/cas-usage`, the sector pages and `/agence-ia-bordeaux`. |
| `FactCard` | `fact-card.tsx` | `visual?`, `facts: { label, value }[]`, `price?: { label, value, unit?, note? }` | Key facts as a label/value list with an optional inset visual and price footer. Used as the `SplitHero` aside. |
| `ConstellationBackdrop` | `constellation-backdrop.tsx` | `sources`, `destinations` (5 `ToolLogoId` each) | 40px grid, dotted wires, orange nodes, floating white logo tiles at the Figma positions. Decorative (`aria-hidden`). |
| `ClientsRow` | `clients-row.tsx` | `label`, `names` | Text wordmarks of real clients only. |
| `ToolsStrip` | `tools-strip.tsx` | `title`, `tools: Tool[]`, `more?` | Centered logo and name row. |
| `LogoTile` | `logo-tile.tsx` | `logo`, `size?` (`sm` 28, `md` 40, `lg` 48) | White tile, brand-coloured glyph, both themes. |
| `AgentPill`, `FlowLine` | `agent-pill.tsx` | `label` | Orange "Agent IA" pill and the 1.5px connector. |
| `FlowRow` | `flow-row.tsx` | `from`, `to` (logo ids), `agentLabel` | Logo, pill, logos chain used in use cases. |
| `OfferCard`, `OfferRow`, `CatalogueLinks` | `offer-card.tsx` | card: `name`, `audience`, `body`, `priceLabel?`, `price`, `unit?`, `duration`, `href`, `linkLabel`, `illustration?`; links: `label`, `items` | `OfferRow` is the bordered 3-column table. |
| `OfferLink` | `offer-link.tsx` | `href`, `name`, `price` | Compact link card (name, price, arrow circle). Plain `next/link`, so pass an already localized `href`. Used on the 404 and in the blog service links. |
| `SiteIllustration`, `AgentIllustration`, `TeamIllustration` | `offer-illustrations.tsx` | see file | The three offer illustrations. Team uses generic avatars plus Maxime's real photo, never stock faces. |
| `UseCaseCard`, `BeforeAfterRows` | `use-case-card.tsx` | `category`, `title`, `from`, `to`, `agentLabel`, `before`, `after` (`{ label, text }`) | `BeforeAfterRows` also works on its own. |
| `ComparisonList` | `comparison-list.tsx` | `items: { title, before, after }[]` (`before`/`after` are `{ label, text }`) | One bordered list: title left, `BeforeAfterRows` right. The before/after block on sector pages and `/agence-ia-bordeaux`. |
| `CaseCarousel` (client) | `case-carousel.tsx` | `items: CarouselCase[]`, `labels`, `interval?` (ms, 4000) | Tabs below the slide, progress-driven advance. |
| `CaseRow` | `case-row.tsx` | `slug`, `name`, `kind`, `summary`, `meta`, `image` | One "other project" row linking to its case study. |
| `MethodSteps` | `method-steps.tsx` | `steps: { when?, title, body, mock? }[]` | With a mock on any step: numbered rows, mock panel on the right. With no mock at all: columns instead (2 from `sm`, 4 on `lg` when there are more than 3 steps, else 3), the numbers joined by a line on desktop. Offer pages and `/tarifs` use the column layout. |
| `CallMock`, `QuoteMock`, `UpdateMock`, `HandoverMock` | `method-mocks.tsx` | see file | Mock cards for the four steps. |
| `TrustGrid` | `trust-grid.tsx` | `items: { icon, title, body }[]`, `footer?: { label, models }` | Données et sécurité panel. |
| `FounderCard` | `founder-card.tsx` | `name`, `role`, `bio`, `photo`, `photoAlt`, `stats`, `graph?`, `links` (`{ label, detail, href, icon }`) | Pass `ContributionGraph` with `fills={ACCENT_LEVEL_FILLS}` and `cell={9}` as `graph`. Stats come from data (GitHub JSON, case count), never typed in. Use `FounderPanel` instead of filling it by hand. |
| `FaqList` | `faq-list.tsx` | `title`, `intro?`, `items: { question, answer, id? }[]`, `openFirst?` | Native `<details class="faq-item">` with the answer as the direct `<p>` child (quality.spec relies on it). |
| `FinalCta` | `final-cta.tsx` | `title`, `body`, `actions?`, `aside` | White panel with the soft orange glow. |
| `BookingCard` (client) | `booking-card.tsx` | `labels`, `avatar`, `days`, `slots`, `buttonTemplate` (`{day} {date} {time}`, pass `t.raw`) | Day and slot pickers are marked "Exemple"; the button always opens `site.calUrl` (or `/contact`). |

Page-level pieces built on the kit, outside `ui-kit/`:

| Component | File | Props | Notes |
|---|---|---|---|
| `MethodSection` | `src/components/templates/method-section.tsx` | `locale`, `title`, `intro`, `steps` (exactly 4 `{ when, title, body }`, check with `fourSteps()`), `quote: { title, items, excluded, offer }`, `updates` (3 strings) | The four-step method with the call, quote, update and handover mocks. Mock labels come from `useCases.method.mocks`; the quote price and duration from the `offer`. Sector pages and `/agence-ia-bordeaux`. |
| `PriceCards` | `src/components/templates/price-cards.tsx` | `locale`, `cards: { id: OfferId, audience, body }[]`, `labels: { from, perDay, viewOffer }` | An `OfferRow` of `OfferCard`s whose name, price, unit, duration and link come from `offers.ts` and `offers.items`. Sector pages, `/agence-ia-bordeaux`, outreach pages. |
| `ShotFrame` | `src/components/proof/shot-frame.tsx` | `image`, `alt`, `sizes`, `device?` (`desktop` 16:10, `mobile` 390:844), `eager?` | A real screenshot in a plain bordered frame, no window chrome. Case studies. `hostOf(url)` gives the bare host for captions. |
| `FounderPanel` | `src/components/sections/founder-panel.tsx` | `locale`, `className?` | Fills `FounderCard` from `home.team`, the GitHub JSON and the case count. The home and `/a-propos` both render it so they stay identical. Also exports `FOUNDER_PHOTO`. |

Elsewhere: `ThemeToggle` and `ThemeScript` (`src/components/theme/`), `KlyxMark` (`src/components/brand/klyx-mark.tsx`, inline SVG logo in `currentColor`), `LanguageMenu` (globe pill in the nav, `src/components/language-switcher.tsx`), `Rails` (`src/components/rails.tsx`), button variants `outline`, `inverse` and size `xl` in `src/components/ui/button.tsx`. Home data (logos, cases, FAQ keys) lives in `src/lib/home-sections.ts`.

## 7. Rules for Phase B pages

- No eyebrows or index strings, no three-dot window chrome, no terminal, no sand band. No page renders `Section`/`Eyebrow`, `LiveSystem` or the `tone-sand` styles any more; they wait for deletion, do not use them in new work.
- One h1 per page carrying the page keyword; the hero can be `CenteredHero` or `SectionHeader as="h1"`.
- Each block says who it is for, what we do and what it costs. No jargon in visible copy ("workflow", "repo", "prod", "FDE"); "Forward Deployed Engineer" is shown as "Développeur dédié".
- Real proof only: real client names, real screenshots from `public/realisations`, numbers read from data files.
- Copy lives in `messages/{fr,en}.json` (identical key sets), and the `/md` mirror in `src/lib/machine/page-markdown.ts` follows every visible change.
- Check both themes at 390, 768 and 1440 before calling a page done (`e2e/theme.spec.ts` shows how to seed the theme).
