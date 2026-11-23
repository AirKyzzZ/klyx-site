import type { CSSProperties } from "react";

import { BRAND_COLORS } from "@/components/logos/brand-colors";
import { ToolLogo } from "@/components/logos/tool-logo";
import type { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

import "./ui-kit.css";

function ToolList({ tools, copy }: { tools: Tool[]; copy?: boolean }) {
  return (
    <ul
      className="tools-marquee-list"
      aria-hidden={copy || undefined}
      inert={copy}
    >
      {tools.map((tool) => (
        <li
          key={tool.name}
          data-tool={copy ? undefined : tool.name}
          className="text-text-2 flex shrink-0 items-center gap-2 px-[18px] text-[0.9375rem] font-medium whitespace-nowrap"
        >
          <span
            className="text-text flex"
            style={{ color: BRAND_COLORS[tool.logo] }}
          >
            <ToolLogo logo={tool.logo} size={20} />
          </span>
          {tool.name}
        </li>
      ))}
    </ul>
  );
}

export function ToolsStrip({
  title,
  tools,
  className,
}: {
  title: string;
  tools: Tool[];
  className?: string;
}) {
  return (
    <div
      data-tools-strip
      className={cn(
        "flex flex-col items-center gap-[22px] text-center",
        className,
      )}
    >
      <h2 className="text-text-3 text-sm font-normal tracking-normal">
        {title}
      </h2>
      <div
        data-marquee
        className="tools-marquee self-stretch"
        style={{ "--marquee-items": tools.length } as CSSProperties}
      >
        <div className="tools-marquee-track">
          <ToolList tools={tools} />
          <ToolList tools={tools} copy />
        </div>
      </div>
    </div>
  );
}
