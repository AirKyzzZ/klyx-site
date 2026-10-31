"use client";

import {
  type CSSProperties,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";

import { useLocale, useTranslations } from "next-intl";

import { MARKDOWN_TYPE } from "@/lib/machine/markdown-href";

import {
  setMachineMode,
  useMachineMode,
  useMarkdownHref,
  ViewToggle,
  wipeOrigin,
} from "./view-toggle";
import "./machine-view.css";

const cache = new Map<string, string>();
const COPIED_MS = 1600;
const CHARS_PER_TOKEN = 4;
const LINK = /(\[[^\]]*\]\([^)\s]+\)|<https?:\/\/[^>\s]+>)/;

function MarkdownLine({ line }: { line: string }) {
  if (/^#{1,6} /.test(line)) return <span className="mv-heading">{line}</span>;
  return (
    <>
      {line.split(LINK).map((part, i) => {
        const inline = /^\[([^\]]*)\]\(([^)\s]+)\)$/.exec(part);
        if (inline) {
          return (
            <Fragment key={i}>
              [{inline[1]}](
              <a href={inline[2]} className="mv-link">
                {inline[2]}
              </a>
              )
            </Fragment>
          );
        }
        const auto = /^<(https?:\/\/[^>\s]+)>$/.exec(part);
        if (auto) {
          return (
            <Fragment key={i}>
              &lt;
              <a href={auto[1]} className="mv-link">
                {auto[1]}
              </a>
              &gt;
            </Fragment>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function MachineView() {
  const t = useTranslations("machine");
  const locale = useLocale();
  const href = useMarkdownHref();
  const machine = useMachineMode();
  const [, setLoadedCount] = useState(0);
  const [failure, setFailure] = useState<{
    href: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const layerRef = useRef<HTMLElement>(null);
  const restore = useRef<{ scrollY: number; focus: Element | null } | null>(
    null,
  );
  const markdown = cache.get(href);

  useEffect(() => {
    if (!machine || cache.has(href)) return;
    const controller = new AbortController();
    fetch(href, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GET ${href} returned ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        cache.set(href, text);
        setLoadedCount((count) => count + 1);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : String(error);
        console.error(error);
        setFailure({ href, message });
      });
    return () => controller.abort();
  }, [machine, href]);

  useEffect(() => {
    const covered = document.querySelectorAll<HTMLElement>("main, footer");
    for (const element of covered) element.inert = machine;
    return () => {
      for (const element of covered) element.inert = false;
    };
  }, [machine]);

  useEffect(() => {
    if (machine) {
      restore.current = {
        scrollY: window.scrollY,
        focus: document.activeElement,
      };
      layerRef.current?.scrollTo(0, 0);
      layerRef.current?.focus({ preventScroll: true });
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setMachineMode(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
    if (!restore.current) return;
    window.scrollTo(0, restore.current.scrollY);
    if (restore.current.focus instanceof HTMLElement) {
      restore.current.focus.focus({ preventScroll: true });
    }
    restore.current = null;
  }, [machine]);

  const copy = async () => {
    if (!markdown) return;
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), COPIED_MS);
  };

  const bytes = markdown ? new TextEncoder().encode(markdown).length : 0;
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const tokens = markdown
    ? Math.round(markdown.length / CHARS_PER_TOKEN / 10) * 10
    : 0;
  const lines = markdown ? markdown.replace(/\n$/, "").split("\n") : [];
  const wipe = {
    "--wipe-x": wipeOrigin.x,
    "--wipe-y": wipeOrigin.y,
  } as CSSProperties;

  return (
    <>
      <section
        ref={layerRef}
        className="machine-view"
        data-open={machine ? "" : undefined}
        aria-label={t("machine")}
        inert={!machine}
        tabIndex={-1}
        style={wipe}
      >
        <div className="container">
          <div className="mv-window">
            <header className="mv-bar">
              <div className="mv-hatch" aria-hidden="true" />
              <div className="mv-meta">
                <p className="mv-request">
                  <span className="mv-verb">GET</span>{" "}
                  <span className="mv-path">{href}</span>
                  <span className="mv-facts">
                    {" · "}
                    {MARKDOWN_TYPE}
                    {markdown && (
                      <>
                        {" · "}
                        {number.format(bytes / 1024)} KB
                        {" · "}
                        {t("tokensApprox", { count: number.format(tokens) })}
                      </>
                    )}
                  </span>
                </p>
                <div className="mv-actions">
                  <button
                    type="button"
                    className="mv-action"
                    onClick={copy}
                    disabled={!markdown}
                  >
                    {copied ? t("copied") : t("copy")}
                  </button>
                  <a
                    href={href}
                    className="mv-action"
                    target="_blank"
                    rel="noopener"
                  >
                    {t("openRaw")}
                  </a>
                  <div className="mv-inline-toggle">
                    <ViewToggle markdownHref={href} variant="inline" />
                  </div>
                </div>
              </div>
              <div className="mv-hatch" aria-hidden="true" />
            </header>
            {failure?.href === href && !markdown && (
              <p className="mv-failure">{failure.message}</p>
            )}
            <ol className="mv-lines">
              {lines.map((line, i) => (
                <li key={i} className="mv-line">
                  <span className="mv-ln" aria-hidden="true">
                    {i + 1}
                  </span>
                  <code className="mv-code">
                    <MarkdownLine line={line} />
                  </code>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <ViewToggle markdownHref={href} variant="floating" />
    </>
  );
}
