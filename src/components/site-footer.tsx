import Image from "next/image";

import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageViewToggle } from "@/components/machine-view/view-toggle";
import { Hr } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { site, socialLinks } from "@/lib/site";

const columnTitle = "type-label text-text-3";
const footerLink =
  "text-sm leading-snug text-text-2 transition-colors duration-(--d-fast) hover:text-text";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  const sisterText: Record<(typeof site.sisterSites)[number]["name"], string> =
    { "Klyx Studio": t("studio"), "Klyx Estate": t("estate") };

  const offerLinks = [
    { href: "/services/creation-site-web", label: nav("sites") },
    { href: "/services/agents-ia", label: nav("agents") },
    { href: "/forward-deployed-engineer", label: nav("fde") },
  ] as const;

  const companyLinks = [
    { href: "/realisations", label: nav("cases") },
    { href: "/tarifs", label: nav("pricing") },
    { href: "/a-propos", label: nav("about") },
    { href: "/agence-ia-bordeaux", label: nav("bordeaux") },
    { href: "/blog", label: nav("blog") },
    { href: "/contact", label: nav("contact") },
  ] as const;

  return (
    <footer className="bg-bg-sunken relative z-1 overflow-hidden">
      <Hr />
      <div className="container grid grid-cols-2 gap-x-8 gap-y-12 pt-16 pb-12 md:grid-cols-12 lg:pt-20">
        <div className="col-span-2 flex flex-col gap-6 md:col-span-12 lg:col-span-4">
          <Link href="/" className="flex w-fit items-center gap-2 rounded-sm">
            <Image
              src="/brand/klyx-white.png"
              alt=""
              width={801}
              height={759}
              className="h-5 w-auto"
            />
            <span className="text-[1.0625rem] leading-none font-semibold tracking-[-0.03em]">
              Klyx
            </span>
          </Link>
          <p className="text-text-2 max-w-[38ch] text-sm leading-relaxed">
            {t("tagline")}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {socialLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener"
                  className="text-text-2 hover:text-text inline-flex items-center gap-0.5 font-mono text-xs tracking-[0.06em] uppercase transition-colors duration-(--d-fast)"
                >
                  {item.name}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
          <div className="lg:hidden">
            <PageViewToggle variant="inline" />
          </div>
        </div>

        <nav
          aria-label={t("offersTitle")}
          className="flex flex-col gap-4 md:col-span-4 lg:col-span-2 lg:col-start-6"
        >
          <h2 className={columnTitle}>{t("offersTitle")}</h2>
          <ul className="flex flex-col gap-2.5">
            {offerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          aria-label={t("companyTitle")}
          className="flex flex-col gap-4 md:col-span-4 lg:col-span-2"
        >
          <h2 className={columnTitle}>{t("companyTitle")}</h2>
          <ul className="flex flex-col gap-2.5">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 flex flex-col gap-4 md:col-span-4 lg:col-span-3">
          <h2 className={columnTitle}>{t("sisterSitesTitle")}</h2>
          <ul className="flex flex-col gap-4">
            {site.sisterSites.map((sister) => (
              <li key={sister.url} className="flex flex-col gap-1">
                <a
                  href={sister.url}
                  target="_blank"
                  rel="noopener"
                  className="text-text hover:text-text-2 inline-flex w-fit items-center gap-0.5 text-sm font-medium transition-colors duration-(--d-fast)"
                >
                  {new URL(sister.url).host}
                  <ArrowUpRight className="size-3.5" />
                </a>
                <p className="text-text-3 text-[0.8125rem] leading-snug">
                  {sisterText[sister.name]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="border-line text-text-3 flex flex-col gap-3 border-t py-5 font-mono text-xs md:flex-row md:items-center md:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li className="tabular-nums">
              {t("siret", { siret: site.siret })}
            </li>
            <li>
              <Link
                href="/mentions-legales"
                className="hover:text-text transition-colors duration-(--d-fast)"
              >
                {t("legal")}
              </Link>
            </li>
            <li>
              <Link
                href="/confidentialite"
                className="hover:text-text transition-colors duration-(--d-fast)"
              >
                {t("privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container" aria-hidden="true">
        <svg
          viewBox="0 0 1000 260"
          className="block w-full"
          preserveAspectRatio="xMidYMin meet"
        >
          <text
            x="0"
            y="324"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fontSize="416"
            className="fill-none font-mono"
            stroke="var(--line-strong)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          >
            klyx
          </text>
        </svg>
      </div>
    </footer>
  );
}
