# Design review, round 2 (2026-11-01)

Juror lens: Awwwards SOTD next to Cursor, Linear and Raycast. Inputs: DESIGN_DIRECTION.md §1, §2, §7, `docs/screenshots/references/`, the FR section shots in `docs/screenshots/redesign/<route>/` refreshed at 13:29 to 13:30 (grid backdrop), `docs/screenshots/qa/hero-backdrop-*` and `logos-*`, plus live headless captures of `localhost:3100/en` and `/en/pricing` at 1440. The EN section shots on disk are from 12:33 (painting backdrop) and were only used for the 390 layout check. Contact sheets are in the session scratchpad (`r8/round-2/sheets/`).

Overall: the round-1 broken list is mostly closed (méthode windows, Kenzi, trace header, 404, orphan rows, FAQ wall). The site now reads as one system. What keeps it below SOTD is the same thing as round 1, one level quieter: inner pages still run problème, offres window, step table, stack grid, accordion, CTA, and the new grid backdrop made the CTA card and the Bordeaux hero emptier than the painting was. The flagship case study is still two sentences.

Legend: **P** pass · **G** generic · **B** broken. Widths are collapsed when the verdict is the same at all three.

## 1. Verdicts

| Route | Section | Width | Verdict | Reason → single change that lifts it most |
|---|---|---|---|---|
| home | 01 hero | all | P | Product UI, two-tone h1, one serif word, grid backdrop stays in the margins. Nits: at 1440 the graph panel fills the left 60% and the right 40% is empty grid, with the `Lead transmis · 1,8 s` chip floating on a dotted wire outside any window. The AI node packs two brand marks (OpenAI + Mistral) into a 16px slot. → Put the result chip inside the journal window footer and let the journal fill the right column. |
| home | 02 offres | 1440, 390 | P | One window, three rows, mini pipeline, mono price. Fix 8 landed. |
| home | 02 offres | 768 | G | The pipelines stretch across the full row, chips 200px apart on a hairline. → Keep the pipeline at intrinsic width, left-aligned. |
| home | 03 outils | all | G | Every tile now has a glyph, so it no longer looks unfinished, but it is still an 18-tile logo grid. → The connection map from round 1, fix 7. |
| home | 04 réalisations | 1440, 768 | P | 7/5 then 5/7 on sand. |
| home | 04 réalisations | 390 | G | URL pills are cut ("pkba.ve", "citeme.") and phone captures are cropped mid-page. → Fit the phone frame to the card at 390, never clip the chrome. |
| home | 05 méthode | all | P | Windows render at full height with a bottom border at every width. Fixed. |
| home | 06 l'équipe | all | G | A CiteMe screenshot now sits behind team.yml: the "team" section shows a purple product, not a person, and it is the 2nd CiteMe on the page. → Drop the screenshot; team.yml plus the GitHub contribution strip from à propos. |
| home | 07 questions | all | G | Stock accordion. Low priority. |
| home | 08 CTA | all | G | Unified centred card, but with the grid backdrop at rest it is a dark rounded box with an orange glow and four faint nodes: any AI agency. → One real mini artefact in the card, e.g. the agenda window's `mar. 3 · 11:00` slot as the primary action. |
| services-agents-ia | 01 hero | all | P | New « réponse client » scenario (Zendesk → Notion → brouillon → relecture → 4 min). Fixed. |
| services-agents-ia | 02 le problème | all | G | Text plus a 3-item list; the h2 has no period while most do. |
| services-agents-ia | 03 offres | all | G | One window, three columns: better. The middle column still carries the only filled orange button, so it still reads "recommended plan". → Ghost buttons in all three. |
| services-agents-ia | 04 méthode | all | G | A 4-row number/title/sentence table. Quiet, and the heading copies the home one word for word. |
| services-agents-ia | 05 journal | all | P | Waterfall trace; at 390 the chip moved into a footer row. Fixed. The "L'audit est déduit du Sprint" card beside it is unrelated filler. |
| services-agents-ia | 06 stack | all | G | 9 logo tiles. |
| services-agents-ia | 07 réalisations | all | P | "Déjà en production" has no period. |
| services-agents-ia | 08 prix | all | P | Clean, sector links are now underlined. It does repeat the three items of §03 with the same prices. |
| services-agents-ia | 09 questions, 10 CTA | all | G | Accordion; CTA as on home. |
| services-creation-site-web | 01 hero | all | B | Good scenario, but the caption reads "Trois exemples de ce qu'on livre…": that is the home tabs caption on a single-scenario frame. → Page-specific caption. |
| services-creation-site-web | 02 problème, 03 offres, 04 méthode | all | G | Template trio (3 rows). |
| services-creation-site-web | 05 preuves | 1440, 768 | P | Two live sites in frames, status printed once. |
| services-creation-site-web | 05 preuves | 390 | G | VertiFlow capture cut mid-word ("CONTOURNER"). |
| services-creation-site-web | 06 réalisations | all | G | Kenzi is gone (fixed), but VertiFlow now shows in §05 and §06 with the same capture. The PKBA duplicate just moved. |
| services-creation-site-web | 07 prix | all | P | |
| services-creation-site-web | 08 questions, 09 CTA | all | G | |
| forward-deployed-engineer | 01 hero | all | P | ENG-142. |
| forward-deployed-engineer | 02 problème, 04 méthode | all | G | Template (2 rows). |
| forward-deployed-engineer | 03 offres | all | P | One card plus conditions. h2 "Ce qu'on fait dans votre équipe" has no period. |
| forward-deployed-engineer | 05 définition | all | P | Dictionary entry. Still the most distinctive block on the inner pages. |
| forward-deployed-engineer | 06 prix | all | P | "soit environ 5 600 € HT", see honesty. |
| forward-deployed-engineer | 07 questions, 08 CTA | all | G | |
| services-audit-ia | 01 hero | all | P | J1 to J7. |
| services-audit-ia | 02 problème, 03 offres, 04 méthode | all | G | Template trio (3 rows). |
| services-audit-ia | 05 livrable | all | P | Roadmap table; the Bpifrance card is now one clean sentence plus a gov link. Fixed. |
| services-audit-ia | 06 prix | all | P | |
| services-audit-ia | 07 questions, 08 CTA | all | G | |
| services-automatisation-ia | 01 hero | all | P | TVA error scenario. |
| services-automatisation-ia | 02 problème, 03 offres, 04 méthode | all | G | Template trio (3 rows). |
| services-automatisation-ia | 05 exemples | all | P | |
| services-automatisation-ia | 06 stack | all | G | Heading fixed ("…vos automatisations."), still a logo strip. |
| services-automatisation-ia | 07 prix | all | P | |
| services-automatisation-ia | 08 questions, 09 CTA | all | G | |
| services-geo-referencement-ia | 01 hero | all | P | Fan-out graph. At 390 the edges cross behind nodes (`Cité ou pas ?` sits under the engines). |
| services-geo-referencement-ia | 02 problème, 03 offres, 04 méthode | all | G | Template trio (3 rows). |
| services-geo-referencement-ia | 05 mesure, 06 réalisations, 07 prix | all | P | 3 rows. |
| services-geo-referencement-ia | 08 questions, 09 CTA | all | G | |
| tarifs | 01 hero + table | all | P | Still the best page. |
| tarifs | 02 marché | all | G | With the Malt row removed, `marche.csv` is a window with one row. It reads as a stub. → Add one or two dated, linked rows, or fold the Studeria line into a sentence under the main table. |
| tarifs | 03 questions, 04 CTA | all | G | Two questions only. |
| realisations | 01 hero | all | P | `realisations/` file list. Fixed. |
| realisations | 02 projets | all | P | 7/5, 5/7, no orphan. Fixed. Same 390 cropping as the home band. |
| realisations | 03 CTA | all | G | |
| realisations-hop-hop-immo | 01 hero | all | G | Two-tone now, but no serif word (§1.2: one per page, in the h1) and nothing else above the fold. |
| realisations-hop-hop-immo | 02 case hero | all | P | Desktop plus mobile capture, facts row with an honest "Pas encore de chiffre publié". |
| realisations-hop-hop-immo | 03 case body | all | B | Two sentences: context, then "L'assistant Hoppy, de la conception à la mise en production." This is the flagship case and the body reads as a placeholder (rule 14 spirit). Kenzi was hidden for less. |
| realisations-hop-hop-immo | 04 projet suivant | all | P | |
| realisations-hop-hop-immo | 05 CTA | all | G | |
| a-propos | 01 hero | all | G | Same small `klyx --info` card in an empty half. |
| a-propos | 02 équipe | all | P | team.yml, no screenshot here. |
| a-propos | 03 lead engineer | all | P | Real GitHub contribution graph, dated. Fills the half. |
| a-propos | 04 produits | all | G | Another CiteMe screenshot; `studio.klyx.fr` still has no description. |
| a-propos | 05 confiance | all | G | Two-tone now (no period); small card in a wide section. |
| a-propos | 06 CTA | all | G | |
| cas-usage | 01 hero | all | P | `secteurs.csv` window. Fixed. "Cabinets et servi…" truncates at 1440 although the window has room. |
| cas-usage | 02 secteurs | all | P | |
| cas-usage | 03 autres secteurs, 04 CTA | all | G | |
| cas-usage-immobilier | 01 hero | all | P | Ends at 2,4 s now. |
| cas-usage-immobilier | 02 problème | all | G | |
| cas-usage-immobilier | 03 workflows, 04 données, 05 preuves, 06 prix | all | P | 4 rows. |
| cas-usage-immobilier | 07 questions, 08 CTA | all | G | |
| cas-usage-agences | 01 hero | all | P | Marque blanche delivery run, `llms.txt` result. |
| cas-usage-agences | 05 marque blanche | all | G | Six commitments set as mono sentences (§1.2: mono never for sentences). → Geist 15px, mono only for the index. |
| cas-usage-agences | 07 preuves | all | P | Honest note ("aucun projet en marque blanche"). |
| cas-usage-agences | 02 problème, 06 méthode, 09 questions, 10 CTA | all | G | Template (4 rows). |
| cas-usage-agences | 03 workflows, 04 données, 08 prix | all | P | 3 rows. |
| cas-usage-cabinets-services | 01 hero, 03 workflows | all | P | 2 rows. Four workflows each tagged ILLUSTRATION. |
| cas-usage-cabinets-services | 05 preuves | all | G | A whole section to say there is no proof yet. Honest, but it is an empty proof slot (rule 14 spirit). → One line under the workflows. |
| cas-usage-cabinets-services | 02 problème, 07 questions, 08 CTA | all | G | 3 rows. |
| cas-usage-cabinets-services | 04 données, 06 prix | all | P | 2 rows. |
| faq | 01 hero | all | P | Theme index with counts. |
| faq | 02 to 10 themes | all | P | Collapsed, first open, h2 top-aligned. Page went from 17,000 to 9,400px. Fixed. |
| faq | 11 CTA | all | G | |
| contact | 01 hero/form | all | P | |
| agence-ia-bordeaux | 01 hero | 1440 | G | Regressed from round 1. The painting is replaced by a big empty lit frame with a grid and six nodes behind text only. → Put the Gironde outline with the Bordeaux pin (already in §05) inside the frame as the hero artefact. |
| agence-ia-bordeaux | 01 hero | 390, 768 | G | The frame is hidden below 1024, so the hero is plain text with two buttons. |
| agence-ia-bordeaux | 02 le problème | all | G | France Num source now linked; still the template. |
| agence-ia-bordeaux | 03 exemples | all | P | Wine export, BTP, cabinet comptable. Fixed. (The 1440 section crop misses the eyebrow; the full-page shot has it, harness only.) |
| agence-ia-bordeaux | 04 méthode | all | G | |
| agence-ia-bordeaux | 05 local | all | P | |
| agence-ia-bordeaux | 06 confiance | all | G | Heading plus one paragraph. |
| agence-ia-bordeaux | 07 questions, 08 CTA | all | G | |
| mentions-legales | 01 éditeur | all | P | |
| mentions-legales | 02 hébergement | all | B | Netlify name and address are there, but no phone (LCEN art. 6 requires it), and the VAT status line was removed rather than filled. Launch blocker. |
| mentions-legales | 03 to 05 | all | P | |
| 404 | not-found | all | P | Accent label, one language, `access.log` window, one primary button. Fixed. |
| en (home) | all | 1440 live | same as FR home | Copy fits, prices match FR. |
| en-pricing | all | 1440 live | same as FR tarifs | Same one-row `market.csv`. |

