import { getStaticTranslator } from "@/i18n/static-translator";
import { getOfferCopy } from "@/lib/offer-copy";
import { offers } from "@/lib/offers";
import { pageMarkdownHref } from "@/lib/machine/markdown-href";
import { type AppPathname, absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

const KEY_PAGES: { pathname: AppPathname; metaKey: string }[] = [
  { pathname: "/tarifs", metaKey: "pricing" },
  { pathname: "/services/creation-site-web", metaKey: "sites" },
  { pathname: "/services/agents-ia", metaKey: "agents" },
  { pathname: "/services/audit-ia", metaKey: "audit" },
  { pathname: "/services/automatisation-ia", metaKey: "automation" },
  { pathname: "/services/geo-referencement-ia", metaKey: "geo" },
  { pathname: "/forward-deployed-engineer", metaKey: "fde" },
  { pathname: "/agence-ia-bordeaux", metaKey: "bordeaux" },
  { pathname: "/realisations", metaKey: "cases" },
  { pathname: "/a-propos", metaKey: "about" },
  { pathname: "/contact", metaKey: "contact" },
];

function markdownUrl(pathname: AppPathname) {
  return `${site.url}${pageMarkdownHref("fr", { pathname })}`;
}

export function GET() {
  const offersT = getStaticTranslator("fr", "offers");
  const meta = getStaticTranslator("fr", "meta");
  const nav = getStaticTranslator("fr", "nav");

  const offerLines = offers.map((offer) => {
    const copy = getOfferCopy(offersT, "fr", offer.id);
    const price = offer.priceFrom === null ? "" : ` ${copy.price}.`;
    return `- [${copy.name}](${absoluteUrl("fr", offer.page)}):${price} ${copy.summary}`;
  });

  const pageLines = KEY_PAGES.map(
    ({ pathname, metaKey }) =>
      `- [${meta(`${metaKey}.title`)}](${absoluteUrl("fr", pathname)}) (English: ${absoluteUrl("en", pathname)}) (Markdown : ${markdownUrl(pathname)})`,
  );

  const lines = [
    `# ${site.name}`,
    "",
    `> ${meta("home.description")}`,
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
