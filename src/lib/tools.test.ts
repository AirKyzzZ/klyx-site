import { describe, expect, it } from "vitest";

import { CONNECTED_TOOLS, DEPLOYED_TECH, TOOLS } from "./tools";

const connected = CONNECTED_TOOLS.flatMap((group) => group.tools);
const AUTOMATION_LOGOS = new Set(["make", "n8n", "zapier"]);

describe("tools", () => {
  it("lists 12 to 16 connected tools, each once", () => {
    expect(connected.length).toBeGreaterThanOrEqual(12);
    expect(connected.length).toBeLessThanOrEqual(16);
    const names = connected.map((tool) => tool.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("shows at most one automation logo among connected tools", () => {
    const logos = connected.filter(
      (tool) => tool.logo && AUTOMATION_LOGOS.has(tool.logo),
    );
    expect(logos.length).toBeLessThanOrEqual(1);
  });

  it("keeps text-only names for brands without a usable logo licence", () => {
    for (const tool of [
      TOOLS.outlook,
      TOOLS.excel,
      TOOLS.teams,
      TOOLS.pipedrive,
      TOOLS.pennylane,
      TOOLS.claude,
      TOOLS.claudeCode,
      TOOLS.openai,
      TOOLS.nanoclaw,
    ]) {
      expect(tool, tool.name).not.toHaveProperty("logo");
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
