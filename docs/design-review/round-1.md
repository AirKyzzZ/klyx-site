# Design review, round 1 (2026-11-01)

Juror lens: Awwwards SOTD next to Cursor, Linear and Raycast. Inputs: DESIGN_DIRECTION.md §1, §2, §7, `docs/screenshots/references/`, and the section shots in `docs/screenshots/redesign/<route>/` taken at 11:04 to 11:05 on Nov 1. Older 03:24 files in `home/` and `en/` (`02-preuves`, `03-offres`, …) are stale leftovers from an earlier section order and were ignored. Contact sheets are in the session scratchpad (`r8/round-1/sheets/`).

Overall: the home hero and the "only Klyx has this" artefacts (agent trace, roadmap table, GEO report, market.csv, the FDE definition, the sector table) are at SOTD level. What pulls the site down is the template every inner page reuses: problem section, three offer cards, an orange-dot timeline, a logo grid, an accordion and a tilted screenshot CTA. Each of those could sit on any agency site. A few things are actually broken: clipped windows on mobile, the Kenzi capture, legal placeholders, a header overlap at 390 and the 404.

Legend: **P** pass · **G** generic · **B** broken. Widths are collapsed when the verdict is the same at all three.

## 1. Verdicts

| Route | Section | Width | Verdict | Reason → fix |
|---|---|---|---|---|
| home | 01 hero | all | P | Real product UI on a lit Garonne frame, two-tone h1, one serif word. Cursor-grade. Nits: the `Agents IA / Sites / FDE` chips glued to the end of the lead repeat the tabs under the frame; the HUMAN/MACHINE pill floats over the journal at the 1440×900 fold. |
| home | 02 offres | all | G | Three equal cards as the 2nd section (rule 13). The mini pipeline chips save it from icon-bento, but the shape is still template. The `AUSSI` link strip wraps word by word at 768 ("Audit / IA"). |
| home | 03 outils | all | G | An 18-tile integrations grid, the most generic block on the site. 6 tiles are text-only (Outlook, Excel, Pipedrive, Microsoft Teams, Pennylane, Qonto) next to icon tiles, so the grid looks unfinished. |
| home | 04 réalisations | 1440 | G | The sand band is good, but the layout runs 2 cards, then PKBA alone with its caption floating to the right. It reads like an orphan row. |
| home | 04 réalisations | 390, 768 | P | Clean single column. |
| home | 05 méthode | 1440 | P | Scroll-spy plus real mini artefacts (agenda, perimetre.md, point-hebdo, passation). |
| home | 05 méthode | 390, 768 | B | Every example window is cut mid-content with a fade: half-visible slot buttons, half a checklist line, no bottom border. Looks like a rendering bug. |
| home | 06 l'équipe | all | P | team.yml plus a real person and real links. About 200px of dead space under the links at 1440. |
| home | 07 questions | all | G | Stock accordion. |
| home | 08 final CTA | 1440, 768 | G | A tilted Hop Hop Immo screenshot cropped at the card edge, the 3rd Hop Hop image on the page. Generic SaaS move. |
| home | 08 final CTA | 390 | P | Centred, no screenshot, clean. |
| services-agents-ia | 01 hero | all | P | Good, but it is the exact home scenario ("tri des demandes", 1,8 s). The 2nd page a visitor opens shows the same animation. |
| services-agents-ia | 02 le problème | all | G | A paragraph plus a mono "symptômes" list. Mono is used as paragraphs (§1.2). About 150px of empty space above the h2. |
| services-agents-ia | 03 offres | all | G | Classic 3-column SaaS pricing cards with the middle one in orange. |
| services-agents-ia | 04 méthode | all | G | Orange-dot horizontal timeline, 4 equal columns. Template. |
| services-agents-ia | 05 journal | 1440, 768 | P | Waterfall trace with retry in red. Only Klyx has this. |
| services-agents-ia | 05 journal | 390 | B | The `ILLUSTRATION · SCÉNARIO TYPE` chip wraps to 2 lines and collides with the truncated "trace · tri de…" title. |
| services-agents-ia | 06 stack | all | G | A strip of 9 tiny logo tiles lost in a 1440 container, mixing icon and text-only tiles. |
| services-agents-ia | 07 réalisations | all | P | Sand card inside the dark page, real work. |
| services-agents-ia | 08 prix | all | P | Clean mono table. The `PAR SECTEUR Immobilier Agences web` links are too faint to read as links. |
| services-agents-ia | 09 questions | all | G | Stock accordion. The h2 has no period while the home one does. |
| services-agents-ia | 10 CTA | 1440, 768 | G | Same tilted Hop Hop screenshot as home. |
| services-creation-site-web | 01 hero | all | P | Its own scenario (git push → llms.txt). Good. |
| services-creation-site-web | 02 le problème | all | G | Same template as above. |
| services-creation-site-web | 03 offres | all | G | Same 3-card pricing template. |
| services-creation-site-web | 04 méthode | all | G | Same timeline. |
| services-creation-site-web | 05 preuves | all | P | Live sites in frames. Nits: "SITE EN LIGNE" and "EN LIGNE" are printed twice per card; PKBA shows here and again in the next section. |
| services-creation-site-web | 06 réalisations | all | B | The Kenzi frame has no browser chrome or URL, and it was captured mid intro animation: a big dark-red pill and a cropped "Kenzi" wordmark. |
| services-creation-site-web | 07 prix | all | P | |
| services-creation-site-web | 08 questions | all | G | |
| services-creation-site-web | 09 CTA | 1440, 768 | G | Tilted PKBA screenshot, same move as the other CTAs. |
| forward-deployed-engineer | 01 hero | all | P | ENG-142 scenario with "128 tests passent". Specific and credible. |
| forward-deployed-engineer | 02 le problème | all | G | Template. |
| forward-deployed-engineer | 03 offres | all | P | One card plus a numbered conditions list. Honest and not a 3-up. |
| forward-deployed-engineer | 04 méthode | all | G | Timeline. |
| forward-deployed-engineer | 05 définition | all | P | Dictionary entry ("nom masculin") plus "Ce qu'on ne propose pas". Distinctive. |
| forward-deployed-engineer | 06 réalisations | all | G | A sand box holding only a heading and a "Voir le GitHub" button. It reads as an empty proof slot (spirit of rule 14). |
| forward-deployed-engineer | 07 prix | all | P | |
| forward-deployed-engineer | 08 questions | all | G | |
| forward-deployed-engineer | 09 CTA | all | P | Centred CTA on the Garonne painting. This is the right CTA pattern, use it everywhere. |
| services-audit-ia | 01 hero | all | P | J1 to J7 audit journal. Good. |
| services-audit-ia | 02 le problème / 03 offres / 04 méthode | all | G | Template trio. |
| services-audit-ia | 05 livrable | all | P | roadmap-audit-ia.md table, the best "show don't claim" block on the site. The Bpifrance card prints "Non vérifié sur bpifrance.fr", see the honesty pass. |
| services-audit-ia | 06 prix | all | P | |
| services-audit-ia | 07 questions | all | G | |
| services-audit-ia | 08 CTA | all | P | Garonne variant. |
| services-automatisation-ia | 01 hero | all | P | Supplier invoice scenario with a TVA error. Specific. |
| services-automatisation-ia | 02 le problème / 03 offres / 04 méthode | all | G | Template trio. |
| services-automatisation-ia | 05 exemples | all | P | Three mini pipelines with a highlighted human validation step. Each card holds an artefact. |
| services-automatisation-ia | 06 stack | all | G | Logo strip, and the heading says "Ce qui tourne sous vos **agents**" on the automation page. |
| services-automatisation-ia | 07 prix | all | P | |
| services-automatisation-ia | 08 questions | all | G | |
| services-automatisation-ia | 09 CTA | all | P | Garonne variant. |
| services-geo-referencement-ia | 01 hero | all | P | Fan-out graph to 4 engines. Good. |
| services-geo-referencement-ia | 02 le problème / 03 offres / 04 méthode | all | G | Template trio. |
| services-geo-referencement-ia | 05 mesure | all | P | rapport-geo.md citation matrix plus a transparency note. |
| services-geo-referencement-ia | 06 réalisations | all | P | CiteMe on sand. |
| services-geo-referencement-ia | 07 prix | all | P | |
| services-geo-referencement-ia | 08 questions | all | G | |
| services-geo-referencement-ia | 09 CTA | 1440, 768 | G | Tilted CiteMe screenshot brings purple into the brand-defining slot (rule 1 spirit). |
| tarifs | 01 hero + table | all | P | One dense, honest table. Linear-level restraint. |
| tarifs | 02 marché | all | P | market.csv with a dated source. The h2 is single-tone (§1.2). |
| tarifs | 03 questions | all | G | Only 2 questions; the h2 is single-tone. |
| tarifs | 04 CTA | 1440, 768 | G | Tilted Hop Hop screenshot again. |
| realisations | 01 hero | all | G | h1 plus one line, then nothing. No artefact. |
| realisations | 02 projets | all | B | Kenzi capture as above. The 2/2/1 grid leaves VertiFlow orphaned with a floating caption. |
| realisations | 03 CTA | 1440, 768 | G | Tilted Hop Hop. |
| realisations-kenzi | 01 hero | all | G | No two-tone, no serif word (§1.2). |
| realisations-kenzi | 02 case hero | all | B | Mid-animation capture, empty URL bar, metadata "Stack: Web" with no URL. |
| realisations-kenzi | 03 case body | all | B | The whole case study is one sentence ("Site livré pour Kenzi Events…"). It reads as a placeholder. Hop Hop's body is barely longer, so the template itself is thin. |
| realisations-kenzi | 04 projet suivant | all | P | |
| realisations-kenzi | 05 CTA | all | P | Garonne variant. |
| a-propos | 01 hero | all | G | A small `klyx --info` terminal and empty space. The page is about one person and shows no person. |
| a-propos | 02 équipe | all | P | team.yml plus copy. Duplicates home but works. |
| a-propos | 03 lead engineer | all | G | Text plus two buttons and an empty right half at 1440. This is exactly where a portrait or commit graph belongs. |
| a-propos | 04 produits | all | G | Third CiteMe screenshot of the visit. `studio.klyx.fr` has no description. The h2 is single-tone. |
| a-propos | 05 confiance | all | G | Small three-row card in a big empty section. |
| a-propos | 06 CTA | all | P | |
| cas-usage | 01 hero | all | G | Text-only hero, empty right half at 1440. |
| cas-usage | 02 secteurs | all | P | Sector × problème × solution × prix table. Useful and honest ("un seul… cas client publié"). |
| cas-usage | 03 autres secteurs | all | G | A paragraph plus 2 links. |
| cas-usage | 04 CTA | all | P | |
| cas-usage-immobilier | 01 hero | all | P | Its own scenario (portail → visite). |
| cas-usage-immobilier | 02 le problème | all | G | Template. |
| cas-usage-immobilier | 03 workflows | all | P | Three mini pipelines with outils footers. |
| cas-usage-immobilier | 04 données | all | P | Data/outils/hébergement/RGPD spec table. |
| cas-usage-immobilier | 05 preuves | all | P | "Un cas réel" on sand, honest scope note. |
| cas-usage-immobilier | 06 prix | all | P | |
| cas-usage-immobilier | 07 questions | all | G | |
| cas-usage-immobilier | 08 CTA | 1440, 768 | G | Tilted Hop Hop. |
| faq | 01 hero | all | P | Theme index with counts. |
| faq | 02 to 10 themes | all | G | All 56 answers are expanded (17,000px at 1440), a wall of grey text. The theme h2 sits at varying heights in the left column (e.g. "Données et RGPD" is mid-column). |
| faq | 11 CTA | all | P | |
| contact | 01 hero/form | all | P | Booking card plus form with budget chips. Clean. |
| agence-ia-bordeaux | 01 hero | all | P | Painted Garonne in a lit frame. No product UI, but it is the local page and the place earns it. |
| agence-ia-bordeaux | 02 le problème | all | G | Template, and the stat has no link (see the honesty pass). |
| agence-ia-bordeaux | 03 exemples | all | G | A copy of the automatisation page's three examples. |
| agence-ia-bordeaux | 04 méthode | all | G | Timeline; the h2 is single-tone. |
| agence-ia-bordeaux | 05 local | all | P | Gironde outline with a Bordeaux pin plus a spec table. |
| agence-ia-bordeaux | 06 confiance | all | G | Heading plus one paragraph. |
| agence-ia-bordeaux | 07 questions | all | G | |
| agence-ia-bordeaux | 08 CTA | all | P | |
| mentions-legales | éditeur, hébergement | all | B | "Mention TVA : précisée à la mise en ligne" and "Hébergeur : précisé à la mise en ligne" are placeholders in production (rule 14). The LCEN requires the host's name, address and phone. |
| mentions-legales | PI, crédits, données | all | P | Crédits section is exemplary. |
| 404 | not-found | all | B | The "404" label renders red-pink (looks like `--ui-err`, which is outside a UI window: rule 15). FR and EN copy are stacked, with 2 buttons that do the same thing. No Live System touch. |
| en (home) | all | all | same as FR home | Copy fits; same issues (clipped méthode windows < 1024, tools grid, tilted CTA). |
| en-pricing | all | all | same as FR tarifs | The Malt source is unlinked here too. |

