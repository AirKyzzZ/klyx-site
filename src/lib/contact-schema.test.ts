import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

import {
  CONTACT_BUDGETS,
  CONTACT_NEEDS,
  contactSchema,
} from "./contact-schema";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  need: "site",
  message: "Un site pour notre lancement.",
  consent: "on",
};

describe("contactSchema", () => {
  it("accepts a minimal valid request", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("enforces lengths and enums", () => {
    for (const patch of [
      { name: "A" },
      { name: "A".repeat(101) },
      { company: "A".repeat(121) },
      { message: "Trop court".slice(0, 9) },
      { message: "A".repeat(5001) },
      { need: "rocket" },
      { budget: "1M" },
      { website: "filled" },
    ]) {
      expect(
        contactSchema.safeParse({ ...valid, ...patch }).success,
        JSON.stringify(patch),
      ).toBe(false);
    }
  });

  it("matches the options offered by the form in both locales", () => {
    for (const messages of [fr, en]) {
      const { need, budget } = messages.contact.form.fields;
      expect(Object.keys(need.options)).toEqual([...CONTACT_NEEDS]);
      expect(Object.keys(budget.options)).toEqual([...CONTACT_BUDGETS]);
    }
  });
});
