import { BeforeAfterRows } from "@/components/ui-kit/use-case-card";
import { cn } from "@/lib/utils";

export function BeforeAfterCards({
  items,
  labels,
  className,
}: {
  items: { title: string; before: string; after: string }[];
  labels: { before: string; after: string };
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-5 lg:grid-cols-3", className)}>
      {items.map((item) => (
        <li
          key={item.title}
          className="border-line bg-surface-1 shadow-panel flex flex-col gap-4 rounded-[16px] border p-6"
        >
          <h3 className="text-text text-[1.1875rem] leading-tight font-semibold tracking-[-0.4px]">
            {item.title}
          </h3>
          <BeforeAfterRows
            before={{ label: labels.before, text: item.before }}
            after={{ label: labels.after, text: item.after }}
            className="sm:[&>div]:grid-cols-1 sm:[&>div]:gap-1"
          />
        </li>
      ))}
    </ul>
  );
}
