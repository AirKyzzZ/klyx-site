import { getTranslations } from "next-intl/server";

import { SampleWindow } from "@/components/sections/process-timeline";
import type { Locale } from "@/i18n/routing";
import { getGithubContributions } from "@/lib/proof";

import { ContributionGraph } from "./contribution-graph";

export async function ContributionWindow({ locale }: { locale: Locale }) {
  const contributions = getGithubContributions();
  if (!contributions) return null;
  const t = await getTranslations({ locale, namespace: "about.contributions" });
  const day = (date: string) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(date));
  return (
    <figure>
      <SampleWindow file={t("window")}>
        <ContributionGraph
          data={contributions}
          label={t("label", {
            from: day(contributions.from),
            to: day(contributions.to),
          })}
        />
        <p className="text-text mt-4">
          {t("total", {
            total: new Intl.NumberFormat(locale).format(contributions.total),
          })}
        </p>
      </SampleWindow>
      <figcaption className="text-text-3 mt-3 text-xs">
        {t("caption", { date: day(contributions.capturedAt) })}
      </figcaption>
    </figure>
  );
}
