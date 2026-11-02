import { renderOg, OG_SIZE } from "@/lib/og/render-og";
import { outreachPages } from "@/lib/outreach-pages";

const { hero } = outreachPages.agencies;

export const alt = `${hero.title} ${hero.emphasis}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({ title: hero.title, emphasis: hero.emphasis });
}
