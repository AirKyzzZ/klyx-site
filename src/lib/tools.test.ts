import { describe, expect, it } from "vitest";

import { CONNECTED_TOOLS, DEPLOYED_TECH, TOOLS } from "./tools";

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
