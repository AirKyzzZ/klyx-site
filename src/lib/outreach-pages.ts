import type { Metadata } from "next";

import { getPriceValues, type OfferId } from "./offers";
import type { OutreachPath } from "./outreach-paths";
import { brandedTitle } from "./seo";
import { site } from "./site";
import type { ToolLogoId } from "./tools";

export type OutreachKey = "agencies" | "startups";

type Heading = { title: string; body?: string };

type ListItem = { title?: string; body: string };

export type OutreachSection = Heading &
  (
    | { kind: "list"; id: string; tone?: "check" | "limit"; items: ListItem[] }
    | { kind: "steps"; id: string; items: Required<ListItem>[] }
    | {
        kind: "pricing";
        id: string;
        body: string;
        offers: { id: OfferId; audience: string; body: string }[];
      }
    | { kind: "cases"; id: string; body: string; slugs: string[] }
  );

export type OutreachPageConfig = {
  key: OutreachKey;
  path: OutreachPath;
  meta: { title: string; description: string };
  backdrop: { sources: ToolLogoId[]; destinations: ToolLogoId[] };
  hero: { title: string; subtitle: string; note: string };
  sections: OutreachSection[];
  midCtaAfter: string;
  booking: { title: string; body: string };
};

export const OUTREACH_CTA = "Réserver 30 minutes";
export const OUTREACH_PROOF_LINE = `${site.name} · ${site.city} · SIRET ${site.siret}`;
export const OUTREACH_EMAIL_LINE = "Vous préférez écrire ?";
export const OUTREACH_CLIENTS_LABEL = "Ils nous ont confié un projet";
export const OUTREACH_LABELS = {
  from: "À partir de",
  viewOffer: "Voir l'offre en détail",
} as const;

const prices = getPriceValues("fr");

