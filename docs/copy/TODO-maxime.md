# TODO(maxime): claims to confirm before launch

No public page shows a `TODO(maxime)` marker any more (controller ruling, 2026-11-01; `e2e/pending-markers.spec.ts` crawls every route and case study in both locales). Each claim below was softened to what is true today, or removed, and still needs your answer before the stronger wording can come back. The only markers left in `messages/*.json` are `home.proof.body` and `home.testimonials.note`, which do not render.

Rows written before the sweep still describe the original claim; the sweep section at the end says what the page shows now.

## Launch blockers

Do not put the site live until each of these is answered and the page updated.

| Page | Key | What is missing |
|---|---|---|
| Mentions légales | `legal.hosting.body` | Host decided (Netlify, 2026-11-01). The page now names Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, United States, contact support@netlify.com, taken from https://www.netlify.com/legal/terms-of-use/ (last updated 14 Oct 2026) and https://www.netlify.com/privacy/ (section 17). Netlify publishes no phone number on either page, and the LCEN asks for one: find a number Netlify accepts being published (or confirm with a lawyer that the support address is enough) before launch |
| Confidentialité | `privacy.hosting.body` | Netlify is now named, with the EU-US Data Privacy Framework: Netlify's DPA (https://www.netlify.com/pdf/netlify-dpa.pdf, version 20260609, section 14.2) says Netlify is certified under the EU-US DPF, with SCCs as fallback. Still open: the transfer mechanism for Resend and Cal.com |
| Mentions légales | `legal.publisher.body`, `legal.publisher.siret` | Registered address and SIRET confirmed |
| Mentions légales | `legal.publisher.vat` (removed) | VAT status unknown, so the line is gone from the page and the machine view. Add the VAT number, or « TVA non applicable, art. 293 B du CGI », back as `legal.publisher.vat` (FR and EN) and render it again in `mentions-legales/page.tsx` and `page-markdown.ts`. If you are on franchise en base, the « HT » wording needs rethinking too |
| Confidentialité | `privacy.contactForm.body` | Retention period for contact form data, confirm before launch |
| Confidentialité | `privacy.analytics.body` | « No analytics, no ad cookies »: confirm before launch, update if PostHog or any tracker is added |
| Confidentialité | `privacy.prospection.sources` | Prospect data sources the outreach system actually uses, confirm before launch |
| Confidentialité | `privacy.prospection.retention` | Prospect data retention period, confirm before launch |
| Home, Sites, Création de site | `src/lib/proof/klyx-lighthouse.json` | Done (2026-11-01): `node scripts/lighthouse.mjs --base https://klyx.fr` ran on the live site (Lighthouse 12.8.2, mobile, median of 3). The file now says `status: "measured"` for https://klyx.fr/ (perf 96 · a11y 100 · BP 100 · SEO 100), so the Sites chip, its « Score Lighthouse réel » caption and the Lighthouse proof card show after the next deploy. Per-page scores in `docs/lighthouse/summary.json`. Re-run after any big change |
| Home tools grid, Agents IA and Automatisation IA strips, every hero with an AI step | `src/lib/tools.ts`, `src/components/logos/claude-logo.tsx`, `claude-code-logo.tsx` | Claude and Claude Code marks ship in monochrome at your decision (2026-11-01), but Anthropic's trademark guidelines ask for prior approval. Send the draft in `docs/sales/anthropic-logo-request.md` to marketing@anthropic.com and keep the answer; drop the two marks if refused |
| Same places, plus use-case workflow cards | all third-party logos in `src/components/logos/` | Lawyer check before launch on the Microsoft (Outlook, Excel, Teams: Fluent icons need a licence), Meta (WhatsApp), Anthropic and OpenAI marks, used nominatively in monochrome. `docs/logos-audit.md` lists every placement and source |
| Réalisations, Création de site, case route | `content/realisations/kenzi.*.mdx` `listed: false` | Kenzi is hidden everywhere (index, home, Sites proof, "projet suivant", sitemap, llms.txt, machine view; `/realisations/kenzi` is a 404) until there is a real write-up and kenzievents.com answers again. To bring it back: write context, what was built and the live URL, recapture the cover after the intro animation, then remove `listed: false` (and `live: false`) |

