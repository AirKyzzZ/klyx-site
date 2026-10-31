import { getTranslations } from "next-intl/server";

import { Section, SectionHeading } from "@/components/section";
import { SampleWindow } from "@/components/sections/process-timeline";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type State = "cited" | "competitor" | "absent";

const ENGINES = ["ChatGPT", "Perplexity", "Gemini", "AI Overviews"] as const;

const SAMPLE: { prompt: "a" | "b" | "c"; states: State[] }[] = [
  { prompt: "a", states: ["cited", "cited", "competitor", "absent"] },
  { prompt: "b", states: ["competitor", "cited", "absent", "competitor"] },
  { prompt: "c", states: ["absent", "competitor", "absent", "absent"] },
];

const STATE_STYLES: Record<State, { dot: string; text: string }> = {
  cited: { dot: "bg-ui-ok", text: "text-text" },
  competitor: { dot: "bg-text-3", text: "text-text-2" },
  absent: { dot: "border border-text-3", text: "text-text-3" },
};

export async function GeoVisibility({
  locale,
  index,
  eyebrow,
}: {
  locale: Locale;
  index: string;
  eyebrow: string;
}) {
  const t = await getTranslations({ locale, namespace: "geo.block" });
  const all = SAMPLE.flatMap((row) => row.states);
  const cited = all.filter((state) => state === "cited").length;
  const quote = (text: string) =>
    locale === "fr" ? `« ${text} »` : `"${text}"`;

  return (
    <Section index={index} eyebrow={eyebrow}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="reveal space-y-8 lg:col-span-4">
          <SectionHeading lead={t("title")} rest={t("titleEmphasis")} />
          <p className="text-text-2 max-w-[48ch]">{t("body")}</p>
          <aside className="border-line bg-surface-1 shadow-card rounded-md border p-5 lg:p-6">
            <p className="type-label text-text-3">{t("disclosure.label")}</p>
            <p className="text-text-2 mt-3 text-[0.9375rem]">
              {t("disclosure.body")}
            </p>
          </aside>
        </div>
        <div className="reveal min-w-0 lg:col-span-7 lg:col-start-6">
          <SampleWindow file={t("card.file")} sample={t("card.sample")}>
            <p className="text-text"># {t("card.site")}</p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left">
                <thead>
                  <tr className="border-line text-text-3 border-b">
                    <th scope="col" className="py-2 pr-4 font-normal">
                      {t("card.promptsLabel")}
                    </th>
                    {ENGINES.map((engine) => (
                      <th
                        key={engine}
                        scope="col"
                        className="py-2 pr-3 font-normal whitespace-nowrap last:pr-0"
                      >
                        {engine}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE.map((row) => (
                    <tr
                      key={row.prompt}
                      className="border-line border-b last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="text-text-2 py-3 pr-4 font-normal"
                      >
                        {quote(t(`card.prompts.${row.prompt}`))}
                      </th>
                      {row.states.map((state, i) => (
                        <td key={ENGINES[i]} className="py-3 pr-3 last:pr-0">
                          <span
                            className={cn(
                              "inline-flex items-center gap-2",
                              STATE_STYLES[state].text,
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                "size-1.5 rounded-full",
                                STATE_STYLES[state].dot,
                              )}
                            />
                            {t(`card.states.${state}`)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-line text-text-3 mt-4 border-t pt-3 text-xs">
              {t("card.summary", { cited, total: all.length })}
            </p>
          </SampleWindow>
          <p className="type-label text-text-3 mt-4">{t("realData")}</p>
        </div>
      </div>
    </Section>
  );
}
