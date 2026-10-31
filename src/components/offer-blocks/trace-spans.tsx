import { getTranslations } from "next-intl/server";

import { Section, SectionHeading } from "@/components/section";
import { SampleWindow } from "@/components/sections/process-timeline";
import type { Locale } from "@/i18n/routing";
import { scenarios, type TraceLine } from "@/lib/scenarios";
import { cn } from "@/lib/utils";

type Span = TraceLine & { start: number; end: number };

const BAR_TONES: Record<NonNullable<TraceLine["tone"]> | "default", string> = {
  default: "bg-text-3/60",
  dim: "bg-surface-3",
  ok: "bg-ui-ok",
  err: "bg-ui-err",
};

function toSpans(lines: TraceLine[]): Span[] {
  const starts = lines.map((line) => Number.parseFloat(line.t));
  return lines.map((line, i) => ({
    ...line,
    start: starts[i],
    end: starts[i + 1] ?? starts[i],
  }));
}

export async function TraceSpans({
  locale,
  index,
  eyebrow,
}: {
  locale: Locale;
  index: string;
  eyebrow: string;
}) {
  const t = await getTranslations({ locale, namespace: "agents" });
  const page = await getTranslations({ locale, namespace: "offerPage" });
  const root = await getTranslations({ locale });
  const scenario = scenarios.agents;
  const spans = toSpans(scenario.trace);
  const total = spans.at(-1)?.end ?? 0;
  const seconds = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Section index={index} eyebrow={eyebrow}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="reveal space-y-8 lg:col-span-5">
          <SectionHeading
            lead={t("block.title")}
            rest={t("block.titleEmphasis")}
          />
          <p className="text-text-2 max-w-[48ch]">{t("block.body")}</p>
          <div className="border-line bg-surface-1 shadow-card rounded-md border p-5 lg:p-7">
            <h3 className="type-h3">{t("credit.title")}</h3>
            <p className="text-text-2 mt-2 text-[0.9375rem]">
              {t("credit.body")}
            </p>
          </div>
        </div>
        <div className="reveal min-w-0 lg:col-span-7">
          <SampleWindow
            file={page("trace.file", { title: root(scenario.titleKey) })}
            sample={root("liveSystem.label")}
          >
            <ol className="space-y-2.5">
              {spans.map((span) => {
                const width = ((span.end - span.start) / total) * 100;
                return (
                  <li
                    key={span.key}
                    className="grid grid-cols-[minmax(0,1fr)_3.5rem] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_3.5rem]"
                  >
                    <span
                      className={cn(
                        "truncate sm:col-start-1 sm:row-start-1",
                        span.tone === "err" ? "text-ui-err" : "text-text-2",
                        span.tone === "ok" && "text-ui-ok",
                      )}
                    >
                      {root(span.key)}
                    </span>
                    <span className="bg-surface-3/40 relative col-span-2 row-start-2 h-2 rounded-xs sm:col-span-1 sm:col-start-2 sm:row-start-1">
                      <span
                        className={cn(
                          "absolute inset-y-0 rounded-xs",
                          BAR_TONES[span.tone ?? "default"],
                        )}
                        style={{
                          left: `${(span.start / total) * 100}%`,
                          width: width > 0 ? `${width}%` : "4px",
                        }}
                      />
                    </span>
                    <span className="text-text-3 text-right text-xs sm:col-start-3 sm:row-start-1">
                      {seconds.format(span.start)} s
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="border-line text-text-3 mt-4 flex justify-between border-t pt-3 text-xs">
              <span>{page("trace.steps", { count: spans.length })}</span>
              <span>
                {page("trace.total")} {seconds.format(total)} s
              </span>
            </p>
          </SampleWindow>
        </div>
      </div>
    </Section>
  );
}
