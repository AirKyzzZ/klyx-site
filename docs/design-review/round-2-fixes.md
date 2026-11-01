# Design review round 2, fixes (2026-11-01)

What changed for each item in `round-2.md` §3, plus the round-1 items it flagged as not fixed, partly fixed or regressed. Open questions for Maxime are in `docs/copy/TODO-maxime.md`, section "Design review round 2".

## Broken

1. **Hop Hop case body.** The MDX now has four short parts: context (how the site searches today, what Hoppy adds), the approved « what we built » line, « Ce que voit le visiteur » (Hoppy button on the home page, the `/assistant` page with map, Hoppy and the criteria panel, voice or text, the ElevenLabs consent window) and the stack seen on the live site (Next.js in the HTML, ElevenLabs as the site discloses, OpenStreetMap map data). A screenshot sequence (`metadata.flow`, rendered under the prose and in the machine view) shows the assistant page, the voice consent window and the phone view, captured from hophopimmo.com on 2026-11-01. No figures, no scope beyond what is visible; the real exchange, the build scope and figures are TODO rows. Case stack is now `Next.js, ElevenLabs`.
2. **Mentions légales.** Unchanged per controller ruling: host phone and VAT status are Maxime's inputs, still launch blockers.
3. **Sites hero caption.** New `liveSystem.scenarios.sites.caption` for the `git push → llms.txt` run (FR, EN). Every other offer and sector hero already had its own caption; only the home tabs use the « Trois exemples » line.

## Generic

4. **CTA card.** Every CTA now holds the sample agenda window (`agenda`, « Exemple » chip, Appel de cadrage · 20 min, lun. 2 / mar. 3 / mer. 4, 11:00 lit) with the booking button inside it; the other action is a ghost button under the copy. The slots come from a shared `AgendaSlots` used by the home méthode too, so both always match.
5. **Bordeaux hero.** The frame now renders at every width with the Gironde outline and Bordeaux pin inside it (right half at ≥1024, under the CTAs below), captioned with the zone and coordinates. The duplicate map is gone from §04; that section is copy plus the address card. The `painting` backdrop variant keeps its old layout.
6. **CiteMe repetition.** Home §06 no longer has the screenshot: team.yml plus the GitHub contribution window. À propos §03 shows CiteMe as a one-line card (name, domain, one sentence). CiteMe screenshots remain in réalisations, GEO and its case.
7. **Sites page proof.** Ran Lighthouse 12.8.2 (mobile, median of 3) against vertiflow.fr (87) and pkba.vertiflow.fr (76, LCP 5.5 s) at about 13:00 UTC. Publishing a 76 on the page that sells sites is Maxime's call, so the duplicate was removed instead: the « Preuves » block now renders only with a measured klyx.fr score, VertiFlow and PKBA stay in §05 réalisations once. Scores are logged in TODO-maxime. Hop Hop Immo is no longer on this page (the case claims the assistant, not the site).
8. **Screenshot crops.** `scripts/capture-cases.ts` hides any text line cut by the bottom edge and skips unlisted cases; all four live sites recaptured (`site-shots.json` dated 2026-11-01), so the Hop Hop half line is gone everywhere. Case cards that use the phone frame show it only at ≥1024; below that they use the desktop shot, so the phone is never cropped mid-page. Phone frames are `compact` (no traffic lights), so URL pills fit.
9. **Home tools.** New connection map: Email, Données, Site/boutique → AI agent node (runs on n8n, Make) → CRM, Équipe, Compta, with dashed wires, logos per group. The full 18-tile grid with names sits in a `<details>` under it; the brand note stays visible.
10. **Service méthode table.** Removed from agents IA, audit, automatisation and GEO (they already have journal, livrable, exemples, mesure). Kept on sites, FDE, Bordeaux and agences with page-specific headings (« Du brief à la mise en ligne, », « Un ingénieur dans votre équipe, semaine après semaine. », « Du premier échange au suivi, »). Machine view follows.
11. **Offres window.** All tier buttons are ghost; `highlighted` is gone from the config. Agents IA drops §08 prix (same three items as §03); the tarifs link and sector links move under the offers window.
12. **Home hero at 1440.** Graph and journal are side by side and vertically centred, the journal fills the right column, and the result chip lives in the journal footer (the floating wire is gone). The AI node uses one neutral glyph; model names stay in screen-reader text.
13. **À propos hero.** The GitHub contribution window replaces `klyx --info` in the hero; `klyx --info` moves to the lead engineer section. No portrait yet (TODO row from round 1).
14. **Tarifs marché.** The one-row `marche.csv` window is folded into one sourced sentence under the price table (Studeria link, checked 31 Oct 2026, compared with the FDE day rate). The section and its index are gone.
15. **Agences marque blanche.** Commitments in Geist 15px, mono only for `01` to `06`.
16. **Cabinets.** No proof section; one line under the workflows with the link to the audit. Machine view follows.
17. **Headings.** Rule: every marketing h2 ends with a period (legal document headings excepted). Fixed: sites problème, offres, réalisations; agents problème, offres, réalisations; FDE offres; à propos confiance (FR and EN). Case h1s carry one serif word via `metadata.serif` (assistant, visibilité, club, parkour).
18. **FDE price.** « 4 semaines minimum, à partir de 5 600 € HT (2 jours × 4 semaines) » in conditions and prix, EN « from ».
19. **Agents IA anchor.** Hero eyebrow « Audit 1 500 € HT · Sprint 4 500 € HT » (`agents.hero.anchor`), also in the machine view.
20. **768 home offers.** Pipelines keep intrinsic width from 640 to 1023px, stretch only on phones and inside the desktop column.

Round-1 leftovers: 3 (legal) per ruling; 6, 7, 9, 11, 13, 21, 22, 25 and the FDE wording are covered above; 19 (periods, serif in case h1s) above.

## Gates

See the R8 round 2 report for the command output. Screenshots refreshed with `SCREENSHOTS=1 npx playwright test e2e/screenshots.spec.ts` for every route in both locales (153 shots; `docs/screenshots/redesign/` is gitignored, `docs/screenshots/pages/` is tracked). Older section shots whose numbering no longer exists are still on disk in the ignored folder, and `docs/screenshots/pages/realisations-kenzi-*.png` is a stale tracked file; neither was deleted, pending Maxime's OK.

Lint, typecheck, 330 unit tests, build and 705 e2e (153 screenshot tests skipped outside `SCREENSHOTS=1`) green.

Lighthouse, local `next start`, mobile preset, median of 3 (status stays `local`):

| Page | Perf | A11y | BP | SEO | LCP |
|---|---|---|---|---|---|
| `/` | 93 | 100 | 100 | 100 | 2.9 s |
| `/services/agents-ia` | 95 | 100 | 100 | 100 | 2.8 s |
| `/tarifs` | 96 | 100 | 100 | 100 | 2.6 s |
| `/cas-usage/immobilier` | 96 | 100 | 100 | 100 | 2.6 s |
