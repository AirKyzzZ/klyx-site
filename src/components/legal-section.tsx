import type { ReactNode } from "react";

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-shot={id}
      aria-labelledby={`${id}-title`}
      className="border-line scroll-mt-28 border-t pt-8"
    >
      <h2 id={`${id}-title`} className="type-h3">
        <a
          href={`#${id}`}
          className="group/anchor inline-flex items-baseline gap-2"
        >
          {title}
          <span
            aria-hidden="true"
            className="text-text-3 font-mono text-sm opacity-0 transition-opacity duration-(--d-fast) group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100"
          >
            #
          </span>
        </a>
      </h2>
      <div className="text-text-2 mt-4 space-y-3">{children}</div>
    </section>
  );
}

export function LegalArticle({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="container pt-24 pb-24 md:pt-28 md:pb-32">
      <article className="max-w-[66ch] space-y-12">
        <header>
          <h1 className="type-h1">{title}</h1>
          <p className="type-label text-text-3 mt-5">{updated}</p>
          {intro && <p className="type-lead text-text-2 mt-6">{intro}</p>}
        </header>
        {children}
      </article>
    </div>
  );
}
