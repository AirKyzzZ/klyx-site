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
  | "hermes-agent";

export type Tool = { name: string; logo?: ToolLogoId };

export type ToolGroup = { key: string; tools: Tool[] };

export const TOOLS = {
  gmail: { name: "Gmail", logo: "gmail" },
  outlook: { name: "Outlook" },
  googleSheets: { name: "Google Sheets", logo: "google-sheets" },
  excel: { name: "Excel" },
  notion: { name: "Notion", logo: "notion" },
  airtable: { name: "Airtable", logo: "airtable" },
  hubspot: { name: "HubSpot", logo: "hubspot" },
  pipedrive: { name: "Pipedrive" },
  slack: { name: "Slack", logo: "slack" },
  teams: { name: "Microsoft Teams" },
  whatsapp: { name: "WhatsApp Business", logo: "whatsapp" },
  shopify: { name: "Shopify", logo: "shopify" },
  wordpress: { name: "WordPress", logo: "wordpress" },
  stripe: { name: "Stripe", logo: "stripe" },
  pennylane: { name: "Pennylane" },
  qonto: { name: "Qonto" },
  make: { name: "Make", logo: "make" },
  hermesAgent: { name: "Hermes Agent", logo: "hermes-agent" },
  openclaw: { name: "OpenClaw", logo: "openclaw" },
  nanoclaw: { name: "NanoClaw" },
  claude: { name: "Claude" },
  claudeCode: { name: "Claude Code" },
  openai: { name: "OpenAI" },
  mistral: { name: "Mistral AI", logo: "mistral-ai" },
  n8n: { name: "n8n", logo: "n8n" },
  mcp: { name: "MCP", logo: "mcp" },
} as const satisfies Record<string, Tool>;

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
