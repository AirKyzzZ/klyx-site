import type { MetadataRoute } from "next";

import { getStaticTranslator } from "@/i18n/static-translator";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

const BG = "#141414";

export default function manifest(): MetadataRoute.Manifest {
  const t = getStaticTranslator(routing.defaultLocale, "meta.home");
  return {
    name: site.name,
    short_name: site.name,
    description: t("description"),
    start_url: "/",
    display: "browser",
    lang: routing.defaultLocale,
    background_color: BG,
    theme_color: BG,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
