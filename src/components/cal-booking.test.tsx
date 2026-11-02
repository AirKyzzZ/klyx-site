import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CalBooking } from "./cal-booking";

const CAL_URL = "https://cal.com/klyx-studio/30min";

describe("CalBooking", () => {
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
