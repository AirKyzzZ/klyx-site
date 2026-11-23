export type ToolLogoId =
  | "gmail"
  | "google-sheets"
  | "notion"
  | "airtable"
  | "hubspot"
  | "slack"
  | "whatsapp"
  | "shopify"
  | "wordpress"
  | "stripe"
  | "make"
  | "n8n"
  | "mistral-ai"
  | "mcp"
  | "openclaw"
  | "hermes-agent"
  | "outlook"
  | "excel"
  | "microsoft-teams"
  | "pipedrive"
  | "pennylane"
  | "qonto"
  | "claude"
  | "claude-code"
  | "openai"
  | "nanoclaw"
  | "google-gemini"
  | "perplexity"
  | "google"
  | "zendesk"
  | "git"
  | "nextjs"
  | "lighthouse"
  | "figma"
  | "github";

export type Tool = { name: string; logo: ToolLogoId };

export type ToolGroup = { key: string; tools: Tool[] };

export const TOOLS = {
  gmail: { name: "Gmail", logo: "gmail" },
  outlook: { name: "Outlook", logo: "outlook" },
  googleSheets: { name: "Google Sheets", logo: "google-sheets" },
  excel: { name: "Excel", logo: "excel" },
  notion: { name: "Notion", logo: "notion" },
  airtable: { name: "Airtable", logo: "airtable" },
  hubspot: { name: "HubSpot", logo: "hubspot" },
  pipedrive: { name: "Pipedrive", logo: "pipedrive" },
  slack: { name: "Slack", logo: "slack" },
  teams: { name: "Microsoft Teams", logo: "microsoft-teams" },
  whatsapp: { name: "WhatsApp Business", logo: "whatsapp" },
  shopify: { name: "Shopify", logo: "shopify" },
  wordpress: { name: "WordPress", logo: "wordpress" },
  stripe: { name: "Stripe", logo: "stripe" },
  pennylane: { name: "Pennylane", logo: "pennylane" },
  qonto: { name: "Qonto", logo: "qonto" },
  make: { name: "Make", logo: "make" },
  hermesAgent: { name: "Hermes Agent", logo: "hermes-agent" },
  openclaw: { name: "OpenClaw", logo: "openclaw" },
  nanoclaw: { name: "NanoClaw", logo: "nanoclaw" },
  claude: { name: "Claude", logo: "claude" },
  claudeCode: { name: "Claude Code", logo: "claude-code" },
  openai: { name: "OpenAI", logo: "openai" },
  mistral: { name: "Mistral AI", logo: "mistral-ai" },
  n8n: { name: "n8n", logo: "n8n" },
  mcp: { name: "MCP", logo: "mcp" },
} as const satisfies Record<string, Tool>;

export const WORKFLOW_TOOL_LOGOS: Partial<Record<string, ToolLogoId[]>> = {};

export const CONNECTED_TOOLS: ToolGroup[] = [
  { key: "email", tools: [TOOLS.gmail, TOOLS.outlook] },
  {
    key: "data",
    tools: [TOOLS.googleSheets, TOOLS.excel, TOOLS.notion, TOOLS.airtable],
  },
  { key: "crm", tools: [TOOLS.hubspot, TOOLS.pipedrive] },
  { key: "team", tools: [TOOLS.slack, TOOLS.teams, TOOLS.whatsapp] },
  { key: "commerce", tools: [TOOLS.wordpress, TOOLS.shopify, TOOLS.stripe] },
  { key: "finance", tools: [TOOLS.pennylane, TOOLS.qonto] },
  { key: "automation", tools: [TOOLS.n8n, TOOLS.make] },
];

export const DEPLOYED_TECH: ToolGroup[] = [
  {
    key: "agents",
    tools: [
      TOOLS.hermesAgent,
      TOOLS.openclaw,
      TOOLS.nanoclaw,
      TOOLS.claudeCode,
    ],
  },
  { key: "models", tools: [TOOLS.claude, TOOLS.openai, TOOLS.mistral] },
  { key: "plumbing", tools: [TOOLS.n8n, TOOLS.mcp] },
];

export const AI_MODELS: Tool[] = [TOOLS.openai, TOOLS.claude, TOOLS.mistral];
