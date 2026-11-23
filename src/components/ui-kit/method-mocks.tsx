import Image from "next/image";

import { Check, Minus, User } from "lucide-react";

import { ToolLogo } from "@/components/logos/tool-logo";
import { BRAND_COLORS } from "@/components/logos/brand-colors";
import { cn } from "@/lib/utils";

const card =
  "border-line bg-surface-1 shadow-panel w-full max-w-[420px] rounded-[16px] border";

function CheckDot() {
  return (
    <span className="bg-surface-2 text-ui-ok grid size-[18px] shrink-0 place-items-center rounded-full">
      <Check className="size-[11px]" strokeWidth={2.5} />
    </span>
  );
}

export function CallMock({
  month,
  day,
  title,
  time,
  people,
  avatar,
}: {
  month: string;
  day: string;
  title: string;
  time: string;
  people: string;
  avatar: string;
}) {
  return (
    <div className={cn(card, "flex flex-col gap-3.5 px-[22px] py-5")}>
      <div className="flex items-center gap-3.5">
        <span className="bg-accent-tint text-accent-text flex w-12 shrink-0 flex-col items-center rounded-[10px] py-1.5 leading-none">
          <span className="text-[0.625rem] font-medium uppercase">{month}</span>
          <span className="mt-1 text-xl font-semibold">{day}</span>
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-text text-[0.9375rem] font-semibold">{title}</p>
          <p className="text-text-2 text-[0.8125rem]">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex -space-x-2">
          <Image
            src={avatar}
            alt=""
            width={60}
            height={60}
            sizes="30px"
            className="border-surface-1 relative size-[30px] rounded-full border-2 object-cover"
          />
          <span className="border-surface-1 bg-line-strong text-text-3 grid size-[30px] place-items-center rounded-full border-2">
            <User className="size-3.5" />
          </span>
        </div>
        <p className="text-text-2 text-[0.8125rem]">{people}</p>
      </div>
    </div>
  );
}

export function QuoteMock({
  label,
  title,
  items,
  excluded,
  total,
  price,
}: {
  label: string;
  title: string;
  items: string[];
  excluded: string;
  total: string;
  price: string;
}) {
  return (
    <div className={cn(card, "flex flex-col gap-3 px-6 py-[22px]")}>
      <p className="text-text-3 text-xs font-medium">{label}</p>
      <p className="text-text text-base font-semibold">{title}</p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="text-text-2 flex items-center gap-2.5 text-[0.8125rem]"
          >
            <CheckDot />
            {item}
          </li>
        ))}
        <li className="text-text-3 flex items-center gap-2.5 text-[0.8125rem]">
          <Minus className="size-[18px] shrink-0 p-0.5" />
          {excluded}
        </li>
      </ul>
      <div className="border-line flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t pt-3">
        <span className="text-text-2 text-[0.8125rem] whitespace-nowrap">
          {total}
        </span>
        <span className="text-text text-xl font-semibold tracking-[-0.5px] whitespace-nowrap">
          {price}
        </span>
      </div>
    </div>
  );
}

export function UpdateMock({
  from,
  time,
  title,
  items,
  next,
  channel,
  avatar,
}: {
  from: string;
  time: string;
  title: string;
  items: { label: string; done: boolean }[];
  next: string;
  channel: string;
  avatar: string;
}) {
  return (
    <div className={cn(card, "max-w-[440px] px-5 py-[18px]")}>
      <div className="flex gap-3">
        <Image
          src={avatar}
          alt=""
          width={72}
          height={72}
          sizes="36px"
          className="size-9 shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-text text-sm font-semibold">
            {from}{" "}
            <span className="text-text-3 ml-1 text-xs font-normal">{time}</span>
          </p>
          <p className="text-text text-sm">{title}</p>
          <ul className="flex flex-col gap-1.5">
            {items.map((item) => (
              <li
                key={item.label}
                className="text-text-2 flex items-center gap-2.5 text-sm"
              >
                {item.done ? (
                  <CheckDot />
                ) : (
                  <span className="border-accent size-[18px] shrink-0 rounded-full border-2 border-dashed" />
                )}
                {item.label}
              </li>
            ))}
          </ul>
          <p className="text-text text-sm">{next}</p>
        </div>
      </div>
      <p className="text-text-3 mt-3.5 flex items-center gap-1.5 text-xs">
        <span className="flex" style={{ color: BRAND_COLORS.slack }}>
          <ToolLogo logo="slack" size={13} />
        </span>
        {channel}
      </p>
    </div>
  );
}

export function HandoverMock({
  title,
  live,
  items,
}: {
  title: string;
  live: string;
  items: string[];
}) {
  return (
    <div className={cn(card, "flex flex-col gap-3 px-6 py-[22px]")}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-text text-base font-semibold">{title}</p>
        <span className="bg-surface-2 text-ui-ok inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
          <span className="bg-ui-ok size-[7px] rounded-full" />
          {live}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="text-text-2 flex items-center gap-2.5 text-sm"
          >
            <CheckDot />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
