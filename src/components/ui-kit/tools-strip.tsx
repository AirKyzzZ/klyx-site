import { BRAND_COLORS } from "@/components/logos/brand-colors";
import { ToolLogo } from "@/components/logos/tool-logo";
import type { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function ToolsStrip({
  title,
  tools,
  more,
  className,
}: {
  title: string;
  tools: Tool[];
  more?: string;
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
      <ul className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3">
        {tools.map((tool) => (
          <li
            key={tool.name}
            data-tool={tool.name}
            className="text-text-2 flex items-center gap-2 text-[0.9375rem] font-medium"
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
        {more && <li className="text-text-3 text-[0.9375rem]">{more}</li>}
      </ul>
    </div>
  );
}
