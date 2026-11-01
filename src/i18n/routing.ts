import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"] as const,
  defaultLocale: "fr",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/services/creation-site-web": {
      fr: "/services/creation-site-web",
      en: "/services/websites",
    },
    "/services/agents-ia": {
      fr: "/services/agents-ia",
      en: "/services/ai-agents",
    },
    "/services/audit-ia": {
      fr: "/services/audit-ia",
      en: "/services/ai-audit",
    },
    "/services/automatisation-ia": {
      fr: "/services/automatisation-ia",
      en: "/services/ai-automation",
    },
    "/services/geo-referencement-ia": {
      fr: "/services/geo-referencement-ia",
      en: "/services/ai-search-visibility",
    },
    "/forward-deployed-engineer": "/forward-deployed-engineer",
    "/tarifs": { fr: "/tarifs", en: "/pricing" },
    "/realisations": { fr: "/realisations", en: "/work" },
    "/realisations/[slug]": { fr: "/realisations/[slug]", en: "/work/[slug]" },
    "/a-propos": { fr: "/a-propos", en: "/about" },
    "/agence-ia-bordeaux": {
      fr: "/agence-ia-bordeaux",
      en: "/ai-agency-bordeaux",
    },
    "/cas-usage": { fr: "/cas-usage", en: "/use-cases" },
    "/cas-usage/immobilier": {
      fr: "/cas-usage/immobilier",
      en: "/use-cases/real-estate",
    },
    "/cas-usage/agences": {
      fr: "/cas-usage/agences",
      en: "/use-cases/agencies",
    },
    "/cas-usage/cabinets-services": {
      fr: "/cas-usage/cabinets-services",
      en: "/use-cases/professional-services",
    },
    "/faq": "/faq",
    "/contact": "/contact",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/mentions-legales": { fr: "/mentions-legales", en: "/legal-notice" },
    "/confidentialite": { fr: "/confidentialite", en: "/privacy" },
  },
});

export type Locale = (typeof routing.locales)[number];