export const outreachPages: Record<OutreachKey, OutreachPageConfig> = {
  agencies: {
    key: "agencies",
    path: "/pour/agences",
    meta: {
      title: "IA et Next.js en marque blanche pour agences",
      description: `Agents IA et sites Next.js livrés sous la marque de votre agence, au forfait, avec des règles de marque blanche fixées par écrit. Prix publics dès ${prices.landingPrice}.`,
    },
    backdrop: {
      sources: ["figma", "gmail", "notion", "slack", "wordpress"],
      destinations: ["nextjs", "hubspot", "openai", "pipedrive", "shopify"],
    },
    hero: {
      title: "Vos clients demandent de l'IA. On la livre sous votre marque.",
      subtitle:
        "Agents IA, automatisations et sites Next.js pour les clients de votre agence, au forfait, avec le code dans votre dépôt. Vous gardez le client, la relation et la marge.",
      note: `Prix publics dès ${prices.landingPrice}, fixés par écrit avant de commencer.`,
    },
    sections: [
      {
        kind: "list",
        id: "deliver",
        title: "Le brief arrive, on prend la partie technique.",
        body: "Trois demandes qui reviennent chez les clients d'agence. Le périmètre et le prix sont écrits avant de commencer, pour que vous puissiez revendre au forfait sans surprise.",
        items: [
          {
            title: "Assistant sur le site du client",
            body: "Il répond à partir des pages et des documents du client, et passe la main à son équipe quand il ne sait pas.",
          },
          {
            title: "Tri des demandes entrantes",
            body: "Formulaire et boîte mail classés, résumés et créés dans le CRM du client, avec une validation de son équipe.",
          },
          {
            title: "Site Next.js prêt pour l'IA",
            body: "Votre maquette intégrée, lisible par Google et par les moteurs IA. Votre équipe fait la recette avant la mise en ligne.",
          },
        ],
      },
      {
        kind: "pricing",
        id: "pricing",
        title: "Nos prix publics, votre prix de revente.",
        body: "Des prix de départ en € HT, qui servent de base à votre devis. Vous fixez votre marge. Pour tester la collaboration, commencez par un projet limité, comme une page de présentation.",
        offers: [
          {
            id: "landing",
            audience: "Pour tester la collaboration.",
            body: "Une page qui présente une offre, intégrée depuis votre maquette.",
          },
          {
            id: "site-ia",
            audience: "Pour un site complet.",
            body: "5 à 8 pages rapides, lisibles par Google et par les moteurs IA.",
          },
          {
            id: "sprint-ia",
            audience: "Pour un agent sur le site ou les outils du client.",
            body: "Un agent branché sur les outils du client, testé sur de vrais exemples, livré avec un guide écrit.",
          },
        ],
      },
      {
        kind: "list",
        id: "terms",
        title: "La marque blanche, noir sur blanc.",
        body: "Ces règles s'écrivent avec vous, par écrit, avant le premier brief. Voici ce qu'on vous propose d'y mettre.",
        items: [
          {
            body: "Un accord de confidentialité avant le brief, si vous le souhaitez.",
          },
          {
            body: "Votre marque sur ce qu'on livre : on convient ensemble de ce qui peut mentionner notre nom, et de ce qui ne le mentionne pas.",
          },
          {
            body: "La relation client reste la vôtre. Les échanges directs avec votre client se décident avec vous.",
          },
          {
            body: "Le code dans votre dépôt ou celui du client, avec une passation écrite pour qu'un autre développeur puisse reprendre.",
          },
          {
            body: "Peu de projets en parallèle : si on ne peut pas tenir votre calendrier, on vous le dit avant de signer.",
          },
        ],
      },
      {
        kind: "cases",
        id: "proof",
        title: "Ce que vous pouvez vérifier avant de signer.",
        body: "Aucun projet en marque blanche n'est montré ici : par définition, ils ne portent pas notre nom. Voici deux sites livrés sous le nôtre, en ligne aujourd'hui.",
        slugs: ["pkba", "vertiflow"],
      },
    ],
    midCtaAfter: "pricing",
    booking: {
      title: "Un brief IA que personne ne peut livrer chez vous ?",
      body: "On lit le brief avec vous et on vous dit ce qu'on peut livrer, en combien de temps et à quel prix. Si ce n'est pas pour nous, on vous le dit aussi.",
    },
  },
  startups: {
    key: "startups",
    path: "/pour/startups-sprint-ia",
    meta: {
      title:
        "Agent IA au forfait : votre feature IA en production en 2 semaines",
      description: `Un agent IA au forfait, à partir de ${prices.sprintPrice} : une feature IA branchée sur votre produit, testée et en production en deux semaines, avec le code dans votre dépôt.`,
    },
    backdrop: {
      sources: ["github", "slack", "notion", "gmail", "stripe"],
      destinations: [
        "openai",
        "claude",
        "mistral-ai",
        "hubspot",
        "microsoft-teams",
      ],
    },
    hero: {
      title:
        "Votre feature IA en production en 2 semaines, pas dans un prototype.",
      subtitle:
        "Un agent IA au forfait pour les startups qui ont une feature IA en attente : branchée sur votre produit, testée, en production, avec le code dans votre dépôt.",
      note: `Agent IA à partir de ${prices.sprintPrice}, 2 semaines, prix fixé avant de commencer.`,
    },
    sections: [
      {
        kind: "list",
        id: "deliverables",
        title: "Ce que vous recevez au bout des deux semaines.",
        body: `Un forfait à partir de ${prices.sprintPrice}, au périmètre écrit et signé avant de commencer. Le prix ne bouge pas avec le temps passé.`,
        items: [
          {
            title: "La feature en production",
            body: "Un agent, un assistant ou une automatisation, branché sur votre produit et vos données.",
          },
          {
            title: "Une validation humaine",
            body: "Quand l'agent touche à des données sensibles, une personne de votre équipe valide avant l'action.",
          },
          {
            title: "Un journal de chaque action",
            body: "Chaque étape de l'agent, sa durée et ses erreurs, consultables par votre équipe.",
          },
          {
            title: "Un jeu de tests",
            body: "Pour vérifier les réponses avant chaque changement de modèle ou de consigne.",
          },
          {
            title: "Le code dans votre dépôt",
            body: "Avec un guide écrit et une prise en main pour votre équipe.",
          },
        ],
      },
      {
        kind: "steps",
        id: "timeline",
        title: "Deux semaines, une revue à la fin de chacune.",
        items: [
          {
            title: "Avant",
            body: "Un appel de 30 minutes, puis un périmètre et un prix écrits. Rien ne commence sans votre accord.",
          },
          {
            title: "Semaine 1",
            body: "Branchement sur vos données et vos outils, premiers cas de test, revue avec vous en fin de semaine.",
          },
          {
            title: "Semaine 2",
            body: "Fiabilisation, jeu de tests complet, mise en production et seconde revue.",
          },
          {
            title: "Après",
            body: "Guide écrit et passation. Votre équipe reprend la main, ou on assure le suivi mensuel, sur devis.",
          },
        ],
      },
      {
        kind: "list",
        id: "limits",
        tone: "limit",
        title: "Ce que le forfait ne couvre pas.",
        body: "Mieux vaut le savoir avant l'appel.",
        items: [
          {
            body: "Une seule feature par forfait. Plusieurs intégrations ou une recherche dans vos documents passent sur devis.",
          },
          { body: "Pas d'astreinte 24 h/24, pas de certification SOC 2." },
          {
            body: "Peu de projets en parallèle : le devis donne une date de début, et on ne la promet pas si on ne peut pas la tenir.",
          },
          {
            body: "Si votre feature ne tient pas en deux semaines, on vous le dit dès l'appel, avec ce qu'il faudrait à la place.",
          },
        ],
      },
      {
        kind: "cases",
        id: "proof",
        title: "Ce que vous pouvez ouvrir avant l'appel.",
        body: "Hoppy, l'assistant IA de Hop Hop Immo, et CiteMe, cofondé par Maxime Mansiet, qui écrit le code chez Klyx. Les deux sont en ligne.",
        slugs: ["hop-hop-immo", "citeme"],
      },
    ],
    midCtaAfter: "deliverables",
    booking: {
      title: "Une feature IA qui attend quelqu'un pour la livrer ?",
      body: "On regarde la feature avec vous et on vous dit si elle tient dans le forfait. Sinon, on vous dit ce qu'il faudrait, sans engagement.",
    },
  },
};

export const OUTREACH_KEYS = Object.keys(outreachPages) as OutreachKey[];

export function outreachCopyText(page: OutreachPageConfig): string {
  const { hero, sections, booking } = page;
  return [
    hero.title,
    hero.subtitle,
    hero.note,
    ...sections.flatMap((section) => [
      section.title,
      section.body ?? "",
      ...(section.kind === "list" || section.kind === "steps"
        ? section.items.flatMap((item) => [item.title ?? "", item.body])
        : []),
      ...(section.kind === "pricing"
        ? section.offers.flatMap((offer) => [offer.audience, offer.body])
        : []),
    ]),
    booking.title,
    booking.body,
  ]
    .filter(Boolean)
    .join(" ");
}

export function outreachMetadata(page: OutreachPageConfig): Metadata {
  const url = `${site.url}${page.path}`;
  const { description } = page.meta;
  const title = brandedTitle(page.meta.title);
  const image = { url: `${url}/opengraph-image`, width: 1200, height: 630 };
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "fr_FR",
      type: "website",
      images: [{ ...image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ ...image, alt: title }],
    },
  };
}
