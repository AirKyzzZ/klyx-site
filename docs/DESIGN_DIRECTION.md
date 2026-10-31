# Design direction: Live System (2026-10-31)

Replaces the Mainline-based direction. Maxime judged the Mainline look flat and generic and picked art direction C, "Live System", from the direction board. This file is the design system and the section-by-section spec. The implementation plan is `docs/superpowers/plans/2026-10-31-klyx-redesign.md`. The outreach page template and the proof production order from the previous version are carried over unchanged at the end (sections 8 and 9).

Unchanged and not reopened: every route, all copy in `messages/{fr,en}.json` and `content/`, SEO/GEO (metadata, JSON-LD, sitemap, robots, `llms.txt`), the contact action, the redirects, the offer ladder and prices, "no fake proof ever". Only the visual layer changes, plus three new service pages and the HUMAN/MACHINE view.

The idea in one line: **show the agent working instead of claiming it.** The site is warm black, quiet and precise. Colour and life come from small, real-looking system UI (graphs, traces, run logs, scores) lit like objects on a stage.

Path shorthands:
- `CM/` = `/Users/samsepiol/Downloads/GithubRepos/Work/Citeme/web-citeme/`
- `EU/` = `/Users/samsepiol/Downloads/GithubRepos/Work/Euthyne/app-euthyne/`
- `REF/` = `/private/tmp/claude-501/-Users-samsepiol-Downloads-GithubRepos-Work-Projets-perso-Klyx/d033e167-5872-411a-8ca0-cbbf448f15d5/scratchpad/wow/` (reference screenshots and research notes; plan task R1 copies the ones used here into `docs/screenshots/references/` because the scratchpad is temporary)
- `21st:<author>/<name>` = a 21st.dev component, `https://21st.dev/@<author>/components/<name>`
- `MS:<id>` = a MotionSites prompt, `https://motionsites.ai/?prompt=<id>`

References that define the look: Cursor (product windows on a painted backdrop, warm black, burnt orange; `REF/sotd/cursor-full.png`), Raycast (lit OS frame with coloured bloom; `REF/sotd/raycast-full.png`), Linear (DOM product UI, two-tone headings, FIG captions; `REF/sotd/linear-full.png`), Clerk (tabbed live showcase, chamfered section break; `REF/sotd/clerk-full.png`), basement (HUMAN/MACHINE toggle; `REF/sotd/basement-hero-live.jpg`), `REF/21st/agent-pipeline.png`, `REF/21st/agent-trace.png`, `REF/motionsites/jpg/codeveil.jpg`, `REF/motionsites/jpg/network-hero.jpg`.

---

## 1. Design tokens

All tokens live in `src/app/globals.css` as custom properties on `:root`, mapped to Tailwind v4 through `@theme inline`. The site is dark, with no theme switch. One section family uses the inverted "sand" surface.

### 1.1 Colour

| Token | Value | Use |
|---|---|---|
| `--bg` | `#141414` | page background (warm black, fixed by Maxime) |
| `--bg-sunken` | `#0F0F0E` | machine view, terminal body, footer |
| `--surface-1` | `#1A1918` | cards, nav pill |
| `--surface-2` | `#211F1D` | windows, inputs, raised cards |
| `--surface-3` | `#2A2825` | hover, active tab, selected row |
| `--line` | `rgb(237 232 222 / 0.08)` | default 1px borders, rails |
| `--line-strong` | `rgb(237 232 222 / 0.14)` | window borders, focused inputs |
| `--highlight` | `rgb(255 255 255 / 0.06)` | 1px inset top highlight on raised surfaces |
| `--text` | `#EDEAE3` | primary text |
| `--text-2` | `#A8A29A` | sand grey: heading continuations, secondary body (about 7.3:1 on `--bg`) |
| `--text-3` | `#948E85` | captions, mono labels, timestamps (5.7:1 on `--bg`, 4.5:1 on `--surface-3`, never under 12px; was `#8A847B`, which failed on `--surface-2` and `--surface-3`) |
| `--sand-50` | `#F3EFE7` | inverted sand surface (réalisations band, case covers) |
| `--sand-200` | `#E3DCCF` | lines on sand |
| `--ink` | `#1A1917` | text on sand |
| `--ink-2` | `#5E5850` | secondary text on sand |
| `--accent` | `#F54E00` | burnt orange: primary CTA, active state, packets, one highlight per UI card |
| `--accent-hover` | `#FF6413` | primary CTA hover |
| `--accent-ink` | `#141414` | text on accent (white on `#F54E00` is about 3.8:1 and fails AA; `#141414` is about 4.9:1) |
| `--accent-soft` | `rgb(245 78 0 / 0.14)` | active tab fill, chip background |
| `--glow` | `rgb(245 78 0 / 0.32)` | bloom behind lit frames |
| `--ui-ok` | `#4CC38A` | success dot, check, diff plus (inside UI windows only) |
| `--ui-err` | `#E5484D` | error dot, retry, diff minus (inside UI windows only) |

Rules:
- One accent. Green and red appear only inside UI windows (terminal, graph, proof cards), never in marketing type, buttons or backgrounds.
- No gradient text. No purple, blue or teal light.
- Accent covers at most about 3% of any viewport: CTA, active tab, packets, one chip.
- Focus ring on every interactive element: `2px solid var(--accent)`, `outline-offset: 2px`.
- Contrast is checked by `node scripts/check-contrast.mjs` (every text token on every dark surface, ink on sand, `--accent-ink` on accent). `--accent` as text (active labels) only on `--bg` to `--surface-2` (4.67:1 minimum); on `--surface-3` it is 4.18:1, so an active label there uses `--text`.

