"use client";

import { type ReactNode, useEffect, useRef } from "react";

import type { ScenarioStep } from "@/lib/scenarios";

export const HOLD_MS = 2500;
export const MAX_LOOPS = 3;
const SETTLE_MS = 700;

type VisibilitySubscriber = (
  onChange: (visible: boolean) => void,
) => () => void;

type PlayerProps = {
  scenarios: Partial<Record<string, ScenarioStep[]>>;
  initial: string;
  subscribeVisibility?: VisibilitySubscriber;
  className?: string;
  children: ReactNode;
};

type Run = {
  pause: (reason: string) => void;
  resume: (reason: string) => void;
  stop: () => void;
};

const ACTIVE = '[data-state="active"]';

function setAll(
  stage: HTMLElement,
  selector: string,
  name: string,
  value: string,
) {
  for (const el of stage.querySelectorAll(selector))
    el.setAttribute(name, value);
}

function reset(stage: HTMLElement) {
  setAll(stage, "[data-node], [data-edge]", "data-state", "idle");
  setAll(stage, "[data-line], [data-chip]", "data-shown", "false");
  stage
    .querySelector<HTMLElement>("[data-trace]")
    ?.style.setProperty("--shown", "0");
}

function settle(stage: HTMLElement) {
  setAll(stage, ACTIVE, "data-state", "done");
}

function applyStep(stage: HTMLElement, step: ScenarioStep) {
  if (step.edge) {
    const [from, to] = step.edge;
    setAll(stage, `[data-node="${from}"]${ACTIVE}`, "data-state", "done");
    setAll(stage, `[data-edge="${from}>${to}"]`, "data-state", "active");
  }
  if (step.node) {
    setAll(
      stage,
      `[data-edge$=">${step.node}"]${ACTIVE}`,
      "data-state",
      "done",
    );
    setAll(stage, `[data-node="${step.node}"]`, "data-state", "active");
  }
  if (step.line !== undefined) {
    setAll(stage, `[data-line="${step.line}"]`, "data-shown", "true");
    stage
      .querySelector<HTMLElement>("[data-trace]")
      ?.style.setProperty("--shown", String(step.line + 1));
  }
  if (step.chip) setAll(stage, "[data-chip]", "data-shown", "true");
}

function play(
  root: HTMLElement,
  stage: HTMLElement,
  steps: ScenarioStep[],
): Run {
  const last = steps.at(-1)?.at ?? 0;
  const events: { at: number; run: () => void }[] = [
    ...steps.map((step) => ({
      at: step.at,
      run: () => applyStep(stage, step),
    })),
    { at: last + SETTLE_MS, run: () => settle(stage) },
  ];
  const passMs = last + HOLD_MS;
  const paused = new Set<string>();
  let loop = 0;
  let index = 0;
  let elapsed = 0;
  let startedAt = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const tick = () => {
    timer = undefined;
    elapsed = events[index]?.at ?? passMs;
    startedAt = Date.now();
    const event = events[index];
    if (event) {
      event.run();
      index += 1;
      schedule();
      return;
    }
    loop += 1;
    if (loop >= MAX_LOOPS) {
      root.removeAttribute("data-playing");
      return;
    }
    reset(stage);
    index = 0;
    elapsed = 0;
    schedule();
  };

  const schedule = () => {
    if (paused.size > 0) return;
    const nextAt = events[index]?.at ?? passMs;
    startedAt = Date.now();
    timer = setTimeout(tick, Math.max(0, nextAt - elapsed));
  };

  reset(stage);
  root.setAttribute("data-playing", "");
  schedule();

  return {
    pause(reason) {
      if (paused.has(reason)) return;
      paused.add(reason);
      root.setAttribute("data-paused", "");
      if (!timer) return;
      clearTimeout(timer);
      timer = undefined;
      elapsed += Date.now() - startedAt;
    },
    resume(reason) {
      if (!paused.delete(reason) || paused.size > 0) return;
      root.removeAttribute("data-paused");
      if (loop < MAX_LOOPS && !timer) schedule();
    },
    stop() {
      if (timer) clearTimeout(timer);
      timer = undefined;
      root.removeAttribute("data-playing");
      root.removeAttribute("data-paused");
    },
  };
}

