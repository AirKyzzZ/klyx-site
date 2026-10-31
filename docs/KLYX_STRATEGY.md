# Klyx strategy (2026-10-31)

Synthesis of the 2026-10-31 research pass (market, competition, ICPs/offers, SEO/GEO, positioning, visual, templates, motion, recon). PAL/Gemini was down for every pass, so all of it is WebSearch/WebFetch plus read-only CiteMe. Marks kept from the sources: DIRECT = page read in full, SNIPPET = search/directory only, GUESS = estimate, unverified = third-party claim nobody checked. Anything a prospect could challenge on a call is in section 8.

Decisions already made by Maxime (not reopened here): new repo `klyx-site` on Next.js; Resend for the contact form and Cal.com for booking (replaces Formspree + Calendly); `studio.klyx.fr` and `estate.klyx.fr` stay live and are linked from klyx.fr; the outreach lead engine comes later, this site only prepares the assets for it.

## 1. TL;DR

1. Demand is real but shallow: 40% of TPE-PME use AI, only 11% automate a task and 19% pay for a tool ([France Num 2026](https://www.entreprises.gouv.fr/espace-presse/barometre-france-num-2026-quatre-tpe-pme-sur-dix-utilisent-desormais-lintelligence)). Klyx sells the step from "uses ChatGPT" to "a workflow in production".
2. Top barrier is lack of expertise (53-54%), not cost (30-33%) ([INSEE 2026](https://www.insee.fr/fr/statistiques/9025878)). Done-for-you plus handover beats training.
3. Klyx cannot deliver subsidised AI aids today (Diag Data IA needs Bpifrance referencing). Sell unsubsidised and fixed-price; Prêt Boost IA and the NA Chèque transformation numérique are the only client-side levers worth mentioning, after confirmation.
4. Competitors hide prices and prove with counters and logos. Gaps: verifiable engineering proof, a French mid-price embedded FDE offer, price plus guarantee.
5. Fastest cash: agencies needing white-label AI/Next.js (ICP 1), then funded startups (ICP 2), then Bordeaux PME (ICP 3, slowest, biggest pool).
6. Ladder: one-pager 900 > Site IA 2 900 > Audit IA 1 500 > Sprint IA 4 500 > FDE by the week > run retainer. Live Sprint price undercuts the FDE rate; needs a call (decision 3).
7. Positioning: engineer-whose-code-you-can-read (B) as spine, outcome language (A) on the CTA, FDE (C) as a rung, not the headline.
8. SEO: Bordeaux "IA" queries are low volume and nearly uncontested; national traffic comes from price and how-to queries. Publish `/tarifs`.
9. GEO: what gets cited is original data, local pages and an entity page (CiteMe data on Hop Hop Immo). llms.txt ships but does nothing measurable.
10. Most proof (Verana, Credo-ts, CiteMe numbers, client names) needs Maxime's confirmation before it goes live.

## 2. Market

### Adoption

| Metric | Value | Source |
|---|---|---|
| Firms 10+ staff using AI, France | 18% in 2025 (10% 2024, 6% 2023); EU 20%. By size: 10-49 15%, 50-249 31%, 250+ 58% | [INSEE Première 2120](https://www.insee.fr/fr/statistiques/9025878), DIRECT |
| TPE-PME using AI, 2026 | 40% (+14 pts); PME 53% | [France Num 2026](https://www.entreprises.gouv.fr/espace-presse/barometre-france-num-2026-quatre-tpe-pme-sur-dix-utilisent-desormais-lintelligence), DIRECT |
| Uses | gen text/voice/image 34%, chatbots 24%, doc analysis 13%, task automation 11% | same |
| Paying | 19% of firms, 32% of PME; 85% of payers rate AI positive vs 68% overall | same |
| PME/ETI (Bpifrance Le Lab, 2024 field) | 32% adopted; 58% think AI affects survival in 3-5 yrs | [Siècle Digital](https://siecledigital.fr/2025/06/05/seulement-32-des-pme-francaises-utilisent-lia-une-revolution-encore-timide/), secondary |
| Startup funding | 230 equity rounds H1 2025 vs 400 H1 2024; Nouvelle-Aquitaine 124.75 M EUR H1 2025 | [Maddyness](https://www.maddyness.com/2025/06/30/french-tech-les-levees-de-fonds-en-chute-au-premier-semestre/), [Journal des Entreprises](https://www.lejournaldesentreprises.com/breve/124-million-deuros-leves-par-lecosysteme-french-tech-en-nouvelle-aquitaine-2126475) |
| FDE demand FR | ~47 FDE postings on one Paris aggregator snapshot, mostly CDI | [inferencejobs](https://inferencejobs.com/jobs/locations/paris-idf-france/forward-deployed-engineer?page=3); low-medium confidence, proves the title exists, not freelance demand |

### Budgets

- TJM: senior dev/AI engineer 650-900 posted; FDE missions 580-750; 1 000+ only with niche proof ([Studeria](https://www.studeria.fr/articles-de-blog/tjm-consultant-ia-2026-tarifs-grille), [Plateya](https://www.plateya.fr/blog/detail/tarif-consultant-ia-en-2026-guide-complet-fourchettes-et-conseils), secondary, conflicting).
- Packages: express audit 1 500-2 500 (Malt SNIPPET); private audit 3 000-12 000; RAG 5-15k; custom agent 20-50k; n8n one-week example 4 500. Diag Data IA benchmark 10 000 HT / 8 days.
- Landing pages: template 100-300, freelance 1 000-3 000, custom 5 000+.

### Triggers (inferred, not surveyed)

Peers adopting (adoption tripled in 2 years); public push "Osez l'IA" and financed diagnostics; a free-tool experiment that stalls; staff time lost on admin/docs; a subsidy window; an investor or customer asking for an AI roadmap (startups). For agencies: a client brief they cannot staff.

### Objections and answers

| Objection | Share | Answer |
|---|---|---|
| Lack of expertise | 53-54% (INSEE) | Handover, short training, code in their repo |
| Data protection / RGPD | 38-43% (INSEE), 30% (Bpifrance) | EU hosting or local models, DPA, data mapping before build |
| Legal uncertainty | 42% of adopters | AI Act Omnibus pushed Annex III to 2 Dec 2027 per [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement) / [FPF](https://fpf.org/blog/the-ai-act-implementation-timeline-what-changes-under-the-ai-omnibus) (medium confidence, Art. 4 status disputed, verify OJ before quoting). Internal assistants are not high-risk; HR/credit scoring would be |
| Cost | 30-33% | Fixed price, audit credited against build |
| "No use for AI" | 71% of non-adopters | Free 30 min call that names one process |

### Public aids

Rule of thumb: nearly every subsidised AI consulting aid is delivered by a referenced or programme-selected provider. Klyx is not one. Subsidies are a closing aid for the client, never part of a Klyx price claim.

| Aid | What | % / amount | Client eligibility | Klyx as provider? | Status / confidence | Link |
|---|---|---|---|---|---|---|
| Diag Data IA (Bpifrance, France 2030) | 8-day expert diagnostic, 10 000 HT | 40% covered, client pays 6 000 HT | PE/PME/ETI 10-2 000 FTE, >1 yr, >=1 M EUR turnover; TPE excluded | No. Expert must be "habilité Bpifrance", personal application with client-diagnostic references | Open; high on terms, medium on whether a referencing call is open, high that Klyx is not eligible now | [les-aides.fr](https://les-aides.fr/aide/aVkf3w/bpifrance/diagnostic-data-intelligence-artificielle.html), [entreprises.gouv.fr](https://www.entreprises.gouv.fr/espace-presse/renforcement-du-plan-national-osez-lia-pour-sensibiliser-les-entreprises) |
| Accélérateur IA (ex IA Booster?) | 18-month programme, 12-day diag + two 13-day modules | 46% (gov page); one blog says 23% on phase 3 | >8 M turnover, >50 FTE, >=3 yrs | No (Bpifrance Conseil consultants) | medium-high | [entreprises.gouv.fr](https://www.entreprises.gouv.fr/espace-presse/renforcement-du-plan-national-osez-lia-pour-sensibiliser-les-entreprises) |
| AMI solutions souveraines d'IA PME/ETI | Public referencing list, no money | n/a | PME/ETI as buyers | Apply once 2-3 client references exist; rolling since 5 June 2026 | high | [press release](https://www.entreprises.gouv.fr/files/files/presse/2026/665_-_CP_-_France_2030_Lancement_dun_Appel_a_Manifestation_dInteret_AMI_pour_identifier_des_solutions_souveraines_dIA_pour_les_PME_et_ETI.pdf), [Hub France IA](https://www.hub-franceia.fr/ami-catalogue-des-offreurs-de-solutions-souveraines-ia-pour-pme-et/) |
| Prêt Boost IA (Bpifrance) | Unsecured loan for AI projects | 5-100k (one guide says 75k) | TPE/PME <=49 FTE, >=3 yrs | No referencing: free choice. Whether consulting fees qualify is unclear | medium; most usable lever | [les-aides.fr](https://les-aides.fr/aide/dHQ_3w/bpifrance/pret-boost-ia.html) |
| Chèque transformation numérique (NA) | External services incl. development, licences | 50%, max 150k, min project 10k | PME/ETI/assoc with a digital strategy or Region diag; BTP/transport/CHR excluded | Not stated | medium-high on terms, medium on open now. Positioning file's "~1 500 EUR" was an old 2022 doc, superseded | [fiche 251](https://les-aides.nouvelle-aquitaine.fr/gda-fiche-pdf/251) |
| Défis numériques des TPE (NA) | Up to 4 coached days | 100% to client | TPE <10 FTE, <2 M | Programme advisors only; matransfonum listing unverified | high on content, low on provider route; deadline 31 Dec 2026 is unverified, fiche has none | [fiche 5480](https://les-aides.nouvelle-aquitaine.fr/gda-fiche-pdf/5480) |
| Aide transformation numérique TPE (NA) | Investment >=10k | up to 50%, 5-50k | Craft/production TPE <10 | n/a | Closed (examination ended 31 Dec 2025) | [fiche 6007](https://les-aides.nouvelle-aquitaine.fr/gda-fiche-pdf/6007) |
| Opco EP "IA dans les TPME" (NA) | 14 h on-site diag + action plan | <50 FTE: 50% Opco + 50% Region | <250 FTE in Opco EP scope | No (Opco's selected providers) | high | [Opco EP fiche](https://www.opcoep.fr/ressources/centre-ressources/fiche/actions-regionales/fiche-intelligence-artificielle-dans-les-tpme-na-opcoep.pdf) |
| OPCO-funded training | Training | amounts unverified | employees | Only with NDA + Qualiopi, or as subcontractor of a Qualiopi body | rules high, amounts none | [Opco EP FAQ](https://www.opcoep.fr/question-formation/anticiper-les-evolutions-et-les-transitions-former-et-developper-les-competences-de-mes-salaries/connaitre-les-modalites-de-formation-et-gerer-les-inscriptions-en-formation/l-0) |
| CII | Innovation spend (prototype of new product) | 20%, 400k base, to 31 Dec 2027 | PME | Unverified whether outsourced work to Klyx qualifies. Do not claim | high on rate, low on provider | [CCI Paris](https://www.entreprises.cci-paris-idf.fr/web/cci92/le-credit-d-impot-recherche-et-le-credit-d-impot-innovation) |
| Chèque France Num 500 EUR | | | | | Ended 2026, do not mention | (subventions.fr, via positioning file) |

**Diag Data IA conflict, resolved.** Three rates circulate: 80% (Bpifrance catalogue v7, 2024), 25% "since Jan 2026" and "raised 17 June 2026" (single blogs, unconfirmed), 40% (les-aides.fr updated 12 Aug 2026 and the entreprises.gouv.fr Osez l'IA page, both read DIRECT in the market pass; Studeria also says 40%). Verified: 40% of 10 000 HT, 8 days, client pays 6 000 HT, 10-2 000 FTE and >=1 M turnover. The 2023 cahier des charges (3-10 days, 3 900-13 000 HT) is outdated. Not verified: bpifrance.fr itself (403) and whether a provider call is open. Treat 40% as current; never claim Klyx delivers it.

Actions this week: email transfonum@nouvelle-aquitaine.fr (Chèque open? freelancer as provider?), ask Bpifrance Conseil whether a Diag Data IA expert call is open, plan an AMI application after two named deployments, partner with a Qualiopi body rather than certifying.

Safe site line, only after transfonum confirms: « Financement possible (Région, Bpifrance), je vous aide à monter le dossier. » No amounts.

## 3. Competition

Site quality 1-5 judges copy/structure from fetched text, not visual design.

| Name | Offer | Price signal | Proof | Quality |
|---|---|---|---|---|
| [Tensoria](https://tensoria.fr/agence-ia-bordeaux) (Toulouse, serves Bordeaux) | Diag > automate > train (OPCO) > harden | Sur devis | Continental RAG 2 000+ users, Thales, Actia | 4 |
| [Mink](https://mink-agency.com) (Bordeaux) | Web + AI agency, no packages | None | Univ. Bordeaux, Eiffage, figures; 8 vs 11 yrs inconsistent | 3 |
| [Hack'celeration](https://hackceleration.com/fr/agence-automatisation/n8n) (Bordeaux per French Tech listing, verify) | n8n package, academy, lab | n8n from 2 000, 4-6 wks | Counters (100+ projects), no named cases | 3 |
| [Hyperstack](https://www.hyperstack.studio/toolbox/n8n) (Paris/Nantes) | n8n audit, build, hosting, training | Audit 800/day, design from 2 500, ~8 000 build | 5 cases with numbers, named testimonials | 4, most transparent in FR |
| [Tandem](https://www.wearetandem.ai/fr/services/agence-n8n) (Paris, 15+) | n8n + agents, training | "Milliers, pas dizaines de milliers" | ~40 logos, 2 cases | 4 |
| [DevFlows](https://www.devflows.eu/agence-n8n) (Boulogne) | n8n + agents + apps, simulator | None | "+150 projets", no names | 3 |
| Althoce, Kames, IGK Digital (Bordeaux, SNIPPET) | Agents + automation for PME | None | Unverified counters or 0 reviews | n/a |
| [Josselin Guarnelli](https://contra.com/s/EWQkmXvA-ai-agent-sprint-from-architecture-to-production) (Contra) | 3-8 wk agent sprint, audit trail | Contact | None | 3 |
| Malt freelancers (Bordeaux/Paris, SNIPPET) | Audit, agents, "FDE" | 400-800/day; audit 1 500-2 500 | Platform reviews | n/a |
| [A.Team](https://www.a.team/hire-forward-deployed-engineers) | FDE as a service | ~$25k/month | Case stats, SOC 2 | 5 |
| [Main & Machine](https://www.mainandmachine.com/pricing/) (US) | Audit > sprint > managed | Audit $3.5-8.5k, sprint $18-60k | 1 case; "live in 90 days or we keep building free" | 5 |
| [Gigabit](https://gigabit.agency/pricing/) | Audit > build > embedded | Review $2 500, embedded $3-7.5k/engineer/month | Claimed ROI cases | 4 |

Patterns: free first call is universal; tool-first "agence n8n" identity is a commodity (Malt floor 200-450/day); most hide prices; proof is counters and logos; several Bordeaux "agence IA" entrants created in 2026 with no reviews.

Three gaps Klyx can hold:
1. **Verifiable engineering proof.** Nobody surfaced shows public commits or open-source standing. Klyx can link repos and PRs, pending section 8.
2. **French, mid-price, embedded FDE.** FDE offers are English and ~$25k/month, or Malt day rates. No French agency sells "je m'intègre à votre équipe" with published terms.
3. **Price plus guarantee for PME.** Only Hyperstack publishes prices in France, nobody offers an audit credit or delivery guarantee. Main & Machine is the model.

## 4. ICPs ranked by speed-to-cash

All deal sizes and cycles are GUESS unless sourced.

### ICP 1: web/marketing agencies and freelance collectives (white-label AI + Next.js)

- **Pains:** clients ask for chatbots, agents, GEO; no senior engineer; peak-load capacity; fear of shipping flaky AI under their brand.
- **Triggers:** a brief they cannot staff, a pitch lost for lack of AI credibility, GEO becoming a line item, a dev leaving.
- **Channels:** LinkedIn (founders, directeurs techniques), Bordeaux Tech'Day, French Tech Bordeaux, white-label requests on [Codeur.com](https://www.codeur.com/projects/327605-recherche-agence-digitale-pour-sous-traitance-en-marque-blanche)/Malt, blog.klyx.fr readers. ~3 in 4 agencies outsource part of web production ([LeFreelance](https://lefreelance.fr/articles/marque-blanche-agence-freelance/), vendor content, unverified).
- **Decision-maker:** founder/gérant, directeur technique, head of delivery.
- **Deal:** 1 500-4 500 first mission; 7 500-11 500/month as a capacity block. **Cycle:** 1-3 weeks.
- **Age objection:** "si tu disparais, notre client est exposé." **Honest counter:** written scope, code in their repo from day 1, documented handover so any dev can take over, small paid test mission first, NDA/white-label clause, public GitHub. Do not invent a backup person.

### ICP 2: funded startups / scale-ups, seed to A, shipping an AI feature without senior engineers

- **Pains:** AI features (agents, RAG, evals) on a 2-4 person team, ship before next round, slow senior hiring, enterprise customers asking about agent security and audit.
- **Triggers:** round announced (Maddyness, Les Echos Start, LinkedIn), a customer demanding an AI feature, CTO leaving, "AI engineer" posting open >30 days.
- **Channels:** warm intros first ([fde.academy](https://fde.academy/blog/fractional-forward-deployed-engineer-for-startups): first clients come via network), Technowest/Unitec, French Tech Bordeaux, SSI/eIDAS 2/Credo-ts ecosystem (niche, strong fit).
- **Decision-maker:** CEO/CTO co-founder.
- **Deal:** Sprint 4 500+, FDE 7 500-11 500/month, 4-12 weeks. **Cycle:** 2-6 weeks.
- **Age objection:** "tu as 20 ans, on veut du senior." **Honest counter:** judge on artefacts (linked PRs and shipped products, once confirmed), 1-week paid trial with exit. State limits up front: solo, no 24/7 on-call, no SOC 2, 2 clients max. Never write "senior".

### ICP 3: Bordeaux / Nouvelle-Aquitaine PME, 10-100 staff, repetitive ops

- **Pains:** manual quotes, invoices, emails, reporting; no in-house IT; tried ChatGPT without process change; data-leak fear; burned by agencies.
- **Triggers:** pre-season overload, hiring freeze, failed ERP/CRM project, a CCI workshop, a subsidy window (once verified).
- **Channels:** CCI Bordeaux Gironde, CPME/MEDEF Gironde, business clubs, expert-comptable referrals (GUESS: strongest PME channel), past clients (Hop Hop Immo, Kenzi, PKBA, Reciproq), Google Business Profile and `/agence-ia-bordeaux`.
- **Decision-maker:** dirigeant/gérant (10-50), DAF or directeur des opérations (50-100).
- **Deal:** audit 1 500-2 500 > workflow 4 500-9 000 > retainer 300-900/month. **Cycle:** 4-12 weeks, in person.
- **Pool:** several thousand 10+ staff establishments in Gironde (order of magnitude from a 2013 INSEE derivation, refresh from [INSEE](https://www.insee.fr/en/statistiques/6678114?geo=DEP-33)).
- **Age objection:** "trop jeune, qui assure le suivi ?" **Honest counter:** fixed scope and price, « payez l'audit, repartez avec le plan même si vous ne continuez pas », code ownership, EU hosting, a run contract that makes continuity explicit, 2-3 phone-callable references (only with their consent).
- Slowest and most contested: [Tensoria](https://tensoria.fr/agence-ia-bordeaux) has named industrial proof here.

Sub-segment folded into ICP 2: SSI/digital identity startups (Verana/2060.io/Credo-ts adjacent). Not an ICP now: Euthyne-style buyers (that is a product, use as proof).

## 5. Offer ladder

All EUR HT, "à partir de". Live klyx.fr prices kept as floors. Anchors: [Main & Machine](https://www.mainandmachine.com/services/implementation-sprint/), [A.Team](https://www.a.team/hire-forward-deployed-engineers), Studeria, Plateya.

| Rung | Offer | Price | Duration | Status |
|---|---|---|---|---|
| 0a | One-pager (landing) | 900 | 1-2 wks | Brief price, not on live site |
| 0b | Site IA (5-8 pages, Next.js or WP, SEO+GEO) | 2 900 | 3-4 wks | Live |
| 0c | Custom site | 5 700+ | GUESS | From brief, referenced in visual research; confirm |
| 1 | Audit IA + roadmap | 1 500 express (1 wk); 2 500-3 500 full (2 wks) | 1-2 wks | 1 500 live; full tier GUESS |
| 2 | Sprint IA: first agent/automation in prod | 4 500; RAG/integrations 9 000-15 000 | 2 wks, renewable | 4 500 live; upper band GUESS |
| 3 | FDE embarqué, by the week | 3 500-4 000/wk (700-800 TJM); 10 days/month ~7 500-8 000 | 4-12 wk min | GUESS on market data |
| 4 | Run-and-improve retainer | 300-900/month light; 1 500-3 000 with improvement days | 3-month min | GUESS, no market data |

**Reconciliation problem.** Live Sprint IA is 4 500 for a 2-week sprint, ~450/day on a 10-day basis: below the 650 FDE floor and well below the proposed weekly rate. It only holds if Sprint IA is sold as a fixed-scope deliverable (one workflow, agent-leveraged delivery), not as time. Decision 3.

Per rung:
- **0 Site.** Deliverables: pages, copy brief, SEO + GEO (schema, llms.txt), analytics, Core Web Vitals pass, handover. Guarantee idea: 2 correction rounds, delivery on date (GUESS). Upsell: free 20-min « où est l'IA dans votre process ? » at delivery, leads to rung 1.
- **1 Audit.** 3-5 interviews, process map, top 3 automations ranked by hours saved and risk, ROI with stated assumptions, RGPD notes, prototype of #1, 90-day roadmap + restitution. Never call it "Diag Data IA" or imply Bpifrance eligibility. Guarantee idea: refund if no automation with estimated payback under 6 months is found (GUESS). Credit: 100% of express / 50% of full against rung 2 if signed within 60 days (GUESS; Main & Machine credits up to 25%).
- **2 Sprint.** One workflow in production, human-in-the-loop step, log of agent actions (Euthyne angle), eval set of 20-50 cases, runbook, code in client repo, 1 h training. Guarantee idea: « en production en fin de sprint ou je continue sans surfacturer » plus 30 days of bug fixes (GUESS, aggressive). Upsell: retainer or second workflow.
- **3 FDE.** In their Slack/repo/stand-ups, weekly written update with shipped-PR list, backlog ownership, handover docs. Cap 2 concurrent clients. Guarantee: week 1 is a paid trial, stop with no further commitment. Raise to 900+/day after 2-3 named references.
- **4 Retainer.** Monitoring, model/prompt updates, eval re-runs, business-hours incidents, 1-2 improvement days, monthly KPI report. No lock-in after 3 months, 30-day notice, full export.

Cash sequencing (GUESS): weeks 1-2 sell 2-3 audits to warm contacts and past clients; weeks 2-4 convert one to a Sprint; in parallel pitch 15 Bordeaux agencies a white-label test mission. Target 8-12k in 30 days, 20k+ in 60.

## 6. Positioning

### A. Outcome (PME + agencies)
- **Headline:** « Des agents IA qui tournent vraiment en production, pas des démos. »
- **Sub:** « Un premier workflow automatisé en 2 semaines, au forfait, avec le code qui vous appartient. À partir de 4 500 € HT. »
- **Proof:** live client sites and testimonials (Hop Hop Immo, Kenzi, PKBA, VertiFlow; David A., Antoni V., Clément D.). Say exactly what was built per project; do not imply AI agents where there were none.
- **Weakness:** crowded claim, every Bordeaux entrant says "production".

### B. Engineer whose code you can read (trust)
- **Headline:** « Du code que vous pouvez lire avant de signer. » (variant naming Verana/Credo-ts only once cleared, section 8)
- **Sub:** « Sites et agents IA au forfait. Code dans votre repo, journal de chaque action des agents, handover documenté. »
- **Proof:** public PRs and repos linked from offer pages; Euthyne as founder (state its real stage); agent-driven delivery with his own review. All pending section 8.
- **Weakness:** SSI/trust-layer jargon means nothing to a PME dirigeant.

### C. Shared FDE (startups)
- **Headline:** « Un Forward Deployed Engineer à temps partagé pour votre équipe. »
- **Sub:** « Je m'intègre à votre équipe, je livre chaque semaine avec des agents IA, je vous laisse un code propre et traçable. À partir de 3 500 € HT / semaine. »
- **Proof:** weekly shipped-PR list, 1-week paid trial, public commit history. Drop "senior" from the source statement, not defensible at 20.
- **Weakness:** capacity capped at 1-2 clients, "FDE" is jargon in French.

**Recommendation:** B as the brand spine, A's outcome language on the hero and CTA, C as rung 3 inside the ladder. Aim first at ICP 1 and 2 (they can read GitHub); serve ICP 3 through `/agence-ia-bordeaux` with A's language and B as « Pourquoi me faire confiance ». Every claim is a link someone can open on a call. Consistent with the live pivot (« studio web et IA pour startups et équipes tech »), so no rebrand. Depends on section 8 clearances.

Visual direction that supports B (from visual research): editorial/Swiss layout with warm paper `#FAF9F5`, Euthyne-style "proof as artefact" (real deliverables, logs, Lighthouse scores), mono evidence blocks only for the FDE/agent section. Motion: CSS-only by default, at most two Motion islands; Lighthouse >= 95 is itself proof for a studio selling fast sites. Stack base: Next 16 + Tailwind v4 + shadcn/ui + Tailark free blocks (MIT); avoid once-ui magic-portfolio (CC BY-NC).

## 7. SEO / GEO

All volumes are estimates (bands from autocomplete depth and SERP; no GSC/Ahrefs access). Check in GSC/Keyword Planner after launch.

### Keyword targets

| Cluster | Keywords | Est. vol | KD | Note |
|---|---|---|---|---|
| Local money | agence ia bordeaux; consultant/expert ia bordeaux | 50-150; 30-100 | M; L-M | Page one is directories + a templated Toulouse page. Top 3 reachable |
| Local web | création site web bordeaux; refonte site internet bordeaux | 300-800; 50-150 | H; M | Saturated, one solid page only |
| Pricing | prix/tarif agent ia, combien coûte un agent ia; prix landing page | 100-300 each | L-M | Winnable with public prices |
| Audit/aids | audit ia pme, **audit ia bpi**; subvention ia entreprise | 200-500 | M | Explain Diag Data IA honestly |
| Service | automatisation ia pme; agent ia entreprise; ia pour pme | 200-1.5k | M | No Bordeaux variant of "agence n8n/automatisation" yet |
| Category | forward deployed engineer (+ en français) | 300-1k | M | Mostly jobs; no French page explains freelance FDE for PME. Own the definition |
| GEO | référencement chatgpt, geo seo | 300-1k | M | CiteMe co-founder credibility |

**"Développeur embarqué" trap:** in French it means embedded systems (high volume, wrong intent). Never use it as a label, title or slug. Use « développeur IA intégré à votre équipe » or « FDE » in prose.

### URL map

```
/                                   Home (B spine, A hero, 3 offers, proof)
/agence-ia-bordeaux                 Local page: address, GBP, quartiers, local clients, FAQ
/services/audit-ia                  1 500 € HT, section on Diag Data IA (as context, not as provider)
/services/agents-ia                 Sprint IA, price bands
/services/automatisation-ia
/services/developpeur-ia-freelance  FDE rung (not "développeur embarqué")
/services/creation-site-web         900 / 2 900 / custom
/services/geo-referencement-ia      CiteMe link, Hop Hop Immo case (with consent)
/tarifs                             Every price + market ranges (key GEO asset)
/realisations, /realisations/<slug> hop-hop-immo, citeme, kenzi, pkba
/a-propos                           Person + Organization entity page
/forward-deployed-engineer          Definitional page
/blog/<slug>                        Migrated from blog.klyx.fr (decision 5)
/contact                            Resend form + Cal.com embed
/mentions-legales, /confidentialite (missing today)
/llms.txt
```

Note: the SEO file recommends removing or redirecting `studio.klyx.fr` and `estate.klyx.fr` to fix entity consistency. Maxime decided they stay and are linked. Mitigation: present them on klyx.fr as distinct Klyx lines with one sentence each, so the entity description stays coherent. Phase 2 only with real proof: Mérignac/Pessac/sector pages (thin city-swap pages read as doorway spam).

### First 10 articles

1. Combien coûte un agent IA pour une PME en 2026 ? (grille de prix réelle)
2. Audit IA Bpifrance (Diagnostic Data IA) : éligibilité, prix, démarche
3. Comment intégrer l'IA dans une PME : méthode en 4 étapes
4. Forward Deployed Engineer : définition, rôle, et version freelance pour les PME
5. Agent IA vs chatbot vs automatisation : lequel choisir ?
6. n8n, Make ou code sur mesure : quel outil d'automatisation IA pour une PME ?
7. ChatGPT Entreprise, Claude, Mistral : prix, RGPD et confidentialité comparés (update quarterly)
8. Agents IA en entreprise : les risques réels (et comment les cadrer)
9. Être cité par ChatGPT et Perplexity : ce que montrent les données (cas Hop Hop Immo, client consent required)
10. Combien coûte un site internet professionnel en 2026 (et une landing page)

### GEO checklist

First-party CiteMe data (Hop Hop Immo, 90 days, read-only): citation rate ChatGPT 38%, Gemini 32%, Perplexity 23%, Claude 13%, AI Overviews 10%; its domain is the #2 cited host. Cited pages are a proprietary data page (`/barometre`), local pages and `/a-propos`. For Klyx: `/tarifs`, `/agence-ia-bordeaux`, `/a-propos`, later a small « Baromètre IA des PME bordelaises ».

- [ ] robots.txt allows GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot, Google-Extended, Bingbot; check Vercel/Cloudflare bot settings ([Google](https://developers.google.com/search/docs/appearance/ai-features))
- [ ] All content server-rendered; no price/FAQ text behind client JS
- [ ] llms.txt shipped, zero expectations: no measurable effect per [SE Ranking](https://seranking.com/blog/llms-txt/) (~300k domains) and [Search Atlas](https://searchatlas.com/blog/limits-of-llms-txt-for-ai-search-citation-study/)
- [ ] Sitemap with lastmod in GSC and Bing Webmaster Tools (Bing feeds ChatGPT search), IndexNow; add the missing `www` record and a canonical host
- [ ] JSON-LD matching visible text: Organization + ProfessionalService (SIRET, address, areaServed, founder, sameAs), Person on `/a-propos`, Service + Offer with `valueAddedTaxIncluded: false`, FAQPage, BlogPosting, BreadcrumbList; Review only for visible first-party testimonials
- [ ] Answer-first: 2-3 quotable sentences under each H2; H2s phrased as real queries; tables for prices; numbers linked to sources and dated ([GEO paper](https://arxiv.org/abs/2311.09735): citations/stats up to +40% visibility)
- [ ] Byline + bio on every article, honest `dateModified`
- [ ] One canonical description sentence reused everywhere (GBP, Bing Places, Apple Business Connect, LinkedIn, Malt, Pappers)
- [ ] GBP with reviews from every past client (strongest local lever, Local Pack businesses recommended 3.5x more per [Insites](https://insites.com/blog/do-google-reviews-affect-ai-recommendations-yes-heres-by-how-much/))
- [ ] Mentions over backlinks (0.664 vs 0.218 correlation, Ahrefs via [Frase](https://www.frase.io/blog/which-ai-engines-cite-which-sources)): directories (La Fabrique du Net, Sortlist, Codeur, Malt), French Tech Bordeaux, Technowest, CCI, client footers ("site réalisé par Klyx"), CiteMe founder page, AMI list once eligible
- [ ] Create a Klyx project in CiteMe with 20-30 French prompts for a pre-launch baseline; track AI referrers in analytics

## 8. Claims to verify with Maxime

Nothing below goes on the site until checked. Add `TODO(maxime)` in copy wherever one is used.

- [ ] TODO(maxime): can Verana be named publicly, and with what exact role title?
- [ ] TODO(maxime): can 2060.io be named publicly (employer/client)? Same wording question.
- [ ] TODO(maxime): CiteMe wording. Sources say co-founded: write « co-fondateur », never « client ». Recon lists it under Réalisations; decide how it appears there.
- [ ] TODO(maxime): Credo-ts PRs, how many are merged under his handle? Do not write « contributeur Credo-ts » unless merged. Collect PR links.
- [ ] TODO(maxime): "~130 merged PRs per month" on CiteMe: count on GitHub before publishing, and can the repo history be shown?
- [ ] TODO(maxime): testimonials (David A./PKBA, Antoni V./Kenzi, Clément D./Reciproq): consent to reuse on the new site, full names or initials, and willingness to take a reference call?
- [ ] TODO(maxime): what was actually built per project (Hop Hop Immo, Kenzi, PKBA, VertiFlow, Reciproq)? Any AI component, or web only?
- [ ] TODO(maxime): Hop Hop Immo CiteMe numbers (38% ChatGPT, #2 cited host, 563 citations): client consent before a case study or article 9.
- [ ] TODO(maxime): studio.klyx.fr brief names Dataiku, Deezer, Le Pôle Horloger as proof. Real clients of his? Usable on klyx.fr?
- [ ] TODO(maxime): Euthyne, real stage (users, launch status) before any mention.
- [ ] TODO(maxime): CII, do not claim Klyx invoices are eligible unless an accountant confirms the provider rule.
- [ ] TODO(maxime): any number on the site (delivery days, hours saved, client count, Lighthouse scores): source each or drop it.
- [ ] TODO(maxime): 5 700+ custom site tier, confirm it exists.
- [ ] TODO(maxime): SIRET, legal name, address for mentions légales and JSON-LD (template in `klyx-estate/src/app/mentions-legales/page.tsx`).
- [ ] TODO(maxime): funding line, only after transfonum@nouvelle-aquitaine.fr replies.

## 9. Open decisions for Maxime

1. **Homepage audience.** SEO file proposes « Agence IA à Bordeaux pour PME » as the home H1; strategy ranks agencies and startups first. **Recommend:** home speaks to startups/agencies (B spine, A hero); PME and local SEO go to `/agence-ia-bordeaux`.
2. **Visual direction.** A editorial/Swiss vs B warm-craft. **Recommend:** A with B's warm paper `#FAF9F5` and artefact proof; this also replaces the current black + animated gradient brand.
3. **Sprint vs FDE pricing.** Live Sprint IA 4 500 for 2 weeks sits below the proposed 3 500-4 000/week FDE rate. **Recommend:** keep Sprint IA 4 500 as a fixed-scope deliverable (one workflow, not time), publish FDE as « à partir de 700 €/jour » with a 4-week minimum, publish every price on `/tarifs`.
4. **Guarantees.** Options: audit credit, audit refund if nothing found, « en production en fin de sprint ou je continue ». **Recommend:** launch with audit credit (100% express within 60 days) and FDE week-1 trial only; add the delivery guarantee after 2-3 sprints prove the timeline.
5. **Blog and language.** Migrate blog.klyx.fr to `/blog` and decide FR-only vs FR/EN. **Recommend:** migrate with 301s for on-topic posts, noindex or drop the off-topic 2025 posts; launch FR-only but set up next-intl `[locale]` routing from day one (no kit ships i18n).