### 1.2 Typography

Fonts via `next/font/google` in `src/app/fonts.ts`: `Geist` (variable, `--font-sans`), `Geist_Mono` (`--font-mono`), `Instrument_Serif` italic 400 (`--font-serif`). DM Sans and Inter are removed. Only Geist is preloaded; mono and serif use `display: swap` with `adjustFontFallback` so swaps do not shift layout.

| Role | Font | Size (mobile to desktop) | Line height | Tracking | Weight |
|---|---|---|---|---|---|
| Display (home h1) | Geist | `clamp(2.5rem, 1.6rem + 4.2vw, 4.75rem)` | 1.02 | -0.045em | 600 |
| H1 (inner pages) | Geist | `clamp(2.25rem, 1.6rem + 3vw, 3.75rem)` | 1.04 | -0.04em | 600 |
| H2 | Geist | `clamp(1.75rem, 1.3rem + 2vw, 2.75rem)` | 1.08 | -0.03em | 600 |
| H3 | Geist | 1.25rem to 1.375rem | 1.25 | -0.015em | 550 |
| Lead | Geist | 1.125rem to 1.25rem | 1.5 | -0.01em | 400 |
| Body | Geist | 1rem to 1.0625rem | 1.6 | 0 | 400 |
| Small | Geist | 0.875rem | 1.5 | 0 | 400 |
| Mono label / eyebrow | Geist Mono | 0.75rem | 1.4 | 0.06em, uppercase | 500 |
| Mono data (prices, metrics, logs) | Geist Mono | 0.8125rem to 0.875rem | 1.5 | 0 | 400, `tabular-nums` |
| Emphasis word | Instrument Serif italic | 1.08x the heading size | inherit | -0.01em | 400 |

Rules:
- **Two-tone headings** on every h1 and h2: lead clause in `--text`, continuation in `--text-2` (`SectionHeading` from `CM/components/site/home/section.tsx`). The message files already split `title` / `titleEmphasis`; that split drives it.
- **One Instrument Serif word per page**, not per heading. Home: « démos ». Each other page uses its serif word once, in its h1. Never in buttons, nav, labels or body.
- Mono is for data and labels only: eyebrows, prices, durations, timestamps, file names, code. Never paragraphs.
- Measure: 62ch for body, 22ch for display.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.

### 1.3 Spacing

4px base. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- Section padding block: `--section-y: clamp(6rem, 4rem + 6vw, 10rem)` (96px mobile, 160px desktop).
- Heading to content: 48px mobile, 64px desktop.
- Card padding: 20px mobile, 28px desktop.
- Window chrome bar: 36px.

### 1.4 Radii

| Token | Value | Use |
|---|---|---|
| `--r-xs` | 4px | chips inside UI windows, kbd, status pills |
| `--r-sm` | 6px | buttons, inputs, tags |
| `--r-md` | 10px | cards, graph nodes |
| `--r-lg` | 14px | windows (terminal, browser frame) |
| `--r-xl` | 20px | lit frame, final CTA card |
| `--r-full` | 999px | nav pill, HUMAN/MACHINE toggle, tabs |

No other radii.

### 1.5 Grid, rails and crosses

- Container `--container: 1232px` (CiteMe value), side padding 16px mobile, 24px tablet, 32px desktop. One container for the whole site.
- 12-column grid, 24px gutter desktop, 16px mobile; 4 columns under 640px.
- **Rails:** 1px vertical lines in `--line` at the container edges, full page height (`.rails` in `CM/app/globals.css` around L525-575). Hidden under 768px.
- **Crosses:** a 9px `+` in `--text-3` where a section's top rule meets a rail (`Hr` and `.cross` from CiteMe). Every section starts with a full-width 1px rule.
- **Eyebrows:** `01 · OFFRES` in mono label style, sitting on the rule, numbered per page. They replace Mainline's dashed rules.
- Breakpoints: 390 (design floor), 640, 768, 1024, 1280, 1440 (design canvas).

### 1.6 Elevation and light

Depth is light, not shadow. Four levels:

| Level | Recipe | Use |
|---|---|---|
| 0 flat | bg only | sections |
| 1 card | `--surface-1`, 1px `--line`, `inset 0 1px 0 var(--highlight)` | cards, FAQ, price rows |
| 2 window | `--surface-2`, 1px `--line-strong`, inset top highlight, `0 24px 48px -24px rgb(0 0 0 / 0.6)` | terminal, browser frame, graph panel |
| 3 lit | level 2 inside a lit frame | hero, final CTA, case covers |

**Lit frame** (Raycast + Cursor): a `--r-xl` stage holding the treated backdrop, 1px `--line-strong` border, outer bloom `box-shadow: 0 0 0 1px var(--line), 0 40px 160px -40px var(--glow)`, and a "plinth" under the windows: `radial-gradient(50% 30% at 50% 100%, rgb(255 255 255 / 0.08), transparent)`. The bloom never animates `box-shadow`; if it breathes, a pseudo-element's opacity does.

### 1.7 Grain

- Page grain: a 128x128 noise PNG generated once from SVG `feTurbulence` (`public/textures/grain.png`, under 3 KB), as a repeating `background-image` on `body` with about 4% opacity baked in. Not a fixed full-screen overlay, which would add a composited layer over everything.
- Backdrop grain: the same tile at about 10% over the backdrop inside the lit frame, via a pseudo-element with `mix-blend-mode: overlay`, limited to the frame.
- Sand band: the tile at about 5% in `multiply`.

### 1.8 Hatching

