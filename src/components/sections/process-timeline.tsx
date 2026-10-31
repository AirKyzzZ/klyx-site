import type { ReactNode } from "react";

import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Section, SectionHeading } from "@/components/section";
import { messageStrings } from "@/i18n/message-list";
import type { Locale } from "@/i18n/routing";
import { formatPrice, getOfferPrice } from "@/lib/offers";
import { cn } from "@/lib/utils";

import { ProcessSpy } from "./process-spy";

type Translate = Awaited<ReturnType<typeof getTranslations>>;
type StepId = "call" | "scope" | "build" | "measure";

const STEP_IDS: StepId[] = ["call", "scope", "build", "measure"];
const SAMPLE_WEEK = ["2026-11-02", "2026-11-03", "2026-11-04"];
const SAMPLE_SLOTS = [
  ["09:30", "14:00"],
  ["11:00", "16:30"],
  ["10:00", "17:30"],
];
const PICKED = { day: 1, slot: 0 };

export function SampleWindow({
  file,
  sample,
  children,
}: {
  file: string;
  sample: string;
  children: ReactNode;
}) {
  return (
    <div className="border-line-strong bg-surface-2 shadow-window overflow-hidden rounded-lg border">
      <div className="border-line text-text-3 flex h-9 items-center gap-2 border-b px-3 font-mono text-xs">
        <span className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <i
              key={dot}
              className="bg-surface-3 size-2.25 rounded-full shadow-[inset_0_0_0_1px_var(--line-strong)]"
            />
          ))}
        </span>
        <span className="ml-1 truncate">{file}</span>
        <span className="border-line-strong type-label ml-auto rounded-xs border px-1.5 py-0.5">
          {sample}
        </span>
      </div>
      <div className="type-data p-4 text-[0.8125rem] sm:p-5">{children}</div>
    </div>
  );
}

