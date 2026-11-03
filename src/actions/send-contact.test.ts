import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ContactState } from "@/lib/contact-schema";

const send = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const requestHeaders = new Headers();

vi.mock("next/headers", () => ({
  headers: async () => requestHeaders,
}));

const { sendContact } = await import("./send-contact");

const IDLE: ContactState = { status: "idle" };
let nextIp = 0;

function form(overrides: Record<string, string> = {}) {
  const data = new FormData();
  const values = {
    locale: "fr",
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: "Analytical",
    need: "agents",
    budget: "from3to10k",
    message: "Nous voulons automatiser nos devis.",
    website: "",
    consent: "on",
    fillMs: "8000",
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("sendContact", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@klyx.fr");
    nextIp += 1;
    requestHeaders.set("x-nf-client-connection-ip", `203.0.113.${nextIp}`);
    send.mockReset();
    send.mockResolvedValue({ data: { id: "email_1" }, error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends the request with Resend and replies to the visitor", async () => {
    const state = await sendContact(IDLE, form());
    expect(state).toEqual({ status: "success" });
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0]).toMatchObject({
      from: "Klyx <contact@send.klyx.fr>",
      to: "inbox@klyx.fr",
      replyTo: "ada@example.com",
    });
    expect(send.mock.calls[0][0].text).toContain(
      "Nous voulons automatiser nos devis.",
    );
  });

  it("pretends success without sending when the honeypot is filled", async () => {
    const log = vi.spyOn(console, "warn").mockImplementation(() => {});
    const state = await sendContact(IDLE, form({ website: "spam.example" }));
    expect(state.status).toBe("success");
    expect(send).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("reason=honeypot"),
    );
  });

  it("blocks a form submitted faster than a person can fill it", async () => {
    const log = vi.spyOn(console, "warn").mockImplementation(() => {});
    const state = await sendContact(IDLE, form({ fillMs: "400" }));
    expect(state).toEqual({
      status: "error",
      message: expect.stringContaining("contact@klyx.fr"),
    });
    expect(send).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("reason=too-fast"),
    );
  });

  it("blocks a direct post that never ran the form", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const data = form();
    data.delete("fillMs");
    const state = await sendContact(IDLE, data);
    expect(state.status).toBe("error");
    expect(send).not.toHaveBeenCalled();
  });

  it("rate limits one address and logs it masked, without the visitor's data", async () => {
    const log = vi.spyOn(console, "warn").mockImplementation(() => {});
    for (let i = 0; i < 5; i++) await sendContact(IDLE, form());
    expect(send).toHaveBeenCalledTimes(5);

    const state = await sendContact(IDLE, form());
    expect(send).toHaveBeenCalledTimes(5);
    expect(state.status).toBe("error");

    const line = String(log.mock.calls[0][0]);
    expect(line).toContain("reason=rate-limited");
    expect(line).toContain(".0/24");
    expect(line).not.toContain("ada@example.com");
  });

  it("gives a blocked request the same answer as a failed send", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const blocked = await sendContact(IDLE, form({ fillMs: "1" }));
    send.mockRejectedValue(new Error("network down"));
    const failed = await sendContact(IDLE, form());
    expect(blocked).toEqual(failed);
  });

  it("does not spend the rate limit on invalid submissions", async () => {
    for (let i = 0; i < 6; i++) {
      await sendContact(IDLE, form({ email: "not-an-email" }));
    }
    expect((await sendContact(IDLE, form())).status).toBe("success");
  });

  it("returns field errors for an invalid email", async () => {
    const state = await sendContact(IDLE, form({ email: "not-an-email" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.email).toBe(
      "Cette adresse e-mail n'est pas valide.",
    );
    expect(send).not.toHaveBeenCalled();
  });

  it("flags missing required fields and translates in English", async () => {
    const state = await sendContact(
      IDLE,
      form({ locale: "en", name: "", need: "", consent: "" }),
    );
    expect(state.status).toBe("error");
    expect(state.fieldErrors).toMatchObject({
      name: "This field is required.",
      need: "This field is required.",
      consent: "This field is required.",
    });
  });

  it("returns an error and logs when Resend is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = await sendContact(IDLE, form());
    expect(state.status).toBe("error");
    expect(state.message).toContain("contact@klyx.fr");
    expect(log).toHaveBeenCalledWith(expect.stringContaining("RESEND_API_KEY"));
    expect(send).not.toHaveBeenCalled();
  });

  it("returns an error and logs when the recipient is not configured", async () => {
    vi.stubEnv("CONTACT_TO_EMAIL", "");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = await sendContact(IDLE, form());
    expect(state.status).toBe("error");
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("CONTACT_TO_EMAIL"),
    );
  });

  it("never reports success when Resend returns an error", async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: "Invalid from" },
    });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = await sendContact(IDLE, form());
    expect(state.status).toBe("error");
    expect(state.message).toContain("contact@klyx.fr");
    expect(log).toHaveBeenCalled();
  });

  it("never reports success when Resend throws", async () => {
    send.mockRejectedValue(new Error("network down"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = await sendContact(IDLE, form());
    expect(state.status).toBe("error");
    expect(log).toHaveBeenCalled();
  });
});
