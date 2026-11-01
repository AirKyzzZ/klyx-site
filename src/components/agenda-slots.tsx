import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const SAMPLE_WEEK = ["2026-11-02", "2026-11-03", "2026-11-04"];
const SAMPLE_SLOTS = [
  ["09:30", "14:00"],
  ["11:00", "16:30"],
  ["10:00", "17:30"],
];
const PICKED = { day: 1, slot: 0 };

export function AgendaSlots({ locale }: { locale: Locale }) {
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return (
    <div className="grid grid-cols-3 gap-2">
      {SAMPLE_WEEK.map((day, d) => (
        <div key={day} className="space-y-2">
          <p className="text-text-3 text-xs">{weekday.format(new Date(day))}</p>
          {SAMPLE_SLOTS[d].map((slot, s) => {
            const picked = d === PICKED.day && s === PICKED.slot;
            return (
              <p
                key={slot}
                className={cn(
                  "rounded-xs border px-2 py-1.5 text-center",
                  picked
                    ? "border-accent bg-accent-soft text-text"
                    : "border-line-strong text-text-2",
                )}
              >
                {slot}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}