## Proof and identity

| Page | Key | Claim | What to confirm |
|---|---|---|---|
| Home | `home.founder.experience` | Maxime builds Verana's MCP server and AI agents at 2060.io; co-founded CiteMe (now third person, agency voice) | Can Verana and 2060.io be named, and with what role wording? « cofondé CiteMe » is fine as written? Softened: the home now only says Maxime co-founded CiteMe |
| Home, À propos | `home.founder.roster.items.partners.who` | Team roster lists « partenaires : design, spécialités » | Which specialties partners actually cover (design, motion, legal, data?) and whether you can name any of them. Softened: roster row is now « spécialistes · au cas par cas · si le projet le demande, on vous le dit avant » |
| Home, À propos | `home.faq.items.team.answer`, `about.team.partners` | Partners are brought in when a project needs design or a specialty, and the client is told before signing | How partners are engaged (subcontracted by Klyx, or contracted directly by the client), and whether « partenaires de confiance » holds today. Softened: visible copy is now « si le projet le demande, on s'associe à un spécialiste, et on vous le dit avant » |
| Home, À propos | `home.founder.roster.items.agents`, `about.team.agents`, `home.faq.items.team.answer`, `meta.about.description` | Claude Code agents take scoped tasks and every change is reviewed by Maxime before production | Still how you work; OK to name Claude Code on the site? Softened: visible copy now says « agents de code IA » and « le code qu'ils produisent est relu avant la mise en production », without naming Claude Code or Maxime as the reviewer |
| À propos | `about.story.work` | Same Verana / 2060.io sentence | Same as above. Softened: visible text names neither Verana nor 2060.io (« une infrastructure européenne d'identité numérique ») |
| À propos | `about.story.citeme` | Co-founded CiteMe, tracks brand citations in ChatGPT, Gemini, Perplexity | Wording OK? Marker removed (CiteMe co-founding is already shown on the home products row) |
| Home | `home.proof.body` | Proof artefact next to the hero | Pick a real one: CiteMe PR list (count on GitHub first), Lighthouse score of a live client site, or a real agent run log |
| Home | `home.testimonials.note` | 3 quotes reused verbatim (David A./PKBA, Antoni V./Kenzi, Clément D./Reciproq) | Consent from each client, initials vs full names, willing to take a reference call? Antoni's quote had an em dash, replaced with a comma: OK with him? EN versions are translations: OK? |
| Home, Offres IA, Bordeaux | `home.faq.items.data.answer`, `agents.faq.items.data.answer`, `bordeaux.faq.items.data.answer` | Data goes through a model provider's API (e.g. OpenAI, Anthropic), which by default does not train on API data | Which providers you use by default, and that their API terms still say this. Marker removed from the home FAQ (the sentence only states the providers' public API defaults) |
| Offres IA | `agents.proof.body` | Hoppy (Hop Hop Immo) and CiteMe are "already in production" | What exactly was built on Hoppy, and can Hop Hop Immo be named this way? |
| FDE | `fde.proof.body` | Public commit history, PRs to show | GitHub profile to link; Credo-ts PRs merged under your handle (do not say « contributeur » unless merged); CiteMe PR links |
| Footer, À propos | `footer.studio`, `about.lines.studio` | One sentence on studio.klyx.fr | What studio.klyx.fr sells, in one line. Softened: the keys are removed and only the studio.klyx.fr link renders until you give the sentence (add `footer.studio` and `about.lines.studio` back, FR and EN) |

## Offers and prices

| Page | Key | Claim | What to confirm |
|---|---|---|---|
| Offers, Tarifs | `offers.items.siteCustom.duration` | Custom site duration | Duration, and that the 5 700 € tier exists |
| Sites | `sites.deliverables.tiers.siteCustom.items.todo` | Custom site scope | Typical scope of the tier |
| Offers, Tarifs | `offers.items.retainer.price` | Monthly run price | Price (research suggests from 300 €/month) |
| Offres IA | `agents.deliverables.subtitle` | A Sprint can be bought without the Audit if the scope is already clear | Confirm you sell the Sprint standalone |
| Offres IA | `agents.credit.body` | Audit credited against the Sprint | Exact terms (suggested: 100% if the Sprint is signed within 60 days) |
| Tarifs | `pricing.guarantees.items.credit` | Same credit rule | Same |
| Tarifs | `pricing.market.body` | Freelance AI developer 650-900 €/day, express audit 1 500-2 500 € | Add dated source links (Studeria, Plateya, Malt) or drop the sentence. Sources are secondary and conflicting |

