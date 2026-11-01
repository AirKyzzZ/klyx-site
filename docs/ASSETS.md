# Assets

Backdrop imagery for the redesign, art direction C "Live System". Files live in `public/backdrop/`.

Since R8b (2026-11-01) the painting is no longer the default. The hero lit frame, the final CTA card and the Bordeaux hero use an abstract backdrop drawn in code (`src/components/backdrop/`, no image file), picked by `NEXT_PUBLIC_HERO_BACKDROP=grid|mesh|flow|painting` at build time, default `grid`. The painting files below stay for `painting` and the case-study band; the comparison is in `docs/design-review/hero-backdrop.md`.

Source for every image below: generated with Google Gemini (image generation in the Gemini app, Maxime's Pro account), 2026-10-31. All were generated in one conversation, so the mobile and band prompts refer back to "the third image" (the chosen hero).

Note: `DESIGN_DIRECTION.md` section 5 says "no AI-generated imagery" and recommends the Vernet painting (option A). These assets were made on Maxime's request as an alternative; keep or drop is his call.

## Hero backdrop, 16:9

Files: `bordeaux-1600.avif`, `bordeaux-1600.webp`, `bordeaux-800.avif`, `bordeaux-800.webp`

Raw: 2752x1536 JPEG. Variants generated: 4, rejected: 3.

- v1 (quays from across the river, near-photographic): rejected, reads as a photo, not a painting.
- v2 (Whistler nocturne, Pont de pierre): rejected, sky too light and grey, hard sun disc.
- v4 (Bourse and Pont de pierre, bloom slightly right of centre): rejected, the bloom and its reflection sit too close to the centre where UI windows float.
- v3: chosen. Dark empty centre, bloom off to the left, quays low right.

Prompt (v3):

> Generate a new image, landscape 16:9: a very dark tonalist oil painting of the Port de la Lune in Bordeaux, the crescent bend of the Garonne seen from a slightly elevated viewpoint on the right bank just after sunset. Loose, broad, visible brushstrokes on canvas, soft edges everywhere, like a 19th-century nocturne. The long curved line of pale stone quay facades sits low in the frame as a faint, blurred band of sand and ochre tones. No sun disc: instead a diffuse, soft burnt orange (#F54E00) light bloom glowing through haze near the horizon on the left, bleeding gently into the sky and reflected on the dark water. Sky and river are deep warm black (#141414) with subtle smoky warm-grey gradients. The central area of the image is calm, dark and nearly featureless. Very low contrast, matte, moody. No text, no letters, no logos, no signature, no people, no boats.

## Mobile backdrop, 9:16

Files: `bordeaux-mobile-800.avif`, `bordeaux-mobile-800.webp`

Raw: 1536x2752 JPEG. Variants generated: 1, rejected: 0.

Prompt:

> Generate a new image in vertical portrait 9:16 aspect ratio: the same scene and exact same painting style as the third image you made (the dark tonalist oil painting of the Port de la Lune crescent of the Garonne in Bordeaux, curved pale stone quays on the right, diffuse burnt orange #F54E00 light bloom through haze, warm black #141414 sky and water, loose broad brushstrokes). Recompose it for a tall phone screen: the horizon, the curving quays and the orange bloom sit in the lower third; the upper half is calm, dark, nearly featureless smoky warm-black sky with very subtle brush texture; dark water at the bottom. Keep the quays softer and dimmer. Very low contrast, matte. No text, no letters, no logos, no signature, no people, no boats.

## Case-study band, 21:9

Files: `band-1600.avif`, `band-1600.webp`

Raw: 1584x672 JPEG (Gemini's 21:9 output is smaller than the other ratios). Variants generated: 1, rejected: 0. The middle band is fairly bright sand, so text over it needs a dark overlay or should sit above/below it.

Prompt:

> Generate a new image, ultra-wide 21:9 aspect ratio: an abstract painted texture band in the same oil painting style as the third image, to be used as a subtle website section background. Broad horizontal brushstrokes of thin oil paint on canvas, like an abstracted close-up of the sky and river haze: muted sand, warm grey and soft ochre tones layered over warm black (#141414), darker toward the top and bottom edges, the brightest sand tones forming a soft horizontal band through the middle third, with only a faint whisper of burnt orange warmth at one end. Even, calm, low contrast, no focal point, no objects, no buildings, no horizon line, matte, visible canvas weave. No text, no letters, no logos, no signature.

## Optimisation

ImageMagick for crop and resize (Lanczos, metadata stripped), `avifenc` 1.4.2 (aom) and `cwebp` 1.6.0 for encoding. No grading applied; the raw colours already match the palette.

| File | Crop / resize | Encoder settings | Size |
|---|---|---|---|
| `bordeaux-1600.avif` | centre crop to 2731x1536 (exact 16:9), resize 1600x900 | `avifenc -q 70 -s 4 -d 10 -y 420` | 31.9 KB |
| `bordeaux-1600.webp` | same | `cwebp -q 82 -m 6 -sharp_yuv` | 20.5 KB |
| `bordeaux-800.avif` | same crop, resize 800x450 | `avifenc -q 75 -s 4 -d 10 -y 420` | 8.9 KB |
| `bordeaux-800.webp` | same | `cwebp -q 82 -m 6 -sharp_yuv` | 7.0 KB |
| `bordeaux-mobile-800.avif` | bottom-anchored crop to 1536x2731 (exact 9:16), resize 800x1422 | `avifenc -q 72 -s 4 -d 10 -y 420` | 18.1 KB |
| `bordeaux-mobile-800.webp` | same | `cwebp -q 82 -m 6 -sharp_yuv` | 13.6 KB |
| `band-1600.avif` | centre crop to 1536x658 (trims painted edge strokes), resize 1600x686 | `avifenc -q 58 -s 4 -d 10 -y 420` | 40.2 KB |
| `band-1600.webp` | same | `cwebp -q 75 -m 6 -sharp_yuv` | 27.0 KB |

10-bit AVIF is used to avoid banding in the dark gradients; a level-stretched check of the decoded 1600 AVIF shows no banding and keeps the canvas weave. Budgets from `DESIGN_DIRECTION.md` (1600w ≤ 70 KB, 800w ≤ 35 KB) are met with room to spare.

## Tool and technology logos

Used in the home section « Vos outils, branchés » (`ToolsSection` with `CONNECTED_TOOLS`), the « Technologies que nous déployons » strip on `/services/agents-ia` and `/services/automatisation-ia` (`DEPLOYED_TECH`), hero workflow nodes in every scenario, and the « Outils » line of four use-case workflow cards. Full placement list: `docs/logos-audit.md`. These are tools Klyx connects or deploys, never clients or partners: every strip carries the footnote « Les marques citées appartiennent à leurs propriétaires respectifs. Klyx n'est ni affilié ni partenaire de ces éditeurs. » and every strip logo sits above its written name in a tile grid, at 24px. In the hero, a tool step shows its mark at 14px and the step's text names the tool. An AI step shows the OpenAI, Claude and Mistral AI marks at 12px (three on desktop, OpenAI and Claude only on mobile) with no visible name: the names are in visually hidden text for screen readers only, the hero carries the « Illustration · scénario type » label, and the names are written out under the marks in the « Technologies que nous déployons » tiles. On the use-case cards the marks are 14px, next to the « Outils » line that names the same brands. The Klyx nav lockup is a 20px mark plus a 17px wordmark; the 24px marks are kept below the 28-32px the review asked for to stay close to it. Credits and the CC BY attribution are shown on `/mentions-legales` (« Crédits », `src/lib/credits.ts`).

Treatment: one neutral monochrome style, `fill="currentColor"` in `--text-2`, no hover effect. No brand colour: section 7 rule 15 (no green or red, no second accent) wins over the brief's optional hover colour. Paths are copied unchanged (no redraw), only the colour is neutralised. Components live in `src/components/logos/` (one file per mark, inline SVG, 0 JS), registry in `tool-logo.tsx`. All files fetched 2026-11-01.

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
