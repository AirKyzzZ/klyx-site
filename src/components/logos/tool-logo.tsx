import type { ComponentType } from "react";

import type { ToolLogoId } from "@/lib/tools";
import { cn } from "@/lib/utils";

import { AirtableLogo } from "./airtable-logo";
import { ClaudeCodeLogo } from "./claude-code-logo";
import { ClaudeLogo } from "./claude-logo";
import { ExcelLogo } from "./excel-logo";
import { FigmaLogo } from "./figma-logo";
import { GitLogo } from "./git-logo";
import { GitHubLogo } from "./github-logo";
import { GmailLogo } from "./gmail-logo";
import { GoogleGeminiLogo } from "./google-gemini-logo";
import { GoogleLogo } from "./google-logo";
import { GoogleSheetsLogo } from "./google-sheets-logo";
import { HubSpotLogo } from "./hubspot-logo";
import { LighthouseLogo } from "./lighthouse-logo";
import type { LogoProps } from "./logo-svg";
import { MakeLogo } from "./make-logo";
import { McpLogo } from "./mcp-logo";
import { MicrosoftTeamsLogo } from "./microsoft-teams-logo";
import { MistralAiLogo } from "./mistral-ai-logo";
import { N8nLogo } from "./n8n-logo";
import { NanoClawLogo } from "./nanoclaw-logo";
import { NextJsLogo } from "./nextjs-logo";
import { NotionLogo } from "./notion-logo";
import { OpenAiLogo } from "./openai-logo";
import { OpenClawLogo } from "./openclaw-logo";
import { OutlookLogo } from "./outlook-logo";
import { PennylaneLogo } from "./pennylane-logo";
import { PerplexityLogo } from "./perplexity-logo";
import { PipedriveLogo } from "./pipedrive-logo";
import { QontoLogo } from "./qonto-logo";
import { ShopifyLogo } from "./shopify-logo";
import { SlackLogo } from "./slack-logo";
import { StripeLogo } from "./stripe-logo";
import { WhatsAppLogo } from "./whatsapp-logo";
import { WordPressLogo } from "./wordpress-logo";
import { ZendeskLogo } from "./zendesk-logo";

const SVG_LOGOS: Record<
  Exclude<ToolLogoId, "hermes-agent">,
  ComponentType<LogoProps>
> = {
  gmail: GmailLogo,
  "google-sheets": GoogleSheetsLogo,
  notion: NotionLogo,
  airtable: AirtableLogo,
  hubspot: HubSpotLogo,
  slack: SlackLogo,
  whatsapp: WhatsAppLogo,
  shopify: ShopifyLogo,
  wordpress: WordPressLogo,
  stripe: StripeLogo,
  make: MakeLogo,
  n8n: N8nLogo,
  "mistral-ai": MistralAiLogo,
  mcp: McpLogo,
  openclaw: OpenClawLogo,
  outlook: OutlookLogo,
  excel: ExcelLogo,
  "microsoft-teams": MicrosoftTeamsLogo,
  pipedrive: PipedriveLogo,
  pennylane: PennylaneLogo,
  qonto: QontoLogo,
  claude: ClaudeLogo,
  "claude-code": ClaudeCodeLogo,
  openai: OpenAiLogo,
  nanoclaw: NanoClawLogo,
  "google-gemini": GoogleGeminiLogo,
  perplexity: PerplexityLogo,
  google: GoogleLogo,
  zendesk: ZendeskLogo,
  git: GitLogo,
  nextjs: NextJsLogo,
  lighthouse: LighthouseLogo,
  figma: FigmaLogo,
  github: GitHubLogo,
};

export function ToolLogo({
  logo,
  size = 16,
  className,
}: {
  logo: ToolLogoId;
  size?: number;
  className?: string;
}) {
  if (logo === "hermes-agent") {
    return (
      <span
        aria-hidden="true"
        data-logo={logo}
        className={cn(
          "inline-block bg-current [mask:url(/logos/hermes-agent.webp)_center/contain_no-repeat]",
          className,
        )}
        style={{ width: size, height: size }}
      />
    );
  }
  const Logo = SVG_LOGOS[logo];
  return (
    <Logo width={size} height={size} data-logo={logo} className={className} />
  );
}
