import type { ComponentType } from "react";

import type { ToolLogoId } from "@/lib/tools";
import { cn } from "@/lib/utils";

import { AirtableLogo } from "./airtable-logo";
import { GmailLogo } from "./gmail-logo";
import { GoogleSheetsLogo } from "./google-sheets-logo";
import { HubSpotLogo } from "./hubspot-logo";
import type { LogoProps } from "./logo-svg";
import { MakeLogo } from "./make-logo";
import { McpLogo } from "./mcp-logo";
import { MistralAiLogo } from "./mistral-ai-logo";
import { N8nLogo } from "./n8n-logo";
import { NotionLogo } from "./notion-logo";
import { OpenClawLogo } from "./openclaw-logo";
import { ShopifyLogo } from "./shopify-logo";
import { SlackLogo } from "./slack-logo";
import { StripeLogo } from "./stripe-logo";
import { WhatsAppLogo } from "./whatsapp-logo";
import { WordPressLogo } from "./wordpress-logo";

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