## New service pages (audit, automation, GEO)

Prices come from market research (`pricing-automation-geo.md`, 2026-10-31), not from you. Confirm each price before launch; they live in `src/lib/offers.ts`.

| Page | Key | Claim | What to confirm |
|---|---|---|---|
| Automatisation IA, Tarifs | `offers.ts` `automation` | Confirm price: from 2 400 € HT, one linear workflow (trigger, LLM step, action), 4 to 5 working days | Price and scope |
| Automatisation IA, Tarifs | `offers.ts` `automation-care` | Confirm price: « Suivi » 190 €/month, 3 months minimum, then 30 days' notice | Price, minimum, notice |
| Automatisation IA | `automation.deliverables.subtitle`, `automation.deliverables.tiers.automation.items` | 45-min kickoff, prompt tested on 10 real documents, email alert, 1-page doc + 30-min handover, 14 days of fixes | Package contents (research estimates) |
| Automatisation IA | `automation.deliverables.tiers.sprintIa.items.credit`, `automation.faq.items.upgrade` | Automation price credited 100% against a Sprint IA signed within 60 days | Credit rule (controller ruling) |
| Automatisation IA | `automation.faq.items.tools` | Workflow in the client's n8n/Make account, or n8n self-hosted on a server in the client's name | Hosting option you offer |
| Automatisation IA | `automation.faq.items.runCost` | n8n server 10 to 25 €/month, Make about 30 €, model API 20 to 80 € for small volume (vendor figures, Oct 2026) | Ranges, or drop |
| Automatisation IA | `automation.faq.items.data` | Default model providers | Same question as the agents/home data answers |
| Référencement IA, Tarifs | `offers.ts` `geo` | Confirm price: from 1 200 € HT, 30 queries on 4 AI engines, 5 key pages, 1 article, re-test at D+30, 2 weeks, existing sites only | Price and scope |
| Référencement IA, Tarifs | `offers.ts` `geo-care` | Confirm price: « Suivi GEO » 590 €/month, 3 months minimum | Price, minimum |
| Référencement IA | `geo.deliverables.subtitle` | Same as above | Same |
| Référencement IA | `geo.block.disclosure.body`, `geo.faq.items.citeme.answer` | You co-founded CiteMe and use it for the measurements in this offer | Wording, and that CiteMe is used |
| Référencement IA | `geo.faq.items.platforms.answer` | WordPress, Webflow, Shopify, Next.js supported | Platforms you accept |
| Référencement IA | `geo.block.realData` | Sample report uses fictional values | Swap in Hop Hop Immo numbers only with their consent |
| Audit IA | `audit.block.credit.body`, `audit.faq.items.next.answer` | Audit credited against what follows | Exact terms (suggested: 100% within 60 days) |
| Audit IA | `audit.block.bpifrance.body`, `audit.faq.items.bpifrance.answer` | Diagnostic Data IA: 10 000 € HT, 40% covered, 10 to 2 000 staff (from les-aides.fr, not checked on bpifrance.fr) | Check on bpifrance.fr; Klyx is never presented as an accredited provider |
| Audit IA, Automatisation IA | `offer-pages.ts` `proofLink: null` | No proof section on these two pages: Hoppy is a chatbot, not an audit or automation outcome | Add a real audit/automation case (consented, with numbers), then set `proofSlugs` and `proofLink` and write `audit.proof` / `automation.proof` |
| Audit IA | `audit.block.credit.body`, `audit.deliverables.tiers.automation` | Audit credited against an Automatisation IA: 1 500 € HT deducted from 2 400 € HT, so the client pays 900 € HT for the workflow | Do you credit the full audit against the small offer too, or only against the Sprint IA (4 500)? |
| Audit IA | `audit.faq.items.duration.answer` | Interviews about one hour per person | Matches how you run it? |