**Totals (FR, one per section and width split, grouped rows expanded, EN excluded): 57 pass, 71 generic, 3 broken.** Round 1 reported 51 / 54 / 9 on a coarser count (grouped rows counted once) and before the sector pages for agences and cabinets were reviewed, so compare the broken count, not the totals: 9 down to 3.

## 2. Round-1 fix verification

| # | Round-1 fix | Status | Note |
|---|---|---|---|
| 1 | Méthode windows < 1024 | Fixed | Full height, bottom border, at 390 and 768. |
| 2 | Kenzi | Fixed | Not in the index, home, Sites or "projet suivant". |
| 3 | Legal placeholders | Not fixed | Host named, phone missing, VAT line removed instead of filled. |
| 4 | Trace header at 390 | Fixed | Footer row inside the window. |
| 5 | 404 | Fixed | |
| 6 | One CTA pattern | Fixed, new issue | One pattern everywhere, but the grid backdrop leaves the card empty (now G). |
| 7 | Tools grid | Partly | Uniform glyphs; the connection map was not built, so it is still the most generic block. |
| 8 | Home offers window | Fixed | 768 pipeline stretch nit. |
| 9 | Service timeline | Partly | Orange dots gone, replaced by a plain table. No artefacts, still generic on 8 pages. |
| 10 | Le problème | Fixed | Geist list, spacing tightened. Still the template. |
| 11 | Offres pricing cards | Partly | Single window; the middle column's filled orange button keeps the SaaS read. |
| 12 | Agents IA hero | Fixed | |
| 13 | À propos human | Partly | GitHub graph added. No portrait, hero unchanged. |
| 14 | FDE empty proof | Fixed | Removed. |
| 15 | Orphan rows | Fixed | |
| 16 | FAQ page | Fixed | Sticky index not built, not needed now. |
| 17 | Hero lead chips | Fixed | |
| 18 | HUMAN/MACHINE pill | Fixed | Bottom-left at ≥1024. |
| 19 | Two-tone gaps | Mostly | Two-tone is everywhere. The period rule is not: "Pourquoi les projets IA restent au stade de la démo", "Déjà en production", "Ce qu'on fait dans votre équipe", "Pourquoi nous faire confiance" have none. Case h1s have no serif word. |
| 20 | Bordeaux exemples | Fixed | |
| 21 | Text-only inner heroes | Partly | Réalisations and cas d'usage fixed; à propos not. |
| 22 | Sites page PKBA twice | Regressed | VertiFlow is now shown twice (§05 and §06). |
| 23 | AUSSI strip at 768 | Fixed | |
| 24 | Section rhythm | Fixed | |
| 25 | Case-study template | Not fixed | "Résultat : pas encore de chiffre publié" added; the body is still two sentences. |
| H | Bpifrance figures | Fixed | Gov link only. |
| H | France Num link | Fixed | |
| H | Malt row | Fixed, side effect | Row removed; `market.csv` is now one row. |
| H | "1,8 s" repeats | Fixed | Agents journal still replays the home trace (1,8 s, 86/100) under a different hero run. |
| H | FDE "à partir de" | Not fixed | Now "soit environ 5 600 € HT". |