function CallSample({ t, locale }: { t: Translate; locale: Locale }) {
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return (
    <>
      <p className="text-text font-sans text-sm font-medium">
        {t("call.title")}
      </p>
      <p className="text-text-3 text-xs">{t("call.meta")}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {SAMPLE_WEEK.map((day, d) => (
          <div key={day} className="space-y-2">
            <p className="text-text-3 text-xs">
              {weekday.format(new Date(day))}
            </p>
            {SAMPLE_SLOTS[d].map((slot, s) => {
              const picked = d === PICKED.day && s === PICKED.slot;
              return (
                <p
                  key={slot}
                  className={cn(
                    "rounded-xs border px-2 py-1.5 text-center",
                    picked
                      ? "border-accent bg-accent-soft text-text"
                      : "border-line-strong text-text-2",
                  )}
                >
                  {slot}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

function ScopeSample({
  t,
  price,
  duration,
}: {
  t: Translate;
  price: string;
  duration: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-text"># {t("scope.title")}</p>
      <p className="text-text-3 pt-2">## {t("scope.inLabel")}</p>
      {messageStrings(t, "scope.in").map((line) => (
        <p key={line} className="text-text-2">
          <span className="text-ui-ok">+</span> {line}
        </p>
      ))}
      <p className="text-text-3 pt-2">## {t("scope.outLabel")}</p>
      {messageStrings(t, "scope.out").map((line) => (
        <p key={line} className="text-text-2">
          <span className="text-ui-err">−</span> {line}
        </p>
      ))}
      <p className="border-line mt-3 flex flex-wrap justify-between gap-x-4 border-t pt-3">
        <span className="text-text-3">{t("scope.price")}</span>
        <span className="text-text">
          {price} · {duration}
        </span>
      </p>
    </div>
  );
}

function BuildSample({ t }: { t: Translate }) {
  const items = messageStrings(t, "build.items");
  return (
    <>
      <p className="text-text font-sans text-sm font-medium">
        {t("build.title")}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => {
          const doing = i === items.length - 1;
          return (
            <li key={item} className="flex items-center gap-3">
              {doing ? (
                <span
                  aria-hidden="true"
                  className="bg-accent mx-1 size-1.5 shrink-0 rounded-full"
                />
              ) : (
                <Check
                  aria-hidden="true"
                  className="text-ui-ok size-3.5 shrink-0"
                />
              )}
              <span className="text-text-2 min-w-0 flex-1">{item}</span>
              <span className="text-text-3 text-xs">
                {doing ? t("build.doing") : t("build.done")}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="border-line text-text-2 mt-4 border-t pt-3">
        → {t("build.next")}
      </p>
    </>
  );
}

function MeasureSample({ t }: { t: Translate }) {
  const items = messageStrings(t, "measure.items");
  return (
    <>
      <p className="text-text font-sans text-sm font-medium">
        {t("measure.title")}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => {
          const open = i === items.length - 1;
          return (
            <li key={item} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-xs border",
                  open ? "border-line-strong" : "border-ui-ok/50 text-ui-ok",
                )}
              >
                {!open && <Check className="size-3" />}
              </span>
              <span className={open ? "text-text-3" : "text-text-2"}>
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export async function ProcessTimeline({
  locale,
  index,
  eyebrow,
}: {
  locale: Locale;
  index?: string;
  eyebrow?: string;
}) {
  const t = await getTranslations({ locale, namespace: "home.process" });
  const offersT = await getTranslations({ locale, namespace: "offers" });
  const sample = t("sample");
  const ids = STEP_IDS.map((id) => `process-${id}`);

  const artefacts: Record<StepId, ReactNode> = {
    call: <CallSample t={t} locale={locale} />,
    scope: (
      <ScopeSample
        t={t}
        price={formatPrice(getOfferPrice("sprint-ia"), locale)}
        duration={offersT("items.sprintIa.duration")}
      />
    ),
    build: <BuildSample t={t} />,
    measure: <MeasureSample t={t} />,
  };
  const files: Record<StepId, string> = {
    call: t("call.file"),
    scope: t("scope.file"),
    build: t("build.file"),
    measure: t("measure.file"),
  };

  return (
    <Section index={index} eyebrow={eyebrow}>
      <SectionHeading
        lead={t("title")}
        rest={t("titleEmphasis")}
        className="reveal"
      />
      <div className="border-line mt-12 border-t md:mt-16 lg:grid lg:grid-cols-[240px_1fr]">
        <nav
          aria-label={`${t("title")} ${t("titleEmphasis")}`}
          className="border-line hidden border-r lg:block"
        >
          <ol className="sticky top-28 py-12">
            {STEP_IDS.map((id, i) => (
              <li key={id}>
                <a
                  href={`#process-${id}`}
                  data-spy-link={`process-${id}`}
                  data-active={i === 0 ? "" : undefined}
                  className="group text-text-3 hover:text-text-2 data-active:text-text data-active:before:bg-accent relative flex items-baseline gap-3 py-2.5 pr-6 transition-colors duration-(--d-fast) before:absolute before:top-1/2 before:-right-px before:h-7 before:w-px before:-translate-y-1/2 before:bg-transparent before:transition-colors"
                >
                  <span className="group-data-active:text-accent font-mono text-xs transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1.0625rem] tracking-[-0.015em]">
                    {t(`steps.${id}.title`)}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <ol>
          {STEP_IDS.map((id, i) => (
            <li
              key={id}
              id={`process-${id}`}
              className="border-line grid scroll-mt-28 gap-8 border-b py-10 last:border-b-0 lg:grid-cols-2 lg:gap-12 lg:py-16 lg:pl-12"
            >
              <div className="reveal">
                <p className="type-label text-text-3">
                  <span className="text-text-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  / {files[id]}
                </p>
                <h3 className="type-h3 mt-4">{t(`steps.${id}.title`)}</h3>
                <p className="text-text-2 mt-3 max-w-[46ch]">
                  {t(`steps.${id}.body`)}
                </p>
              </div>
              <div className="reveal max-lg:max-h-40 max-lg:overflow-hidden max-lg:[mask-image:linear-gradient(180deg,#000_65%,transparent)]">
                <SampleWindow file={files[id]} sample={sample}>
                  {artefacts[id]}
                </SampleWindow>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <ProcessSpy ids={ids} />
    </Section>
  );
}
