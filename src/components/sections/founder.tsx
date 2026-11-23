import type { ReactNode } from "react";

import { ROSTER_FIELDS, type TeamRoster } from "@/lib/team-roster";

export function TerminalWindow({
  title,
  command,
  children,
}: {
  title: string;
  command: string;
  children: ReactNode;
}) {
  return (
    <div className="border-line-strong bg-surface-2 shadow-window overflow-hidden rounded-lg border">
      <div className="border-line text-text-3 flex h-9 items-center gap-2 border-b px-3 font-mono text-xs">
        <span className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <i
              key={dot}
              className="bg-surface-3 size-2.25 rounded-full shadow-[inset_0_0_0_1px_var(--line-strong)]"
            />
          ))}
        </span>
        <span className="ml-1">{title}</span>
      </div>
      <div className="type-data p-4 text-[0.8125rem] sm:p-5">
        <p className="text-text-3">
          <span aria-hidden="true">$ </span>
          {command}
        </p>
        {children}
      </div>
    </div>
  );
}

export function FactRows({ rows }: { rows: { key: string; value: string }[] }) {
  return (
    <dl className="mt-2 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
      {rows.map((row) => (
        <div key={row.key} className="contents">
          <dt className="text-text-3">{row.key}</dt>
          <dd className="text-text">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function RosterWindow({ window, file, keys, items }: TeamRoster) {
  return (
    <TerminalWindow title={window} command={`cat ${file}`}>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.role}>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-0.5">
              {ROSTER_FIELDS.map((field, i) => (
                <div key={field} className="contents">
                  <dt className="text-text-3 whitespace-pre">
                    {i === 0 ? "- " : "  "}
                    {keys[field]}:
                  </dt>
                  <dd
                    className={field === "role" ? "text-accent" : "text-text"}
                  >
                    {item[field]}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </TerminalWindow>
  );
}
