import type { LucideIcon } from "lucide-react";
import { Inbox, ScanText, Send, UserCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ToolLogo } from "@/components/logos/tool-logo";
import { Section, SectionHeading } from "@/components/section";
import { messageKeys } from "@/i18n/message-list";
import type { Locale } from "@/i18n/routing";
import { WORKFLOW_TOOL_LOGOS } from "@/lib/tools";
import { cn } from "@/lib/utils";

const STEPS: { id: "trigger" | "ai" | "human" | "action"; icon: LucideIcon }[] =
  [
    { id: "trigger", icon: Inbox },
    { id: "ai", icon: ScanText },
    { id: "human", icon: UserCheck },
    { id: "action", icon: Send },
  ];

export async function AutomationExamples({
  locale,
  index,
  eyebrow,
  namespace = "automation.block",
  labels,
}: {
  locale: Locale;
  index: string;
  eyebrow: string;
  namespace?: string;
  labels?: { human: string; tools: string; illustration?: string };
}) {
  const t = await getTranslations({ locale, namespace });
  const examples = messageKeys(t.raw("examples"));
  const humanLabel = labels?.human ?? t("human");

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
      <ul
        className={cn(
          "reveal mt-12 grid gap-4 md:mt-16",
          examples.length === 4 ? "md:grid-cols-2" : "lg:grid-cols-3",
        )}
      >
        {examples.map((example, i) => (
          <li
            key={example}
            className="border-line-strong bg-surface-2 shadow-window flex flex-col rounded-lg border"
          >
            <p className="border-line type-label text-text-3 flex h-9 items-center border-b px-4">
              <span className="text-text-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              &nbsp;/ {t(`examples.${example}.title`)}
              {labels?.illustration && (
                <span className="hatch text-text-2 ml-auto rounded-xs px-1.5 py-0.5">
                  {labels.illustration}
                </span>
              )}
            </p>
            <ol className="flex flex-col p-4 sm:p-5">
              {STEPS.map(({ id, icon: Icon }, s) => {
                const human = id === "human";
                return (
                  <li key={id} className="flex flex-col">
                    {s > 0 && (
                      <span
                        aria-hidden="true"
                        className="bg-line-strong ml-[17px] h-4 w-px"
                      />
                    )}
                    <span
                      className={cn(
                        "flex items-center gap-3 rounded-md border px-2.5 py-2",
                        human
                          ? "border-accent/50 bg-accent-soft"
                          : "border-line bg-surface-1",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-xs",
                          human
                            ? "bg-accent text-accent-ink"
                            : "bg-surface-3 text-text-2",
                        )}
                      >
                        <Icon aria-hidden="true" className="size-3.5" />
                      </span>
                      <span className="text-text min-w-0 flex-1 font-mono text-[0.8125rem] leading-snug">
                        {t(`examples.${example}.steps.${id}`)}
                      </span>
                      {human && (
                        <span className="type-label text-text shrink-0">
                          {humanLabel}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="border-line text-text-2 mt-auto border-t px-4 py-4 text-[0.9375rem] sm:px-5">
              {t(`examples.${example}.body`)}
            </p>
            {labels && t.has(`examples.${example}.tools`) && (
              <p className="border-line type-data text-text-3 border-t px-4 py-3 text-[0.8125rem] sm:px-5">
                <span className="type-label">{labels.tools}</span>
                {WORKFLOW_TOOL_LOGOS[`${namespace}.${example}`]?.map((logo) => (
                  <ToolLogo
                    key={logo}
                    logo={logo}
                    size={14}
                    className="text-text-2 ml-2 inline-block align-[-2px]"
                  />
                ))}
                <span className="text-text-2 ml-2">
                  {t(`examples.${example}.tools`)}
                </span>
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="reveal border-line text-text-2 mt-4 rounded-md border px-5 py-4 lg:px-7">
        {t("limit")}
      </p>
    </Section>
  );
}
