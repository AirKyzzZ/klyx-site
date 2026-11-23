import type { MDXComponents } from "mdx/types";

export const caseProseComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="text-text border-line mt-12 border-t pt-10 text-2xl leading-[1.15] font-semibold tracking-[-0.7px] first:mt-0 first:border-t-0 first:pt-0 sm:text-[1.625rem]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-text mt-8 text-lg leading-tight font-semibold tracking-[-0.3px]">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-text-2 mt-4 text-base leading-[1.6] first:mt-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 flex flex-col gap-4 [counter-reset:step]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-text-2 [ol>&]:before:border-line-strong [ol>&]:before:bg-surface-1 [ol>&]:before:text-text [ul>&]:before:bg-accent relative text-base leading-[1.6] [ol>&]:min-h-7 [ol>&]:pl-11 [ol>&]:[counter-increment:step] [ol>&]:before:absolute [ol>&]:before:top-0 [ol>&]:before:left-0 [ol>&]:before:grid [ol>&]:before:size-7 [ol>&]:before:place-items-center [ol>&]:before:rounded-full [ol>&]:before:border [ol>&]:before:text-[0.8125rem] [ol>&]:before:font-semibold [ol>&]:before:content-[counter(step)] [ul>&]:pl-5 [ul>&]:before:absolute [ul>&]:before:top-[0.65em] [ul>&]:before:left-0 [ul>&]:before:size-1.5 [ul>&]:before:rounded-full">
      {children}
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-accent underline decoration-1 underline-offset-[3px]"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="text-text font-medium">{children}</strong>
  ),
};