**Totals (rows above, FR, EN rows excluded): 51 pass, 54 generic, 9 broken.**

## 2. Prioritized fixes

Broken first:

1. **Méthode windows < 1024px (home, en).** Remove the max-height and fade mask on the step example windows below the desktop breakpoint. Render each window at full height with its bottom border, or show only the first 3 rows and end on a real last row plus a `…` mono line. Never cut a row in half.
2. **Kenzi.** Recapture the cover after the intro animation finishes (wait for network idle plus 2s, or capture with `prefers-reduced-motion`). Put it in the same browser chrome as the other cards, with the real domain in the URL pill. Until the case body has at least context, what was built and the live URL, take Kenzi out of the index, the creation-site-web band and the "projet suivant" rotation.
3. **Legal placeholders.** Fill in the real host (name, address, phone) and either the VAT number or "TVA non applicable, art. 293 B du CGI". If the values are not known yet, hold the deploy. Do not ship "précisé à la mise en ligne".
4. **Trace header at 390.** Drop the `ILLUSTRATION · SCÉNARIO TYPE` chip from the window title bar below 640px. Put it as a caption under the window, or shorten it to `ILLUSTRATION`. Keep the title on one line with ellipsis.
5. **404.** Use `--accent` or `--text-3` for the "404" label. Show one language based on the route, with one primary button "Retour à l'accueil" and one ghost link to `/contact`. Add a 3-line mono journal (`GET /xyz → 404 · route inconnue · redirection proposée : /`) so the page stays on concept.

