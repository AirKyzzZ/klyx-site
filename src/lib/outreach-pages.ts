import type { Metadata } from "next";

import { getPriceValues, type OfferId } from "./offers";
import type { OutreachPath } from "./outreach-paths";
import type { ScenarioId } from "./scenarios";
import { brandedTitle } from "./seo";
import { site } from "./site";

export type OutreachKey = "agencies" | "startups";

type Heading = { eyebrow: string; title: string; emphasis: string };

type ListItem = { title?: string; body: string };

export type OutreachSection = Heading &
  (
    | { kind: "list"; id: string; body?: string; items: ListItem[] }
    | { kind: "pricing"; id: string; body: string; offers: OfferId[] }
    | { kind: "cases"; id: string; body: string; slugs: string[] }
  );

export type OutreachPageConfig = {
  key: OutreachKey;
  path: OutreachPath;
  meta: { title: string; description: string };
  scenario: ScenarioId;
  hero: {
    anchor: string;
    title: string;
    emphasis: string;
    serif: string;
    subtitle: string;
  };
  sections: OutreachSection[];
  midCtaAfter: string;
  booking: Heading & { body: string };
};

export const OUTREACH_CTA = "Réserver 30 minutes";
export const OUTREACH_PROOF_LINE = `${site.name} · ${site.city} · SIRET ${site.siret}`;
export const OUTREACH_EMAIL_LINE = "Vous préférez écrire ?";

const prices = getPriceValues("fr");

