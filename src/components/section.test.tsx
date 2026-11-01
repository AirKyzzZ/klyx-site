import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Eyebrow, SectionHeading } from "./section";

describe("SectionHeading", () => {
  it("defaults to an h2", () => {
    render(<SectionHeading lead="Comment ça se passe" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Comment ça se passe",
    );
  });

  it("renders as h1 when asked", () => {
    render(<SectionHeading as="h1" lead="Titre" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders lead and rest in separate spans", () => {
    render(
      <SectionHeading
        lead="Des agents IA qui tournent en production,"
        rest="pas des démos."
      />,
    );
    const lead = screen.getByText("Des agents IA qui tournent en production,");
    const rest = screen.getByText("pas des démos.");
    expect(lead.tagName).toBe("SPAN");
    expect(rest.tagName).toBe("SPAN");
    expect(lead).not.toBe(rest);
    expect(screen.getByRole("heading")).toHaveTextContent(
      "Des agents IA qui tournent en production, pas des démos.",
    );
  });

  it("wraps the serif word in an element with the serif class", () => {
    render(
      <SectionHeading
        lead="Des agents IA qui tournent en production,"
        rest="pas des démos."
        serif="démos"
      />,
    );
    const word = screen.getByText("démos");
    expect(word).toHaveClass("font-serif");
    expect(word.closest("span")).toHaveTextContent("pas des démos.");
    expect(screen.getByRole("heading")).toHaveTextContent(
      "Des agents IA qui tournent en production, pas des démos.",
    );
  });

  it("throws when the serif word is not in the heading", () => {
    expect(() =>
      render(<SectionHeading lead="Tarifs" rest="au forfait." serif="démos" />),
    ).toThrow(/démos/);
  });
});

describe("Eyebrow", () => {
  it("prefixes the section index", () => {
    render(<Eyebrow index="01">Offres</Eyebrow>);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Offres")).toBeInTheDocument();
  });
});