## Use-case pages and FAQ (R9, 2026-11-01)

No marker on these pages. The white-label terms are written as proposals agreed in writing with the agency, not as commitments. Confirm or correct each line.

| Page | Key | Claim | What to confirm |
|---|---|---|---|
| Cas d'usage immobilier | `useCases.realEstate.proof.body` | Hoppy is the only real estate case; lead sorting and CRM sync are explicitly "not part of that project" | Is that the right scope for Hoppy? Hop Hop Immo OK with being named here too? |
| Cas d'usage immobilier | `useCases.realEstate.faq.items.portals` | Most portals send leads by email; CRM via API, file import or Make | Matches what you can actually wire up |
| Cas d'usage agences | `useCases.agencies.terms.*`, `faq.items.meetings`, `faq.items.maintenance` | Proposals, set in writing per agency: NDA if wanted, what may mention Klyx agreed case by case, direct contact with the end client decided with the agency, joining meetings if wanted, follow-up by Klyx discussed per project | What you are ready to commit to by default, so the page can state it firmly |
| Cas d'usage agences | `useCases.agencies.terms.items.pricing` | Softened: "public prices are the base, regular volume discussed on the call" | Partner pricing: discount, volume terms, who invoices whom. Not stated on the page until you decide |
| Cas d'usage agences | `useCases.agencies.process.steps.build` | Softened: "a regular progress update, at a pace agreed with you" (weekly removed) | Your actual cadence |
| Cas d'usage agences | `useCases.agencies.faq.items.maintenance` | Monthly follow-up the agency resells | That you offer it in white label |
| Cas d'usage agences | `offer-pages`/`sector-pages` `proof` | PKBA and VertiFlow shown as "sites delivered under our own name" | Same open questions as in the case studies (what is yours) |
| Cas d'usage cabinets | `useCases.services.proof.body` | "No published client case yet" for accounting, law or consulting firms | True as worded |
| Cas d'usage cabinets | `useCases.services.faq.items.secret` | Professional secrecy compatible "if processed in a framework you control" (EU provider, masking) | Wording, ideally reviewed by a lawyer |
| Cas d'usage cabinets | `useCases.services.faq.items.software` | Accounting software via API or file import, else a file to import | Software you have actually integrated |
| FAQ | `faqPage.faq.items.aiAct` | Email triage, invoice extraction and product Q&A are not high-risk under the AI Act; CV screening and credit scoring are; a customer-facing assistant must disclose it is an AI | Check against the AI Act text before relying on it (no dates quoted on purpose) |
| FAQ | `faqPage.faq.items.rgpd`, `continuity`, `expertise` | Data mapping before code, retention set with the client, written handover, onboarding at every delivery | Still how you work |
| Audit IA, FAQ | `audit.faq.items.next.answer` | Softened from "audit price deducted": now "the quote takes the audit you already paid into account, terms written before you sign" | Credit terms, then restore the exact rule |
| Automatisation IA, FAQ | `automation.faq.items.tools.answer` | Softened: the self-hosted n8n option is removed | Whether you offer n8n self-hosted on a server in the client's name |
| Automatisation IA, FAQ | `automation.faq.items.runCost.answer` | Softened: the euro ranges (n8n 10-25 €, Make ~30 €, API 20-80 €) are removed | Ranges you are happy to publish |
| Référencement IA, FAQ | `geo.faq.items.platforms.answer` | Softened: "usually yes", platform list removed, "we check your platform on the call" | Platforms you accept |
| Référencement IA, FAQ | `geo.faq.items.citeme.answer` | Softened: "we use it for the measurements" removed | Whether CiteMe is used for the GEO measurements |

## Sweep of visible markers (R9 fix round 1)