## 3. Prioritized fixes

Broken first:

1. **Hop Hop case body.** Give it context (2 lines), what was built (3 bullets: retrieval over the programme feed, map search, handoff), one real Hoppy exchange as a chat window (real question, real answer, dated), and keep the honest "pas encore de chiffre". If the content is not available, cut the case page to the cover plus facts and link to the live site, but don't ship two sentences.
2. **Mentions légales.** Add Netlify's phone (or a host that publishes one) and the VAT status ("TVA non applicable, art. 293 B du CGI" or the number). Launch blocker.
3. **Sites hero caption.** Replace "Trois exemples de ce qu'on livre…" with a caption for the `git push → llms.txt` run. Check every offer and sector hero for the same reused caption.

Then generic, by impact:

4. **CTA card (about 24 instances).** Give the card one real artefact: the méthode agenda slot row (`lun. 2 · mar. 3 · mer. 4`, one slot lit) wired to "Réserver un appel", or one packet running a single wire into the button. Right now it is the most repeated generic block on the site.
5. **Bordeaux hero.** Move the Gironde outline and pin from §05 into the hero frame and render it at every width. That page lost its only image in the backdrop switch.
6. **CiteMe repetition.** Remove the screenshot from home §06 (team) and à propos §04, where a one-line card with the domain does the job. Keep CiteMe in réalisations, GEO and its own case. This also cuts the purple.
7. **Sites page proof (regression of round 1, fix 22).** Turn §05 "à ouvrir vous-même" into real, dated PageSpeed numbers for `hophopimmo.com` and `vertiflow.fr` (LCP, CLS, score) in a mono window, and keep the screenshots only in §06. The copy already promises "vérifiez la vitesse".
8. **Screenshot crops.** Recapture Hop Hop without the half line of text at the bottom edge (it shows in 6+ places), fix VertiFlow cut mid-word at 390, and size the phone frames at 390 so URL pills never truncate.
9. **Home tools grid.** Build the connection map (your tool → Klyx node → your tool, hero graph style) and keep the grid in a `<details>`.
10. **Service méthode table (8 pages).** Delete it on pages that already have a journal, livrable, mesure or exemples block (agents, audit, GEO, automatisation), and change the heading so it doesn't copy the home one.
11. **Offres window.** All three buttons ghost. On agents IA, drop §08 prix or §03 offres, since they list the same three items and prices.
12. **Home hero at 1440.** Rebalance so the right 40% isn't empty grid: journal window anchored right, result chip inside it. Replace the two-logo AI node glyph with one neutral mark.
13. **À propos hero.** A portrait of Maxime (needs the asset), or move the GitHub graph up into the hero in place of `klyx --info`.
14. **Tarifs marché.** Two more dated, linked rows (for example a landing page range and an agency day rate), or fold it into one sourced sentence.
15. **Agences "marque blanche" list.** Geist 15px for the sentences, mono only for `01` to `06`.
16. **Cabinets "pas encore de cas client".** Fold into one line under the workflows instead of a full section.
17. **Heading consistency.** Pick one rule (period on every h2) and apply it to the four listed headings. Add the page's serif word to case h1s.
18. **FDE price wording.** "à partir de 5 600 € HT (2 jours × 4 semaines)".
19. **Agents IA price anchor.** The hero says "À partir de 1 500 € HT" (the audit) while home lists Agents IA from 4 500 € HT. Show both in the eyebrow: `AUDIT 1 500 € · SPRINT 4 500 € HT`.
20. **768 home offers.** Pipelines at intrinsic width.

