import { cn } from "@/lib/utils";

export function ClientsRow({
  label,
  names,
  className,
}: {
  label: string;
  names: readonly string[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-[18px]", className)}>
      <p className="text-text-3 text-[0.8125rem]">{label}</p>
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 md:gap-x-14">
        {names.map((name) => (
          <li
            key={name}
            className="text-text-3 text-lg font-semibold tracking-[-0.6px] whitespace-nowrap md:text-xl"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