| Page | Key | Now shows | What to confirm |
|---|---|---|---|
| Tarifs, Sites | `offers.items.siteCustom.duration` | « Selon le périmètre » | Duration of the custom site |
| Tarifs, Offres IA | `offers.items.retainer.price` | « Sur devis » | Monthly run price |
| Sites | `sites.deliverables.tiers.siteCustom.items.scope` (was `.todo`) | « Périmètre défini avec vous pendant le brief » | Typical scope |
| Offres IA | `agents.deliverables.subtitle` | "you can stop after any step"; the standalone-Sprint sentence is removed | Whether the Sprint sells without the audit |
| Offres IA, Audit IA, Tarifs | `agents.credit.body`, `audit.block.credit.body`, `pricing.guarantees.items.credit` | "the quote takes the audit you already paid into account, terms written before you sign" | Exact credit rule |
| Offres IA, FDE | `agents.proof.body`, `fde.proof.body` | Marker removed, sentence unchanged | Same as the proof rows above |
| Offres IA, Automatisation IA, Bordeaux | `agents/automation/bordeaux.faq.items.data.answer` | Marker removed; answers state only the providers' public API defaults | Default model providers |
| Audit IA | `audit.block.bpifrance.body`, `audit.faq.items.bpifrance.answer` | Marker removed; the les-aides.fr figures keep their visible dated source line « non vérifié sur bpifrance.fr ». `/faq` now uses `audit.bpifrance` as the Bpifrance entry | Check the figures on bpifrance.fr |
| Automatisation IA, Référencement IA | `automation.deliverables.subtitle`, `geo.deliverables.subtitle` | Marker removed | Prices and package contents (rows above) |
| Référencement IA | `geo.block.realData` | « Valeurs fictives, à titre d'exemple. » | Hop Hop Immo numbers with consent |
| Référencement IA | `geo.block.disclosure.body` | "we tell you so the link is clear"; "we use it for the measurements" removed | Whether CiteMe is used |
| Tarifs | `pricing.market.body`, `pricing.market.card.note`, `pricing.market.card.rows.audit.source` | Marker removed; audit row source reads « Malt » with no link | Dated source link for the audit range, or drop the row |
| Agence IA Bordeaux | `bordeaux.local.body`, `bordeaux.local.card.travel.value` | "where scoping happens, remotely or in a meeting, is decided with you"; travel « À convenir avec vous » | Area and travel |
| Mentions légales | `legal.publisher.body`, `legal.publisher.siret` | Marker removed | Address, SIRET |
| Mentions légales | `legal.publisher.vat` | « Mention TVA : précisée à la mise en ligne. » | VAT statement |
| Mentions légales | `legal.hosting.body` | « Hébergeur : précisé à la mise en ligne. » | Final host |
| Confidentialité | `privacy.hosting.body` | Host named only in the legal notice; DPF or SCCs "depending on the provider" | Host and each transfer mechanism |
| Confidentialité | `privacy.contactForm.body`, `privacy.analytics.body`, `privacy.prospection.sources`, `privacy.prospection.retention` | Marker removed, sentences unchanged | Retention periods, analytics, prospect sources |
| Réalisations (all 5) | `content/realisations/*.mdx` | Pending "what we built / result" notes removed | What is yours on each project, stack, year, figures and testimonials |
| Hop Hop Immo case | `content/realisations/hop-hop-immo.*.mdx` | « L'assistant Hoppy, de la conception à la mise en production. » The « Résultat » section ("no figures until Hop Hop Immo agrees") is removed (R7) | That Klyx did the Hoppy assistant from design to production, and whether Hop Hop Immo agrees to figures |
| Kenzi case | `content/realisations/kenzi.*.mdx` | https://kenzievents.com returned HTTP 500 on 2026-11-01 (R7). « en ligne sur kenzievents.com » is removed and the case has `live: false`, so the page and its machine view render no link to the site. The case text stays | Is the site still live? When it answers 200 again, remove `live: false` |
| Cas d'usage agences | `meta.agencies.description`, `useCases.agencies.hero.titleEmphasis`, `useCases.agencies.card.build`, `useCases.agencies.terms.items.repo` | Softened (R7): « livrés en marque blanche… selon des règles fixées par écrit », h1 « L'IA de vos clients, en marque blanche. », repo line « comme on en convient avec vous » | Same as the agencies terms row above |

## Outreach pages `/pour/agences` and `/pour/startups-sprint-ia` (2026-11-01)

FR only, `noindex, nofollow`, out of the sitemap and llms.txt. Copy lives in `src/lib/outreach-pages.ts`, not in `messages/*.json`.