From MS:codeveil: `repeating-linear-gradient(-45deg, var(--line) 0 1px, transparent 1px 7px)` on 12px strips. Used only for the machine view header and the "illustration" label strip on lit frames. Never as section backgrounds.

---

## 2. Motion system

### 2.1 Principles

1. Motion explains the system: data moving, a step completing, a trace streaming. No decorative loops, no parallax, no cursor followers, no scroll hijack.
2. CSS first, then WAAPI. The `motion` library is not added unless a component below proves CSS/WAAPI cannot do it, and adding it needs Maxime's OK (new dependency). No GSAP, no Lenis, no three.js, no canvas. Nothing in this direction justifies WebGL.
3. Only `transform`, `opacity`, `clip-path`, and `stroke-dashoffset` on small SVGs are animated. Never `box-shadow`, `filter`, `width`/`height`, `top`/`left`, `backdrop-filter`.
4. Everything pauses off-screen (IntersectionObserver) and when `document.hidden`.
5. `prefers-reduced-motion: reduce`: no movement. Every animated component renders its final state (graph lit, trace complete, chip shown). Tab swaps are instant.
6. No JS: every component's server HTML is its final, complete state. JS only replays it.
7. The LCP element (the h1) is in the initial HTML at `opacity: 1` with no transform. It is never in a reveal or an entrance ladder.

### 2.2 Tokens

| Token | Value | Use |
|---|---|---|
| `--d-instant` | 80ms | press feedback |
| `--d-fast` | 140ms | hover colour, focus |
| `--d-ui` | 220ms | toggles, tab indicator, accordion, chips |
| `--d-swap` | 320ms | hero scenario crossfade, machine view wipe |
| `--d-reveal` | 700ms | scroll reveal |
| `--d-packet` | 1400ms | one packet crossing one edge |
| `--ease-out` | `cubic-bezier(.2,.7,.2,1)` | reveals, entrances (CiteMe value) |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` | packets, swaps |
| `--ease-step` | `steps(1, end)` | caret blink |

### 2.3 Techniques

| Need | Technique | Notes |
|---|---|---|
| Scroll reveal (14px rise and fade) | CSS scroll-driven animation: `animation-timeline: view()`, `animation-range: entry 0% entry 40%`, inside `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)` | Zero JS. Browsers without support show content statically. Timing and distance from `CM/components/site/reveal-observer.tsx` and the `.reveal` rules (around L577-586 of `CM/app/globals.css`); only the trigger mechanism changes. Above-the-fold elements never get `.reveal`. |
| Hero entrance ladder | CSS `@keyframes` with a `--d` delay from 0 to 0.9s (eyebrow, sub, CTAs, fold strip, frame) | From `EU/src/components/features/hero.module.css`. The h1 is excluded. |
| Packets on graph edges | CSS `@keyframes` on `stroke-dashoffset` of an overlay path with `pathLength="100"` and `stroke-dasharray="3 97"`, plus a wider low-opacity dash as the glow | Scales with the SVG `viewBox`, avoiding `offset-path` coordinate mismatch when the graph resizes. Node and edge states are `data-state` attributes set by the player. |
| Terminal streaming | the player sets `data-shown` per line on its clock; the current line reveals with `clip-path: inset(0 X 0 0)` in `steps(n)` | Lines exist in HTML from the start; the terminal body has a fixed height, so no CLS. |
| Result chip | WAAPI scale 0.96 to 1 plus opacity, 220ms | |
| Hero tab swap | `document.startViewTransition` when available, instant swap otherwise | `view-transition-name: hero-stage` on the frame only. |
| Count-ups | none | numbers are shown as they are |
| Hover | CSS transitions at `--d-fast` | Spotlight cards read a CSS variable set by one shared `pointermove` handler. |
| Machine view toggle | `clip-path` circle wipe from the toggle, `--d-swap` | |

### 2.4 Client islands (complete list)

Anything not listed ships as a Server Component with zero JS.

| Island | File | First-party JS budget (gz) |
|---|---|---|
| Live System player (clock, tabs, pause) | `src/components/live-system/live-system-player.tsx` | 10 KB |
| HUMAN/MACHINE toggle and machine view | `src/components/machine-view/view-toggle.tsx` | 5 KB |
| Process scroll-spy (desktop only) | `src/components/sections/process-spy.tsx` | 2 KB |
| Spotlight pointer handler (shared) | `src/components/spotlight-pointer.tsx` | 1 KB |
| Mobile nav, language switcher | existing | as today |
| Contact form, Cal.com embed loaded on click | existing | as today |

This replaces the foundation spec's "at most 2 islands" rule; the JS budgets above are the gate instead.

---

## 3. Component inventory

Every port is done by hand: read the source, rewrite to these tokens, kebab-case file, named export, no comments. 21st.dev installs need `API_KEY_21ST`. If that env var exists, `npx shadcn@latest add "https://21st.dev/r/<author>/<name>?api_key=$API_KEY_21ST"` may fetch source into a scratch directory for reading, never straight into `src/`. Without it, port from the 21st page's visible code and the slug noted here. Licenses: check the author repo before copying more than structure.

### 3.1 Foundation

**`section.tsx`** (`Section`, `SectionHeading`, `Hr`, `Eyebrow`)
- Purpose: every section's frame: top rule with crosses, numbered mono eyebrow, two-tone heading.
- Source: `CM/components/site/home/section.tsx`; `.rails`, `.cross`, `.container-x` in `CM/app/globals.css`; `EU/src/components/ui/section-eyebrow.tsx`.
- Perf: server, CSS only.

**`site-header.tsx`** (restyle)
- Purpose: floating pill nav: logo (`public/brand/klyx-white.png`, SVG if vectorising is clean), Offres menu with the six offers in two groups ("Construire": Sites, Agents IA, Automatisation IA; "Conseiller": Audit IA, Référencement IA, FDE), Réalisations, Tarifs, À propos, language switch, primary CTA « Réserver un appel ».
- Source: Raycast nav (`REF/sotd/raycast-hero.png`); existing `site-nav.tsx` logic.
- Perf: `backdrop-filter: blur(12px)` on the pill only; under 768px the pill is opaque `--surface-1` with no blur.

**`site-footer.tsx`** (restyle)
- Purpose: sitemap columns, sister sites, legal links, SIRET, the HUMAN/MACHINE toggle on mobile, and a large outlined `klyx` wordmark in Geist Mono clipped at the bottom edge (replaces the Mainline gradient wordmark).
- Source: `EU/src/components/ui/halftone-wordmark-footer.tsx` (idea only, done in CSS without halftone).
- Perf: server.

**`button.tsx`** (restyle variants)
- `primary`: `--accent` fill, `--accent-ink` text, weight 500, inset top highlight, arrow icon that shifts 2px on hover. `secondary`: transparent, 1px `--line-strong`, `--text`. `ghost`: text only. Heights 36 and 44px.
- Source: Cursor's "Continue" button (`REF/board/img/cursor-full.jpg`), `.btn-dark` in `CM/app/globals.css`.
- No shimmer, no glow on buttons.

**`tag.tsx`**
- Purpose: inline chips naming the offers inside body copy. Mono 12px, `--surface-2`, `--r-xs`.
- Source: `.tag` in `CM/app/globals.css`.

### 3.2 Live System (hero and offer heroes)

**`lit-frame.tsx`**
- Purpose: the stage: treated backdrop, grain, plinth glow, bloom, and a hatched strip on the top edge carrying the label « Illustration · scénario type » / "Illustration · sample run".
- Source: Raycast lit OS frame (`REF/board/img/raycast-full.jpg`), Cursor product on painting (`REF/board/img/cursor-full.jpg`).
- Perf: backdrop through `next/image`, AVIF, explicit `sizes`; `priority` only on the home hero, lazy elsewhere.

**`agent-graph.tsx`**
- Purpose: 4 to 6 nodes (mono label, 14px lucide icon, status dot) joined by curved edges with packets. Nodes are HTML positioned in percent over one SVG of edges in the same aspect-ratio box, so labels stay crisp and wrap.
- Source: `21st:monolythdev/ai-agent-pipeline` (trigger, processing node, fan-out, "LIVE" header, stats footer; `REF/21st/agent-pipeline.png`), `MS:network-hero` (calm motion grammar).
- Perf: server-rendered final state; animation only through `data-state` from the player. Under 640px a vertical layout (same nodes, edges redrawn top to bottom).

**`terminal-trace.tsx`**
- Purpose: overlapping window streaming the scenario's trace, for example `Thought 2s`, `Read inbox (12 new)`, `Called classify(email_3891)`, `lead · score 0.86`, `Called crm.contacts.update`, `✓ posted to #sales`. Timestamps in `--text-3`, tool names in `--text`, success in `--ui-ok`, one retry line in `--ui-err` per scenario so it reads as real operations, not a happy path.
- Source: Cursor CLI window, `21st:ziegfiroyt/terminal1`, `MS:codeveil` (window chrome); `21st:n1m4mz/agent-trace` (span rows with durations) for the second view on offer pages (`REF/21st/agent-trace.png`).
- Perf: fixed height (11 lines desktop, 7 mobile), overflow hidden from the top, so streaming never moves layout.

