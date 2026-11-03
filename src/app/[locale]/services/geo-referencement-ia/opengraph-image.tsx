import { OG_SIZE, ogLocaleParams, pageOgImage } from "@/lib/og/render-og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;
export const generateStaticParams = ogLocaleParams;

export default pageOgImage("geo");
