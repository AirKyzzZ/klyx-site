# Assets

Backdrop imagery from the "Live System" art direction. Only the case-study band is still used (`.case-stage` in `src/components/ui-kit/ui-kit.css`). Files live in `public/backdrop/`.

Source: generated with Google Gemini (image generation in the Gemini app, Maxime's Pro account), 2026-10-31. The band was generated in the same conversation as the old hero painting (since removed), so its prompt refers back to "the third image".

Note: `DESIGN_DIRECTION.md` section 5 says "no AI-generated imagery" and recommends the Vernet painting (option A). These assets were made on Maxime's request as an alternative; keep or drop is his call.

## Case-study band, 21:9

Files: `band-1600.avif`, `band-1600.webp`

Raw: 1584x672 JPEG (Gemini's 21:9 output is smaller than the other ratios). Variants generated: 1, rejected: 0. The middle band is fairly bright sand, so text over it needs a dark overlay or should sit above/below it.

Prompt:

> Generate a new image, ultra-wide 21:9 aspect ratio: an abstract painted texture band in the same oil painting style as the third image, to be used as a subtle website section background. Broad horizontal brushstrokes of thin oil paint on canvas, like an abstracted close-up of the sky and river haze: muted sand, warm grey and soft ochre tones layered over warm black (#141414), darker toward the top and bottom edges, the brightest sand tones forming a soft horizontal band through the middle third, with only a faint whisper of burnt orange warmth at one end. Even, calm, low contrast, no focal point, no objects, no buildings, no horizon line, matte, visible canvas weave. No text, no letters, no logos, no signature.

## Optimisation

ImageMagick for crop and resize (Lanczos, metadata stripped), `avifenc` 1.4.2 (aom) and `cwebp` 1.6.0 for encoding. No grading applied; the raw colours already match the palette.

| File | Crop / resize | Encoder settings | Size |
|---|---|---|---|
| `band-1600.avif` | centre crop to 1536x658 (trims painted edge strokes), resize 1600x686 | `avifenc -q 58 -s 4 -d 10 -y 420` | 40.2 KB |
| `band-1600.webp` | same | `cwebp -q 75 -m 6 -sharp_yuv` | 27.0 KB |

10-bit AVIF is used to avoid banding in the dark gradients; a level-stretched check of the decoded 1600 AVIF shows no banding and keeps the canvas weave. Budgets from `DESIGN_DIRECTION.md` (1600w ≤ 70 KB, 800w ≤ 35 KB) are met with room to spare.

## Tool and technology logos

Used in the home strip « Fonctionne avec les outils que vous avez déjà » (`ToolsStrip` with `HOME_TOOLS`, a subset of `CONNECTED_TOOLS`), the « Technologies que nous déployons » strip on `/services/agents-ia` and `/services/automatisation-ia` (`ToolsStrip` with `DEPLOYED_TECH`), the floating tiles of the home hero (`ConstellationBackdrop`), the use-case flow rows (`FlowRow`), the offer and method illustrations, and the models footer of `TrustGrid`. These are tools Klyx connects or deploys, never clients or partners: the deployed-tech strip carries the footnote « Les marques citées appartiennent à leurs propriétaires. Klyx n'est ni affilié ni partenaire de ces éditeurs. » and every strip logo sits next to its written name. Credits and the CC BY attribution are shown on `/mentions-legales` (« Crédits », `src/lib/credits.ts`).

Treatment since the Figma redesign (2026-11-23): brand colours from `src/components/logos/brand-colors.ts`, marks without an entry fall back to the text colour. Tiles (`LogoTile`) are white in both themes; strips draw the glyph at 20px without a tile. Paths are copied unchanged (no redraw). Components live in `src/components/logos/` (one file per mark, inline SVG, 0 JS), registry in `tool-logo.tsx`. All files fetched 2026-11-01.

| Mark | File | Source | Licence | Brand rules |
|---|---|---|---|---|
| Gmail | `gmail-logo.tsx` | Simple Icons v16.36.0, https://simpleicons.org/?q=gmail | CC0 (path data); mark owned by Google | Google brand resource center; no endorsement implied |
| Google Sheets | `google-sheets-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by Google | as above |
| Notion | `notion-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by Notion Labs | none published |
| Airtable | `airtable-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by Airtable | none published |
| HubSpot | `hubspot-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by HubSpot | https://www.hubspot.com/style-guide |
| Slack | `slack-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by Salesforce | https://slack.com/brand-guidelines, integration reference only, revocable |
| WhatsApp | `whatsapp-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by Meta | https://about.meta.com/brand/resources/whatsapp/whatsapp-brand, name written « WhatsApp Business » |
| Shopify | `shopify-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by Shopify | https://www.shopify.com/brand-assets |
| WordPress | `wordpress-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by WordPress Foundation | https://wordpressfoundation.org/trademark-policy/, no endorsement implied |
| Stripe | `stripe-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by Stripe | https://stripe.com/newsroom/brand-assets |
| Make | `make-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by Celonis (Make) | https://www.make.com/en/press |
| n8n | `n8n-logo.tsx` | Simple Icons v16.36.0 (sourced from n8n.io/press) | CC0; mark owned by n8n GmbH | https://guidelines.n8n.design/logo, mono allowed |
| Mistral AI | `mistral-ai-logo.tsx` | Simple Icons v16.36.0 | CC0; mark owned by Mistral AI | https://mistral.ai/brand: monochrome allowed, clear space, no distortion. The official zip returned 403 to scripts; swap in the kit file once downloaded by hand |
| MCP | `mcp-logo.tsx` | symbol paths from `docs/logo/dark.svg`, https://github.com/modelcontextprotocol/modelcontextprotocol | CC-BY-4.0. Attribution: « Model Context Protocol logo by the Model Context Protocol project, CC BY 4.0 » | symbol only (wordmark replaced by the written name) |
| OpenClaw | `openclaw-logo.tsx` | https://openclaw.ai/favicon.svg (site mascot), repo https://github.com/openclaw/openclaw (MIT) | MIT repo, no brand kit found | recolour to monochrome: red gradient flattened to `currentColor`, eyes kept as cut-outs; legible at 24px; no rule found either way, flag to Maxime |
| Hermes Agent | `public/logos/hermes-agent.webp` (95x96 lossless, 2.9 KB) | official white variant `assets/nous-girl-white.svg`, https://github.com/NousResearch/hermes-agent | MIT repo, no brand guidelines found | white-on-transparent artwork used as a CSS mask filled with `currentColor`, so it sits in the monochrome system without redrawing; rasterised because the SVG is 140 KB |
| Outlook | `outlook-logo.tsx` | Simple Icons v12.4.0 (last version before removal), path from Microsoft's Fluent UI product icons, https://developer.microsoft.com/en-us/fluentui | Fluent UI assets licence https://aka.ms/fluentui-assets-license; mark owned by Microsoft | https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks: logos need a licence. **Risk, see below** |
| Excel | `excel-logo.tsx` | same as Outlook | same | same |
| Microsoft Teams | `microsoft-teams-logo.tsx` | same as Outlook | same | same |
| Pipedrive | `pipedrive-logo.tsx` | the « p » glyph of the inline wordmark SVG on https://www.pipedrive.com/en (header logo), path copied unchanged; no press kit found (press-kit and brand URLs 404) | mark owned by Pipedrive | none found. Extracting one glyph of the wordmark is our choice, flag if Pipedrive objects |
| Pennylane | `pennylane-logo.tsx` | symbol (ring and two lenses) of the inline logo SVG on https://www.pennylane.com/fr, paths copied unchanged; the green lens is drawn in `currentColor` at 55 % opacity | mark owned by Pennylane | no press kit found (press URLs 404) |
| Qonto | `qonto-logo.tsx` | the « Q » of the official wordmark `logo-*.svg` linked from https://qonto.com/en/press/kit, paths copied unchanged | mark owned by Qonto | press kit page, no written rules found |
| Claude | `claude-logo.tsx` | Simple Icons v16.36.0 (source claude.ai) | CC0 path; mark owned by Anthropic | https://www.anthropic.com/legal/trademark-guidelines: prior approval, no colour change. **Risk, see below** |
| Claude Code | `claude-code-logo.tsx` | Simple Icons v16.36.0 | CC0 path; mark owned by Anthropic | same as Claude |
| OpenAI | `openai-logo.tsx` | Simple Icons v15.22.0 (removed in v16), source https://openai.com/brand | CC0 path; mark owned by OpenAI | https://openai.com/brand (page returns 403 to scripts, not read): no implied partnership, not larger than our brand. Also used for the « ChatGPT » GEO node |
| NanoClaw | `nanoclaw-logo.tsx` | potrace 1.16 trace of `assets/nanoclaw-icon.png`, https://github.com/nanocoai/nanoclaw (only PNGs exist): the teal fill regions traced as one path, outlines left as gaps, so it is a faithful monochrome of the official mascot, not a redraw | MIT repo, no brand kit | none found. Monochrome trace accepted by Maxime on 2026-11-01 |
| Google Gemini | `google-gemini-logo.tsx` | Simple Icons v16.36.0 | CC0 path; mark owned by Google | Google brand resource center. Only on the GEO « Gemini » node, whose text names it; dropped from the AI-step cluster because the monochrome sparkle does not read as Gemini at 12px |
| Google | `google-logo.tsx` | Simple Icons v16.36.0 | CC0 path; mark owned by Google | https://about.google/brand-resource-center/brand-elements/. Used for « AI Overview » and « Agenda Google » |
| Perplexity | `perplexity-logo.tsx` | Simple Icons v16.36.0 | CC0 path; mark owned by Perplexity AI | none published |
| Zendesk | `zendesk-logo.tsx` | Simple Icons v16.36.0 | CC0 path; mark owned by Zendesk | https://brandland.zendesk.com |
| Git | `git-logo.tsx` | Simple Icons v16.36.0, from https://git-scm.com/community/logos | CC BY 3.0, Jason Long (credited on `/mentions-legales`) | attribution |
| Next.js | `nextjs-logo.tsx` | Simple Icons v16.36.0 | CC0 path; mark owned by Vercel | https://vercel.com/design/brands#next-js |
| Lighthouse | `lighthouse-logo.tsx` | Simple Icons v16.36.0 (Lighthouse repo favicon) | CC0 path; Apache-2.0 repo | none |
| Figma | `figma-logo.tsx` | Simple Icons v16.36.0 | CC0 path; mark owned by Figma | https://www.figma.com/using-the-figma-brand/ |
| GitHub | `github-logo.tsx` | Simple Icons v16.36.0 | CC0 path; mark owned by GitHub | https://github.com/logos |

No tile is text only any more. Not shipped: Attio (not displayed anywhere since R7; official kit forbids recolouring), Zapier (not shown).

Risk, decided by Maxime on 2026-11-01 (« Add all, monochrome, log risk »): Microsoft and Anthropic require a licence or prior approval for their logos; they are used nominatively in monochrome at Maxime's decision on 2026-11-01. OpenAI and Meta marks follow the same nominative use. Launch blockers in `docs/copy/TODO-maxime.md`: approval request to marketing@anthropic.com (draft in `docs/sales/anthropic-logo-request.md`, not sent) and a lawyer check of the Microsoft, Meta, Anthropic and OpenAI marks before launch. Not legal advice.
