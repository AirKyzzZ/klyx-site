import type { ReactNode } from "react";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { BrowserFrame, hostOf } from "@/components/proof/browser-frame";
import { Section, SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import type { ProofSource } from "@/lib/proof";
import { ROSTER_FIELDS, type TeamRoster } from "@/lib/team-roster";

type SiteShot = Extract<ProofSource, { kind: "site-shot" }>;

type FounderProps = {
  index?: string;
  eyebrow?: string;
  title: string;
  emphasis?: string;
  body: string;
  experience: string;
  caption: string;
  roster: TeamRoster;
  products: { label: string; items: { name: string; url: string }[] };
  shot: SiteShot | null;
  links: { label: string; href: string }[];
  aboutLabel: string;
};

export function TerminalWindow({
  title,
  command,
  children,
}: {
  title: string;
  command: string;
  children: ReactNode;
}) {
  return (
    <div className="border-line-strong bg-surface-2 shadow-window overflow-hidden rounded-lg border">
      <div className="border-line text-text-3 flex h-9 items-center gap-2 border-b px-3 font-mono text-xs">
        <span className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <i
              key={dot}
              className="bg-surface-3 size-2.25 rounded-full shadow-[inset_0_0_0_1px_var(--line-strong)]"
            />
          ))}
        </span>
        <span className="ml-1">{title}</span>
      </div>
      <div className="type-data p-4 text-[0.8125rem] sm:p-5">
        <p className="text-text-3">
          <span aria-hidden="true">$ </span>
          {command}
        </p>
        {children}
      </div>
    </div>
  );
}

export function FactRows({ rows }: { rows: { key: string; value: string }[] }) {
  return (
    <dl className="mt-2 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
      {rows.map((row) => (
        <div key={row.key} className="contents">
          <dt className="text-text-3">{row.key}</dt>
          <dd className="text-text">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function RosterWindow({ window, file, keys, items }: TeamRoster) {
  return (
    <TerminalWindow title={window} command={`cat ${file}`}>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.role}>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-0.5">
              {ROSTER_FIELDS.map((field, i) => (
                <div key={field} className="contents">
                  <dt className="text-text-3 whitespace-pre">
                    {i === 0 ? "- " : "  "}
                    {keys[field]}:
                  </dt>
                  <dd
                    className={field === "role" ? "text-accent" : "text-text"}
                  >
                    {item[field]}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </TerminalWindow>
  );
}

export function Founder({
  index,
  eyebrow,
  title,
  emphasis,
  body,
  experience,
  caption,
  roster,
  products,
  shot,
  links,
  aboutLabel,
}: FounderProps) {
  return (
    <Section index={index} eyebrow={eyebrow}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <figure className="reveal lg:col-span-5">
          {shot && (
            <BrowserFrame
              url={shot.url}
              image={shot.image}
              alt={hostOf(shot.url)}
              sizes="(min-width: 1024px) 460px, 90vw"
              className="w-[92%]"
            />
          )}
          <div
            className={
              shot ? "relative z-1 -mt-6 ml-auto w-[86%] lg:-mt-20" : undefined
            }
          >
            <RosterWindow {...roster} />
          </div>
          <figcaption className="type-label text-text-3 mt-4">
            {caption}
          </figcaption>
        </figure>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading lead={title} rest={emphasis} className="reveal" />
          <div className="reveal">
            <p className="type-lead text-text mt-6 max-w-[52ch]">{body}</p>
            <p className="text-text-2 mt-4 max-w-[58ch]">{experience}</p>

            {products.items.length > 0 && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <p className="type-label text-text-3">{products.label}</p>
                <ul className="flex flex-wrap gap-2">
                  {products.items.map((product) => (
                    <li key={product.url}>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener"
                        className="border-line-strong bg-surface-1 text-text-2 hover:text-text hover:bg-surface-2 inline-flex h-8 items-center gap-2 rounded-sm border px-2.5 font-mono text-xs transition-colors duration-(--d-fast)"
                      >
                        <span
                          aria-hidden="true"
                          className="bg-text-3 size-1.5 rounded-full"
                        />
                        {product.name}
                        <span className="text-text-3">
                          {hostOf(product.url)}
                        </span>
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="border-line mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t pt-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className="text-text hover:text-text-2 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/a-propos"
                  className="group text-text hover:text-text-2 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  {aboutLabel}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
