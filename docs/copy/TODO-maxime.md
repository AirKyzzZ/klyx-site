# TODO(maxime): claims to confirm before launch

Every `TODO(maxime)` in `messages/fr.json` and `messages/en.json` (same keys in both files). Each one renders visibly on the site until you resolve it: confirm and delete the marker, rewrite, or drop the sentence.

Exception: the home page, À propos, the use-case pages (`/cas-usage/*`) and `/faq` show no `TODO(maxime)` marker (review of 2026-11-01). There, the visible sentence was softened to what is true today or removed; the rows below marked « softened » still need your answer before the stronger wording can come back.

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

No marker on these pages: the visible copy says only what is safe today. Confirm or correct each line.

| Page | Key | Claim | What to confirm |
|---|---|---|---|
| Cas d'usage immobilier | `useCases.realEstate.proof.body` | Hoppy is the only real estate case; lead sorting and CRM sync are explicitly "not part of that project" | Is that the right scope for Hoppy? Hop Hop Immo OK with being named here too? |
| Cas d'usage immobilier | `useCases.realEstate.faq.items.portals` | Most portals send leads by email; CRM via API, file import or Make | Matches what you can actually wire up |
| Cas d'usage agences | `useCases.agencies.terms.items` | NDA on request, no Klyx mention anywhere, never contact the end client, code in agency/client repo, written handover | Each commitment, and whether you accept being introduced as a member of the agency's team (`faq.items.meetings`) |
| Cas d'usage agences | `useCases.agencies.terms.items.pricing` | Softened: "public prices are the base, regular volume discussed on the call" | Partner pricing: discount, volume terms, who invoices whom. Not stated on the page until you decide |
| Cas d'usage agences | `useCases.agencies.process.steps.build` | Weekly progress update, work in the agency's tools | Still how you work |
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

## Local and legal

| Page | Key | Claim | What to confirm |
|---|---|---|---|
| Agence IA Bordeaux | `bordeaux.local.body` | Can meet in person across the metro area and Gironde | Address or area to show (match Google Business Profile), and whether you travel |
| Footer, Mentions légales | `footer.siret` | SIRET 941 572 364 00029 (from `site.ts`), now shown only in the footer and legal pages (removed from the hero and À propos) | Still correct for Klyx |
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
- FDE: max 3 days a week per client, « on vise une première PR dès la première semaine », remote by default with on-site possible in Bordeaux. The FDE pages now say « notre lead engineer rejoint votre équipe »: the FDE is you.
- Voice: the site now speaks as an agency (« on » / « nous », « we »). The only named person is Maxime Mansiet, lead engineer. No headcount, photos or partner names anywhere.
- Home FAQ: OpenAI and Anthropic don't train on API data by default (reused from the live FAQ).
- Réalisations copy (`home.cases.subtitle`, `cases.hero.subtitle`, `meta.cases.description`) now only says « sites et produits livrés », with no AI-in-production claim. AI wording only appears where it is flagged (`agents.proof.body`, the Hoppy case study).
- Sprint IA vs FDE answer (`pricing.faq.items.sprintVsFde`) says Klyx reuses building blocks already built. True?
- Bordeaux page: France Num 2026 figures (40% of TPE-PME use AI, 11% automate a task), sourced in `docs/KLYX_STRATEGY.md`.
