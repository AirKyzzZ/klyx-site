import { getTranslations } from "next-intl/server";

import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import type { Locale } from "@/i18n/routing";
import { AGENT_LOG, formatSeconds, type LogTone } from "@/lib/offer-block-data";
import { cn } from "@/lib/utils";

import { InfoCard, SampleBadge } from "./info-card";

const DOTS: Record<LogTone | "default", string> = {
  default: "bg-line-strong",
  ok: "bg-ui-ok",
  err: "bg-ui-err",
};

export async function AgentLog({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "agents" });
  const page = await getTranslations({ locale, namespace: "offerPage" });
  const total = AGENT_LOG.at(-1)?.at ?? 0;

  return (
    <PageSection id="journal">
      <SectionHeader title={t("block.title")} intro={t("block.intro")} />
      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="border-line bg-surface-1 shadow-panel overflow-hidden rounded-[20px] border">
          <div className="border-line flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
            <p className="text-text text-base font-semibold">
              {t("block.log.title")}
            </p>
            <SampleBadge label={page("sample")} />
          </div>
          <ol className="divide-line divide-y px-5 sm:px-6">
            {AGENT_LOG.map((line) => (
              <li key={line.key} className="flex items-center gap-3.5 py-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    DOTS[line.tone ?? "default"],
                  )}
                />
                <span
                  className={cn(
                    "min-w-0 flex-1 text-[0.9375rem] leading-snug",
                    line.tone === "err" ? "text-text-2" : "text-text",
                  )}
                >
                  {t(`block.log.items.${line.key}`)}
                </span>
                <span className="text-text-3 shrink-0 font-mono text-[0.8125rem] tabular-nums">
                  {formatSeconds(locale, line.at)}&nbsp;s
                </span>
              </li>
            ))}
          </ol>
          <div className="border-line bg-surface-2 text-text-3 flex justify-between gap-4 border-t px-5 py-3.5 text-[0.8125rem] sm:px-6">
            <span>{t("block.log.steps", { count: AGENT_LOG.length })}</span>
            <span>
              {t("block.log.total", { seconds: formatSeconds(locale, total) })}
            </span>
          </div>
        </div>
        <InfoCard title={t("credit.title")} body={t("credit.body")} />
      </div>
    </PageSection>
  );
}
