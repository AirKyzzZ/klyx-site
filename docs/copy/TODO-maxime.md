# TODO(maxime): claims to confirm before launch

Every `TODO(maxime)` in `messages/fr.json` and `messages/en.json` (same keys in both files). Each one renders visibly on the site until you resolve it: confirm and delete the marker, rewrite, or drop the sentence.

## Proof and identity

| Page | Key | Claim | What to confirm |
|---|---|---|---|
| Home | `home.founder.experience` | Builds Verana's MCP server and AI agents at 2060.io; co-founded CiteMe | Can Verana and 2060.io be named, and with what role wording? « cofondé CiteMe » is fine as written? |
| À propos | `about.story.work` | Same Verana / 2060.io sentence | Same as above |
| À propos | `about.story.citeme` | Co-founded CiteMe, tracks brand citations in ChatGPT, Gemini, Perplexity | Wording OK? |
| Home | `home.proof.body` | Proof artefact next to the hero | Pick a real one: CiteMe PR list (count on GitHub first), Lighthouse score of a live client site, or a real agent run log |
| Home | `home.testimonials.note` | 3 quotes reused verbatim (David A./PKBA, Antoni V./Kenzi, Clément D./Reciproq) | Consent from each client, initials vs full names, willing to take a reference call? Antoni's quote had an em dash, replaced with a comma: OK with him? EN versions are translations: OK? |
| Home, Offres IA, Bordeaux | `home.faq.items.data.answer`, `agents.faq.items.data.answer`, `bordeaux.faq.items.data.answer` | Data goes through a model provider's API (e.g. OpenAI, Anthropic), which by default does not train on API data | Which providers you use by default, and that their API terms still say this |
| Offres IA | `agents.proof.body` | Hoppy (Hop Hop Immo) and CiteMe are "already in production" | What exactly was built on Hoppy, and can Hop Hop Immo be named this way? |
| FDE | `fde.proof.body` | Public commit history, PRs to show | GitHub profile to link; Credo-ts PRs merged under your handle (do not say « contributeur » unless merged); CiteMe PR links |
| Footer, À propos | `footer.studio`, `about.lines.studio` | One sentence on studio.klyx.fr | What studio.klyx.fr sells, in one line |

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

## Local and legal

| Page | Key | Claim | What to confirm |
|---|---|---|---|
| Agence IA Bordeaux | `bordeaux.local.body` | Can meet in person across the metro area and Gironde | Address or area to show (match Google Business Profile), and whether you travel |
| À propos | `about.facts.items.siret.value` | SIRET 941 572 364 00029 (from `site.ts`) | Still correct for Klyx |
| Mentions légales | `legal.publisher.siret` | Same SIRET | Same |
| Mentions légales | `legal.publisher.body` | Registered address | Address to publish |
| Mentions légales | `legal.publisher.vat` | VAT statement | Your VAT status. Prices are shown « HT » everywhere: if you are on franchise en base (art. 293 B), the « HT » wording needs rethinking too |
| Mentions légales | `legal.hosting.body` | Host is Vercel Inc. | Final host (MIGRATION.md recommends Vercel Pro) |
| Confidentialité | `privacy.hosting.body` | Vercel, Resend, Cal.com transfers rely on the EU-US DPF or SCCs | Host, and each provider's transfer mechanism |
| Confidentialité | `privacy.contactForm.body` | Retention of contact form data | Period (suggested: 3 years after last exchange) |
| Confidentialité | `privacy.analytics.body` | No analytics, no ad cookies | Still true at launch; update if PostHog is added |
| Confidentialité | `privacy.prospection.sources` | Prospect data comes from public professional sources (company site, LinkedIn) | Sources the outreach system actually uses |
| Confidentialité | `privacy.prospection.retention` | Prospect data kept 3 years max after last contact | Period |

## Not marked, but worth a glance

These are not flagged inline because they come from your own sales assets or the live site, but they are commitments a prospect can hold you to:

- Discovery call is 20 minutes everywhere (matches `docs/sales/offer-one-pager.md`). Make the Cal.com event match.
- Sprint IA deliverables: human approval step, agent action log, test set, runbook, onboarding (from the strategy ladder, no numbers kept).
- FDE: max 3 days a week per client, « je vise une première PR dès la première semaine », remote by default with on-site possible in Bordeaux.
- Home FAQ: OpenAI and Anthropic don't train on API data by default (reused from the live FAQ).
- Réalisations copy (`home.cases.subtitle`, `cases.hero.subtitle`, `meta.cases.description`) now only says « sites et produits livrés », with no AI-in-production claim. AI wording only appears where it is flagged (`agents.proof.body`, the Hoppy case study).
- Sprint IA vs FDE answer (`pricing.faq.items.sprintVsFde`) says you reuse building blocks you've already built. True?
- Bordeaux page: France Num 2026 figures (40% of TPE-PME use AI, 11% automate a task), sourced in `docs/KLYX_STRATEGY.md`.
