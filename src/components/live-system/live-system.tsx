import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import lighthouseData from "@/lib/proof/klyx-lighthouse.json";
import { verifyLighthouse } from "@/lib/proof";
import {
  finalState,
  type Scenario,
  type ScenarioId,
  type ScenarioStep,
  scenarios,
} from "@/lib/scenarios";

import { AgentGraph } from "./agent-graph";
import { LitFrame } from "./lit-frame";
import { LiveSystemPlayer } from "./live-system-player";
import { ResultChip } from "./result-chip";
import { ScenarioTabs } from "./scenario-tabs";
import { TerminalTrace } from "./terminal-trace";

import "./live-system.css";

type Translate = Awaited<ReturnType<typeof getTranslations>>;

const lighthouse = verifyLighthouse(lighthouseData);

function chipText(scenario: Scenario, t: Translate): string | null {
  if (scenario.id !== "sites") return t(scenario.chipKey);
  if (lighthouse?.kind === "lighthouse") {
    return t(scenario.chipKey, { score: lighthouse.scores.performance });
  }
  if (process.env.NODE_ENV === "development") {
    return t("liveSystem.scenarios.sites.chipPending");
  }
  return null;
}

function captionKeyFor(scenario: Scenario, withTabs: boolean, t: Translate) {
  const own = `liveSystem.scenarios.${scenario.id}.caption`;
  return !withTabs && t.has(own) ? own : "liveSystem.caption";
}

function captionText(
  scenario: Scenario,
  withTabs: boolean,
  t: Translate,
  locale: Locale,
): string {
  if (scenario.id === "sites" && lighthouse?.kind === "lighthouse") {
    const date = new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(lighthouse.date));
    return t("liveSystem.scenarios.sites.measuredCaption", { date });
  }
  return t(captionKeyFor(scenario, withTabs, t));
}

function groupCaptions(
  list: Scenario[],
  withTabs: boolean,
  t: Translate,
  locale: Locale,
) {
  const groups = new Map<string, ScenarioId[]>();
  for (const scenario of list) {
    const text = captionText(scenario, withTabs, t, locale);
    groups.set(text, [...(groups.get(text) ?? []), scenario.id]);
  }
  return [...groups].map(([text, ids]) => ({ text, ids }));
}

export async function LiveSystem({
  scenarioIds,
  initial,
  priority = false,
  locale,
}: {
  scenarioIds: ScenarioId[];
  initial: ScenarioId;
  priority?: boolean;
  locale: Locale;
}) {
  const t = await getTranslations({ locale });
  const list = scenarioIds.map((id) => scenarios[id]);
  const withTabs = list.length > 1;
  const captions = groupCaptions(list, withTabs, t, locale);
  const steps: Partial<Record<string, ScenarioStep[]>> = Object.fromEntries(
    list.map((scenario) => [scenario.id, scenario.steps]),
  );

  return (
    <LiveSystemPlayer scenarios={steps} initial={initial} className="ls">
      <div data-layout={withTabs ? "wide" : "compact"} className="ls-layout">
        <LitFrame label={t("liveSystem.label")} priority={priority}>
          {list.map((scenario) => {
            const title = t(scenario.titleKey);
            const chip = chipText(scenario, t);
            return (
              <div
                key={scenario.id}
                id={`ls-stage-${scenario.id}`}
                className="ls-stage"
                data-ls-stage={scenario.id}
                hidden={scenario.id !== initial}
                {...(withTabs && {
                  role: "tabpanel",
                  "aria-labelledby": `ls-tab-${scenario.id}`,
                })}
              >
                <AgentGraph
                  scenario={scenario}
                  state={finalState(scenario)}
                  title={title}
                  run={{
                    active: t("liveSystem.run.active"),
                    done: t("liveSystem.run.done"),
                  }}
                  metas={Object.fromEntries(
                    scenario.nodes.map((node) => [node.id, t(node.metaKey)]),
                  )}
                  labels={Object.fromEntries(
                    scenario.nodes.map((node) => [node.id, t(node.labelKey)]),
                  )}
                />
                <TerminalTrace
                  title={`${t("liveSystem.trace")} · ${title}`}
                  lines={scenario.trace.map((line) => ({
                    ...line,
                    text: t(line.key),
                  }))}
                />
                {chip && (
                  <>
                    <span className="ls-link" aria-hidden="true" />
                    <ResultChip>{chip}</ResultChip>
                  </>
                )}
              </div>
            );
          })}
        </LitFrame>
        {withTabs && (
          <ScenarioTabs
            label={t("liveSystem.tablist")}
            selected={initial}
            tabs={list.map((scenario) => ({
              id: scenario.id,
              label: t(`liveSystem.tabs.${scenario.id}`),
              href: scenario.href,
            }))}
          />
        )}
        {captions.map(({ text, ids }) => (
          <p
            key={ids.join(" ")}
            className="ls-caption"
            data-ls-caption={ids.join(" ")}
            hidden={!ids.includes(initial)}
          >
            {text}
          </p>
        ))}
      </div>
    </LiveSystemPlayer>
  );
}
