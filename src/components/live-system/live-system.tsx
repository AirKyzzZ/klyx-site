import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import lighthouse from "@/lib/proof/klyx-lighthouse.json";
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

function measuredPerformance(data: unknown): number | null {
  if (typeof data !== "object" || data === null) return null;
  if (!("status" in data) || data.status !== "measured") return null;
  if (!("scores" in data) || typeof data.scores !== "object") return null;
  const scores = data.scores;
  if (scores === null || !("performance" in scores)) return null;
  return typeof scores.performance === "number" ? scores.performance : null;
}

function chipText(scenario: Scenario, t: Translate): string | null {
  if (scenario.id !== "sites") return t(scenario.chipKey);
  const score = measuredPerformance(lighthouse);
  if (score !== null) return t(scenario.chipKey, { score });
  if (process.env.NODE_ENV === "development") {
    return t("liveSystem.scenarios.sites.chipPending");
  }
  return null;
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
  const ownCaption = `liveSystem.scenarios.${initial}.caption`;
  const captionKey =
    !withTabs && t.has(ownCaption) ? ownCaption : "liveSystem.caption";
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
        <p className="ls-caption">{t(captionKey)}</p>
      </div>
    </LiveSystemPlayer>
  );
}
