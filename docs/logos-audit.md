# Logo audit (R8b, 2026-11-01)

Every place a third-party tool could show a logo, what it shows now, and why. Sources and licences per mark are in `docs/ASSETS.md`; risk rows are in `docs/copy/TODO-maxime.md` (launch blockers). Maxime's ruling on 2026-11-01, « Add all, monochrome, log risk », overrides the earlier text-only decisions for Microsoft, Anthropic, OpenAI, Pipedrive, Pennylane, Qonto and NanoClaw.

All marks are monochrome `currentColor` and decorative (`aria-hidden`). In the strips (24px) each mark sits above its written name, under the « marques citées » footnote. In the hero, a tool step's mark (14px) sits next to text that names the tool. An AI step's model marks (12px) have no visible name: the hero is labelled « Illustration · scénario type », the names are in visually hidden text for screen readers, and they are written out in the « Technologies que nous déployons » tiles.

## Placements

| Placement | Item | Shows | Reason |
|---|---|---|---|
| Home « Vos outils, branchés » | Gmail, Google Sheets, Notion, Airtable, HubSpot, Slack, WhatsApp Business, WordPress, Shopify, Stripe, n8n, Make | logo, 24px | unchanged |
| same | Outlook, Excel, Microsoft Teams | logo, 24px (new) | Fluent product icon paths, Maxime's ruling; licence risk logged |
| same | Pipedrive, Pennylane, Qonto | logo, 24px (new) | symbol taken from each vendor's own site logo SVG |
| « Technologies que nous déployons » (`/services/agents-ia`, `/services/automatisation-ia`, EN twins) | Hermes Agent, OpenClaw, Mistral AI, n8n, MCP | logo, 24px | unchanged |
| same | Claude, Claude Code | logo, 24px (new) | Simple Icons; Anthropic approval requested (draft email), logged as blocker |
| same | OpenAI | logo, 24px (new) | Simple Icons 15.22.0; brand page not readable by script, nominative use |
| same | NanoClaw | logo, 24px (new) | faithful potrace of the official PNG icon, accepted by Maxime |
| Hero, agents « tri des demandes » | Email reçu (Gmail), CRM (HubSpot), Slack, Hors lead (Notion) | logo | unchanged |
| same | L'IA le trie | OpenAI, Claude, Mistral AI marks at 12px (new; OpenAI and Claude only on mobile) | AI step; was a generic funnel |
| Hero, support « réponse client » | Ticket reçu (Zendesk) | Zendesk (new) | step names the tool |
| same | L'IA cherche (Notion) | Notion | step names the tool; kept over the model cluster |
| same | Brouillon prêt (modèle IA) | model cluster (new) | AI step |
| same | Votre accord, Envoyée | generic icon | no tool named |
| Hero, sites « mise en ligne » | Mise à jour (git push), Site compilé (next build), Vitesse testée (lighthouse) | Git, Next.js, Lighthouse (new) | steps name the tools |
| same | Mis en ligne (klyx.fr), Prêt pour l'IA (llms.txt) | generic icon | a domain and a file, not tools |
| Hero, FDE « ENG-142 » | Votre code (dépôt git) | Git (new) | step names git |
| same | Dev + agent IA | model cluster (new) | AI step |
| same | Demande, Correctif (PR #87), Relecture, Livré | generic icon | no tool named (no GitHub/Linear in the copy) |
| Hero, audit | Entretiens, Vos process, Tri par gain, Plan d'action | generic icon | human/consulting steps, no tool or AI named |
| Hero, automatisation « factures fournisseurs » | Facture reçue (Outlook) | Outlook (new) | step names the tool |
| same | L'IA la lit | model cluster (new) | AI step |
| same | Google Sheets | Google Sheets | unchanged |
| same | Votre accord, Envoyée (email) | generic icon | no tool named |
| Hero, GEO « visibilité IA » | ChatGPT, Perplexity, Gemini, AI Overview | OpenAI, Perplexity, Gemini, Google (new) | each node is the engine |
| same | Questions, Cité ou pas ?, Rapport | generic icon | no tool named |
| Hero, immobilier | Bien identifié (IA · fiche T3) | model cluster (new) | AI step |
| same | Lead portail, Visite calée, CRM à jour, Hors cible | generic icon | the copy names no tool (« e-mail », « contact ») |
| Hero, agences | Intégration (Next.js) | Next.js (new) | step names the tool |
| same | Maquette, Recette, En ligne, Prêt pour l'IA | generic icon | no tool named |
| Hero, cabinets « pièces d'un dossier » | L'IA la lit | model cluster (new) | AI step |
| same | Pièce reçue, Saisie compta, Collaborateur, Client relancé | generic icon | no tool named (« logiciel compta » is generic) |
| Use cases, immobilier, workflow « visites » (« Outils » line) | Agenda Google ou Outlook | Google, Outlook 14px (new) | named brands in a tool list |
| Use cases, agences, workflow « leads » | HubSpot ou Pipedrive | HubSpot, Pipedrive 14px (new) | same |
| Use cases, agences, workflow « site » | Figma, GitHub | Figma, GitHub 14px (new) | same |
| Use cases, cabinets, workflow « tri » | Outlook ou Gmail | Outlook, Gmail 14px (new) | same |
| Other use-case « Outils » lines | « Site, fiches des biens, CRM », « Boîte mail ou GED », … | text | generic categories, no brand |
| Offer pages, prose (FAQ answers, deliverable bullets, problem symptoms: ChatGPT, n8n ou Make, Next.js ou WordPress, OpenAI, Slack…) | text | text | running sentences; a mark inside a sentence reads as an endorsement badge and breaks the measure. The same brands carry a logo in the strips and heroes on those pages |
| Home FAQ « stack », À propos facts, Bordeaux, GEO titles | text | text | prose and headings |
| Machine view (`/md/*`) | names | text | markdown has no images by design |

The model cluster is static (no rotation): section 2.1 of `DESIGN_DIRECTION.md` forbids decorative loops, and a static cluster also covers reduced motion without a second state. Desktop: a 32px tile with OpenAI and Claude on top and Mistral AI under them, 12px each. Mobile: OpenAI and Claude at 12px in a 26x24 slot. Gemini was dropped from the cluster: in one colour its sparkle reads as a generic "AI" star at 12px, not as Gemini. It stays on the GEO « Gemini » node, where the text names it.

## Logos added

Outlook, Excel, Microsoft Teams, Pipedrive, Pennylane, Qonto, Claude, Claude Code, OpenAI, NanoClaw, Google Gemini, Google, Perplexity, Zendesk, Git, Next.js, Lighthouse, Figma, GitHub (19 files in `src/components/logos/`, inline SVG, 0 JS).

## Not sourced

- Official vector kits for Pipedrive and Pennylane: their press and brand URLs return 404 to scripts, so the marks come from the logo SVG inlined on each homepage (paths copied unchanged). Swap in kit files if Maxime downloads them.
- Mistral AI official zip: still 403 to scripts (unchanged from R7, Simple Icons path in use).
- OpenAI brand page https://openai.com/brand: 403 to scripts, rules not read first-hand. Used per Maxime's ruling.
- Microsoft: no first-party SVG download without accepting a licence; the Fluent product icon paths come via Simple Icons 12.4.0. Licence not obtained.
- Anthropic: no public kit; approval email drafted, not sent.
- Attio: not on any page, not added.
