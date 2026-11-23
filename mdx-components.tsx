import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

import type { MDXComponents } from "mdx/types";

import { bindPunctuation, headingId } from "@/lib/headings";
import { PROSE_LINK } from "@/lib/prose";

const TODO_PREFIX = "TODO(maxime)";

function TodoNote({ text }: { text: string }) {
  return (
    <p className="border-accent bg-accent-tint text-text rounded-[10px] border px-4 py-3 text-[0.875rem]">
      <span className="text-accent font-medium">{TODO_PREFIX}</span>
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

const H2_CLASS =
  "text-text scroll-mt-28 pt-8 text-[1.5rem] leading-[1.15] font-semibold tracking-[-0.6px] sm:text-[1.625rem] sm:tracking-[-0.7px]";

function AnchoredHeading({ children }: { children?: ReactNode }) {
  if (typeof children !== "string") {
    return <h2 className={H2_CLASS}>{children}</h2>;
  }
  const id = headingId(children);
  return (
    <h2 id={id} className={H2_CLASS}>
      <a href={`#${id}`} className="group/anchor">
        {bindPunctuation(children)}
        <span
          aria-hidden="true"
          className="text-text-3 ml-2 opacity-0 transition-opacity duration-(--d-fast) group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100"
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
    <h3 className="text-text pt-3 text-[1.1875rem] leading-snug font-semibold tracking-[-0.3px]">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-text pt-2 font-semibold">{children}</h4>
  ),
  p: Paragraph,
  ul: ({ children }) => (
    <ul className="marker:text-text-3 list-disc space-y-2 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="marker:text-text-3 list-decimal space-y-2 pl-6 marker:font-medium marker:tabular-nums">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-text-2 pl-1.5">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} className={PROSE_LINK}>
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="text-text font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="border-line bg-surface-2 text-text rounded-[6px] border px-1.5 py-0.5 font-mono text-[0.875em] [pre_&]:border-0 [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-[0.875rem]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="border-line bg-surface-2 overflow-x-auto rounded-[12px] border p-4 leading-relaxed">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-accent bg-surface-2 [&>p]:text-text space-y-3 rounded-r-[12px] border-l-2 px-5 py-4">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-line" />,
  table: ({ children }) => (
    <div className="border-line bg-surface-1 overflow-x-auto rounded-[12px] border">
      <table className="w-full border-collapse text-left text-[0.9375rem] leading-normal">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-surface-2 text-text px-4 py-3 text-[0.8125rem] font-medium">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-line text-text-2 border-t px-4 py-3 align-top">
      {children}
    </td>
  ),
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      <Image
        src={src}
        alt={alt ?? ""}
        width={0}
        height={0}
        sizes="(min-width: 1024px) 720px, 100vw"
        className="border-line bg-surface-2 h-auto w-full rounded-[12px] border"
      />
    ) : null,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...proseComponents, ...components };
}
