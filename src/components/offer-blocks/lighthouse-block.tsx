import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import type { Locale } from "@/i18n/routing";
import {
  formatDay,
  getLighthouseProof,
  LIGHTHOUSE_KEYS,
  pageSpeedUrl,
} from "@/lib/offer-block-data";

export async function LighthouseBlock({ locale }: { locale: Locale }) {
  const source = getLighthouseProof();
  if (!source) return null;
  const t = await getTranslations({ locale, namespace: "sites.block" });
  const date = formatDay(locale, source.date);

  return (
    <PageSection id="mesure">
      <SectionHeader title={t("title")} intro={t("intro")} />
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {LIGHTHOUSE_KEYS.map((key) => (
          <li
            key={key}
            className="border-line bg-surface-1 shadow-panel flex flex-col gap-4 rounded-[16px] border p-6"
          >
            <p className="text-text-2 text-[0.9375rem] font-medium">
              {t(`scores.${key}`)}
            </p>
            <p className="text-text text-[3rem] leading-none font-semibold tracking-[-1.5px] tabular-nums">
              {source.scores[key]}
              <span className="text-text-3 ml-1 text-base font-normal tracking-normal">
                /100
              </span>
            </p>
            <span
              aria-hidden="true"
              className="bg-surface-2 block h-1.5 overflow-hidden rounded-full"
            >
              <span
                className="bg-ui-ok block h-full rounded-full"
                style={{ width: `${source.scores[key]}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
      <p className="text-text-3 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {t("measured", { host: new URL(source.url).host, date })}
        <a
          href={pageSpeedUrl(source.url)}
          target="_blank"
          rel="noopener"
          className="text-text hover:text-accent inline-flex items-center gap-1 font-medium underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)"
        >
          {t("verify")}
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
      </p>
    </PageSection>
  );
}