export const outreachPages: Record<OutreachKey, OutreachPageConfig> = {
  agencies: {
    key: "agencies",
    path: "/pour/agences",
    meta: {
      title: "IA et Next.js en marque blanche pour agences",
      description: `Agents IA et sites Next.js livrés sous la marque de votre agence, au forfait, avec des règles de marque blanche fixées par écrit. Prix publics dès ${prices.landingPrice}.`,
    },
    scenario: "agencies",
    hero: {
      anchor: "Marque blanche · agences web et marketing",
      title: "Vos clients demandent de l'IA.",
      emphasis: "On la livre sous votre marque.",
      serif: "marque",
      subtitle:
        "Agents IA, automatisations et sites Next.js pour les clients de votre agence, au forfait, avec le code dans votre repo. Vous gardez le client, la relation et la marge.",
    },
    sections: [
      {
        kind: "list",
        id: "deliver",
        eyebrow: "Ce qu'on livre",
        title: "Le brief arrive,",
        emphasis: "on prend la partie technique.",
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
            body: "Votre maquette intégrée, avec données structurées et llms.txt pour les moteurs IA. Votre équipe fait la recette avant la mise en ligne.",
          },
        ],
      },
      {
        kind: "pricing",
        id: "pricing",
        eyebrow: "Prix",
        title: "Nos prix publics,",
        emphasis: "votre prix de revente.",
        body: "Des prix de départ en € HT, qui servent de base à votre devis. Vous fixez votre marge. Pour tester la collaboration, commencez par un projet limité, comme une landing page.",
        offers: ["landing", "site-ia", "sprint-ia"],
      },
      {
        kind: "list",
        id: "terms",
        eyebrow: "Marque blanche",
        title: "La marque blanche,",
        emphasis: "noir sur blanc.",
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
            body: "Le code dans votre repo ou celui du client, avec une passation écrite pour qu'un autre développeur puisse reprendre.",
          },
          {
            body: "Peu de projets en parallèle : si on ne peut pas tenir votre calendrier, on vous le dit avant de signer.",
          },
        ],
      },
      {
        kind: "cases",
        id: "proof",
        eyebrow: "Preuves",
        title: "Ce que vous pouvez",
        emphasis: "vérifier avant de signer.",
        body: "Aucun projet en marque blanche n'est montré ici : par définition, ils ne portent pas notre nom. Voici deux sites livrés sous le nôtre, en ligne aujourd'hui.",
        slugs: ["pkba", "vertiflow"],
      },
    ],
    midCtaAfter: "pricing",
    booking: {
      eyebrow: "30 minutes",
      title: "Un brief IA",
      emphasis: "que personne ne peut livrer chez vous ?",
      body: "On lit le brief avec vous et on vous dit ce qu'on peut livrer, en combien de temps et à quel prix. Si ce n'est pas pour nous, on vous le dit aussi.",
    },
  },
  startups: {
    key: "startups",
    path: "/pour/startups-sprint-ia",
    meta: {
      title: "Sprint IA : votre feature IA en production en 2 semaines",
      description: `Sprint IA au forfait, à partir de ${prices.sprintPrice} : une feature IA branchée sur votre produit, testée et en production en deux semaines, avec le code dans votre repo.`,
    },
    scenario: "agents",
    hero: {
      anchor: `Sprint IA · à partir de ${prices.sprintPrice} · 2 semaines`,
      title: "Votre feature IA en production en 2 semaines,",
      emphasis: "pas dans un prototype.",
      serif: "production",
      subtitle:
        "Un Sprint IA au forfait pour les startups qui ont une feature IA en attente : branchée sur votre produit, testée, en production, avec le code dans votre repo.",
    },
    sections: [
      {
        kind: "list",
        id: "deliverables",
        eyebrow: "Livrables",
        title: "Ce que vous recevez",
        emphasis: "à la fin du Sprint.",
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
            body: "Pour vérifier les réponses avant chaque changement de modèle ou de prompt.",
          },
          {
            title: "Le code dans votre repo",
            body: "Avec un runbook et une prise en main pour votre équipe.",
          },
        ],
      },
      {
        kind: "list",
        id: "timeline",
        eyebrow: "Calendrier",
        title: "Deux semaines,",
        emphasis: "une revue à la fin de chacune.",
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
            body: "Runbook et passation. Votre équipe reprend la main, ou on assure le suivi mensuel, sur devis.",
          },
        ],
      },
      {
        kind: "list",
        id: "limits",
        eyebrow: "Limites",
        title: "Ce que le Sprint",
        emphasis: "ne couvre pas.",
        body: "Mieux vaut le savoir avant l'appel.",
        items: [
          {
            body: "Une seule feature par Sprint. Plusieurs intégrations ou une recherche dans vos documents passent sur devis.",
          },
          { body: "Pas d'astreinte 24 h/24, pas de certification SOC 2." },
          {
            body: "Peu de Sprints en parallèle : le devis donne une date de début, et on ne la promet pas si on ne peut pas la tenir.",
          },
          {
            body: "Si votre feature ne tient pas en deux semaines, on vous le dit dès l'appel, avec ce qu'il faudrait à la place.",
          },
        ],
      },
      {
        kind: "cases",
        id: "proof",
        eyebrow: "Preuves",
        title: "Ce que vous pouvez",
        emphasis: "ouvrir avant l'appel.",
        body: "Hoppy, l'assistant IA de Hop Hop Immo, et CiteMe, cofondé par Maxime Mansiet, notre lead engineer. Les deux sont en ligne.",
        slugs: ["hop-hop-immo", "citeme"],
      },
    ],
    midCtaAfter: "deliverables",
    booking: {
      eyebrow: "30 minutes",
      title: "Une feature IA",
      emphasis: "qui attend quelqu'un pour la livrer ?",
      body: "On regarde la feature avec vous et on vous dit si elle tient dans un Sprint. Sinon, on vous dit ce qu'il faudrait, sans engagement.",
    },
  },
};

export const OUTREACH_KEYS = Object.keys(outreachPages) as OutreachKey[];

export function outreachCopyText(page: OutreachPageConfig): string {
  const { hero, sections, booking } = page;
  return [
    hero.anchor,
    hero.title,
    hero.emphasis,
    hero.subtitle,
    ...sections.flatMap((section) => [
      section.eyebrow,
      section.title,
      section.emphasis,
      section.kind === "list" ? (section.body ?? "") : section.body,
      ...(section.kind === "list"
        ? section.items.flatMap((item) => [item.title ?? "", item.body])
        : []),
    ]),
    booking.eyebrow,
    booking.title,
    booking.emphasis,
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
