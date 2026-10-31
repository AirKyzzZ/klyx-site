import type { CSSProperties } from "react";

import type { TraceLine } from "@/lib/scenarios";

const MARKS: Record<NonNullable<TraceLine["tone"]> | "default", string> = {
  default: "›",
  dim: "·",
  ok: "✓",
  err: "↻",
};

export function TerminalTrace({
  title,
  lines,
}: {
  title: string;
  lines: (TraceLine & { text: string })[];
}) {
  return (
    <div className="ls-window ls-terminal">
      <div className="ls-chrome">
        <span className="ls-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{title}</span>
      </div>
      <div className="ls-term-body">
        <div className="ls-term-clip">
          <ol
            className="ls-trace"
            data-trace=""
            style={{ "--shown": lines.length } as CSSProperties}
          >
            {lines.map((line, index) => (
              <li
                key={line.key}
                className="ls-line"
                data-line={index}
                data-shown="true"
                data-tone={line.tone ?? "default"}
              >
                <span className="ls-time">{line.t}</span>
                <span className="ls-mark" aria-hidden="true">
                  {MARKS[line.tone ?? "default"]}
                </span>
                <span className="ls-text">{line.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
