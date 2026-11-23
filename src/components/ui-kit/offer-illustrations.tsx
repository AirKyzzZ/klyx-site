import Image from "next/image";

import { User } from "lucide-react";

import type { ToolLogoId } from "@/lib/tools";

import { AgentPill } from "./agent-pill";
import { LogoTile } from "./logo-tile";

export function SiteIllustration({ domain }: { domain: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center px-10">
      <div className="border-line bg-surface-1 w-[220px] overflow-hidden rounded-lg border">
        <div className="border-line flex items-center gap-1 border-b px-2 py-[7px]">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="bg-line-strong size-1.5 rounded-full" />
          ))}
          <span className="bg-surface-2 text-text-3 ml-1.5 rounded px-2 py-0.5 text-[0.5625rem]">
            {domain}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 px-3.5 pt-3 pb-3.5">
          <span className="bg-text h-[9px] w-[120px] rounded-[3px]" />
          <span className="bg-line-strong h-1 w-[168px] rounded-full" />
          <span className="bg-line-strong h-1 w-[128px] rounded-full" />
          <span className="bg-accent mt-1.5 h-3.5 w-12 rounded-[3px]" />
        </div>
      </div>
    </div>
  );
}

export function AgentIllustration({
  from,
  to,
  label,
  caption,
}: {
  from: ToolLogoId;
  to: ToolLogoId;
  label: string;
  caption: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
      <div className="flex items-center">
        <LogoTile logo={from} />
        <span className="bg-line-strong h-[1.5px] w-11 shrink" />
        <AgentPill label={label} />
        <span className="bg-line-strong h-[1.5px] w-11 shrink" />
        <LogoTile logo={to} />
      </div>
      <p className="text-text-3 text-xs">{caption}</p>
    </div>
  );
}

export function TeamIllustration({
  photo,
  caption,
}: {
  photo: string;
  caption: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div className="flex -space-x-3">
        {[0, 1, 2].map((member) => (
          <span
            key={member}
            className="border-surface-2 bg-line-strong text-text-3 grid size-12 place-items-center rounded-full border-[3px]"
          >
            <User className="size-5" />
          </span>
        ))}
        <Image
          src={photo}
          alt=""
          width={96}
          height={96}
          sizes="48px"
          className="border-accent relative size-12 rounded-full border-[3px] object-cover"
        />
      </div>
      <p className="text-text-3 text-xs">{caption}</p>
    </div>
  );
}
