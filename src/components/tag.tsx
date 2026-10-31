import type { ReactNode } from "react";

export function Tag({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span className="border-line bg-surface-2 text-text [&_svg]:text-text-3 inline-flex h-6 items-center gap-1.5 rounded-xs border px-2 align-[0.1em] font-mono text-xs leading-none [&_svg]:size-3.5">
      {icon}
      {children}
    </span>
  );
}
