import type { LucideIcon } from "lucide-react";

import type { ToolLogoId } from "@/lib/tools";
import { cn } from "@/lib/utils";

import { LogoTile } from "./logo-tile";

export type TrustItem = { icon: LucideIcon; title: string; body: string };

export function TrustGrid({
  items,
  footer,
  className,
}: {
  items: TrustItem[];
  footer?: {
    label: string;
    models: { logo: ToolLogoId; name: string; note?: string }[];
  };
  className?: string;
}) {
  return (
    <div
      data-trust-grid
      className={cn(
        "border-line bg-surface-1 overflow-hidden rounded-[20px] border",
        className,
      )}
    >
      <ul className="bg-line grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="bg-surface-1 flex flex-col gap-3.5 p-6 sm:p-8"
          >
            <span className="bg-accent-tint text-accent grid size-10 place-items-center rounded-[10px]">
              <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </span>
            <h3 className="text-text text-lg leading-tight font-semibold tracking-[-0.3px]">
              {title}
            </h3>
            <p className="text-text-2 text-[0.9375rem] leading-[1.55]">
              {body}
            </p>
          </li>
        ))}
      </ul>
      {footer && (
        <div className="border-line bg-surface-2 flex flex-col gap-4 border-t px-6 py-5 md:flex-row md:items-center sm:px-8">
          <p className="text-text-3 text-sm">{footer.label}</p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {footer.models.map((model) => (
              <li
                key={model.name}
                className="text-text-2 flex items-center gap-2 text-sm font-medium"
              >
                <LogoTile logo={model.logo} size="sm" />
                {model.note ? `${model.name}, ${model.note}` : model.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