**`result-chip.tsx`**
- Purpose: outcome of the run pinned to the frame corner, one accent-bordered chip.
- Source: Linear's agent pane diff chip (`REF/board/img/linear-full.jpg`).

**`scenario-tabs.tsx`**
- Purpose: Clerk-style pill tabs under the frame: Agents IA / Sites / FDE. Active: `--accent-soft` fill, accent dot.
- Source: Clerk (`REF/board/img/clerk-full.jpg`).
- No JS: each tab is a link to its offer page. With JS the player intercepts a plain click, swaps the scenario and sets `aria-selected`; modified clicks still open the page.

**`live-system-player.tsx`** (island)
- Purpose: one clock (a `setTimeout` chain, no rAF loop) walking the scenario: set node states, start a packet, show trace lines, show the chip, hold 2.5s, loop. Pauses out of view, on `document.hidden`, and on hover or focus inside the frame (so people can read). Stops after 3 loops and shows the final state. Never starts under reduced motion.
- Data: `src/lib/scenarios.ts`, typed `Scenario` (`id`, `nodes`, `edges`, `steps`, `trace`, `chip`, `href`). Every visible string lives in messages under `liveSystem.*`.

**Scenarios (honest framing).** Every frame shows the hatched « Illustration » label, and the caption under the frame says what it is: « Exemple de workflow que je construis. Noms et valeurs fictifs. » Sources must be real where the chip claims a result.

