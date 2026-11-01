import Image from "next/image";

import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

export function hostOf(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

export function BrowserFrame({
  url,
  image,
  alt,
  sizes,
  className,
  imageClassName,
  compact = false,
}: {
  url: string | null;
  image: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  compact?: boolean;
}) {
  return (
    <figure
      className={cn(
        "border-line-strong bg-surface-2 shadow-window overflow-hidden rounded-lg border",
        className,
      )}
    >
      <figcaption
        className={cn(
          "border-line text-text-3 grid h-9 items-center gap-3 border-b px-3 font-mono text-xs",
          compact ? "justify-center px-2" : "grid-cols-[1fr_auto_1fr]",
        )}
      >
        <span
          className={cn("flex gap-1.5", compact && "hidden")}
          aria-hidden="true"
        >
          {[0, 1, 2].map((dot) => (
            <i
              key={dot}
              className="bg-surface-3 size-2.25 rounded-full shadow-[inset_0_0_0_1px_var(--line-strong)]"
            />
          ))}
        </span>
        <span
          className={cn(
            "bg-bg-sunken/60 flex h-6 max-w-full min-w-0 items-center gap-1.5 truncate rounded-xs px-2.5",
            !url && "w-32",
          )}
        >
          {url && (
            <>
              <Lock aria-hidden="true" className="size-3 shrink-0" />
              {hostOf(url)}
            </>
          )}
        </span>
      </figcaption>
      <div className={cn("relative aspect-[16/10]", imageClassName)}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      </div>
    </figure>
  );
}
