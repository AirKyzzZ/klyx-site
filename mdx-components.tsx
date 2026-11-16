import type { ComponentProps, ReactNode } from "react";

import type { MDXComponents } from "mdx/types";

const TODO_PREFIX = "TODO(maxime)";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function TodoNote({ text }: { text: string }) {
  return (
    <p className="border-accent type-data text-text rounded-sm border px-4 py-3 text-[0.8125rem]">
      <span className="text-accent-text">{TODO_PREFIX}</span>
      {text.slice(TODO_PREFIX.length)}
    </p>
  );
}

function Paragraph({ children, ...props }: ComponentProps<"p">) {
  if (typeof children === "string" && children.startsWith(TODO_PREFIX)) {
    return <TodoNote text={children} />;
  }
  return (
    <p className="text-text-2" {...props}>
      {children}
    </p>
  );
}

function AnchoredHeading({ children }: { children?: ReactNode }) {
  if (typeof children !== "string") {
    return <h2 className="type-h3 text-text pt-8">{children}</h2>;
  }
  const id = slugify(children);
  return (
    <h2 id={id} className="type-h3 text-text scroll-mt-28 pt-8">
      <a
        href={`#${id}`}
        className="group/anchor inline-flex items-baseline gap-2"
      >
        {children}
        <span
          aria-hidden="true"
          className="text-text-3 font-mono text-sm opacity-0 transition-opacity duration-(--d-fast) group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100"
        >
          #
        </span>
      </a>
    </h2>
  );
}

const proseComponents: MDXComponents = {
  h2: AnchoredHeading,
  h3: ({ children }) => (
    <h3 className="text-text pt-4 text-[1.0625rem] font-medium">{children}</h3>
  ),
  p: Paragraph,
  ul: ({ children }) => <ul className="space-y-2">{children}</ul>,
  ol: ({ children }) => (
    <ol className="marker:text-text-3 list-decimal space-y-2 pl-6 marker:font-mono">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-text-2 [ul>&]:before:text-text-3 relative pl-6 [ol>&]:pl-1 [ul>&]:before:absolute [ul>&]:before:left-0 [ul>&]:before:font-mono [ul>&]:before:content-['-']">
      {children}
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-text decoration-text-3 hover:decoration-text underline underline-offset-4 transition-colors"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="text-text font-medium">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="bg-surface-2 rounded-xs px-1.5 py-0.5 font-mono text-[0.875em]">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-line-strong border-l pl-5">
      {children}
    </blockquote>
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...proseComponents, ...components };
}
