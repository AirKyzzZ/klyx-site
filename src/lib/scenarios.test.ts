import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

import {
  edgeKey,
  finalState,
  lastEdge,
  scenarios,
  terminalNode,
} from "./scenarios";
import { TOOLS, type ToolLogoId } from "./tools";

function lookup(messages: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((node, part) => {
    if (typeof node !== "object" || node === null) return undefined;
    return (node as Record<string, unknown>)[part];
  }, messages);
}

const all = Object.values(scenarios);

const LOGO_TEXT: Partial<Record<ToolLogoId, string[]>> = {
  zendesk: ["Zendesk"],
  git: ["git"],
  nextjs: ["Next.js", "next build"],
  lighthouse: ["Lighthouse"],
  perplexity: ["Perplexity"],
  "google-gemini": ["Gemini"],
  google: ["AI Overview"],
  openai: ["ChatGPT"],
};

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
      ...scenario.nodes.map((node) => node.metaKey),
      ...scenario.trace.map((line) => line.key),
    ];
    for (const key of keys) {
      expect(typeof lookup(fr, key), `fr ${key}`).toBe("string");
      expect(typeof lookup(en, key), `en ${key}`).toBe("string");
    }
  });

  it.each(all)("$id names every node logo in its text", (scenario) => {
    for (const node of scenario.nodes.filter((n) => n.tool)) {
      const names = [
        ...Object.values(TOOLS)
          .filter((candidate) => candidate.logo === node.tool)
          .map((candidate) => candidate.name),
        ...(node.tool ? (LOGO_TEXT[node.tool] ?? []) : []),
      ];
      expect(names, node.id).not.toHaveLength(0);
      for (const messages of [fr, en]) {
        const text = `${String(lookup(messages, node.labelKey))} ${String(lookup(messages, node.metaKey))}`;
        expect(
          names.some((name) => text.toLowerCase().includes(name.toLowerCase())),
          `${node.id}: ${text}`,
        ).toBe(true);
      }
    }
  });

  it.each(all)("$id marks AI steps with the model logos", (scenario) => {
    for (const node of scenario.nodes.filter((n) => n.models)) {
      expect(node.tool, node.id).toBeUndefined();
      for (const messages of [fr, en]) {
        const text = `${String(lookup(messages, node.labelKey))} ${String(lookup(messages, node.metaKey))}`;
        expect(text, node.id).toMatch(/\b(IA|AI)\b/);
      }
    }
  });

  it("labels every scenario as an illustration except sites", () => {
    for (const scenario of all) {
      expect(scenario.illustration).toBe(scenario.id !== "sites");
    }
  });

  it("gives each sector page its own scenario, with no klyx.fr deployment", () => {
    for (const id of ["realEstate", "agencies", "services"] as const) {
      expect(scenarios[id].illustration).toBe(true);
      for (const messages of [fr, en]) {
        const copy = JSON.stringify(
          lookup(messages, `liveSystem.scenarios.${id}`),
        );
        expect(copy, id).not.toContain("klyx.fr");
        expect(
          typeof lookup(messages, `liveSystem.scenarios.${id}.caption`),
          id,
        ).toBe("string");
      }
    }
  });

  it("final state marks every stepped node and edge done", () => {
    const { doneNodes, doneEdges } = finalState(scenarios.agents);
    expect([...doneNodes]).toEqual(["inbox", "classifier", "crm", "slack"]);
    expect(doneEdges.has(edgeKey("classifier", "archive"))).toBe(false);
    expect(doneEdges.has(edgeKey("crm", "slack"))).toBe(true);
  });
});

const MOBILE_LINES = 7;
const DESKTOP_LINES = 11;
const MOBILE_LINE_CHARS = 30;
const NODE_LABEL_CHARS = 14;

function text(messages: unknown, key: string) {
  const value = lookup(messages, key);
  return typeof value === "string" ? value : "";
}

describe("scenario fit", () => {
  it.each(all)("$id trace fits the terminal on both layouts", (scenario) => {
    expect(scenario.trace.length).toBeLessThanOrEqual(DESKTOP_LINES);
    const mobile = scenario.trace.filter((line) => line.mobile);
    expect(mobile.length).toBeLessThanOrEqual(MOBILE_LINES);
    for (const line of mobile) {
      for (const messages of [fr, en]) {
        expect(
          text(messages, line.key).length,
          text(messages, line.key),
        ).toBeLessThanOrEqual(MOBILE_LINE_CHARS);
      }
    }
  });

  it.each(all)("$id has one agent node and short node strings", (scenario) => {
    expect(scenario.nodes.filter((node) => node.agent)).toHaveLength(1);
    for (const node of scenario.nodes) {
      for (const messages of [fr, en]) {
        expect(
          text(messages, node.labelKey).length,
          text(messages, node.labelKey),
        ).toBeLessThanOrEqual(NODE_LABEL_CHARS);
        expect(
          text(messages, node.metaKey).length,
          text(messages, node.metaKey),
        ).toBeLessThanOrEqual(node.agent ? 16 : 10);
      }
    }
  });

  it.each(all)(
    "$id ends on the top-right node next to the chip",
    (scenario) => {
      const terminal = scenario.nodes.find(
        (node) => node.id === terminalNode(scenario),
      );
      expect(terminal).toMatchObject({ x: 87, y: 28 });
      expect(lastEdge(scenario)?.endsWith(`>${terminal?.id}`)).toBe(true);
    },
  );
});