| Where | Graph | Trace highlights | Chip | Status |
|---|---|---|---|---|
| Home tab Agents IA (default), `/services/agents-ia` | Inbox → Classifier → CRM → Slack | email in, classified as lead, contact updated, message posted | `✓ Lead routé · 1,8 s` | illustration. `TODO(maxime)`: swap for an anonymised real run if one exists |
| Home tab Sites, `/services/creation-site-web` | Commit → Build → Lighthouse → Deploy → llms.txt | build, Lighthouse run, sitemap and llms.txt generated | `Lighthouse 9X · klyx.fr` | **real**: klyx.fr's own score, written by the R7 run into `src/lib/proof/klyx-lighthouse.json` |
| Home tab FDE, `/forward-deployed-engineer` | Ticket → Repo → Engineer + agent → PR → Review → Deploy | ticket read, branch, tests, PR opened, review, merged | `PR merged · tests ✓` | illustration. `TODO(maxime)`: base on real CiteMe/Klyx work if he agrees |
| `/services/audit-ia` | Entretiens → Cartographie → Scoring → Roadmap | 3 processes mapped, hours per week estimated, ranked | `Roadmap · 3 workflows priorisés` | illustration |
| `/services/automatisation-ia` | Email + PJ → Extraction → ERP → Validation humaine → Envoi | invoice parsed, fields checked, human approval step | `✓ Facture saisie et validée` | illustration |
| `/services/geo-referencement-ia` | Prompts → ChatGPT / Perplexity / Gemini → Citation check → Rapport | prompts run, cited or not, sources found | `Rapport · 20 prompts suivis` | illustration. A before/after citation number only with real Hop Hop Immo data and consent, `TODO(maxime)` |

Never in a scenario: client logos, real client names, numbers presented as client results.

### 3.3 Proof and content

**`proof-card.tsx`** (rebuild)
- Purpose: a small real artefact. Variants: `lighthouse` (score ring row for a named URL with date), `run-log` (mono rows with timestamps), `pr-list` (repo, title, date, link), `site-shot` (browser frame and live URL). Data from `src/lib/proof/*.ts`; a variant with no verified data does not render (no placeholder box).
- Source: `CM/components/site/home/visuals/*`, `21st:n1m4mz/agent-trace` (span bars).

**`browser-frame.tsx`**
- Purpose: real client screenshots inside window chrome (three dots, mono URL bar with the live domain).
- Source: `MS:codeveil`, Cursor's browser window.
- Perf: `next/image`, explicit width/height, lazy.

**`offer-card.tsx`** (rebuild of `offer-cards.tsx`)
- Purpose: spec-sheet card: mono eyebrow (`01 / SITES`), name, outcome, a static 3-node mini graph glyph in SVG, price row in mono (`à partir de 900 € HT`), duration, arrow link. Spotlight on hover.
- Source: `21st:kevingirelli/spotlight` (pointer glow via CSS vars), Linear FIG captions. The single featured card on a page (Sprint IA in agents contexts) gets a border beam after `21st:hyperiux/border-beam`, done as a rotating conic-gradient border at 8s, stopped under reduced motion. One per page at most.

**`tier-cards.tsx`** (restyle) and **`price-ledger.tsx`** (new)
- Purpose: offers as spec sheets on offer pages; one ledger table on `/tarifs` with mono numbers and row hover.
- Source: `21st:shadcnstore/pricing-section-1` (structure), Anthropic's spec-sheet rows (`REF/sotd/anthropic-full.png`), Euthyne's honest pricing note (`EU` pricing section).

**`process-timeline.tsx`** and **`process-spy.tsx`**
- Purpose: « Comment ça se passe », 4 numbered steps. Desktop home: sticky numbered nav on the left, one card per step on the right, each with a small artefact (call agenda, written scope excerpt, weekly update, handover checklist; sample documents marked as samples). Offer pages: horizontal 4-step line filling with `animation-timeline: view()`. Mobile: stacked cards, visual capped at 160px.
- Source: `CM/components/site/home/platform.tsx` and `platform-nav.tsx`; `21st:shadcnspace/timeline-01` (filling line).

**`founder-block.tsx`**
- Purpose: Maxime's treated photo in a level-2 frame with a mono caption « Maxime Mansiet · Bordeaux », two-tone heading, body, "built by the same hands" row (CiteMe, Euthyne as small browser chips with live links), GitHub and LinkedIn links.
- Source: layout from Euthyne's stat strip; no external port.

**`testimonial-wall.tsx`**
- Purpose: the 3 verbatim quotes as level-1 cards with mono attribution (`DAVID A. · PKBA`). Static grid, no marquee. Renders only when `site.flags.testimonialsConsented` is true (`TODO(maxime)` consent).

**`faq-tabs.tsx`**
- Purpose: native `<details>` accordion, tabbed by audience only where a page has more than 6 items. Answers always in the DOM; the same array feeds FAQPage JSON-LD.
- Source: `EU/src/components/ui/faq-tabs.tsx`, `EU/src/components/features/faq-data.ts`.

**`final-cta.tsx`**
- Purpose: closing lit frame: two-tone heading, CTA pair, backdrop at low opacity, and on desktop a static 6° tilted browser frame of a real client site on the right.
- Source: `CM/components/site/final-cta.tsx`, `EU/src/components/ui/bordered-cta.tsx`, bloom idea from `21st:nexus-ui/nebula-cta-glow` in our accent.

**`fold-strip.tsx`**
- Purpose: 3 verifiable claims at the bottom of the hero with 14px icons: « Code dans votre repo dès le jour 1 », « Prix publics, en € HT », « Bordeaux · SIRET 941 572 364 ». Any claim without a source stays `TODO(maxime)`.
- Source: `EU/src/components/features/hero.tsx` stat strip.

**`chamfer-break.tsx`**
- Purpose: the cut into and out of the sand band, a `clip-path` polygon notch.
- Source: Clerk's light-to-dark cut (`REF/board/img/clerk-full.jpg`). CSS only.

**`case-card.tsx`** (rebuild of `case-grid.tsx`)
- Purpose: on sand: browser frame with the real screenshot, mono meta row (`HOP HOP IMMO · 2026 · NEXT.JS`), title, what was built, arrow. Hover lifts the frame 4px.

