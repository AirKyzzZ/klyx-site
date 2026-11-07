# Visual identity for the FDE pivot (proposal, 2026-11-07)

Proposal only, nothing implemented. Builds on `docs/pivot/positioning.md` and the current « Live System » system in `docs/DESIGN_DIRECTION.md`. Mockups are static HTML of the home above the fold, screenshotted at 1440x900 and 390x844. The recommended ones are in `docs/pivot/identity/`.

## What already fits and should stay

- **The idea « show the agent working instead of claiming it ».** That is exactly the FDE proof in the brief: code in the client's repo, shipped PRs, a log of every agent action. Keep it as the spine.
- **Warm black, one burnt orange accent, grain, hatching.** Reads as an engineering tool, not a web agency. Nothing in the pivot asks for a softer look.
- **Geist, Geist Mono, one Instrument Serif word.** Already loaded, already tuned, mono is the right voice for logs and prices.
- **The honest framing.** Hatched « Illustration » strip and « noms et valeurs fictifs » caption. More important now: an FDE sells trust.
- **The logo.** The fluid K mark (`public/brand/klyx-white.png`, `klyx-black.png`) works on dark and light. Keep it. A clean SVG trace is the only cheap change worth doing.
- **Contrast tooling.** `scripts/check-contrast.mjs` already gates every token pair.

What no longer fits: the hero graph is a generic Inbox → Classifier → CRM → Slack pipeline. It shows an agent, not an engineer embedded in a team. The default scenario and the framing around it need to say « your team + Klyx ».

## Direction A: Live System, recentred on the engineer

**Idea:** same system, the hero graph now shows the engineer inside the client's team, from ticket to production.

Mockups: `docs/pivot/identity/a-evolve-1440.png`, `docs/pivot/identity/a-evolve-390.png`.

| Token | Dark (site) | Light (sand band) |
|---|---|---|
| bg | `#141414` | `#F3EFE7` |
| surface | `#211F1D` | `#FFFFFF` |
| text | `#EDEAE3` (15.3:1 on bg, 13.7:1 on surface) | `#1A1917` (15.3:1, 17.6:1) |
| text-2 | `#A8A29A` (7.3:1, 6.5:1) | `#5E5850` (6.1:1, 7.0:1) |
| text-3 | `#948E85` (5.7:1, 5.1:1) | n/a |
| accent | `#F54E00` (as text 5.2:1 on bg, 4.7:1 on surface) | `#B83A00` as text (5.0:1, 5.8:1) |
| text on accent | `#141414` on `#F54E00` (5.2:1) | same |

Unchanged tokens. One addition: `#B83A00` for orange text on sand, which today has no safe value.

- **Type:** Geist 600 display, Geist Mono labels, Instrument Serif italic on « production ». No change.
- **Logo:** as is.
- **Hero:** eyebrow « Forward Deployed Engineer · Bordeaux ». Lit frame with lanes « Votre backlog / Votre équipe + Klyx / Votre prod »: Ticket → Repo → Ingénieur + agent (accent node) → PR → Deploy, chip « PR mergée · en prod ». The FDE scenario becomes the default tab, Agents IA second, Sites last.
- **Cost: S.** `src/lib/scenarios.ts` (lanes, FDE scenario first), `src/components/live-system/agent-graph.tsx` and `live-system.css` (lane labels, highlighted node), `src/components/sections/hero.tsx` if the order of fold strip and frame moves. Copy goes through the other agent's `messages/` work. About half a day.
- **Risks:** looks like last week's site with new words, so the pivot is less visible to returning visitors. The FDE scenario is still an illustration until a real anonymised run exists.

## Direction B: Engineering log

**Idea:** the site is a work journal. Harder grid, square corners, no glow; the hero proof is a week of logged actions, human and agent side by side.

Mockups: `docs/pivot/identity/b-log-1440.png`, `docs/pivot/identity/b-log-390.png`.

| Token | Dark (site) | Light (docs, case pages) |
|---|---|---|
| bg | `#0E0E0D` | `#FAFAF8` |
| surface | `#171716` | `#F0EFEB` |
| text | `#E8E6E1` (15.5:1 on bg, 14.4:1 on surface) | `#121211` (17.9:1, 16.3:1) |
| text-2 | `#A09B93` (7.0:1, 6.5:1) | `#55524C` (7.5:1, 6.8:1) |
| text-3 | `#8E8981` (5.6:1, 5.2:1) | `#6B675F` (5.4:1, 4.9:1) |
| accent | `#FF5A1F` (6.2:1, 5.8:1) | `#B83A00` as text (5.5:1, 5.0:1) |
| ok / err (log only) | `#4CC38A` (8.7:1) / `#E5484D` | same |
| text on accent | `#0E0E0D` on `#FF5A1F` (6.2:1) | `#121211` (6.0:1) |

