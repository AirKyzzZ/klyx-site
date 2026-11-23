"use client";

import { useState } from "react";

import Image from "next/image";

import { CircleCheck, Video, X } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { cn } from "@/lib/utils";

export type BookingCardLabels = {
  name: string;
  role: string;
  message: string;
  pick: string;
  sample: string;
  video: string;
  free: string;
  noCommitment: string;
};

export type BookingDay = {
  id: string;
  short: string;
  long: string;
  date: number;
};

export function BookingCard({
  labels,
  avatar,
  days,
  slots,
  buttonTemplate,
  initialDay = 1,
  initialSlot = 1,
  className,
}: {
  labels: BookingCardLabels;
  avatar: string;
  days: BookingDay[];
  slots: string[];
  buttonTemplate: string;
  initialDay?: number;
  initialSlot?: number;
  className?: string;
}) {
  const [day, setDay] = useState(initialDay);
  const [slot, setSlot] = useState(initialSlot);

  return (
    <div
      data-booking-card
      className={cn(
        "border-line bg-bg shadow-float overflow-hidden rounded-[20px] border",
        className,
      )}
    >
      <div>
        <div className="flex items-center gap-3.5 px-5 pt-[22px] pb-[18px] sm:px-6">
          <span className="relative shrink-0">
            <Image
              src={avatar}
              alt=""
              width={104}
              height={104}
              sizes="52px"
              className="size-13 rounded-full object-cover"
            />
            <span className="bg-ui-ok border-bg absolute right-0 bottom-0 size-4 rounded-full border-2" />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-text text-base font-semibold">{labels.name}</p>
            <p className="text-text-2 text-[0.8125rem]">{labels.role}</p>
          </div>
        </div>
        <div className="px-5 pb-5 sm:px-6">
          <p className="bg-surface-2 text-text rounded-[12px] rounded-tl-[4px] px-4 py-3 text-sm leading-normal">
            {labels.message}
          </p>
        </div>
      </div>

      <div className="border-line flex flex-col gap-3.5 border-t px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-text text-sm font-medium">{labels.pick}</p>
          <span className="text-text-3 text-xs">{labels.sample}</span>
        </div>
        <div
          role="group"
          aria-label={`${labels.pick} (${labels.sample})`}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-4 gap-2">
            {days.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={i === day}
                aria-label={`${item.long} ${item.date}`}
                onClick={() => setDay(i)}
                className="group/day border-line bg-surface-1 text-text hover:border-line-strong aria-pressed:border-text aria-pressed:bg-text aria-pressed:text-bg flex flex-col items-center gap-0.5 rounded-[10px] border py-2 transition-colors duration-(--d-fast)"
              >
                <span className="text-text-3 group-aria-pressed/day:text-bg text-xs">
                  {item.short}
                </span>
                <span className="text-base font-semibold">{item.date}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {slots.map((time, i) => (
              <button
                key={time}
                type="button"
                aria-pressed={i === slot}
                onClick={() => setSlot(i)}
                className="border-line bg-surface-1 text-text-2 hover:border-line-strong aria-pressed:border-accent aria-pressed:bg-accent-tint aria-pressed:text-accent-text rounded-[8px] border py-[9px] text-[0.8125rem] font-medium transition-colors duration-(--d-fast)"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        <ActionButton
          action="book"
          size="xl"
          trackLocation="booking-card"
          className="h-[46px] w-full rounded-[10px] shadow-none"
        >
          {buttonTemplate
            .replace("{day}", days[day].long)
            .replace("{date}", String(days[day].date))
            .replace("{time}", slots[slot])}
        </ActionButton>
      </div>

      <ul className="bg-surface-2 text-text-2 flex flex-wrap gap-x-[18px] gap-y-1.5 px-5 py-3.5 text-[0.8125rem] sm:px-6">
        <li className="flex items-center gap-1.5">
          <Video aria-hidden="true" className="size-3.5" />
          {labels.video}
        </li>
        <li className="flex items-center gap-1.5">
          <CircleCheck aria-hidden="true" className="size-3.5" />
          {labels.free}
        </li>
        <li className="flex items-center gap-1.5">
          <X aria-hidden="true" className="size-3.5" />
          {labels.noCommitment}
        </li>
      </ul>
    </div>
  );
}
