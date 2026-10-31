import type { ReactNode } from "react";

import { ArrowUpRight, GitPullRequest } from "lucide-react";

import type { Translate } from "@/i18n/message-list";
import type { Locale } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { isVerified, type ProofSource } from "@/lib/proof";

import { BrowserFrame, hostOf } from "./browser-frame";

type Source<Kind extends ProofSource["kind"]> = Extract<
  ProofSource,
  { kind: Kind }
>;

const SCORE_KEYS = [
  "performance",
  "accessibility",
  "bestPractices",
  "seo",
] as const;

const RING = 2 * Math.PI * 17;

function formatDay(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(date));
}

function Shell({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="border-line bg-surface-1 shadow-card flex h-full flex-col overflow-hidden rounded-md border">
      <figcaption className="border-line type-label text-text-3 flex h-9 items-center justify-between gap-3 border-b px-4">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="bg-ui-ok size-1.5 rounded-full" />
          {label}
        </span>
        {meta}
      </figcaption>
      {children}
    </figure>
  );
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const tone = score >= 90 ? "var(--ui-ok)" : "var(--text-2)";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-12">
        <svg
          viewBox="0 0 40 40"
          className="size-12 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="3"
          />
          <circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke={tone}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(RING * score) / 100} ${RING}`}
          />
        </svg>
        <span className="type-data text-text absolute inset-0 grid place-items-center text-[0.8125rem]">
          {score}
        </span>
      </div>
      <span className="text-text-3 text-center text-xs leading-tight">
        {label}
      </span>
    </div>
  );
}

function Lighthouse({
  source,
  locale,
  t,
}: {
  source: Source<"lighthouse">;
  locale: Locale;
  t: Translate;
}) {
  return (
    <Shell
      label={t("kinds.lighthouse")}
      meta={<span>{hostOf(source.url)}</span>}
    >
      <div className="grid flex-1 grid-cols-4 gap-2 px-4 py-6">
        {SCORE_KEYS.map((key) => (
          <ScoreRing
            key={key}
            score={source.scores[key]}
            label={t(`scores.${key}`)}
          />
        ))}
      </div>
      <a
        href={source.url}
        target="_blank"
        rel="noopener"
        className="border-line text-text-3 hover:text-text flex items-center justify-between border-t px-4 py-3 font-mono text-xs transition-colors"
      >
        {t("measured", { date: formatDay(source.date, locale) })}
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </a>
    </Shell>
  );
}

function PrList({
  source,
  locale,
  t,
}: {
  source: Source<"pr-list">;
  locale: Locale;
  t: Translate;
}) {
  return (
    <Shell
      label={t("kinds.prList")}
      meta={<span className="normal-case">{source.repo}</span>}
    >
      <ul className="divide-line flex-1 divide-y">
        {source.items.map((item) => (
          <li key={item.number}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener"
              className="hover:bg-surface-2 flex items-start gap-3 px-4 py-3 transition-colors"
            >
              <GitPullRequest
                aria-hidden="true"
                className="text-ui-ok mt-1 size-3.5 shrink-0"
              />
              <span className="min-w-0">
                <span className="text-text block truncate text-sm">
                  {item.title}
                </span>
                <span className="text-text-3 font-mono text-xs">
                  #{item.number} ·{" "}
                  {t("merged", { date: formatDay(item.mergedAt, locale) })}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

const ROW_TONE = {
  ok: "text-ui-ok",
  err: "text-ui-err",
  dim: "text-text-3",
} as const;

function RunLog({ source, t }: { source: Source<"run-log">; t: Translate }) {
  return (
    <Shell label={t("kinds.runLog")} meta={<span>{t("anonymised")}</span>}>
      <p className="text-text-2 px-4 pt-3 font-mono text-xs">{source.title}</p>
      <ol className="type-data flex-1 space-y-1 px-4 py-3 text-[0.8125rem]">
        {source.rows.map((row, index) => (
          <li key={`${row.t}-${index}`} className="flex gap-3">
            <span className="text-text-3">{row.t}</span>
            <span className={row.tone ? ROW_TONE[row.tone] : "text-text"}>
              {row.text}
            </span>
          </li>
        ))}
      </ol>
    </Shell>
  );
}

function SiteShot({
  source,
  t,
}: {
  source: Source<"site-shot">;
  t: Translate;
}) {
  const host = hostOf(source.url);
  return (
    <Shell label={t("kinds.siteShot")} meta={<span>{t("live")}</span>}>
      <div className="flex-1 px-4 pt-4">
        <BrowserFrame
          url={source.url}
          image={source.image}
          alt={host}
          sizes="(min-width: 1024px) 360px, 300px"
          className="rounded-b-none border-b-0"
          imageClassName="max-md:aspect-[16/6]"
        />
      </div>
      <a
        href={source.url}
        target="_blank"
        rel="noopener"
        className="border-line text-text-3 hover:text-text flex items-center justify-between border-t px-4 py-3 font-mono text-xs transition-colors"
      >
        {t("open", { host })}
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </a>
    </Shell>
  );
}

export function ProofCard({
  source,
  locale,
}: {
  source: ProofSource;
  locale: Locale;
}) {
  if (!isVerified(source)) return null;
  const t = getStaticTranslator(locale, "home.proofStrip");
  switch (source.kind) {
    case "lighthouse":
      return <Lighthouse source={source} locale={locale} t={t} />;
    case "pr-list":
      return <PrList source={source} locale={locale} t={t} />;
    case "run-log":
      return <RunLog source={source} t={t} />;
    case "site-shot":
      return <SiteShot source={source} t={t} />;
  }
}
