export type Credit = {
  key:
    | "mcp"
    | "simpleIcons"
    | "microsoft"
    | "git"
    | "pipedrive"
    | "pennylane"
    | "qonto"
    | "hermes"
    | "openclaw"
    | "nanoclaw";
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
  {
    key: "microsoft",
    source: "https://developer.microsoft.com/en-us/fluentui",
    license: "https://aka.ms/fluentui-assets-license",
  },
  {
    key: "git",
    source: "https://git-scm.com/community/logos",
    license: "https://creativecommons.org/licenses/by/3.0/",
  },
  { key: "pipedrive", source: "https://www.pipedrive.com" },
  { key: "pennylane", source: "https://www.pennylane.com" },
  { key: "qonto", source: "https://qonto.com/en/press/kit" },
  { key: "hermes", source: "https://github.com/NousResearch/hermes-agent" },
  { key: "openclaw", source: "https://github.com/openclaw/openclaw" },
  { key: "nanoclaw", source: "https://github.com/nanocoai/nanoclaw" },
];
