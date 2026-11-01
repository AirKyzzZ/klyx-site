import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ProofSource } from "@/lib/proof";

import { ProofStrip } from "../sections/proof-strip";
import { ProofCard } from "./proof-card";

const lighthouse: ProofSource = {
  kind: "lighthouse",
  url: "https://klyx.fr",
  date: "2026-11-02",
  scores: { performance: 97, accessibility: 100, bestPractices: 96, seo: 100 },
};

const shot: ProofSource = {
  kind: "site-shot",
  slug: "pkba",
  url: "https://pkba.vertiflow.fr",
  image: "/realisations/pkba-1440.png",
};

const prList: ProofSource = {
  kind: "pr-list",
  repo: "klyx/site",
  items: [
    {
      title: "feat: add citation tracker",
      number: 412,
      mergedAt: "2026-10-20",
      href: "https://github.com/klyx/site/pull/412",
    },
  ],
};

describe("ProofCard", () => {
  it("renders the four Lighthouse scores and the measured url", () => {
    render(<ProofCard source={lighthouse} locale="fr" />);
    for (const score of ["97", "100", "96"]) {
      expect(screen.getAllByText(score).length).toBeGreaterThan(0);
    }
    expect(screen.getByText("klyx.fr")).toBeInTheDocument();
  });

  it("links a site shot to the live site", () => {
    render(<ProofCard source={shot} locale="en" />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://pkba.vertiflow.fr",
    );
  });

  it("links each PR to GitHub", () => {
    render(<ProofCard source={prList} locale="fr" />);
    expect(screen.getByRole("link", { name: /#412/ })).toHaveAttribute(
      "href",
      prList.kind === "pr-list" ? prList.items[0].href : "",
    );
  });

  it("renders nothing for an unverified source", () => {
    const { container } = render(
      <ProofCard
        source={{ ...lighthouse, scores: { ...lighthouse.scores, seo: 140 } }}
        locale="fr"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for a PR list with no items", () => {
    const { container } = render(
      <ProofCard source={{ ...prList, items: [] }} locale="fr" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("ProofStrip", () => {
  const heading = { title: "Ce qu'on a livré,", emphasis: "vérifiable." };

  it("renders nothing with fewer than 2 sources", () => {
    const { container } = render(
      <ProofStrip sources={[shot]} locale="fr" {...heading} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when only site shots are verified", () => {
    const { container } = render(
      <ProofStrip
        sources={[shot, { ...shot, slug: "vertiflow" }]}
        locale="fr"
        {...heading}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a card per kind once 2 kinds are verified", () => {
    render(
      <ProofStrip sources={[shot, lighthouse]} locale="fr" {...heading} />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Ce qu'on a livré, vérifiable.",
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
