export type Credit = {
  key: "mcp" | "simpleIcons" | "hermes" | "openclaw";
  source: string;
  license?: string;
};

export const CREDITS: Credit[] = [
  {
    key: "mcp",
    source: "https://github.com/modelcontextprotocol/modelcontextprotocol",
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
  { key: "simpleIcons", source: "https://simpleicons.org" },
  { key: "hermes", source: "https://github.com/NousResearch/hermes-agent" },
  { key: "openclaw", source: "https://github.com/openclaw/openclaw" },
];
