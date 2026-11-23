export type Heading = { id: string; title: string };

export function bindPunctuation(text: string): string {
  return text.replace(/ ([?!:;»])/g, "\u00a0$1");
}

export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const H2_LINE = /^## +(.+?) *#*$/gm;

export function markdownHeadings(body: string): Heading[] {
  return [...body.matchAll(H2_LINE)].map(([, title]) => ({
    id: headingId(title),
    title: bindPunctuation(title),
  }));
}
