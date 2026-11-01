import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function flattenValues(value: unknown): string[] {
  if (typeof value !== "object" || value === null) return [String(value)];
  return Object.values(value).flatMap(flattenValues);
}

describe("messages", () => {
  it("has identical keys in fr and en", () => {
    expect(flattenKeys(fr).sort()).toEqual(flattenKeys(en).sort());
  });

  it("has no empty values", () => {
    for (const value of [...flattenValues(fr), ...flattenValues(en)]) {
      expect(value.trim()).not.toBe("");
    }
  });
});
