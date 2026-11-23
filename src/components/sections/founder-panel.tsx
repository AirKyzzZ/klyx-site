import { getTranslations } from "next-intl/server";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

import {
  ACCENT_LEVEL_FILLS,
  ContributionGraph,
} from "@/components/proof/contribution-graph";
import { FounderCard } from "@/components/ui-kit/founder-card";
import type { Locale } from "@/i18n/routing";
import { getCaseStudies } from "@/lib/content";
import { countLiveHomeCases } from "@/lib/home-sections";
import { getGithubContributions } from "@/lib/proof";
import { site } from "@/lib/site";

export const FOUNDER_PHOTO = "/team/maxime-mansiet.jpg";

export async function FounderPanel({
  locale,
  as,
  className,
}: {
  locale: Locale;
  as?: "h2" | "h3";
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "home.team" });
  const projects = countLiveHomeCases(await getCaseStudies(locale));
  const contributions = getGithubContributions();
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale).format(value).replaceAll(" ", " ");
  const day = (date: string) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(date));

  return (
    <FounderCard
      as={as}
      className={className}
      name={t("name")}
      role={t("role")}
      bio={t("bio")}
      photo={FOUNDER_PHOTO}
      photoAlt={t("photoAlt")}
      stats={[
        ...(contributions
          ? [
              {
                value: formatNumber(contributions.total),
                label: t("stats.contributions"),
              },
            ]
          : []),
        { value: formatNumber(projects), label: t("stats.projects") },
        { value: formatNumber(1), label: t("stats.contact") },
      ]}
      graph={
        contributions && (
          <ContributionGraph
            data={contributions}
            fills={ACCENT_LEVEL_FILLS}
            cell={9}
            label={t("graph", {
              from: day(contributions.from),
              to: day(contributions.to),
            })}
          />
        )
      }
      links={[
        ...(contributions
          ? [
              {
                label: t("links.github"),
                detail: `@${contributions.user}`,
                href: site.socials.github,
                icon: <FaGithub className="size-4 text-[#181717]" />,
              },
            ]
          : []),
        {
          label: t("links.linkedin"),
          detail: site.founder,
          href: site.socials.linkedinFounder,
          icon: <FaLinkedin className="size-4 text-[#0a66c2]" />,
        },
      ]}
    />
  );
}
