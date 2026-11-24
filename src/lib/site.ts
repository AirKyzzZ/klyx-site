import type { Locale } from "@/i18n/routing";

export const site = {
  name: "Klyx",
  legalName: "Maxime Mansiet EI",
  description:
    "Klyx est une agence IA à Bordeaux\u00a0: sites, agents IA et automatisations livrés au forfait pour les PME, startups et agences, avec des prix publics.",
  url: "https://klyx.fr",
  email: "contact@klyx.fr",
  founder: "Maxime Mansiet",
  siret: "941 572 364 00029",
  city: "Bordeaux",
  address: {
    postalCode: "33120",
    locality: "Arcachon",
  },
  calUrl: process.env.NEXT_PUBLIC_CAL_URL,
  legalUpdatedAt: "2026-11-24",
  pagesUpdatedAt: "2026-11-23",
  socials: {
    linkedinCompany: "https://www.linkedin.com/company/klyx-studio",
    linkedinFounder: "https://www.linkedin.com/in/maxime-mansiet",
    instagram: "https://www.instagram.com/klyx.studio",
    github: "https://github.com/AirKyzzZ",
  },
  sisterSites: [
    { name: "Klyx Studio", url: "https://studio.klyx.fr" },
    { name: "Klyx Estate", url: "https://estate.klyx.fr" },
  ],
} as const;

export const SITE_DESCRIPTIONS = {
  fr: site.description,
  en: "Klyx is an AI agency in Bordeaux: websites, AI agents and automations delivered at a fixed price for small businesses, startups and agencies, with public prices.",
} as const satisfies Record<Locale, string>;

export const socialLinks = [
  { name: "LinkedIn", href: site.socials.linkedinCompany },
  { name: "GitHub", href: site.socials.github },
  { name: "Instagram", href: site.socials.instagram },
] as const;