const subscribeViewport =
  (target: Element): VisibilitySubscriber =>
  (onChange) => {
    let inView = false;
    const report = () => onChange(inView && !document.hidden);
    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(
            ([entry]) => {
              inView = entry?.isIntersecting ?? false;
              report();
            },
            { threshold: 0.15 },
          );
    if (observer) observer.observe(target);
    else inView = true;
    document.addEventListener("visibilitychange", report);
    report();
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", report);
    };
  };

function prefersReducedMotion() {
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
}

export function LiveSystemPlayer({
  scenarios,
  initial,
  subscribeVisibility,
  className,
  children,
}: PlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = prefersReducedMotion();
    const frame = root.querySelector("[data-ls-frame]") ?? root;
    let current = initial;
    let visible = false;
    let run: Run | undefined;

    const stageOf = (id: string) =>
      root.querySelector<HTMLElement>(`[data-ls-stage="${id}"]`);

    const start = (id: string) => {
      run?.stop();
      run = undefined;
      const stage = stageOf(id);
      const steps = scenarios[id];
      if (reduced || !stage || !steps) return;
      run = play(root, stage, steps);
      if (!visible) run.pause("view");
    };

    const select = (id: string) => {
      if (id === current) return;
      const swap = () => {
        for (const stage of root.querySelectorAll<HTMLElement>(
          "[data-ls-stage]",
        )) {
          stage.hidden = stage.dataset.lsStage !== id;
        }
        for (const tab of root.querySelectorAll<HTMLElement>("[data-ls-tab]")) {
          const selected = tab.dataset.lsTab === id;
          tab.setAttribute("aria-selected", String(selected));
          tab.tabIndex = selected ? 0 : -1;
        }
        current = id;
        start(id);
      };
      if (reduced || !document.startViewTransition) swap();
      else document.startViewTransition(swap);
    };

    const onClick = (event: MouseEvent) => {
      const tab = (event.target as Element).closest<HTMLElement>(
        "[data-ls-tab]",
      );
      if (!tab?.dataset.lsTab || event.defaultPrevented || event.button !== 0)
        return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      select(tab.dataset.lsTab);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const tabs = [...root.querySelectorAll<HTMLElement>("[data-ls-tab]")];
      const index = tabs.findIndex((tab) => tab === document.activeElement);
      if (index < 0) return;
      const step = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + step + tabs.length) % tabs.length];
      if (!next?.dataset.lsTab) return;
      event.preventDefault();
      next.focus();
      select(next.dataset.lsTab);
    };

    const onPointerEnter = () => run?.pause("hover");
    const onPointerLeave = () => run?.resume("hover");
    const onFocusIn = () => run?.pause("focus");
    const onFocusOut = (event: Event) => {
      const next = (event as FocusEvent).relatedTarget;
      if (!(next instanceof Node && frame.contains(next))) run?.resume("focus");
    };
    const frameListeners = [
      ["pointerenter", onPointerEnter],
      ["pointerleave", onPointerLeave],
      ["focusin", onFocusIn],
      ["focusout", onFocusOut],
    ] as const;

    start(current);
    const unsubscribe = (subscribeVisibility ?? subscribeViewport(root))(
      (next) => {
        visible = next;
        if (next) run?.resume("view");
        else run?.pause("view");
      },
    );

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);
    for (const [type, listener] of frameListeners)
      frame.addEventListener(type, listener);

    return () => {
      run?.stop();
      unsubscribe();
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
      for (const [type, listener] of frameListeners)
        frame.removeEventListener(type, listener);
    };
  }, [initial, scenarios, subscribeVisibility]);

  return (
    <div ref={rootRef} className={className} data-live-system="">
      {children}
    </div>
  );
}