| Page | Key | What to confirm |
|---|---|---|
| Both | `NEXT_PUBLIC_CAL_URL` | Not set, so every « Réserver 20 minutes » goes to `/contact`. The spec wants one Cal.com event per page (`klyx-agences`, `klyx-startups`) for attribution; the site has one `calUrl` today. Create the events and say whether you want a per-page URL |
| Both | before sending | 5-second test with 5 people per ICP (4 of 5 say what, for whom, next step) |
| Startups | `outreachPages.startups` proof | Shows the Hop Hop Immo (Hoppy) and CiteMe case cards, same as the live `/realisations`. Hoppy naming is still open under `agents.proof.body` |
| Agences | `outreachPages.agencies` terms | White-label terms are written as proposals agreed in writing, same as `/cas-usage/agences`. No paid test mission price exists in `offers.ts`, so the page points to a landing page as a first limited project |

## Local and legal

| Page | Key | Claim | What to confirm |
|---|---|---|---|
| Agence IA Bordeaux | `bordeaux.local.body` | Can meet in person across the metro area and Gironde | Address or area to show (match Google Business Profile), and whether you travel |
| Footer, Mentions légales | `footer.siret` | SIRET 941 572 364 00029 (from `site.ts`), now shown only in the footer and legal pages (removed from the hero and À propos) | Still correct for Klyx |
| Mentions légales | `legal.publisher.siret` | Same SIRET | Same |
| Mentions légales | `legal.publisher.body` | Registered address | Address to publish |
| Mentions légales | `legal.publisher.vat` | VAT statement | Your VAT status. Prices are shown « HT » everywhere: if you are on franchise en base (art. 293 B), the « HT » wording needs rethinking too |
| Mentions légales | `legal.hosting.body` | Now shows « Hébergeur : précisé à la mise en ligne. » (no host named) | Final host, with name, address and phone (LCEN). See launch blockers |
| Confidentialité | `privacy.hosting.body` | Vercel, Resend, Cal.com transfers rely on the EU-US DPF or SCCs | Host, and each provider's transfer mechanism |
| Confidentialité | `privacy.contactForm.body` | Retention of contact form data | Period (suggested: 3 years after last exchange) |
| Confidentialité | `privacy.analytics.body` | No analytics, no ad cookies | Still true at launch; update if PostHog is added |
| Confidentialité | `privacy.prospection.sources` | Prospect data comes from public professional sources (company site, LinkedIn) | Sources the outreach system actually uses |
| Confidentialité | `privacy.prospection.retention` | Prospect data kept 3 years max after last contact | Period |

## Not marked, but worth a glance

These are not flagged inline because they come from your own sales assets or the live site, but they are commitments a prospect can hold you to:

- Discovery call is 20 minutes everywhere (matches `docs/sales/offer-one-pager.md`). Make the Cal.com event match.
- Sprint IA deliverables: human approval step, agent action log, test set, runbook, onboarding (from the strategy ladder, no numbers kept).
- FDE: max 3 days a week per client, « on vise une première PR dès la première semaine », remote by default with on-site possible in Bordeaux. The FDE pages now say « notre lead engineer rejoint votre équipe »: the FDE is you.
- Voice: the site now speaks as an agency (« on » / « nous », « we »). The only named person is Maxime Mansiet, lead engineer. No headcount, photos or partner names anywhere.
- Home FAQ: OpenAI and Anthropic don't train on API data by default (reused from the live FAQ).
- Réalisations copy (`home.cases.subtitle`, `cases.hero.subtitle`, `meta.cases.description`) now only says « sites et produits livrés », with no AI-in-production claim. AI wording only appears where it is flagged (`agents.proof.body`, the Hoppy case study).
- Sprint IA vs FDE answer (`pricing.faq.items.sprintVsFde`) says Klyx reuses building blocks already built. True?
- Bordeaux page: France Num 2026 figures (40% of TPE-PME use AI, 11% automate a task), sourced in `docs/KLYX_STRATEGY.md`.

## Design review round 1 (2026-11-01)

