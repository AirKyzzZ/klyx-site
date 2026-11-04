import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ScenarioStep } from "@/lib/scenarios";

import { HOLD_MS, LiveSystemPlayer } from "./live-system-player";

const steps: ScenarioStep[] = [
  { at: 0, node: "a", line: 0 },
  { at: 500, edge: ["a", "b"] },
  { at: 1000, node: "b", line: 1, chip: true },
];
const PASS_MS = 1000 + HOLD_MS;

function Stage({ id, hidden }: { id: string; hidden?: boolean }) {
  return (
    <div data-ls-stage={id} hidden={hidden}>
      <div data-node="a" data-state="done" />
      <svg>
        <path data-edge="a>b" data-state="done" />
      </svg>
      <div data-node="b" data-state="done" />
      <div data-trace style={{ "--shown": 2 } as React.CSSProperties}>
        <p data-line="0" data-shown="true" />
        <p data-line="1" data-shown="true" />
      </div>
      <div data-chip data-shown="true" />
    </div>
  );
}

function setReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("reduce"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

function renderPlayer() {
  let report: (visible: boolean) => void = () => {};
  const subscribeVisibility = (onChange: (visible: boolean) => void) => {
    report = onChange;
    onChange(true);
    return () => {};
  };
  const view = render(
    <LiveSystemPlayer
      scenarios={{ agents: steps, sites: steps }}
      initial="agents"
      subscribeVisibility={subscribeVisibility}
    >
      <div data-ls-frame>
        <Stage id="agents" />
        <Stage id="sites" hidden />
      </div>
      <a data-ls-tab="agents" href="#agents" role="tab" aria-selected="true">
        agents
      </a>
      <a data-ls-tab="sites" href="#sites" role="tab" aria-selected="false">
        sites
      </a>
    </LiveSystemPlayer>,
  );
  const stage = (id: string) =>
    view.container.querySelector<HTMLElement>(`[data-ls-stage="${id}"]`)!;
  const state = (selector: string, id = "agents") =>
    stage(id).querySelector(selector)?.getAttribute("data-state") ??
    stage(id).querySelector(selector)?.getAttribute("data-shown");
  return {
    ...view,
    stage,
    state,
    setVisible: (visible: boolean) => act(() => report(visible)),
  };
}

const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe("LiveSystemPlayer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setReducedMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("starts no timer and keeps the final state under reduced motion", () => {
    setReducedMotion(true);
    const { state } = renderPlayer();
    expect(vi.getTimerCount()).toBe(0);
    expect(state('[data-node="a"]')).toBe("done");
    expect(state("[data-chip]")).toBe("true");
  });

  it("walks the steps in order", () => {
    const { state } = renderPlayer();
    expect(state('[data-node="b"]')).toBe("idle");
    expect(state('[data-line="1"]')).toBe("false");
    expect(state("[data-chip]")).toBe("false");

    advance(0);
    expect(state('[data-node="a"]')).toBe("active");
    expect(state('[data-line="0"]')).toBe("true");

    advance(500);
    expect(state('[data-edge="a>b"]')).toBe("active");
    expect(state('[data-node="a"]')).toBe("active");
    expect(state('[data-node="b"]')).toBe("idle");

    advance(500);
    expect(state('[data-node="a"]')).toBe("done");
    expect(state('[data-node="b"]')).toBe("active");
    expect(state('[data-edge="a>b"]')).toBe("done");
    expect(state('[data-line="1"]')).toBe("true");
    expect(state("[data-chip]")).toBe("true");
  });

  it("pauses the clock while hidden", () => {
    const { state, setVisible } = renderPlayer();
    advance(0);
    setVisible(false);
    advance(5000);
    expect(state('[data-node="a"]')).toBe("active");
    expect(state('[data-edge="a>b"]')).toBe("idle");

    setVisible(true);
    advance(500);
    expect(state('[data-edge="a>b"]')).toBe("active");
  });

  it("keeps playing while the pointer is over the frame", () => {
    const { state, container } = renderPlayer();
    advance(0);
    fireEvent.pointerEnter(container.querySelector("[data-ls-frame]")!);
    advance(500);
    expect(state('[data-edge="a>b"]')).toBe("active");
    expect(
      container.querySelector("[data-live-system]")?.hasAttribute("data-paused"),
    ).toBe(false);
  });

  it("pauses on keyboard focus only", () => {
    const { state, container } = renderPlayer();
    advance(0);
    const target = container.querySelector<HTMLElement>("[data-ls-stage]")!;
    fireEvent.focusIn(target);
    advance(500);
    expect(state('[data-edge="a>b"]')).toBe("active");
    vi.spyOn(target, "matches").mockReturnValue(true);
    fireEvent.focusIn(target);
    expect(
      container.querySelector("[data-live-system]")?.hasAttribute("data-paused"),
    ).toBe(true);
    fireEvent.focusOut(target);
    expect(
      container.querySelector("[data-live-system]")?.hasAttribute("data-paused"),
    ).toBe(false);
  });

  it("keeps looping with no end", () => {
    const { state, container } = renderPlayer();
    advance(PASS_MS * 20);
    expect(vi.getTimerCount()).toBe(1);
    const seen = new Set<string | null | undefined>();
    for (let t = 0; t < PASS_MS; t += 100) {
      advance(100);
      seen.add(state('[data-node="b"]'));
    }
    expect(seen).toContain("idle");
    expect(seen).toContain("done");
    expect(
      container.querySelector("[data-live-system]")?.hasAttribute("data-playing"),
    ).toBe(true);
  });

  it("applies a roving tabindex to the tabs after mount", () => {
    const { container } = renderPlayer();
    const tab = (id: string) =>
      container.querySelector<HTMLElement>(`[data-ls-tab="${id}"]`)!;
    expect(tab("agents").tabIndex).toBe(0);
    expect(tab("sites").tabIndex).toBe(-1);
  });

  it("swaps the scenario on a plain tab click", () => {
    const { container, stage } = renderPlayer();
    const sitesTab = container.querySelector('[data-ls-tab="sites"]')!;
    const clicked = fireEvent.click(sitesTab);
    expect(clicked).toBe(false);
    expect(sitesTab.getAttribute("aria-selected")).toBe("true");
    expect(
      container
        .querySelector('[data-ls-tab="agents"]')!
        .getAttribute("aria-selected"),
    ).toBe("false");
    expect(stage("sites").hidden).toBe(false);
    expect(stage("agents").hidden).toBe(true);
  });

  it("lets modified clicks through to the link", () => {
    const { container } = renderPlayer();
    const sitesTab = container.querySelector('[data-ls-tab="sites"]')!;
    expect(fireEvent.click(sitesTab, { metaKey: true })).toBe(true);
    expect(sitesTab.getAttribute("aria-selected")).toBe("false");
  });
});