### 3.4 HUMAN / MACHINE

**`view-toggle.tsx`** (island)
- Purpose: basement-style pill `HUMAN | MACHINE` (`REF/board/img/basement-hero-live.jpg`). Desktop: fixed bottom centre, 32px high, `--surface-1` with blur. Mobile: inside the open nav sheet and in the footer; nothing fixed over content on small screens.
- Behaviour: MACHINE fetches the page's markdown alternate and shows it in a full-viewport layer over `main` (header stays), with a clip-path wipe. The layer opens with a hatched bar: `GET /md/fr/services/agents-ia · text/markdown · 4,2 KB · ≈1 100 tokens` (bytes measured; tokens estimated as characters / 4 and marked ≈). Then the markdown in Geist Mono 14px with line numbers in `--text-3`, `#` headings in `--accent`, links underlined. "Copier" button and "Ouvrir le .md" link. `Esc` or HUMAN returns and restores scroll. `role="switch"`, `aria-checked`, keyboard operable. The choice is kept in the URL hash `#machine` so it can be shared.
- No JS: the toggle is a plain link to the markdown URL.
- Source: concept from basement; generation pattern from `CM/app/[locale]/md` and `CM/lib/site/llms/*`.

**Markdown alternates.** `src/app/md/[locale]/[[...path]]/route.ts` returns `text/markdown; charset=utf-8`, built by `src/lib/machine/page-markdown.ts` from the same messages, offers and MDX as the pages (never a second copy). Header `X-Robots-Tag: noindex`. Each page head carries `<link rel="alternate" type="text/markdown" href="/md/...">`. `llms.txt` links to them. The `src/proxy.ts` matcher excludes `md`.

---

## 4. Pages, section by section

D = desktop 1440, M = mobile 390. Every page has one h1 and a markdown alternate, and ends with `final-cta` (except contact and legal) then the footer.

### 4.1 Home `/` and `/en`

1. **Hero, Live System.**
   - D: text block on cols 1-8: eyebrow `AGENCE IA · BORDEAUX`; h1 « Des agents IA qui tournent en production, / pas des *démos*. » (two-tone, serif on « démos »); sub with three inline tags (Sites, Agents IA, FDE); CTA pair. Cols 9-12 stay empty. Below, across cols 1-12, starting around 62% of viewport height: the lit frame (16:8) with the backdrop, the agent graph window on the left 60%, the terminal overlapping its lower right (about 45% width, offset 32px down), the result chip on the frame's top right, scenario tabs centred under the frame, the caption under the tabs. The frame's top third shows at the fold and pulls the scroll. Fold strip sits between CTAs and frame.
   - M: eyebrow, h1 (3-4 lines), sub, stacked full-width CTAs, fold strip as 3 short lines; then the frame with the vertical graph and the terminal overlapping by 24px (7 lines); tabs in a horizontally scrolling, scroll-snapping pill row. h1 and both CTAs fit in 390x844 without scrolling.
   - Components: `section`, `lit-frame`, `agent-graph`, `terminal-trace`, `result-chip`, `scenario-tabs`, `live-system-player`, `fold-strip`, `button`, `tag`.
2. **Preuves.** Eyebrow `01 · PREUVES`. New two-tone heading key, for example « Ce que j'ai livré, / vérifiable en un clic. » (FR/EN, `TODO(maxime)` review). D: 3 proof cards in a row: Lighthouse of klyx.fr (real), CiteMe PR list (`TODO(maxime)` numbers), site-shot of a live client site. M: horizontal scroll-snap row, cards 300px wide, at most 220px tall. Replaces the `home.proof` TODO card; only verified variants render, and the section hides if fewer than 2 exist.
3. **Offres.** Eyebrow `02 · OFFRES`, heading from `home.offers`. D: 3 `offer-card`s, then a slim row « Aussi : Audit IA · Automatisation IA · Référencement IA » as mono links. M: stacked cards, the slim row as a 3-line list.
4. **Réalisations (sand band).** Chamfer into `--sand-50`. Eyebrow `03 · RÉALISATIONS`, heading in `--ink` / `--ink-2`. D: 3 case cards (2 on top split 7/5, 1 wide under). M: stacked, screenshots 16:10. "Toutes les réalisations" link. Chamfer back to dark.
5. **Méthode.** Eyebrow `04 · MÉTHODE`. `process-timeline` with `process-spy` on D, stacked on M.
6. **Founder.** Eyebrow `05 · QUI CODE`. D: photo cols 1-5, text cols 7-12, products row. M: photo 4:5 capped at 360px tall, then text.
7. **Témoignages.** Eyebrow `06 · CLIENTS`. 3 cards, D 3 columns, M stacked. Hidden until consent.
8. **FAQ.** Eyebrow `07 · QUESTIONS`. D: heading and "Réserver un appel" sticky on cols 1-4, accordion on cols 6-12. M: stacked.
9. **Final CTA.**

### 4.2 Offer and service pages (one template, 6 pages)

`/services/creation-site-web` (EN `/services/websites`), `/services/agents-ia` (`/services/ai-agents`), `/forward-deployed-engineer`, and new `/services/audit-ia` (`/services/ai-audit`), `/services/automatisation-ia` (`/services/ai-automation`), `/services/geo-referencement-ia` (`/services/ai-search-visibility`).

One template, `src/components/templates/offer-page.tsx`, fed by a typed config per page:

1. **Hero.** D: split 6/6. Left: mono breadcrumb (`Offres / IA et agents`), eyebrow with the price anchor (`À PARTIR DE 1 500 € HT`), two-tone h1 with the page's serif word, sub, CTA pair. Right: a compact lit frame (4:3) with the page's scenario, no tabs. M: text first, frame after, graph vertical.
2. **Le problème.** Large two-tone statement at H2 size, max 28ch, plus a mono aside of 3 symptoms. No cards.
3. **Ce que vous recevez.** `tier-cards` as spec sheets (Agents: Audit, Sprint, Retainer with the border beam on Sprint; Sites: Landing, Site IA, Sur mesure; FDE: one wide card with terms as a mono table; new pages: the tiers from `offers.ts`). M: stacked; features after the 4th collapse into a native `<details>`.
4. **Comment ça se passe.** `process-timeline`, horizontal on D, vertical on M.
5. **Page-specific block.**
   - Agents: « Audit crédité » statement, then the agent-trace span view of the same scenario (illustration label).
   - Sites: Lighthouse/CWV proof card of klyx.fr and live client screenshots.
   - FDE: the French definition of « Forward Deployed Engineer » as a dictionary-style entry (mono term line, definition), audience, limits (2 clients max) as a mono checklist.
   - Audit IA: what the audit delivers, shown as a document window with a roadmap table excerpt (sample, labelled); the Bpifrance Diagnostic Data IA explainer box with dated sources (`TODO(maxime)` verify against the official page).
   - Automatisation IA: 3 SME examples (factures, devis, relances) as mini graphs, each with a visible « validation humaine » node.
   - Référencement IA: how citation is measured (prompt list, engines, citation check) as a CiteMe-style visibility card; real data only with Hop Hop Immo consent (`TODO(maxime)`); disclosure that Maxime co-founded CiteMe.
6. **Preuves.** 1-2 case cards on a sand card (inner pages use a sand card on dark, not a full chamfer band).
7. **Prix.** One ledger excerpt and a link to `/tarifs`.
8. **FAQ.** 5-8 items.
9. **Final CTA.**

### 4.3 Tarifs `/tarifs` (`/en/pricing`)

1. Hero: two-tone h1, sub, VAT note in mono. No frame; the ledger is the hero object and starts above the fold on D.
2. **Price ledger:** one table grouped by line (Sites, IA, FDE, new offers), columns Offre · Pour qui · Durée · Prix (mono, right aligned), row links to the offer page. D: full width in a level-1 panel. M: each row becomes a 2-line block (name and price, then audience and duration), no horizontal scroll.
3. Garanties: 2-3 mono check rows.
4. Contexte marché: two-tone statement and a comparison card of market ranges, each with its dated source link from the strategy doc.
5. FAQ, final CTA.

### 4.4 Réalisations `/realisations` (`/en/work`)

1. Hero: h1, sub, mono count computed from content (`5 PROJETS · 2025-2026`).
2. Sand band: `case-card` grid (D 2 columns alternating 7/5 and 5/7, M one column). No filters.
3. Final CTA.

### 4.5 Réalisation detail `/realisations/[slug]`

1. Cover: lit frame on sand with the desktop screenshot in a browser frame and the 390 shot overlapping bottom right on D (M: desktop shot only).
2. Spec sheet row: Client · Année · Stack · URL · Rôle in mono, 5 columns D, 2 columns M.
3. MDX prose in a 64ch column, mono list bullets; `TODO(maxime)` markers render as an accent-outlined note so they are impossible to miss.
4. Next project card, final CTA.

### 4.6 À propos `/a-propos` (`/en/about`)

1. Hero: D split, two-tone h1 left, treated portrait right in a level-2 frame. M: h1 then portrait.
2. Story: prose.
3. Facts: mono definition list (Basé à, SIRET, Langues, Stack, Disponibilité), `TODO(maxime)` where unverified.
4. "Construit par les mêmes mains": CiteMe and Euthyne as browser chips with live links.
5. Autres activités: studio.klyx.fr and estate.klyx.fr, one sentence each.
6. Links, final CTA.

### 4.7 Agence IA Bordeaux `/agence-ia-bordeaux` (`/en/ai-agency-bordeaux`)

For SME owners: plain language, warmer, the backdrop shown large.
1. Hero: D: full-width lit frame band (21:9) with the Bordeaux backdrop, h1, sub and CTA pair on a dark scrim over the left third (contrast checked at 4.5:1). Phone number as an equal CTA if `TODO(maxime)` provides one. M: text first, image 4:3 under it, never behind text.
2. Le problème: statement.
3. Exemples: the three automation mini graphs (shared with automatisation-ia) with plain captions.
4. Méthode: process timeline.
5. Local: address card in mono (ville, zone servie, déplacements) and a static SVG outline of the Gironde with a Bordeaux dot. No embedded map.
6. Confiance, FAQ, final CTA.

### 4.8 Contact `/contact`

1. Hero: two-tone h1, sub.
2. D: form on cols 1-7 in a level-1 panel (inputs `--surface-2`, mono labels, budget band as segmented pills, primary submit); booking card on cols 8-12 with Maxime's photo, "20 min" and the next step, loading the Cal.com embed only on click; direct email in mono under it. M: booking card first, then the form.
3. No final CTA.

### 4.9 Blog `/blog`, `/blog/[slug]`

- Index: h1, sub, posts as log rows (`2026-11-04 · 8 MIN` in mono, title, one-line summary, arrow), row hover `--surface-3`. Empty state: a terminal window `$ ls content/blog` → « 0 article publié, le premier arrive bientôt » with the RSS link.
- Post: question-style title (no two-tone), mono meta row (published, updated, reading time, byline link to `/a-propos`), 66ch prose at 18px / 1.7, h2s with anchor links, mono sources list at the end, final CTA.

### 4.10 Legal `/mentions-legales`, `/confidentialite`