- **Type:** Geist 500 display with tighter tracking (-0.05em), Geist Mono for nav, buttons, labels and the log. No serif. All already loaded.
- **Logo:** same mark, wordmark set in Geist Mono lowercase `klyx /fde`, path-style suffix per section. Text only, no new drawing.
- **Hero:** split screen. Left: headline with a blinking orange caret, two CTAs (« Réserver un appel », « Lire un journal type »), a three-cell spec row (code, prix, suivi). Right: « journal · semaine type », a vertical timeline (the agent graph turned into a rail) with human, klyx and agent rows, one red test line so it reads as real work. A terminal status bar sits above the nav.
- **Cost: M.** `src/app/globals.css` (bg, surfaces, radii down to 2 to 4px, glow removed), `src/components/ui/button.tsx` (mono, square), `src/components/site-header.tsx` and `site-nav.tsx` (bar nav with tabs), `src/components/sections/hero.tsx`, a new `src/components/live-system/work-log.tsx` replacing `lit-frame.tsx` and the graph on home, `src/components/section.tsx` (heavier rules). Offer pages keep the graph. Two to three days with screenshots and contrast run.
- **Risks:** mono everywhere tires on long pages and can feel cold to SME buyers coming through the audit. The journal looks like evidence; it must stay clearly labelled as an illustration, or be fed by a real anonymised week.

## Direction C: Editorial light

**Idea:** a consultancy look. Sand paper, big serif headline, the agent graph drawn as a technical figure with a caption.

Mockups (not copied to the repo): `c-editorial-1440.png`, `c-editorial-390.png` in the scratchpad `identity/` folder.

| Token | Light (site) | Dark (footer, machine view) |
|---|---|---|
| bg | `#F4F0E8` | `#171513` |
| surface | `#FBF9F4` | `#201E1B` |
| text | `#191816` (15.6:1 on bg, 16.9:1 on surface) | `#EFEBE3` (15.3:1, 14.0:1) |
| text-2 | `#57524A` (6.8:1, 7.4:1) | `#ABA59C` (7.5:1, 6.8:1) |
| text-3 | `#6E685F` (4.9:1, 5.2:1) | `#938D84` (5.5:1, 5.1:1) |
| accent | `#B23A00` as text (5.3:1, 5.7:1) | `#FF6A2B` (6.4:1, 5.8:1) |
| text on accent | `#FFFFFF` on `#B23A00` (6.0:1) | `#171513` on `#FF6A2B` (6.4:1) |

- **Type:** Instrument Serif roman for headings (needs the upright 400 added next to the italic in `src/app/fonts.ts`), Geist body, Geist Mono captions.
- **Logo:** black mark on sand.
- **Hero:** two columns. Serif headline, « production. » in orange italic. Right: « Fig. 1 », Gmail and Notion feeding « ingénieur + agent » inside a dashed « Votre équipe » box, out to CRM and Slack.
- **Cost: L.** Theme flip touches `src/app/globals.css` (`color-scheme`, every token), `src/app/fonts.ts`, every component that assumes dark surfaces (`live-system/*`, `backdrop/*`, `proof/*`, `chamfer-break.tsx`, `site-footer.tsx`, `sections/*`), the OG image generator in `src/lib/og`, and all screenshots in `docs/screenshots`. About a week.
- **Risks:** throws away a system shipped a week ago. Light consulting sites are a crowded look; it loses the « tool you can trust in prod » feel that sells an engineer. Static figures prove less than a live trace.

## Recommendation

Ship **A now**, and take **B's work log as a component**, not as a theme. The log is the most direct picture of the FDE promise (repo, PRs, every action logged), so it should replace the generic proof slot on home and live on `/forward-deployed-engineer`, inside the current dark system. Park C: it costs a week and weakens the engineering signal the pivot depends on.

## Decisions for Maxime

1. **A, B or C as the base?** Recommended: A, plus B's work log as a section.
2. **Default hero scenario:** FDE first (ticket to prod), with Agents IA and Sites as the other tabs?
3. **Work log content:** stay an illustration with fictional names, or build it from a real anonymised week (CiteMe or Klyx repos)? A real one is far stronger proof.
4. **Logo:** keep the PNG mark, or pay for a clean SVG trace (small job, sharper at every size)?
5. **Orange on sand:** add `#B83A00` as the text accent for light surfaces, since `#F54E00` fails as text there?
