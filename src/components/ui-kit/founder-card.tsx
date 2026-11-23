import type { ReactNode } from "react";

import Image from "next/image";

import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type FounderStat = { value: string; label: string };
export type FounderLink = {
  label: string;
  detail: string;
  href: string;
  icon: ReactNode;
};

export function FounderCard({
  name,
  role,
  bio,
  photo,
  photoAlt,
  stats,
  graph,
  links,
  className,
}: {
  name: string;
  role: string;
  bio: string;
  photo: string;
  photoAlt: string;
  stats: FounderStat[];
  graph?: ReactNode;
  links: FounderLink[];
  className?: string;
}) {
  return (
    <article
      data-founder-card
      className={cn(
        "border-line bg-surface-1 grid gap-8 rounded-[24px] border p-5 md:p-6 lg:grid-cols-[340px_1fr] lg:gap-12 lg:pr-12",
        className,
      )}
    >
      <Image
        src={photo}
        alt={photoAlt}
        width={460}
        height={460}
        sizes="(min-width: 1024px) 340px, 100vw"
        className="aspect-square w-full rounded-[16px] object-cover lg:aspect-[340/400] lg:h-[400px]"
      />
      <div className="flex min-w-0 flex-col gap-6 lg:pt-6 lg:pb-2">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-text text-[2rem] leading-none font-semibold tracking-[-1px]">
            {name}
          </h3>
          <p className="text-text-2 text-base">{role}</p>
        </div>
        <p className="text-text-2 max-w-[680px] text-base leading-[1.6]">
          {bio}
        </p>
        <dl className="border-line divide-line grid grid-cols-3 divide-x border-y">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse justify-end gap-1 py-[18px] pr-3 pl-3 first:pl-0 sm:pl-6"
            >
              <dt className="text-text-3 text-[0.8125rem] leading-snug">
                {stat.label}
              </dt>
              <dd className="text-text text-2xl leading-none font-semibold tracking-[-1px] sm:text-[1.75rem]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        {graph && <div className="max-w-[633px]">{graph}</div>}
        <ul className="flex flex-wrap gap-2.5">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener"
                className="border-line-strong bg-surface-1 hover:border-text-3 flex items-center gap-3 rounded-[12px] border py-3 pr-[18px] pl-3.5 transition-colors duration-(--d-fast)"
              >
                <span className="border-line grid size-8 place-items-center rounded-[8px] border bg-white">
                  {link.icon}
                </span>
                <span className="flex flex-col gap-px leading-tight">
                  <span className="text-text text-sm font-medium">
                    {link.label}
                  </span>
                  <span className="text-text-3 text-xs">{link.detail}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="text-text-3 ml-2 size-3.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
