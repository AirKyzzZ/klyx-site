import { describe, expect, it } from "vitest";

import {
  getSiteShot,
  getVerifiedProof,
  type ProofSource,
  selectStripProof,
  verifyLighthouse,
  verifyPrList,
  verifyRunLog,
  verifySiteShots,
} from "./index";
import lighthouseData from "./klyx-lighthouse.json";

const measured = {
  status: "measured",
  url: "https://klyx.fr",
  date: "2026-11-02",
  scores: { performance: 97, accessibility: 100, bestPractices: 100, seo: 100 },
};

describe("verifyLighthouse", () => {
  it("excludes a pending run", () => {
    expect(verifyLighthouse({ status: "pending" })).toBeNull();
  });

  it("excludes scores outside 0-100", () => {
    expect(
      verifyLighthouse({
        ...measured,
        scores: { ...measured.scores, seo: 140 },
      }),
    ).toBeNull();
  });

  it("keeps a measured run with its url and date", () => {
    expect(verifyLighthouse(measured)).toEqual({
      kind: "lighthouse",
      url: measured.url,
      date: measured.date,
      scores: measured.scores,
    });
  });
});

describe("verifyPrList", () => {
  it("excludes a list Maxime has not confirmed", () => {
    expect(verifyPrList({ status: "pending" })).toBeNull();
  });

  it("excludes a confirmed list with no items", () => {
    expect(
      verifyPrList({ status: "confirmed", repo: "klyx/site", items: [] }),
    ).toBeNull();
  });

  it("keeps a confirmed list", () => {
    const item = {
      title: "feat: add citation tracker",
      number: 412,
      mergedAt: "2026-10-20",
      href: "https://github.com/klyx/site/pull/412",
    };
    expect(
      verifyPrList({ status: "confirmed", repo: "klyx/site", items: [item] }),
    ).toEqual({ kind: "pr-list", repo: "klyx/site", items: [item] });
  });
});

describe("verifyRunLog", () => {
  it("excludes a log that is not marked anonymised", () => {
    expect(
      verifyRunLog({
        status: "confirmed",
        title: "run",
        rows: [{ t: "00:01", text: "ok" }],
      }),
    ).toBeNull();
  });

  it("excludes a pending log", () => {
    expect(verifyRunLog({ status: "pending" })).toBeNull();
  });
});

describe("verifySiteShots", () => {
  it("maps captured sites to their 1440 screenshot", () => {
    expect(
      verifySiteShots([
        { slug: "pkba", url: "https://pkba.vertiflow.fr", capturedAt: "x" },
      ]),
    ).toEqual([
      {
        kind: "site-shot",
        slug: "pkba",
        url: "https://pkba.vertiflow.fr",
        image: "/realisations/pkba-1440.png",
      },
    ]);
  });

  it("drops malformed entries", () => {
    expect(verifySiteShots([{ slug: "pkba" }, null, "x"])).toEqual([]);
  });
});

describe("getVerifiedProof", () => {
  it("returns the klyx.fr Lighthouse run only once it is measured", () => {
    const kinds = getVerifiedProof().map((source) => source.kind);
    expect(kinds.includes("lighthouse")).toBe(
      verifyLighthouse(lighthouseData) !== null,
    );
  });

  it("returns only site shots whose url is a live https url", () => {
    for (const source of getVerifiedProof()) {
      if (source.kind !== "site-shot") continue;
      expect(source.url).toMatch(/^https:\/\//);
    }
  });
});

describe("getSiteShot", () => {
  it("returns null for a site that was not captured", () => {
    expect(getSiteShot("does-not-exist")).toBeNull();
  });
});

describe("selectStripProof", () => {
  const shot = (slug: string): ProofSource => ({
    kind: "site-shot",
    slug,
    url: `https://${slug}.fr`,
    image: `/realisations/${slug}-1440.png`,
  });

  it("keeps one source per kind, in strip order", () => {
    const lighthouse = verifyLighthouse(measured);
    if (!lighthouse) throw new Error("fixture");
    expect(
      selectStripProof([shot("a"), shot("b"), lighthouse]).map((s) => s.kind),
    ).toEqual(["lighthouse", "site-shot"]);
  });

  it("returns a single site shot when nothing else is verified", () => {
    expect(selectStripProof([shot("a"), shot("b")])).toHaveLength(1);
  });
});