Then generic, by impact:

6. **One CTA pattern.** Replace every tilted, cropped product screenshot in final CTAs (home, agents, sites, GEO, tarifs, réalisations, immobilier) with the centred Garonne-backdrop card already used on FDE, audit, automatisation and Bordeaux. This also removes 5 of the ~9 purple CiteMe and Hop Hop repeats.
7. **Tools/stack grid.** Make every tile either monochrome icon plus name or name-only, never both in one grid; Simple Icons covers Outlook, Excel, Teams, Pipedrive and Qonto. Better: replace the home grid with one 12-column "connection map" (your tool → Klyx node → your tool, using the hero graph style) and keep the grid as a collapsed `<details>` list. On the automatisation page, change the heading to "…sous vos automatisations."
8. **Home §2 three equal cards (rule 13).** Turn the offer ladder into one wide window: 3 rows (Sites / Agents IA / FDE), each with the existing mini pipeline on the left, the description in the middle and the mono price on the right. Same content, no 3-up.
9. **Service "Les étapes" timeline (6 pages).** Delete the orange-dot timeline and reuse the home méthode component with page-specific artefacts (e.g. the audit page's J1 to J7 entretiens list, the GEO page's J+30 re-test diff). If time is short, remove the section on pages that already have a journal, livrable or mesure block.
10. **Service "Le problème" (8 pages).** Set the symptoms list in Geist 15px `--text-2` instead of mono (§1.2: mono never for sentences). Cut the empty space above the h2: eyebrow to h2 should be 32px, not ~100px. Or replace the list with a "before" artefact: a 3-line failing run (`ChatGPT · onglet ouvert · 0 intégration`).
11. **Service "Offres" 3-up pricing cards.** Keep the content but drop the orange-bordered middle card. Use a single bordered window with three columns divided by 1px `--line`, and put the "+ N autres éléments" lists behind a disclosure on mobile. That reads as a spec sheet rather than SaaS pricing.
12. **Agents IA hero duplicates the home scenario.** Give it a second scenario (e.g. "réponse client": Zendesk → IA rédige → validation humaine → envoyé), or default the home hero tab to Sites so the visitor sees two different runs.
13. **À propos needs a human.** Add one real portrait of Maxime (B/W or warm duotone, `--r-lg`, in the lit frame) in the hero or in the lead engineer section, plus a real GitHub contribution strip, fetched at build time and statically rendered. That fills the empty right halves at 1440.
14. **FDE réalisations empty sand box.** Put 5 to 8 real recent public commits in it (repo · message · date, mono), or remove the section.
15. **Réalisations orphan rows.** For 5 projects, use 1 full-width feature (Hop Hop) and then 2×2, or make the last single card full-width with its caption under it. No floating caption next to a lone card.
16. **FAQ page.** Collapse all answers by default and open the first per theme. Make the theme index sticky on desktop. Top-align each theme h2 (or make it sticky with `top: 96px`). This cuts ~70% of the page height.
17. **Hero lead chips.** Remove the inline `Agents IA / Sites / FDE` chips after the home lead (FR and EN). They duplicate the tabs and break the sentence's rhythm.
18. **HUMAN/MACHINE pill.** It floats over content at the fold (home journal) and mid-text (legal). Dock it in the nav pill at ≥1024 or pin it bottom-left with a 24px inset, and add `scroll-padding-bottom` so it never covers text.
19. **Two-tone rule gaps.** Make these h2 two-tone: "Comment ces prix se situent", "Questions sur les prix", "Cofondé par Maxime", "Basé à Bordeaux", "Pourquoi nous faire confiance" (Bordeaux), "Comment ça se passe" (Bordeaux), "Les étapes", case-page h1s. Pick one rule for the period after "Questions fréquentes" and apply it everywhere.
20. **Bordeaux exemples copy-paste.** Swap in three workflows from local trades (e.g. négoce de vin: commandes export; BTP: devis chantier; cabinet comptable: pièces clients), or link to the automatisation page instead of duplicating it.
21. **Text-only inner heroes** (réalisations, cas-usage, à propos). Add one compact artefact on the right at 1440: a mono project index (`5 projets · 2025-2026` as a file list), the sector table's first row as a mini window, or the portrait.
22. **Creation-site-web PKBA twice.** In §05 preuves, show VertiFlow and Hop Hop live, keep PKBA for réalisations, and print the "EN LIGNE" label only once per card.
23. **768 AUSSI strip.** Let it wrap as whole items (`white-space: nowrap` per link, `flex-wrap: wrap`, 12px row gap), or stack it under 900px.
24. **Section rhythm.** Section tops carry ~100px from eyebrow to h2 plus 160px of section padding, so headings feel unanchored at 1440. Set eyebrow to h2 at 32px and keep `--section-y` for the bottom only.
25. **Case-study template.** Before the next round, give every case at least: context (2 lines), what we built (3 bullets), one second screen (mobile or detail), the live URL and one honest outcome line, or say there is none yet.

