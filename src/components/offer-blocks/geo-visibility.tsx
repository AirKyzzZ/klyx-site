import { getTranslations } from "next-intl/server";

import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import type { Locale } from "@/i18n/routing";
import {
  GEO_ENGINES,
  GEO_SAMPLE,
  type GeoState,
  geoSampleCount,
} from "@/lib/offer-block-data";
import { cn } from "@/lib/utils";

import { InfoCard, SampleBadge } from "./info-card";

const STATE_STYLES: Record<GeoState, { dot: string; text: string }> = {
  cited: { dot: "bg-ui-ok", text: "text-text" },
  competitor: { dot: "bg-text-3", text: "text-text-2" },
  absent: { dot: "border border-text-3", text: "text-text-3" },
};

export async function GeoVisibility({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "geo.block" });
  const page = await getTranslations({ locale, namespace: "offerPage" });
  const quote = (text: string) =>
    locale === "fr" ? `« ${text} »` : `“${text}”`;

  return (
    <PageSection id="mesure">
      <SectionHeader title={t("title")} intro={t("intro")} />
      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="border-line bg-surface-1 shadow-panel overflow-hidden rounded-[20px] border">
          <div className="border-line flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-0.5">
              <p className="text-text text-base font-semibold">
                {t("card.site")}
              </p>
              <p className="text-text-3 text-[0.8125rem]">{t("card.label")}</p>
            </div>
            <SampleBadge label={page("sample")} />
          </div>
          <ul className="divide-line divide-y">
            {GEO_SAMPLE.map((row) => (
              <li
                key={row.prompt}
                className="flex flex-col gap-3 px-5 py-4 sm:px-6"
              >
                <p className="text-text text-[0.9375rem] leading-snug">
                  {quote(t(`card.prompts.${row.prompt}`))}
                </p>
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {row.states.map((state, i) => (
                    <li
                      key={GEO_ENGINES[i]}
                      className="bg-surface-2 flex flex-col gap-1 rounded-[10px] px-3 py-2"
                    >
                      <span className="text-text-3 text-xs">
                        {GEO_ENGINES[i]}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium",
                          STATE_STYLES[state].text,
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            STATE_STYLES[state].dot,
                          )}
                        />
                        {t(`card.states.${state}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="border-line bg-surface-2 text-text-2 border-t px-5 py-3.5 text-[0.875rem] font-medium sm:px-6">
            {t("card.summary", geoSampleCount())}
          </p>
        </div>
        <InfoCard title={t("disclosure.title")} body={t("disclosure.body")} />
      </div>
    </PageSection>
  );
}
