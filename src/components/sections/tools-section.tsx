import { Workflow } from "lucide-react";

import { ToolLogo } from "@/components/logos/tool-logo";
import { Section, SectionHeading } from "@/components/section";
import type { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

export type ToolRow = { key: string; label: string; tools: Tool[] };

export type ToolMap = {
  inputs: string[];
  outputs: string[];
  hub: string;
  labels: {
    inputs: string;
    outputs: string;
    hub: string;
    hubMeta: string;
    under: string;
    details: string;
  };
};

const COLUMNS = {
  grid: "grid-cols-3 md:grid-cols-6",
  strip: "grid-cols-3 xl:grid-cols-9",
};

function MapNode({ row, side }: { row: ToolRow; side: "in" | "out" }) {
  return (
    <li
      className={cn(
        "border-line bg-surface-1 relative flex h-16 items-center justify-between gap-3 rounded-sm border px-3 shadow-[inset_0_1px_0_var(--highlight)]",
        "lg:after:border-line-strong lg:after:absolute lg:after:top-1/2 lg:after:w-6 lg:after:border-t lg:after:border-dashed",
        side === "in" ? "lg:after:left-full" : "lg:after:right-full",
      )}
    >
      <span className="type-label text-text-3">{row.label}</span>
      <span className="flex items-center gap-2">
        {row.tools.map((tool) => (
          <span key={tool.name} className="text-text-2 flex">
            <ToolLogo logo={tool.logo} size={18} />
            <span className="sr-only">{tool.name}</span>
          </span>
        ))}
      </span>
    </li>
  );
}

function ConnectionMap({ rows, map }: { rows: ToolRow[]; map: ToolMap }) {
  const pick = (keys: string[]) =>
    keys.flatMap((key) => rows.filter((row) => row.key === key));
  const hub = rows.find((row) => row.key === map.hub);
  const bus = (side: "in" | "out") =>
    cn(
      "relative grid gap-3",
      "lg:before:border-line-strong lg:before:absolute lg:before:top-8 lg:before:bottom-8 lg:before:border-l lg:before:border-dashed",
      side === "in" ? "lg:pr-6 lg:before:right-0" : "lg:pl-6 lg:before:left-0",
    );
  return (
    <div
      data-tools-map
      className="reveal mt-12 grid gap-4 md:mt-16 lg:grid-cols-[minmax(0,1fr)_3rem_auto_3rem_minmax(0,1fr)] lg:items-center lg:gap-0"
    >
      <div>
        <p className="type-label text-text-3 mb-3">{map.labels.inputs}</p>
        <ul className={bus("in")}>
          {pick(map.inputs).map((row) => (
            <MapNode key={row.key} row={row} side="in" />
          ))}
        </ul>
      </div>
      <span
        aria-hidden="true"
        className="border-line-strong mx-auto block h-8 border-l border-dashed lg:mt-7 lg:h-auto lg:w-full lg:border-t lg:border-l-0"
      />
      <div className="border-accent/60 bg-surface-2 shadow-window mx-auto w-full max-w-72 rounded-md border p-4 lg:mt-7 lg:w-60">
        <p className="flex items-center gap-2.5">
          <span className="border-line-strong bg-bg-sunken text-accent flex size-8 items-center justify-center rounded-sm border">
            <Workflow aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </span>
          <span className="flex flex-col">
            <span className="text-text text-sm font-medium">
              {map.labels.hub}
            </span>
            <span className="type-data text-text-3 text-xs">
              {map.labels.hubMeta}
            </span>
          </span>
        </p>
        {hub && (
          <p className="border-line type-data text-text-3 mt-4 flex items-center gap-2 border-t pt-3 text-xs">
            {map.labels.under}
            {hub.tools.map((tool) => (
              <span
                key={tool.name}
                className="text-text-2 inline-flex items-center gap-1.5"
              >
                <ToolLogo logo={tool.logo} size={14} />
                {tool.name}
              </span>
            ))}
          </p>
        )}
      </div>
      <span
        aria-hidden="true"
        className="border-line-strong mx-auto block h-8 border-l border-dashed lg:mt-7 lg:h-auto lg:w-full lg:border-t lg:border-l-0"
      />
      <div>
        <p className="type-label text-text-3 mb-3 lg:pl-6">
          {map.labels.outputs}
        </p>
        <ul className={bus("out")}>
          {pick(map.outputs).map((row) => (
            <MapNode key={row.key} row={row} side="out" />
          ))}
        </ul>
      </div>
    </div>
  );
}

function ToolGrid({
  rows,
  label,
  layout,
}: {
  rows: ToolRow[];
  label: string;
  layout: keyof typeof COLUMNS;
}) {
  return (
    <>
      <h3 className="type-label text-text-2">{label}</h3>
      <ul
        className={cn("mt-4 grid auto-rows-fr gap-2 sm:gap-3", COLUMNS[layout])}
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
              <ToolLogo logo={tool.logo} size={24} className="shrink-0" />
              <span className="font-mono text-[0.6875rem] leading-tight">
                {tool.name}
              </span>
            </li>
          )),
        )}
      </ul>
    </>
  );
}

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
  map,
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
  map?: ToolMap;
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
      {map && <ConnectionMap rows={rows} map={map} />}
      <div
        className={cn("reveal", map ? "mt-10" : "mt-12 md:mt-16")}
        data-tools
      >
        {map ? (
          <details data-tools-details className="group">
            <summary className="type-label text-text-2 hover:text-text inline-flex cursor-pointer list-none items-center gap-2 transition-colors">
              <span
                aria-hidden="true"
                className="text-text-3 group-open:hidden"
              >
                +
              </span>
              <span
                aria-hidden="true"
                className="text-text-3 hidden group-open:inline"
              >
                −
              </span>
              {map.labels.details}
            </summary>
            <div className="mt-5">
              <ToolGrid rows={rows} label={label} layout={layout} />
            </div>
          </details>
        ) : (
          <ToolGrid rows={rows} label={label} layout={layout} />
        )}
        <p className="text-text-3 mt-4 max-w-[72ch] text-xs leading-relaxed">
          {note}
        </p>
      </div>
    </Section>
  );
}