## 3. Honesty pass

| Visible item | Where | Looks |
|---|---|---|
| SIRET 941 572 364 00029 | footer, mentions | Sourced (check it once on annuaire-entreprises). |
| All prices: 900 / 2 900 / 5 700 / 1 200 / 590 per month / 1 500 / 2 400 / 190 per month / 4 500 / 700 per day / "Sur devis" | everywhere | Sourced. They agree across hero, cards, tables, FAQ and EN. |
| "5 600 € HT pour démarrer" (FDE) | FDE | Sourced: 700 × 2 days × 4 weeks. Note that 3 days per week gives 8 400; say "à partir de". |
| Hero and journal numbers: 1,8 s, 86/100, 0,3 s, 128 tests, 9 tâches, −6 h/sem, 31 sites cités, 30 questions | heroes, journals | Labelled "Noms et valeurs fictifs", so OK. But "1,8 s" appears in 3 different scenarios (home, agents, immobilier "Visite proposée · 1,8 s"), which reads as copy-paste. Vary them. The fictif caption is 12px `--text-3` under the frame, easy to miss: also put "ILLUSTRATION" in the frame header (already done). |
| "3 réponses sur 12 citent le site" | GEO mesure | Labelled "valeurs fictives". OK. |
| Marché: 650 to 900 €/day freelance (Studeria, linked) | tarifs | Sourced. |
| Marché: audit IA express 1 500 to 2 500 € (Malt) | tarifs, en-pricing | Weak: no link. Add the URL and date like Studeria. |
| "40 % des TPE-PME… utilisent l'IA, seulement 11 %… automatiser une tâche (baromètre France Num 2026)" | agence-ia-bordeaux | Named but unlinked. Verify the exact figures and link the report. |
| Bpifrance Diag Data IA: 10 000 € HT, 40 % prise en charge, 10 to 2 000 salariés (source les-aides.fr, "Non vérifié sur bpifrance.fr") | audit livrable, FAQ | Suspicious as shipped. Verify on bpifrance.fr and drop the disclaimer, or remove the figures. A "non vérifié" note on a sales page undercuts trust. |
| "Le rôle vient d'éditeurs comme Palantir et des labs d'IA" | FDE définition | Fine (public knowledge). |
| "56 questions · 9 thèmes" | FAQ | Sourced: the theme counts add up to 56. |
| "5 projets · 2025-2026" | réalisations | Sourced (5 cases). |
| Hop Hop Immo / Hoppy, 2026, Next.js, hophopimmo.com | réalisations | Sourced (live URL). "+ de 1 243 programmes" is the client's own claim inside the screenshot. |
| CiteMe "cofondé par Maxime", citeme.io | many | Sourced. The screenshot carries CiteMe's own marketing claims, so it is fine as a screenshot. |
| PKBA (pkba.vertiflow.fr), VertiFlow (vertiflow.fr), 2025 | réalisations | Sourced (live URLs). |
| Kenzi Events, 2025, "Web" | réalisations | Suspicious: no URL, no body, broken capture. Unverifiable as shown. |
| "Technologies que nous déployons": Hermes Agent, OpenClaw, NanoClaw, Claude Code, Claude, OpenAI, Mistral AI, n8n, MCP | agents, automatisation | Plausible, but "déployons" is a claim. Keep only what has shipped in a client or own project (NanoClaw and Hermes Agent especially). The disclaimer about brands is present. |
| Tool tiles (Gmail … Qonto) | home | Disclaimer present, no partner claims. OK. |
| team.yml: "agents de code IA" as a team role, "spécialistes au cas par cas" | home, à propos | Honest framing. OK. |
| "Serveurs MCP … infrastructure européenne d'identité numérique" | à propos | True (Verana). OK. |
| github.com/AirKyzzZ, LinkedIn | à propos, home | Sourced. |
| studio.klyx.fr, estate.klyx.fr | à propos, footer | Sourced. studio has no description. |
| "Zone servie Bordeaux Métropole et Gironde" vs "à distance partout en France" | Bordeaux, home | Consistent enough. |
| Mentions: "Mention TVA / Hébergeur : précisé(e) à la mise en ligne" | mentions-légales | Placeholder. Must be fixed before launch. |
