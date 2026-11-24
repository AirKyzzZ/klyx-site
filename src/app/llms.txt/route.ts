import { getStaticTranslator } from "@/i18n/static-translator";
import { getPosts } from "@/lib/content";
import { AREA_SERVED } from "@/lib/json-ld";
import { getOfferCopy } from "@/lib/offer-copy";
import { offers } from "@/lib/offers";
import { pageMarkdownHref } from "@/lib/machine/markdown-href";
import { type AppPathname, absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const KEY_PAGES: { pathname: AppPathname; metaKey: string }[] = [
  { pathname: "/tarifs", metaKey: "pricing" },
  { pathname: "/services/creation-site-web", metaKey: "sites" },
  { pathname: "/services/agents-ia", metaKey: "agents" },
  { pathname: "/services/audit-ia", metaKey: "audit" },
  { pathname: "/services/automatisation-ia", metaKey: "automation" },
  { pathname: "/services/geo-referencement-ia", metaKey: "geo" },
  { pathname: "/forward-deployed-engineer", metaKey: "fde" },
  { pathname: "/agence-ia-bordeaux", metaKey: "bordeaux" },
  { pathname: "/cas-usage", metaKey: "useCases" },
  { pathname: "/cas-usage/immobilier", metaKey: "realEstate" },
  { pathname: "/cas-usage/agences", metaKey: "agencies" },
  { pathname: "/cas-usage/cabinets-services", metaKey: "services" },
  { pathname: "/faq", metaKey: "faq" },
  { pathname: "/realisations", metaKey: "cases" },
  { pathname: "/a-propos", metaKey: "about" },
  { pathname: "/contact", metaKey: "contact" },
];

function markdownUrl(pathname: AppPathname, params?: Record<string, string>) {
  return `${site.url}${pageMarkdownHref("fr", { pathname, params })}`;
}

export async function GET() {
  const offersT = getStaticTranslator("fr", "offers");
  const meta = getStaticTranslator("fr", "meta");
  const nav = getStaticTranslator("fr", "nav");

  const offerLines = offers.map((offer) => {
    const copy = getOfferCopy(offersT, "fr", offer.id);
    return `- [${copy.name}](${absoluteUrl("fr", offer.page)}): ${copy.price}. ${copy.summary}`;
  });

  const pageLines = KEY_PAGES.map(
    ({ pathname, metaKey }) =>
      `- [${meta(`${metaKey}.title`)}](${absoluteUrl("fr", pathname)}) (English: ${absoluteUrl("en", pathname)}) (Markdown : ${markdownUrl(pathname)})`,
  );

  const guideLines = (await getPosts("fr")).map(
    ({ slug, title }) =>
      `- [${title}](${absoluteUrl("fr", "/blog/[slug]", { slug })}) (Markdown : ${markdownUrl("/blog/[slug]", { slug })})`,
  );

  const { postalCode, locality } = site.address;
  const lines = [
    `# ${site.name}`,
    "",
    `> ${meta("home.description")}`,
    "",
    `${site.description} Fondateur : ${site.founder}. Adresse légale : ${postalCode} ${locality} (${site.legalName}, SIRET ${site.siret}). Zone servie : ${AREA_SERVED.map((area) => area.name).join(", ")}.`,
    "",
    `Markdown : ${markdownUrl("/")}`,
    "",
    "## Offres",
    "",
    offersT("vatNote"),
    "",
    ...offerLines,
    "",
    "## Pages clés",
    "",
    ...pageLines,
    "",
    "## Guides",
    "",
    ...guideLines,
    "",
    "## Contact",
    "",
    `- E-mail : ${site.email}`,
    `- [${nav("quote")}](${absoluteUrl("fr", "/contact")})`,
    ...(site.calUrl ? [`- [${nav("book")}](${site.calUrl})`] : []),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
