import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function AuthorCard({
  label,
  name,
  role,
  bio,
  photo,
  photoAlt,
  links,
  className,
}: {
  label: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  photoAlt: string;
  links: ReactNode;
  className?: string;
}) {
  return (
    <aside
      aria-label={label}
      className={cn(
        "border-line bg-surface-1 shadow-panel flex flex-col gap-5 rounded-[20px] border p-6 sm:flex-row sm:gap-6 sm:p-7",
        className,
      )}
    >
      <Image
        src={photo}
        alt={photoAlt}
        width={144}
        height={144}
        sizes="72px"
        className="size-[72px] shrink-0 rounded-full object-cover"
      />
      <div className="flex min-w-0 flex-col">
        <p className="text-text-3 text-[0.8125rem] font-medium">{label}</p>
        <p className="text-text mt-1 text-lg leading-tight font-semibold tracking-[-0.3px]">
          {name}
        </p>
        <p className="text-text-2 mt-1 text-sm">{role}</p>
        <p className="text-text-2 mt-3 text-[0.9375rem] leading-relaxed">
          {bio}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
          {links}
        </div>
      </div>
    </aside>
  );
}
