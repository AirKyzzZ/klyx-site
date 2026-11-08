import { getTranslations } from "next-intl/server";

import { Section, SectionHeading } from "@/components/section";
import type { Locale } from "@/i18n/routing";

import "./work-log.css";

type Actor = "human" | "klyx" | "agent";

const ENTRIES: { id: string; actor: Actor; tone?: "ok" | "err" }[] = [
  { id: "ticket", actor: "human" },
  { id: "branch", actor: "klyx" },
  { id: "wired", actor: "agent" },
  { id: "red", actor: "agent", tone: "err" },
  { id: "fixed", actor: "klyx", tone: "ok" },
  { id: "review", actor: "human" },
  { id: "deployed", actor: "klyx", tone: "ok" },
];

export async function WorkLog({
  locale,
  index,
  eyebrow,
}: {
  locale: Locale;
  index: string;
  eyebrow: string;
}) {
  const t = await getTranslations({ locale, namespace: "workLog" });

  return (
    <Section id="journal" index={index} eyebrow={eyebrow}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="reveal space-y-6 lg:col-span-5">
          <SectionHeading lead={t("title")} rest={t("titleEmphasis")} />
          <p className="text-text-2 max-w-[48ch]">{t("body")}</p>
        </div>
        <figure className="wl reveal lg:col-span-7">
          <div className="wl-chrome">
            <span className="text-text">{t("window")}</span>
            <span>{t("repo")}</span>
          </div>
          <ol className="wl-rows">
            {ENTRIES.map(({ id, actor, tone }) => (
              <li
                key={id}
                className="wl-row"
                data-actor={actor}
                data-tone={tone}
              >
                <span className="wl-time">{t(`entries.${id}.time`)}</span>
                <span className="wl-dot" aria-hidden="true" />
                <span className="wl-text">
                  <span className="wl-title">{t(`entries.${id}.title`)}</span>{" "}
                  <span className="wl-detail">{t(`entries.${id}.detail`)}</span>
                </span>
                <span className="wl-actor">{t(`actors.${actor}`)}</span>
              </li>
            ))}
          </ol>
          <figcaption className="wl-strip">{t("label")}</figcaption>
        </figure>
      </div>
    </Section>
  );
}
