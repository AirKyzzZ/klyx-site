import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

import { edgeKey, finalState, scenarios } from "./scenarios";

function lookup(messages: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((node, part) => {
    if (typeof node !== "object" || node === null) return undefined;
    return (node as Record<string, unknown>)[part];
  }, messages);
}

const all = Object.values(scenarios);

describe("scenarios", () => {
  it("keys every scenario by its id", () => {
    for (const [id, scenario] of Object.entries(scenarios)) {
      expect(scenario.id).toBe(id);
    }
  });

  it.each(all)("$id edges reference existing nodes", (scenario) => {
    const ids = new Set(scenario.nodes.map((node) => node.id));
    for (const edge of scenario.edges) {
      expect(ids).toContain(edge.from);
      expect(ids).toContain(edge.to);
    }
  });

  it.each(all)("$id steps are time-sorted", (scenario) => {
    const times = scenario.steps.map((step) => step.at);
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it.each(all)(
    "$id steps reference real nodes, edges and lines",
    (scenario) => {
      const ids = new Set(scenario.nodes.map((node) => node.id));
      const edges = new Set(scenario.edges.map((e) => edgeKey(e.from, e.to)));
      for (const step of scenario.steps) {
        if (step.node) expect(ids).toContain(step.node);
        if (step.edge) expect(edges).toContain(edgeKey(...step.edge));
        if (step.line !== undefined) {
          expect(step.line).toBeLessThan(scenario.trace.length);
        }
      }
      const lines = scenario.steps.flatMap((step) =>
        step.line === undefined ? [] : [step.line],
      );
      expect(lines).toEqual(scenario.trace.map((_, index) => index));
      expect(scenario.steps.filter((step) => step.chip)).toHaveLength(1);
    },
  );

  it.each(all)("$id keeps nodes inside the graph box", (scenario) => {
    for (const node of scenario.nodes) {
      for (const value of [node.x, node.y, node.mx, node.my]) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    }
  });

  it.each(all)("$id has every string in both message files", (scenario) => {
    const keys = [
      scenario.titleKey,
      scenario.chipKey,
      `liveSystem.tabs.${scenario.id}`,
      ...scenario.nodes.map((node) => node.labelKey),
      ...scenario.trace.map((line) => line.key),
    ];
    for (const key of keys) {
      expect(typeof lookup(fr, key), `fr ${key}`).toBe("string");
      expect(typeof lookup(en, key), `en ${key}`).toBe("string");
    }
  });

  it("labels every scenario as an illustration except sites", () => {
    for (const scenario of all) {
      expect(scenario.illustration).toBe(scenario.id !== "sites");
    }
  });

  it("final state marks every stepped node and edge done", () => {
    const { doneNodes, doneEdges } = finalState(scenarios.agents);
    expect([...doneNodes]).toEqual(["inbox", "classifier", "crm", "slack"]);
    expect(doneEdges.has(edgeKey("classifier", "archive"))).toBe(false);
    expect(doneEdges.has(edgeKey("crm", "slack"))).toBe(true);
  });
});
