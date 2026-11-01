import { ToolLogo } from "@/components/logos/tool-logo";
import { Section, SectionHeading } from "@/components/section";
import type { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

export type ToolRow = { key: string; label: string; tools: Tool[] };

const COLUMNS = {
  grid: "grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  strip: "grid-cols-3 xl:grid-cols-9",
};

export function ToolsSection({
  index,
  eyebrow,
  title,
  emphasis,
  body,
  label,
  rows,
  note,
  layout = "grid",
}: {
  index: string;
  eyebrow: string;
  title: string;
  emphasis?: string;
  body: string;
  label: string;
  rows: ToolRow[];
  note: string;
  layout?: keyof typeof COLUMNS;
}) {
  return (
    <Section index={index} eyebrow={eyebrow}>
      <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
        <SectionHeading
          lead={title}
          rest={emphasis}
          className="lg:col-span-7"
        />
        <p className="text-text-2 max-w-[44ch] lg:col-span-4 lg:col-start-9">
          {body}
        </p>
      </div>
      <div className="reveal mt-12 md:mt-16" data-tools>
        <h3 className="type-label text-text-2">{label}</h3>
        <ul
          className={cn(
            "mt-4 grid auto-rows-fr gap-2 sm:gap-3",
            COLUMNS[layout],
          )}
        >
          {rows.flatMap((row) =>
            row.tools.map((tool) => (
              <li
                key={tool.name}
                data-tool={tool.name}
                className="border-line bg-surface-1 text-text-2 relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-sm border px-2 pt-6 pb-3 text-center shadow-[inset_0_1px_0_var(--highlight)]"
              >
                <span className="text-text-3 absolute top-2 left-2.5 font-mono text-[0.625rem] leading-none tracking-wide uppercase">
                  {row.label}
                </span>
                {tool.logo ? (
                  <>
                    <ToolLogo logo={tool.logo} size={24} className="shrink-0" />
                    <span className="font-mono text-[0.6875rem] leading-tight">
                      {tool.name}
                    </span>
                  </>
                ) : (
                  <span className="text-[0.9375rem] leading-tight font-semibold tracking-[-0.02em]">
                    {tool.name}
                  </span>
                )}
              </li>
            )),
          )}
        </ul>
        <p className="text-text-3 mt-4 max-w-[72ch] text-xs leading-relaxed">
          {note}
        </p>
      </div>
    </Section>
  );
}
