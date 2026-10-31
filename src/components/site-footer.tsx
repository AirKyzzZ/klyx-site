import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

const linkClass = "font-medium transition-opacity hover:opacity-75";
const externalClass =
  "flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  const socials = [
    { name: "LinkedIn", href: site.socials.linkedinCompany },
    { name: "GitHub", href: site.socials.github },
    { name: "Instagram", href: site.socials.instagram },
  ];
  const sisterText: Record<(typeof site.sisterSites)[number]["name"], string> =
    { "Klyx Studio": t("studio"), "Klyx Estate": t("estate") };

  return (
    <footer className="flex flex-col items-center gap-12 overflow-hidden pt-20 lg:pt-28">
      <p className="text-muted-foreground container max-w-xl text-center leading-snug text-balance">
        {t("tagline")}
      </p>

      <nav className="container flex flex-col items-center gap-5 text-center">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <li>
            <Link href="/services/creation-site-web" className={linkClass}>
              {nav("sites")}
            </Link>
          </li>
          <li>
            <Link href="/services/agents-ia" className={linkClass}>
              {nav("agents")}
            </Link>
          </li>
          <li>
            <Link href="/forward-deployed-engineer" className={linkClass}>
              {nav("fde")}
            </Link>
          </li>
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <li>
            <Link href="/realisations" className={linkClass}>
              {nav("cases")}
            </Link>
          </li>
          <li>
            <Link href="/tarifs" className={linkClass}>
              {nav("pricing")}
            </Link>
          </li>
          <li>
            <Link href="/a-propos" className={linkClass}>
              {nav("about")}
            </Link>
          </li>
          <li>
            <Link href="/agence-ia-bordeaux" className={linkClass}>
              {nav("bordeaux")}
            </Link>
          </li>
          <li>
            <Link href="/blog" className={linkClass}>
              {nav("blog")}
            </Link>
          </li>
          <li>
            <Link href="/contact" className={linkClass}>
              {nav("contact")}
            </Link>
          </li>
          {socials.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener"
                className={externalClass}
              >
                {item.name} <ArrowUpRight className="size-4" />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-2">
          <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
            {t("sisterSitesTitle")}
          </h2>
          <ul className="flex flex-col items-center gap-1.5">
            {site.sisterSites.map((sister) => (
              <li
                key={sister.url}
                className="text-muted-foreground max-w-xl text-sm"
              >
                {sisterText[sister.name]}{" "}
                <a
                  href={sister.url}
                  target="_blank"
                  rel="noopener"
                  className="text-foreground inline-flex items-center gap-0.5 font-medium hover:opacity-75"
                >
                  {new URL(sister.url).host}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <ul className="text-muted-foreground mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <li>
            <Link href="/mentions-legales" className="hover:opacity-75">
              {t("legal")}
            </Link>
          </li>
          <li>
            <Link href="/confidentialite" className="hover:opacity-75">
              {t("privacy")}
            </Link>
          </li>
          <li>{t("copyright", { year: new Date().getFullYear() })}</li>
        </ul>
      </nav>

      <div className="text-primary-foreground/80 mt-6 w-full lg:mt-12">
        <svg
          viewBox="0 0 1570 293"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-full"
        >
          <text
            x="0"
            y="368"
            textLength="1570"
            lengthAdjust="spacingAndGlyphs"
            fontSize="480"
            fill="url(#footer-wordmark-gradient)"
            className="font-display"
          >
            klyx
          </text>
          <defs>
            <linearGradient
              id="footer-wordmark-gradient"
              x1="742.5"
              y1="0"
              x2="742.5"
              y2="218.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="currentColor" />
              <stop offset="1" stopColor="#F8F8F8" stopOpacity="0.41" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
}
