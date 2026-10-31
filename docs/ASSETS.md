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
