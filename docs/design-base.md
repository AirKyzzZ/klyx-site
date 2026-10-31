# Design base

The site's look comes from shadcnblocks Mainline, ported into our Next 16 scaffold. Sections Mainline doesn't have come from Tailark free blocks, restyled to Mainline's tokens.

## Source

- Repo: https://github.com/shadcnblocks/mainline-nextjs-template
- Commit: `2329ed3524a6038d834b925187084a0e41fab2d9` (2025-10-15)
- Upstream stack: Next 15.5, Tailwind 4.1, shadcn/ui new-york. Ported to Next 16.4.3, Tailwind 4.3.3, React 19.3.

## License

MIT + Commons Clause. Fine for our own site: the clause only forbids reselling the template itself.

```text
MIT + Commons Clause License Condition v1.0

Copyright (c) 2025 shadcnblocks.com - Rob Austin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, and distribute the Software as part of an application, website, or product, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Commons Clause Restriction

You may use this Software, including for commercial purposes, provided that you do not sell the template itself in its original or substantially unmodified form.
This restriction is intended solely to prevent grifters from reselling this template as-is (or close to) without meaningful customization or added value.
```

## What was ported

Theme: Mainline's light tokens, radius, shadows, `container` utility, display/text font split and DM Sans stylistic sets, all in `src/app/globals.css`. Fonts in `src/app/fonts.ts`: DM Sans (display, `--font-dm-sans`) and Inter (body, `--font-inter`) like Mainline, plus Instrument Serif italic (`font-serif`) and Geist Mono (`font-mono`) for our own layer.

UI primitives (`src/components/ui`): accordion, button, card, carousel, checkbox, collapsible, input, label, navigation-menu, select, switch, textarea.

Helpers: `src/components/background.tsx` (rounded gradient panels), `src/components/dashed-line.tsx`, `src/lib/utils.ts` (`cn`).

Layout (`src/components/layout`): `navbar.tsx`, `footer.tsx`.

Blocks (`src/components/blocks`), every section Mainline renders on home, about, pricing, faq and contact:

| Block | Mainline page |
|---|---|
| `hero.tsx` | home |
| `logos.tsx` | home |
| `features.tsx` | home |
| `resource-allocation.tsx` | home |
| `testimonials.tsx` | home, faq |
| `pricing.tsx` | home, pricing |
| `faq.tsx` | home, faq |
| `about-hero.tsx` | about |
| `about.tsx` | about |
| `investors.tsx` | about |
| `pricing-table.tsx` | pricing |
| `contact.tsx`, `contact-form.tsx` | contact |

All of them render once with Mainline's demo copy on `/design-preview` (removed in Task 5).

## What was left out or changed

- Mainline's images (app screenshots, logos, portraits, about photos, investors, the "mainline" footer SVG, favicon, OG image) are not ported. Image slots render `ImagePlaceholder`, logo rows render text wordmarks, the footer wordmark is SVG text. Task 5 swaps in real Klyx artefacts.
- Dark mode, theme toggle and `next-themes` dropped: the spec is light only. The `dark` variant is bound to a `.dark` class so shadcn's `dark:` utilities never trigger from the OS setting.
- StyleGlide provider, tweakcn live-preview script, login/signup/privacy pages, MDX and the GitHub link dropped.
- Contact form keeps the visual (labels, inputs, select, textarea, checkbox) but not react-hook-form, zod, next-safe-action or the `motion` success animation. Task 6 wires the real form; add `npx shadcn add form` then if needed.
- `motion` is not installed: Mainline only uses it in that success state.
- Lucide dropped brand icons, so the contact socials use `react-icons/fa6`.
- `carousel.tsx` derives `canScrollPrev/Next` from the Embla API on render instead of setting state inside an effect (Next 16's `react-hooks/set-state-in-effect` lint rule).
- Default exports turned into named exports, comments removed.

## Tailark free blocks for gaps

Repo: https://github.com/tailark/blocks (MIT). Three kits, `dusk`, `mist`, `veil`, each with blocks under `call-to-action`, `content`, `faqs`, `features`, `footer`, `hero-section`, `integrations`, `logo-cloud`, `pricing`, `stats`, `team`, `testimonials`, plus `contact` and `comparator` in mist and veil. Likely fillers for us: `stats`, `team`, `comparator`, `call-to-action`, `integrations`.

`components.json` already registers the Radix flavour (we use Radix primitives):

```json
"registries": { "@tailark-oss": "https://oss-tailark.com/r/radix/{name}" }
```

Add a block by `<kit>-<category>-<number>`:

```bash
npx shadcn@latest add @tailark-oss/mist-stats-one
```

The index of item names is at https://oss-tailark.com/r/radix/registry.json. After adding, move the file into `src/components/blocks` (kebab-case, named export), strip comments, and restyle to Mainline tokens (`bg-background`, `text-muted-foreground`, `container`, `DashedLine`, `Background`).

## Screenshots

`docs/screenshots/design-base/`: `design-preview-1440.png` and `design-preview-500.png` (headless Chrome won't lay out below roughly 500px, so the 390 shot was clipped and replaced by 500). `mainline-demo-1440.png` is the upstream demo for side-by-side comparison.
