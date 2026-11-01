# Design review round 1, fixes (2026-11-01)

What changed for each prioritized fix in `round-1.md`, plus the honesty pass and the controller rulings. Open questions for Maxime are logged in `docs/copy/TODO-maxime.md` (sections "Launch blockers" and "Design review round 1").

## Broken

1. **Méthode windows under 1024px.** The `max-h-40` plus fade mask on the step windows is gone (`process-timeline.tsx`). Every window renders at full height with its bottom border.
2. **Kenzi.** Hidden everywhere until there is a real write-up: `listed: false` in both MDX files, `getCaseStudies` drops unlisted cases, so the index, the home band, the Sites proof, "projet suivant", the sitemap, `llms.txt` and the machine view no longer list it, and `/realisations/kenzi` and `/md/fr/realisations/kenzi` return 404. The MDX files stay. Kenzi is also out of `meta.cases.description` and `sites.proof.body`.
3. **Legal placeholders.** Host filled in with Netlify's legal identity: Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, United States, contact support@netlify.com. Sources: https://www.netlify.com/legal/terms-of-use/ (last updated 14 October 2026) and https://www.netlify.com/privacy/ (section 17). Netlify publishes no phone number on either page, so the LCEN phone requirement stays a launch blocker. The privacy page names Netlify as a US host under the EU-US Data Privacy Framework, which Netlify's DPA states (https://www.netlify.com/pdf/netlify-dpa.pdf, version 20260609, section 14.2, SCCs as fallback). The VAT line is removed from the page and the machine view (status unknown); the launch-blocker row stays. `legalUpdatedAt` is now 2026-11-01.
4. **Trace header at 390.** `SampleWindow` hides the `ILLUSTRATION · SCÉNARIO TYPE` chip below 640px and prints it as a footer row inside the window instead; the file name truncates on one line.
5. **404.** Both 404s share `NotFoundView`: `404` label in `--accent`, one primary "Retour à l'accueil", one ghost link to contact, and a 3-line `access.log` window (`GET /… → 404`, route inconnue, redirection proposée). The global 404 renders French in the static HTML; a tiny client component (`not-found-locale.tsx`, 404 only) swaps to the English copy on `/en/*` after hydration, so there is always one tree and one h1. A discreet link offers the other language.

## Generic

6. **One CTA pattern.** The tilted screenshot variant is deleted from `Cta`; every page now uses the centred Garonne card.
7. **Tools grid.** Tiles without a licensed logo get a 24px mono monogram slot (`Ou`, `Ex`, `MT`…) so every tile is glyph plus mono name. The automation page heading reads "Ce qui tourne sous vos automatisations." (per-page `stack.titleEmphasis`, also in the machine view). The connection-map idea was not built.
8. **Home offers.** One wide window with three rows: mini pipeline, description, mono price and duration. No 3-up.
9. **Service timeline.** The orange-dot timeline is replaced by a numbered step list in one bordered card (mono index, Geist title and body) on the 6 offer pages, the sector pages and Bordeaux. Page-specific artefacts per step were not built.
10. **Le problème.** Symptom lists are Geist 15px `--text-2` (mono kept for the index). Fix 24 cuts the space above the h2.
11. **Offres pricing cards.** One bordered window with three columns split by 1px `--line`, no orange middle card; the "+ N autres éléments" disclosure on mobile stays.
12. **Agents IA hero.** New `support` scenario (« réponse client »: Zendesk ticket, AI looks up Notion, carrier retry, draft, human review, sent · 4 min). The home keeps the lead-sorting run, and the agents journal block still shows the lead-sorting trace, so the two pages show different runs.
13. **À propos.** No portrait exists in the repo, so none was added (logged for Maxime). The lead engineer section now carries a real GitHub contribution graph for github.com/AirKyzzZ, snapshotted at build input by `node scripts/github-contributions.mjs` into `src/lib/proof/github-contributions.json` (365 days, captured 2026-11-01) and rendered as static SVG. It only renders when the snapshot verifies. The machine view prints the total and the capture date.
14. **FDE réalisations.** Section removed (`proofLink: null`, `fde.proof` copy deleted). The recent public commits name Verana and 2060.io repos, which are not confirmed for the site.
15. **Réalisations orphan rows.** With Kenzi hidden there are 4 cases. The index and the home band share one `CaseList` layout (7/5 then 5/7). The home band shows all 4, so no lone card with a floating caption.
16. **FAQ page.** Answers are collapsed, the first of each theme open. The sticky theme index was not built (the index stays in the hero); with collapsed answers the page is much shorter and each theme heading sits at the top of its sticky column.
17. **Hero lead chips.** Removed from the home lead (FR and EN).
18. **HUMAN/MACHINE pill.** Pinned bottom-left with a 24px inset at ≥1024px, `scroll-padding-bottom: 88px` on `html`.
19. **Two-tone gaps.** Split: "Comment ces prix / se situent.", "Questions / sur les prix.", "Un produit / cofondé par Maxime." (new `about.products`), "Basés à Bordeaux, / à distance partout en France.", "Pourquoi / nous faire confiance.", "Comment ça se passe, / en quatre étapes." (Bordeaux, Sites, Agents IA, FDE, replacing "Les étapes"), the Bordeaux problem, FAQ and CTA headings, the tarifs and réalisations CTAs, and case h1s (split at the first comma). Rule for FAQ headings: they end with a period everywhere.
20. **Bordeaux examples.** Three local workflows in `bordeaux.block` (négoce de vin: commandes export; BTP: devis de chantier; cabinet comptable: pièces clients), labelled as typical examples, via `AutomationExamples namespace="bordeaux.block"`; the machine view follows.
21. **Text-only inner heroes.** Réalisations: a `realisations/` file list (slug, year, stack, each a link). Cas d'usage: a `secteurs.csv` window with each sector and its anchor price. À propos: see 13.
22. **Creation-site-web PKBA twice.** The live-sites block now shows VertiFlow and Hop Hop Immo; PKBA stays in réalisations. The site-shot card prints its "en ligne" status once.
23. **AUSSI strip at 768.** Links are `whitespace-nowrap` items in a wrapping row.
24. **Section rhythm.** `Section` puts the eyebrow in flow with 32px to the heading and keeps `--section-y` for the bottom only.
25. **Case-study template.** Every case shows a « Résultat : pas encore de chiffre publié » fact (page and machine view) and a two-tone h1. Context, built-what bullets and second screens need Maxime's content, logged per case.

## Honesty pass

- Bpifrance Diag Data IA: figures and the « non vérifié » line removed; the block keeps one sentence and links to https://www.entreprises.gouv.fr/osez-lia.
- France Num stat (Bordeaux): checked against the press release, which states 40 % and 11 %; the page now links it.
- Malt audit range: no URL in `docs/KLYX_STRATEGY.md`, so the row and the sentence are removed from tarifs (FR, EN, machine view).
- « 1,8 s »: the real-estate scenario now ends at 2,4 s and the new agents scenario at 4 min; only the home lead-sorting run keeps 1,8 s.
- Technologies list kept as Maxime asked.

## Gates

`npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e` green (290 unit tests, 703 e2e passed, 153 screenshot tests skipped outside `SCREENSHOTS=1`). Screenshots refreshed with `SCREENSHOTS=1 npx playwright test e2e/screenshots.spec.ts` (153 passed).

Lighthouse, local `next start`, mobile preset, median of 3 (status stays `local`):

| Page | Perf | A11y | BP | SEO | LCP |
|---|---|---|---|---|---|
| `/` | 95 | 100 | 100 | 100 | 2.7 s |
| `/services/agents-ia` | 97 | 100 | 100 | 100 | 2.6 s |
| `/tarifs` | 93 | 100 | 100 | 100 | 3.1 s |
| `/cas-usage/immobilier` | 93 | 100 | 100 | 100 | 3.2 s |
