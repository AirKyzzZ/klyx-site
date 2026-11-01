import { describe, expect, it } from "vitest";

import fr from "../../messages/fr.json";
import {
  AI_MODELS,
  CONNECTED_TOOLS,
  DEPLOYED_TECH,
  TOOLS,
  WORKFLOW_TOOL_LOGOS,
} from "./tools";

const connected = CONNECTED_TOOLS.flatMap((group) => group.tools);
const AUTOMATION_LOGOS = new Set(["make", "n8n", "zapier"]);

describe("tools", () => {
  it("lists 12 to 18 connected tools, each once", () => {
    expect(connected.length).toBeGreaterThanOrEqual(12);
    expect(connected.length).toBeLessThanOrEqual(18);
    const names = connected.map((tool) => tool.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("shows n8n, the automation tool we deploy, among connected tools", () => {
    const logos = connected.flatMap((tool) =>
      tool.logo && AUTOMATION_LOGOS.has(tool.logo) ? [tool.logo] : [],
    );
    expect(logos).toContain("n8n");
    expect(logos).not.toContain("zapier");
  });

  it("gives every tile a logo, including the brands that used to be text only", () => {
    for (const tool of [
      TOOLS.outlook,
      TOOLS.excel,
      TOOLS.teams,
      TOOLS.pipedrive,
      TOOLS.pennylane,
      TOOLS.qonto,
      TOOLS.claude,
      TOOLS.claudeCode,
      TOOLS.openai,
      TOOLS.nanoclaw,
    ]) {
      expect(tool.logo, tool.name).toBeTruthy();
    }
    const tiles = [...CONNECTED_TOOLS, ...DEPLOYED_TECH].flatMap(
      (group) => group.tools,
    );
    expect(tiles.every((tool) => tool.logo)).toBe(true);
  });

  it("shows the OpenAI, Claude and Mistral marks on AI steps", () => {
    expect(AI_MODELS.map((tool) => tool.logo)).toEqual([
      "openai",
      "claude",
      "mistral-ai",
    ]);
  });

  it("only maps workflow logos to workflows that exist in the copy", () => {
    for (const key of Object.keys(WORKFLOW_TOOL_LOGOS)) {
      const [scope, sector, workflows, example] = key.split(".");
      const value: unknown = (fr as Record<string, unknown>)[scope];
      const tools = [
        sector,
        workflows,
        "examples",
        example,
        "tools",
      ].reduce<unknown>(
        (node, part) =>
          node && typeof node === "object"
            ? (node as Record<string, unknown>)[part]
            : undefined,
        value,
      );
      expect(typeof tools, key).toBe("string");
    }
  });

  it("deploys the agreed technologies", () => {
    expect(
      DEPLOYED_TECH.flatMap((group) => group.tools.map((tool) => tool.name)),
    ).toEqual(
      expect.arrayContaining([
        "Hermes Agent",
        "OpenClaw",
        "NanoClaw",
        "Claude",
        "Claude Code",
        "OpenAI",
        "Mistral AI",
        "n8n",
        "MCP",
      ]),
    );
  });
});
