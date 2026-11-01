# Hero backdrop variants (R8b, 2026-11-01)

Maxime found the Gemini painting not right for the hero. Three abstract variants were built next to it, switchable at build time:

```
NEXT_PUBLIC_HERO_BACKDROP=grid|mesh|flow|painting   # default grid
```

The flag is read in `src/lib/hero-backdrop.ts` (an unknown value fails the build with the allowed list). It drives the hero lit frame (home and the six offer heroes, sector heroes), the final CTA card and the Bordeaux hero. NEXT_PUBLIC values are inlined at build, so each variant needs its own `npm run build && next start`; the :3100 dev server shows the default.

| Variant | What it is | JS | Motion (only while the hero player runs, paused off-screen, none with reduced motion or without JS) |
|---|---|---|---|
| `grid` | 40px grid drawn as an SVG pattern, 14 small nodes joined by dotted wires that run only through the frame margins (left and right gutters, top right, bottom left), never under the workflow windows, 3 lit nodes, small low-left bloom | 0 KB | 4 small packets slide along straight gutter wires (`transform`), lit nodes breathe (`opacity`) |
| `mesh` | CSS gradient mesh: burnt-orange bloom low left, warm sand haze top right, fine 24px grid fading down | 0 KB | the bloom layer drifts slowly (`transform`) |
| `flow` | 7 SVG streamlines pinching through the middle of the frame | 0 KB | 3 short orange dashes travel along them (`stroke-dashoffset`), clipped to the right gutter |
| `painting` | the Gemini Port de la Lune painting, unchanged | 0 KB | none |

The brief allowed a canvas for `flow`; it is SVG instead because `DESIGN_DIRECTION.md` section 2.1 rules out canvas, and SVG keeps it at 0 KB.

Outside the hero (CTA card, Bordeaux) the same variant renders as a still frame: no `[data-playing]` ancestor, so nothing animates there. On the Bordeaux page the abstract variants hide below 1024px (the painting's 4:3 block had meaning there, an empty pattern block does not), and the dark text panel only applies to the painting.

Fix round 1: the first `grid` put nodes on the workflow window's title bar and its solid orthogonal wires read as part of the graph. The wires now only run through the margins outside the window boxes, dotted so they read as background, and the low-left bloom is smaller and fainter (`.ls-frame` bloom 0.22 to 0.12 with abstract variants). `mesh` bloom -40 %, `flow` lines at 14 % alpha with dashes only in the right gutter.

## Pick: `grid`

- It is the only one that says "system": nodes, wires and packets are the Live System's own vocabulary, and since they only live in the margins it reads as the system continuing beyond the windows, not as a second graph.
- Cheapest motion: packets are small elements moving with `transform`, so repaints stay tiny; `flow`'s `stroke-dashoffset` repaints long paths every frame.
- Holds up behind text: on the CTA card and the Bordeaux hero it stays quiet (wires at 12 % alpha) and keeps contrast.
- `mesh` is the prettiest still, but it is a generic gradient glow (section 7's anti-generic list), and its bloom is the strongest accent area of the page. `flow` is elegant but the lines are faint at 1px and mostly hidden behind the windows. `painting` stays available.

Lighthouse with `grid` (local `next start`, mobile preset, median of 3, status `local`): `/` 95 perf, LCP 2.8 s, TBT 30 ms, CLS 0; `/services/agents-ia` 95; `/tarifs` 93; `/cas-usage/immobilier` 96. The h1 stays the LCP element; the backdrop has no image to load.

## Screenshots

`docs/screenshots/qa/hero-backdrop-<variant>-<width>-<rest|playing>.png` for 1440 and 390 (rest = reduced motion, final state; playing = 3.2 s into the run), plus `-cta-1440` and `-bordeaux-1440` per variant. PNGs are 8-bit quantised to keep the repo light. The `grid` default was also checked live on :3100 in Chrome.
