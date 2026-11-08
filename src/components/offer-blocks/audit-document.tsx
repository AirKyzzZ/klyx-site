import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Section, SectionHeading } from "@/components/section";
import { SampleWindow } from "@/components/sections/process-timeline";
import { messageKeys } from "@/i18n/message-list";
import type { Locale } from "@/i18n/routing";

const COLUMNS = ["process", "hours", "offer", "risk", "when"] as const;

export async function AuditDocument({
  locale,
  index,
  eyebrow,
}: {
  locale: Locale;
  index: string;
  eyebrow: string;
}) {
  const t = await getTranslations({ locale, namespace: "audit.block" });
  const rows = messageKeys(t.raw("document.rows"));

  return (
    <Section index={index} eyebrow={eyebrow}>
      <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
        <SectionHeading
          lead={t("title")}
          rest={t("titleEmphasis")}
          className="lg:col-span-7"
        />
        <p className="text-text-2 max-w-[44ch] lg:col-span-4 lg:col-start-9">
          {t("body")}
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-12">
        <div className="reveal min-w-0 lg:col-span-8">
          <SampleWindow file={t("document.file")} sample={t("document.sample")}>
            <p className="text-text"># {t("document.heading")}</p>
            <p className="text-text-3 mt-1">{t("document.company")}</p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[34rem] text-left">
                <thead>
                  <tr className="border-line text-text-3 border-b">
                    {COLUMNS.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="py-2 pr-4 font-normal last:pr-0"
                      >
                        {t(`document.columns.${column}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row}
                      className="border-line border-b last:border-b-0"
                    >
                      {COLUMNS.map((column) => (
                        <td
                          key={column}
                          className={
                            column === "process"
                              ? "text-text py-2.5 pr-4"
                              : "text-text-2 py-2.5 pr-4 last:pr-0"
                          }
                        >
                          {column === "process" && (
                            <span
                              className={
                                i === 0 ? "text-accent-text" : "text-text-3"
                              }
                            >
                              {i + 1}.{" "}
                            </span>
                          )}
                          {t(`document.rows.${row}.${column}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-line text-text-3 mt-4 border-t pt-3 text-xs">
              {t("document.note")}
            </p>
          </SampleWindow>
        </div>
        <div className="reveal space-y-4 lg:col-span-4">
          <div className="border-line bg-surface-1 shadow-card rounded-md border p-5 lg:p-6">
            <h3 className="type-h3">{t("credit.title")}</h3>
            <p className="text-text-2 mt-2 text-[0.9375rem]">
              {t("credit.body")}
            </p>
          </div>
          <aside className="border-line rounded-md border p-5 lg:p-6">
            <p className="type-label text-text-3">{t("bpifrance.label")}</p>
            <h3 className="type-h3 mt-3">{t("bpifrance.title")}</h3>
            <p className="text-text-2 mt-2 text-[0.9375rem]">
              {t("bpifrance.body")}
            </p>
            <a
              href={t("bpifrance.url")}
              target="_blank"
              rel="noopener"
              className="type-data text-text-2 hover:text-text mt-4 inline-flex items-center gap-1 text-xs underline underline-offset-4 transition-colors"
            >
              {t("bpifrance.source")}
              <ArrowUpRight aria-hidden="true" className="size-3" />
            </a>
          </aside>
        </div>
      </div>
    </Section>
  );
}
