import type { ReactNode } from "react";

import { SampleWindow } from "@/components/sections/process-timeline";

type NotFoundCopy = {
  title: string;
  body: string;
  unknown: string;
  suggested: string;
};

export function NotFoundView({
  copy,
  home,
  actions,
  footer,
  className,
}: {
  copy: NotFoundCopy;
  home: string;
  actions: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        className ??
        "container flex min-h-[80vh] flex-col items-center justify-center pt-28 pb-24 text-center"
      }
    >
      <p className="type-label text-accent-text">404</p>
      <h1 className="type-h1 mt-4">{copy.title}</h1>
      <p className="text-text-2 mt-4 max-w-[44ch]">{copy.body}</p>
      <div className="mt-10 w-full max-w-[560px] text-left">
        <SampleWindow file="klyx.fr · access.log">
          <p>
            <span className="text-text-2">GET</span>{" "}
            <span className="text-text">/…</span>{" "}
            <span className="text-text-3" aria-hidden="true">
              →
            </span>{" "}
            <span className="text-ui-err">404</span>
          </p>
          <p className="text-text-3">{copy.unknown}</p>
          <p className="text-text-2">
            {copy.suggested} <span className="text-text">{home}</span>
          </p>
        </SampleWindow>
      </div>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        {actions}
      </div>
      {footer}
    </div>
  );
}
