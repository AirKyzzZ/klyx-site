import type { ReactNode } from "react";

export function SampleWindow({
  file,
  sample,
  children,
}: {
  file: string;
  sample?: string;
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
        <span className="ml-1 min-w-0 truncate">{file}</span>
        {sample && (
          <span className="border-line-strong type-label ml-auto hidden shrink-0 rounded-xs border px-1.5 py-0.5 whitespace-nowrap sm:inline">
            {sample}
          </span>
        )}
      </div>
      <div className="type-data p-4 text-[0.8125rem] sm:p-5">{children}</div>
      {sample && (
        <p className="border-line type-label text-text-3 border-t px-4 py-2 sm:hidden">
          {sample}
        </p>
      )}
    </div>
  );
}
