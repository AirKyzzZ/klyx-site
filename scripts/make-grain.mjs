import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SIZE = 128;
const MAX_BYTES = 3 * 1024;
const OUTPUT = new URL("../public/textures/grain.png", import.meta.url);

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
const lightAbove = sorted[Math.floor(sorted.length * 0.78)];
const darkBelow = sorted[Math.floor(sorted.length * 0.1)];

const rgba = Buffer.alloc(SIZE * SIZE * 4, 0);
values.forEach((value, i) => {
  if (value > lightAbove) {
    rgba.fill(255, i * 4, i * 4 + 3);
    rgba[i * 4 + 3] = 14;
  }
  if (value < darkBelow) rgba[i * 4 + 3] = 40;
});

mkdirSync(new URL(".", OUTPUT), { recursive: true });
await sharp(rgba, { raw: { width: SIZE, height: SIZE, channels: 4 } })
  .png({ palette: true, colours: 3, compressionLevel: 9, effort: 10 })
  .toFile(OUTPUT.pathname);

const bytes = statSync(OUTPUT).size;
if (bytes > MAX_BYTES) {
  throw new Error(
    `grain.png is ${bytes} bytes, over the ${MAX_BYTES} byte budget`,
  );
}
console.log(`Wrote ${OUTPUT.pathname} (${bytes} bytes)`);
