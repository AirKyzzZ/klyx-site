import { cn } from "@/lib/utils";

type ProofCardProps = {
  label: string;
  title: string;
  body: string;
  className?: string;
};

export function ProofCard({ label, title, body, className }: ProofCardProps) {
  return (
    <figure
      className={cn(
        "bg-background overflow-hidden rounded-2xl border shadow-lg",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b px-5 py-3">
        <span className="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-wider uppercase">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#E8431F]"
          />
          {label}
        </span>
        <span className="text-muted-foreground font-mono text-xs">klyx.fr</span>
      </div>
      <figcaption className="px-5 pt-5 font-semibold">{title}</figcaption>
      <div className="p-5">
        <pre className="bg-muted text-muted-foreground rounded-lg border border-dashed p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {body}
        </pre>
      </div>
    </figure>
  );
}
