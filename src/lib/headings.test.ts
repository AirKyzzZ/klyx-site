import { describe, expect, it } from "vitest";

import { bindPunctuation, headingId, markdownHeadings } from "./headings";

describe("headingId", () => {
  it("drops accents, punctuation and the French space before ?", () => {
    expect(headingId("Combien coûte un agent IA pour une PME en 2026 ?")).toBe(
      "combien-coute-un-agent-ia-pour-une-pme-en-2026",
    );
    expect(headingId("Étape 1 : comment choisir le premier process ?")).toBe(
      "etape-1-comment-choisir-le-premier-process",
    );
  });
});

describe("markdownHeadings", () => {
  it("lists the h2 lines only, in order", () => {
    const body = [
      "Intro.",
      "## Première question ?",
      "Texte avec ## au milieu.",
      "### Sous-titre",
      "## Seconde question",
    ].join("\n\n");
    expect(markdownHeadings(body)).toEqual([
      { id: "premiere-question", title: "Première question\u00a0?" },
      { id: "seconde-question", title: "Seconde question" },
    ]);
  });
});

describe("bindPunctuation", () => {
  it("glues French double punctuation to the previous word", () => {
    expect(bindPunctuation("Étape 1 : pourquoi ?")).toBe(
      "Étape 1\u00a0: pourquoi\u00a0?",
    );
    expect(bindPunctuation("Step 1: why?")).toBe("Step 1: why?");
  });
});
