import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function freshTracker() {
  vi.resetModules();
  return import("./track");
}

describe("track", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete window.__klyxEvents;
  });

  it("does nothing without a key, even once a client connects", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    const { track, connectAnalytics } = await freshTracker();
    const capture = vi.fn();

    expect(() =>
      track("cta_book_call_click", { location: "hero" }),
    ).not.toThrow();
    connectAnalytics({ capture });
    track("$pageview");

    expect(capture).not.toHaveBeenCalled();
  });

  it("queues events until the client connects, then flushes them in order", async () => {
    const { track, connectAnalytics } = await freshTracker();
    const capture = vi.fn();

    track("$pageview");
    track("cta_book_call_click", { location: "hero" });
    expect(capture).not.toHaveBeenCalled();

    connectAnalytics({ capture });
    expect(capture.mock.calls).toEqual([
      ["$pageview", undefined],
      ["cta_book_call_click", { location: "hero" }],
    ]);

    track("contact_submit", { status: "success" });
    expect(capture).toHaveBeenLastCalledWith("contact_submit", {
      status: "success",
    });
    expect(capture).toHaveBeenCalledTimes(3);
  });

  it("drops the queue and stays silent when analytics is switched off", async () => {
    const { track, connectAnalytics } = await freshTracker();
    const capture = vi.fn();

    track("$pageview");
    connectAnalytics(null);
    track("pricing_view", { location: "pricing_page" });
    connectAnalytics({ capture });

    expect(capture).not.toHaveBeenCalled();
  });

  it("mirrors every call to the test hook when the page defines it", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    const { track } = await freshTracker();
    window.__klyxEvents = [];

    track("cta_quote_click", { location: "offer_page" });

    expect(window.__klyxEvents).toEqual([
      ["cta_quote_click", { location: "offer_page" }],
    ]);
  });
});
