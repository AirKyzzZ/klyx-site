# Assets

Backdrop imagery for the redesign, art direction C "Live System". Files live in `public/backdrop/`.

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

Used in the home section « Vos outils, branchés » (`ToolsSection` with `CONNECTED_TOOLS`), the « Technologies que nous déployons » strip on `/services/agents-ia` and `/services/automatisation-ia` (`DEPLOYED_TECH`), and three hero nodes. These are tools Klyx connects or deploys, never clients or partners: every strip carries the footnote « Les marques citées appartiennent à leurs propriétaires respectifs. Klyx n'est ni affilié ni partenaire de ces éditeurs. » and every logo sits above its written name in a tile grid, at 24px (14px in hero nodes). The Klyx nav lockup is a 20px mark plus a 17px wordmark; the 24px marks are kept below the 28-32px the review asked for to stay close to it. Credits and the CC BY attribution are shown on `/mentions-legales` (« Crédits », `src/lib/credits.ts`).

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

Text only (no logo shipped): Outlook, Excel, Microsoft Teams (Microsoft logos need a licence), Pipedrive, Pennylane and Qonto (no public SVG kit), Claude and Claude Code (Anthropic needs written approval), OpenAI (until Maxime checks https://openai.com/brand), NanoClaw (PNG only, no redraw), Attio (official kit only in black, no recolour allowed, dropped). Zapier not shown. Not legal advice: have the strips reviewed before launch, especially Microsoft and Meta.
