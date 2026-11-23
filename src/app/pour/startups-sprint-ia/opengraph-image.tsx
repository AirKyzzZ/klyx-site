import { renderOg, OG_SIZE } from "@/lib/og/render-og";
import { outreachPages } from "@/lib/outreach-pages";

const { hero } = outreachPages.startups;

export const alt = hero.title;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({ title: hero.title });
}
