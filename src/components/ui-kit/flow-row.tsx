import { Fragment } from "react";

import type { ToolLogoId } from "@/lib/tools";
import { cn } from "@/lib/utils";

import { AgentPill, FlowLine } from "./agent-pill";
import { LogoTile } from "./logo-tile";

export function FlowRow({
  from,
  to,
  agentLabel,
  className,
}: {
  from: readonly ToolLogoId[];
  to: readonly ToolLogoId[];
  agentLabel: string;
  className?: string;
}) {
  return (
    <div
      data-flow-row
      className={cn("flex items-center justify-center", className)}
    >
      {from.map((logo) => (
        <Fragment key={logo}>
          <LogoTile logo={logo} className="rounded-[11px]" />
          <FlowLine />
        </Fragment>
      ))}
      <AgentPill label={agentLabel} />
      {to.map((logo) => (
        <Fragment key={logo}>
          <FlowLine />
          <LogoTile logo={logo} className="rounded-[11px]" />
        </Fragment>
      ))}
    </div>
  );
}