## 4. Honesty pass

| Visible item | Where | Status |
|---|---|---|
| SIRET 941 572 364 00029 | footer, mentions | Sourced (check once on annuaire-entreprises). |
| Prices: 900 / 2 900 / 5 700 / 1 200 / 590 per month / 1 500 / 2 400 / 190 per month / 4 500 / 700 per day / Sur devis | everywhere, FR and EN | Sourced and consistent. The Agents IA page leads with 1 500 (audit) where home leads with 4 500 (Sprint): both true, confusing side by side. |
| "4 semaines minimum, soit environ 5 600 € HT" | FDE offres and prix | Suspicious wording: it is a floor (2 days), 3 days a week is 8 400. Say "à partir de". |
| Hero and journal values: 1,8 s, 86/100, 4 min, 2,4 s, 128 tests, 9 tâches, −6 h/sem, 31 sites cités, 30 questions, 14 champs, ENG-142, PR #87 | heroes, journals, traces | Illustration-labelled (frame header plus "Noms et valeurs fictifs" caption). The Sites hero caption is the wrong one (says "Trois exemples"). |
| "3 réponses sur 12 citent le site", `cabinet-exemple.fr`, `client-agence.fr`, "PME fictive · 25 personnes" | GEO, agences, audit | Illustration-labelled. |
| "12 933 contributions sur GitHub en 12 mois" | à propos | Sourced (build snapshot of the public profile, dated 1 Nov 2026). About 35 a day reads inflated to a non-developer; say whether private contributions are included. |
| Marché: freelance AI developer 650 to 900 €/day (Studeria) | tarifs, en-pricing | Sourced, linked, dated 2026-10-31. |
| France Num 2026: 40 % use AI, 11 % automate a task | Bordeaux | Sourced, linked. |
| Bpifrance Diagnostic Data IA (no figures, entreprises.gouv.fr link) | audit livrable, FAQ | Sourced. |
| "Le rôle vient d'éditeurs comme Palantir et des labos d'IA" | FDE | Fine, public knowledge. |
| "56 questions · 9 thèmes" (8+4+5+15+5+5+8+3+3) | FAQ | Sourced. |
| "4 projets · 2025-2026" | réalisations | Sourced (4 listed cases). |
| Hop Hop Immo / Hoppy, 2026, Next.js, hophopimmo.com, "Pas encore de chiffre publié" | cases, home, immobilier | Sourced. "+ de 1 243 programmes" is the client's own claim inside the capture. |
| CiteMe (co-fondé), citeme.io | 6 places | Sourced. Its taglines ("Tracked across all 10 AI engines") are CiteMe's claims inside the capture. |
| PKBA (`pkba.vertiflow.fr`), VertiFlow (`vertiflow.fr`), 2025 | réalisations, Sites, agences | Sourced (live URLs). PKBA lives on a VertiFlow subdomain; "Des sites livrés pour des clients" is fine only if they are two separate clients. Worth a word in each case. |
| "Technologies que nous déployons": Hermes Agent, OpenClaw, NanoClaw, Claude Code, Claude, OpenAI, Mistral AI, n8n, MCP | agents, automatisation | Kept at Maxime's request. "Déployons" is still an unverified claim for Hermes Agent, OpenClaw and NanoClaw. Brand disclaimer present. |
| Tool tiles (Gmail … Make, 18) | home | Disclaimer present, no partner claim. OK. |
| team.yml: "agents de code IA", "spécialistes au cas par cas" | home, à propos | Honest framing. |
| "Deux clients au plus en même temps", "Pas d'astreinte 24 h/24", "Pas de certification SOC 2" | FDE | Policy statements. OK. |
| "Code dans votre repo dès le jour 1", "Prix publics, en € HT" | hero strip | Policy, consistent with the tarifs page. |
| Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, support@netlify.com | mentions | Sourced (round-1-fixes). Phone missing, VAT status missing. |
| "Zone servie Bordeaux Métropole et Gironde", "à distance partout en France" | Bordeaux, home | Consistent. |
| studio.klyx.fr, estate.klyx.fr | à propos, footer | Sourced; studio still has no description. |
| github.com/AirKyzzZ, LinkedIn, Instagram | à propos, contact, footer | Sourced. |
