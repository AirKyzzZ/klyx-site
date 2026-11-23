import type { Heading } from "@/lib/headings";
import { cn } from "@/lib/utils";

export function PostToc({
  title,
  items,
  className,
}: {
  title: string;
  items: Heading[];
  className?: string;
}) {
  return (
    <nav aria-label={title} className={cn("flex flex-col gap-3", className)}>
      <p className="text-text text-sm font-medium">{title}</p>
      <ol className="border-line flex flex-col border-l">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-text-2 hover:border-text-3 hover:text-text -ml-px block border-l border-transparent py-1.5 pl-4 text-[0.875rem] leading-snug transition-colors duration-(--d-fast)"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
