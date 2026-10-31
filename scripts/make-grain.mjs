import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SIZE = 128;
const MAX_BYTES = 3 * 1024;

const TILES = [
  { file: "grain.png", light: { above: 0.5, alpha: 12 }, dark: null },
  {
    file: "grain-sand.png",
    light: { above: 0.88, alpha: 12 },
    dark: { below: 0.25, alpha: 13 },
  },
];

const noiseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <filter id="n" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>`;

const { data, info } = await sharp(Buffer.from(noiseSvg))
  .raw()
  .toBuffer({ resolveWithObject: true });

const values = Array.from(
  { length: SIZE * SIZE },
  (_, i) => data[i * info.channels],
);
const sorted = [...values].sort((a, b) => a - b);
const quantile = (q) => sorted[Math.floor(sorted.length * q)];

for (const tile of TILES) {
  const output = new URL(`../public/textures/${tile.file}`, import.meta.url);
  const lightAbove = quantile(tile.light.above);
  const darkBelow = tile.dark ? quantile(tile.dark.below) : -1;

  const rgba = Buffer.alloc(SIZE * SIZE * 4, 0);
  values.forEach((value, i) => {
    if (value > lightAbove) {
      rgba.fill(255, i * 4, i * 4 + 3);
      rgba[i * 4 + 3] = tile.light.alpha;
    }
    if (tile.dark && value < darkBelow) rgba[i * 4 + 3] = tile.dark.alpha;
  });

  mkdirSync(new URL(".", output), { recursive: true });
  await sharp(rgba, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .png({
      palette: true,
      colours: tile.dark ? 3 : 2,
      compressionLevel: 9,
      effort: 10,
    })
    .toFile(output.pathname);

  const bytes = statSync(output).size;
  if (bytes > MAX_BYTES) {
    throw new Error(
      `${tile.file} is ${bytes} bytes, over the ${MAX_BYTES} byte budget`,
    );
  }
  console.log(`Wrote ${output.pathname} (${bytes} bytes)`);
}