| Page | Key | Now shows | What to confirm |
|---|---|---|---|
| Audit IA | `audit.block.bpifrance` | The Diag Data IA is mentioned with a link to https://www.entreprises.gouv.fr/osez-lia, no figures. That page states 10 000 € HT, 40 % covered by France 2030, 8 days | Whether to put the figures back, citing entreprises.gouv.fr |
| Tarifs | `pricing.market` | The Malt « audit IA express 1 500-2 500 € » row and sentence are removed (no source URL in `docs/KLYX_STRATEGY.md`) | A dated, linkable source if you want the row back |
| Agence IA Bordeaux | `bordeaux.problem.source` | France Num figures now link to the entreprises.gouv.fr press release, which states 40 % and 11 % | Nothing, unless the wording should change |
| Agence IA Bordeaux | `bordeaux.block` | Three new example workflows (wine trade export orders, construction quotes, accounting firm documents), labelled as typical examples | That these are trades you want to target |
| Offres IA | `liveSystem.scenarios.support` | New hero scenario « réponse client » (Zendesk ticket, Notion lookup, human review), fictional values | That you are happy to show Zendesk and Notion there |
| FDE | `fde.proof` (removed) | The empty « code you can read » section is gone. Recent public commits name Verana and 2060.io repos, which are not confirmed for the site | Whether those repos can be shown; then the section can come back with real commits |
| À propos | `src/lib/proof/github-contributions.json` | Contribution graph and total (12 933 in 12 months) from github.com/AirKyzzZ, captured 2026-11-01 by `node scripts/github-contributions.mjs`. The count may include private contributions if your profile shows them | OK to show; rerun the script before launch to refresh |
| À propos | (none) | No portrait yet | A real photo of Maxime for the hero or lead engineer section |
| Réalisations (all cases) | `content/realisations/*.mdx` | Each case shows « Résultat : pas encore de chiffre publié » | For every case: 2 lines of context, 3 bullets of what was built, a second screen, and an honest outcome line |

## Design review round 2 (2026-11-01)

| Page | Key | Now shows | What to confirm |
|---|---|---|---|
| Hop Hop Immo case | `content/realisations/hop-hop-immo.*.mdx` | Context, the approved « what we built » line, what a visitor sees on hophopimmo.com today (Hoppy button, assistant page, voice or text, ElevenLabs consent), stack seen on the live site (Next.js, ElevenLabs, OpenStreetMap map) and three screenshots taken 2026-11-01 | What Klyx built beyond « the assistant » (retrieval over the programme feed? map search? handoff to an agent?), one real Hoppy exchange you are allowed to publish, and any figure the client accepts to share. Also confirm ElevenLabs belongs in the case stack |
| Création de site web | `sites.block` (hidden) | The « sites en ligne » proof block no longer repeats VertiFlow; it only comes back with a measured klyx.fr Lighthouse score. Lighthouse 12.8.2 mobile, median of 3, run by Klyx on 2026-11-01 ~13:00 UTC: vertiflow.fr perf 87 · a11y 96 · BP 96 · SEO 100 · LCP 3.7 s · CLS 0; pkba.vertiflow.fr perf 76 · a11y 83 · BP 79 · SEO 100 · LCP 5.5 s · CLS 0 | Whether to publish these client scores (PKBA would need a perf pass first) |
| Réalisations | `pkba`, `vertiflow` | PKBA lives on a VertiFlow subdomain; the copy says « sites livrés pour des clients » | That PKBA and VertiFlow are two separate clients, or a word in each case explaining the link |
| À propos / home | `about.contributions.caption` | Contribution graph now in the à propos hero and under team.yml on home | Whether the 12 933 total includes private contributions (the public page does not say); add it to the caption if so |
| À propos | `site.sisterSites` | studio.klyx.fr still has no description | One sentence for studio.klyx.fr |
| Offres IA | `agents.hero.anchor` | Hero eyebrow « Audit 1 500 € HT · Sprint 4 500 € HT »; the duplicate « Prix » section is gone (prices stay in Offres and on /tarifs) | OK |
| CTA (every page) | `home.process.call` | The final CTA now holds the sample agenda window (lun. 2 to mer. 4, 11:00 lit) with « Réserver un appel » inside it, labelled « Exemple » | OK to show sample slots there |
