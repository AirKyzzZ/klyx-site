import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { messageKeys } from "@/i18n/message-list";
import type { Locale } from "@/i18n/routing";
import { AUDIT_COLUMNS } from "@/lib/offer-block-data";
import { cn } from "@/lib/utils";

import { InfoCard, SampleBadge } from "./info-card";

export async function AuditDocument({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "audit.block" });
  const page = await getTranslations({ locale, namespace: "offerPage" });
  const rows = messageKeys(t.raw("document.rows"));

  return (
    <PageSection id="livrable">
      <SectionHeader title={t("title")} intro={t("intro")} />
      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="border-line bg-surface-1 shadow-panel overflow-hidden rounded-[20px] border">
          <div className="border-line flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-0.5">
              <p className="text-text text-base font-semibold">
                {t("document.heading")}
              </p>
              <p className="text-text-3 text-[0.8125rem]">
                {t("document.company")}
              </p>
            </div>
            <SampleBadge label={page("sample")} />
          </div>
          <table className="w-full text-left text-[0.9375rem]">
            <thead className="max-md:sr-only">
              <tr className="text-text-3 text-[0.8125rem]">
                {AUDIT_COLUMNS.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-3 py-3 font-medium first:pl-6 last:pr-6"
                  >
                    {t(`document.columns.${column}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row}
                  className="border-line border-t max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-1 max-md:px-5 max-md:py-4"
                >
                  {AUDIT_COLUMNS.map((column) => (
                    <td
                      key={column}
                      className={cn(
                        "px-3 py-3.5 align-top first:pl-6 last:pr-6 max-md:p-0 max-md:first:pl-0 max-md:last:pr-0",
                        column === "process"
                          ? "text-text font-medium max-md:col-span-2"
                          : "text-text-2",
                      )}
                    >
                      {column !== "process" && (
                        <span className="text-text-3 block text-[0.8125rem] md:hidden">
                          {t(`document.columns.${column}`)}
                        </span>
                      )}
                      {t(`document.rows.${row}.${column}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-line bg-surface-2 text-text-3 border-t px-5 py-3.5 text-[0.8125rem] sm:px-6">
            {t("document.note")}
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <InfoCard title={t("credit.title")} body={t("credit.body")} />
          <InfoCard title={t("bpifrance.title")} body={t("bpifrance.body")}>
            <a
              href={t("bpifrance.url")}
              target="_blank"
              rel="noopener"
              className="text-text hover:text-accent-text mt-2 inline-flex w-fit items-center gap-1 text-sm font-medium underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)"
            >
              {t("bpifrance.source")}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          </InfoCard>
        </div>
      </div>
    </PageSection>
  );
}
