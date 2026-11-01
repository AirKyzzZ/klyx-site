import { ToolLogo } from "@/components/logos/tool-logo";
import { Section, SectionHeading } from "@/components/section";
import type { Tool } from "@/lib/tools";

export type ToolRow = { key: string; label: string; tools: Tool[] };

export function ToolsSection({
  index,
  eyebrow,
  title,
  emphasis,
  body,
  label,
  rows,
  note,
}: {
  index: string;
  eyebrow: string;
  title: string;
  emphasis?: string;
  body: string;
  label: string;
  rows: ToolRow[];
  note: string;
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
        <dl className="border-line mt-4 border-t">
          {rows.map((row) => (
            <div
              key={row.key}
              className="border-line grid gap-3 border-b py-4 md:grid-cols-12 md:items-center md:gap-6"
            >
              <dt className="type-label text-text-3 md:col-span-3">
                {row.label}
              </dt>
              <dd className="md:col-span-9">
                <ul className="flex flex-wrap gap-2">
                  {row.tools.map((tool) => (
                    <li
                      key={tool.name}
                      data-tool={tool.name}
                      className="border-line bg-surface-1 text-text-2 hover:border-line-strong hover:text-text inline-flex h-9 items-center gap-2 rounded-sm border px-3 text-sm leading-none transition-colors duration-(--d-fast)"
                    >
                      {tool.logo && (
                        <ToolLogo logo={tool.logo} className="shrink-0" />
                      )}
                      {tool.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-text-3 mt-4 max-w-[72ch] text-xs leading-relaxed">
          {note}
        </p>
      </div>
    </Section>
  );
}