h1, mono « Mis à jour le », 66ch prose, h2 per section with stable anchors (`#prospection`). No frames, no reveals.

### 4.11 404

Centred terminal window: `GET /chemin → 404` and two links (home, réalisations).

### 4.12 Open Graph images

`src/app/[locale]/opengraph-image.tsx` plus one per offer page through a shared renderer: 1200x630, `#141414` with baked grain, the static graph glyph (4 nodes, one accent packet) on the right, the page title two-tone on the left in Geist 600, `klyx.fr` in mono bottom left. Fonts loaded from `public/fonts/` for `ImageResponse`.

---

## 5. Asset plan

| Asset | Source | Treatment | Budget |
|---|---|---|---|
| Backdrop (hero, final CTA, Bordeaux page) | **A, recommended:** Claude-Joseph Vernet, *Première vue du port de Bordeaux, prise du côté des Salinières* (1759), public domain on Wikimedia Commons; confirm the file's PD tag and record it in `docs/assets.md`. It is Cursor's "software on a painting" move, and it is Bordeaux. **B:** Maxime's own photo of the Garonne or Pont de pierre at dusk. **C:** a licensed Unsplash photo (URL and author recorded). | crops 16:8, 4:3 and 21:9; warm duotone (shadows `#141414`, highlights `#C9B9A0`), lower contrast, 2px blur so UI reads over it, grain | AVIF 1600w ≤ 70 KB, 800w ≤ 35 KB |
| Founder portrait | Maxime, `TODO(maxime)`: recent, warm light, plain background, 3:4, ≥ 1600px tall | warm duotone matching the backdrop, grain | AVIF ≤ 60 KB |
| Client screenshots | re-shot from the live sites at 1440x900 and 390x844 with Playwright (`scripts/capture-cases.ts`), saved as `public/realisations/<slug>-1440.png` and `-390.png` | none; real pixels framed by `browser-frame` | served AVIF/WebP via next/image |
| klyx.fr Lighthouse proof | R7 Lighthouse run, reduced to `src/lib/proof/klyx-lighthouse.json` (scores, URL, date) | proof card and the Sites chip | n/a |
| CiteMe PR list | `gh` query, numbers confirmed by Maxime | proof card | n/a |
| Grain tile | generated once from SVG feTurbulence | PNG 128x128 | ≤ 3 KB |
| Logo | `public/brand/klyx-white.png`, SVG if vectorising is clean | | ≤ 4 KB |
| Node icons | lucide-react (already installed), 14px, stroke 1.5 | | tree-shaken |
| OG images | `ImageResponse` | | |

No stock photos of people, no AI-generated imagery, no hero video.

---

## 6. Performance and quality gates

- Lighthouse mobile ≥ 90 hard gate (95 target, the foundation spec's number) on `/`, `/services/agents-ia`, `/tarifs`. Accessibility ≥ 95, SEO 100.
- CLS ≤ 0.02 on every page, measured in e2e with a `PerformanceObserver`.
- LCP is the home h1. The backdrop must not win LCP on mobile; if it does, it gets `fetchpriority="high"` and the 800w file.
- First-party island JS on home ≤ 18 KB gz in total. No new runtime dependency without Maxime's approval.
- 60fps scroll on a mid laptop: no animated `filter`/`box-shadow`/`backdrop-filter`, animations paused off-screen, verified with a Chrome performance trace (no long task over 50ms while scrolling, no layout during animation).
- Reduced motion: with `reducedMotion: 'reduce'`, `document.getAnimations()` is empty after load and final states are visible.
- No JS: with `javaScriptEnabled: false`, the h1, the full hero trace, the chip, prices, FAQ answers and the toggle link are all visible.
- Contrast: all text ≥ 4.5:1, including over the backdrop.

---

## 7. Anti-generic rules (what must NOT appear)

1. No purple, blue or teal gradients, aurora blobs, mesh gradients, gradient text, or glass cards (glass only on the nav pill and the desktop toggle).
2. No AI imagery: brains, glowing heads, robot hands, orbs, neural meshes, chrome blobs, cosmic particles.
3. No WebGL, canvas, shader, beams, dot-grid or particle backgrounds.
4. No fake proof: no client logo wall, no « +150 projets », no "trusted by", no stars without real reviews, no illustration numbers presented as results, no fictional testimonials.
5. No generic bento of icon + title + two lines repeated six times. Every card carries a real artefact, a real number, or a working mini UI.
6. No sparkle icons, no "AI-powered" badges, no « révolutionner / booster / libérer » copy, no emoji.
7. No shimmer, glowing or magnetic buttons, custom cursors or cursor trails.
8. No scroll-jacking, smooth-scroll libraries, parallax, pinned horizontal scroll, or preloader.
9. No text scramble or typewriter on headings. Typing lives only inside the terminal.
10. No infinite marquee.
11. No centred-everything layouts: headings align left on the grid. Centred text only in the final CTA and the 404.
12. One Instrument Serif word per page. No serif in body.
13. No "three equal cards with icons" row as the second section of any page.
14. No placeholder boxes in production. A proof slot without verified data does not render.
15. No green or red outside UI windows. No second accent.
16. No heavily rounded cards with big drop shadows. Depth comes from light (1.6).

Self-check per section: if the section could sit on another AI agency's site with the logo swapped, it fails. Each section must hold something only Klyx has: a real artefact, a real price, a real person, or a working system view.

---

## 8. Outreach landing pages (`/pour/*`)

Carried over unchanged from the previous direction. Visually these pages reuse the offer page template (4.2) with the header reduced to logo and CTA.

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

## 9. Proof production order

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
