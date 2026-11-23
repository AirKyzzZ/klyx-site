import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CalBooking } from "./cal-booking";

const CAL_URL = "https://cal.com/klyx-studio/30min";

describe("CalBooking", () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
  });

  it("loads the calendar only after the button is clicked", () => {
    const { container } = render(
      <CalBooking calUrl={CAL_URL} label="Réserver" title="Agenda" />,
    );
    expect(container.querySelector("iframe")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Réserver" }));

    const frame = screen.getByTitle("Agenda");
    expect(frame.tagName).toBe("IFRAME");
    expect(frame.getAttribute("src")).toMatch(
      /^https:\/\/cal\.com\/klyx-studio\/30min\?/,
    );
    expect(frame.getAttribute("src")).toContain("theme=light");
  });

  it("passes the current theme to the calendar", () => {
    document.documentElement.dataset.theme = "dark";
    render(<CalBooking calUrl={CAL_URL} label="Réserver" title="Agenda" />);
    fireEvent.click(screen.getByRole("button", { name: "Réserver" }));
    expect(screen.getByTitle("Agenda").getAttribute("src")).toContain(
      "theme=dark",
    );
  });

  it("falls back to the contact form when no calendar is configured", () => {
    render(<CalBooking calUrl={undefined} label="Réserver" title="Agenda" />);
    expect(screen.getByRole("link", { name: "Réserver" })).toHaveAttribute(
      "href",
      "#contact-form",
    );
    expect(screen.queryByRole("button")).toBeNull();
  });
});
