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
