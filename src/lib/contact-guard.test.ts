import { describe, expect, it } from "vitest";

import {
  MIN_FILL_MS,
  checkContactRequest,
  clientIp,
  createSlidingWindowLimiter,
  filledTooFast,
  limiterKey,
  maskIp,
} from "./contact-guard";

describe("createSlidingWindowLimiter", () => {
  const options = { limit: 2, windowMs: 1000, maxKeys: 100 };

  it("blocks once a key reaches the limit", () => {
    const allow = createSlidingWindowLimiter(options);
    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 1)).toBe(true);
    expect(allow("a", 2)).toBe(false);
  });

  it("counts each key on its own", () => {
    const allow = createSlidingWindowLimiter({ ...options, limit: 1 });
    expect(allow("a", 0)).toBe(true);
    expect(allow("b", 0)).toBe(true);
    expect(allow("a", 1)).toBe(false);
  });

  it("slides instead of resetting a fixed window", () => {
    const allow = createSlidingWindowLimiter(options);
    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 900)).toBe(true);
    expect(allow("a", 1001)).toBe(true);
    expect(allow("a", 1002)).toBe(false);
    expect(allow("a", 1901)).toBe(true);
  });

  it("does not let blocked attempts extend the block", () => {
    const allow = createSlidingWindowLimiter({ ...options, limit: 1 });
    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 999)).toBe(false);
    expect(allow("a", 1000)).toBe(true);
  });

  it("forgets the least recently seen key past maxKeys", () => {
    const allow = createSlidingWindowLimiter({
      limit: 1,
      windowMs: 1000,
      maxKeys: 2,
    });
    allow("a", 0);
    allow("b", 0);
    allow("a", 1);
    allow("c", 2);
    expect(allow("a", 3)).toBe(false);
    expect(allow("b", 3)).toBe(true);
  });
});

describe("filledTooFast", () => {
  it.each([null, "", "  ", "soon", "NaN", "Infinity", String(MIN_FILL_MS - 1)])(
    "is true for %s",
    (value) => {
      expect(filledTooFast(value)).toBe(true);
    },
  );

  it("is false from the minimum fill time on", () => {
    expect(filledTooFast(String(MIN_FILL_MS))).toBe(false);
    expect(filledTooFast("120000")).toBe(false);
  });
});

describe("checkContactRequest", () => {
  it("does not spend the budget of a request that was too fast", () => {
    const ip = "198.51.100.1";
    for (let i = 0; i < 10; i++) {
      expect(checkContactRequest(ip, "1")).toBe("too-fast");
    }
    expect(checkContactRequest(ip, "5000")).toBeNull();
  });

  it("rate limits after five requests from one address", () => {
    const ip = "198.51.100.2";
    for (let i = 0; i < 5; i++) {
      expect(checkContactRequest(ip, "5000")).toBeNull();
    }
    expect(checkContactRequest(ip, "5000")).toBe("rate-limited");
    expect(checkContactRequest("198.51.100.3", "5000")).toBeNull();
  });
});

describe("limiterKey", () => {
  it("keeps the full address for IPv4", () => {
    expect(limiterKey("203.0.113.9")).toBe("203.0.113.9");
    expect(limiterKey("203.0.113.10")).toBe("203.0.113.10");
  });

  it.each([
    ["::ffff:203.0.113.9", "203.0.113.9"],
    ["::FFFF:203.0.113.9", "203.0.113.9"],
    ["::ffff:cb00:7109", "203.0.113.9"],
    ["0:0:0:0:0:ffff:cb00:7109", "203.0.113.9"],
  ])("unwraps the IPv4-mapped %s", (ip, key) => {
    expect(limiterKey(ip)).toBe(key);
  });

  it.each([
    ["2001:db8:85a3:8d3:1319:8a2e:370:7348", "2001:db8:85a3:8d3::/64"],
    ["2001:0DB8:85A3:08D3:ffff:ffff:ffff:ffff", "2001:db8:85a3:8d3::/64"],
    ["2001:db8::1", "2001:db8:0:0::/64"],
    ["2001:db8:0:0:1::", "2001:db8:0:0::/64"],
    ["2001:db8:0:0:0:0:0:1", "2001:db8:0:0::/64"],
    ["2001:db8::1%eth0", "2001:db8:0:0::/64"],
    ["[2001:db8::1]", "2001:db8:0:0::/64"],
    ["::1", "0:0:0:0::/64"],
    ["::", "0:0:0:0::/64"],
    ["64:ff9b::203.0.113.9", "64:ff9b:0:0::/64"],
  ])("reduces %s to its /64", (ip, key) => {
    expect(limiterKey(ip)).toBe(key);
  });

  it.each([
    "unknown",
    "1:2:3",
    "1::2::3",
    "1:2:3:4:5:6:7:8:9",
    "1:2:3:4:5:6:7::8",
    "12345::1",
    "::ffff:300.0.113.9",
  ])("leaves the unparseable %s as it is", (ip) => {
    expect(limiterKey(ip)).toBe(ip);
  });
});

describe("checkContactRequest on IPv6", () => {
  it("shares one budget across a rotating /64", () => {
    for (let i = 1; i <= 5; i++) {
      expect(checkContactRequest(`2001:db8:1:1::${i}`, "5000")).toBeNull();
    }
    expect(checkContactRequest("2001:db8:1:1:ffff::6", "5000")).toBe(
      "rate-limited",
    );
    expect(checkContactRequest("2001:db8:1:2::1", "5000")).toBeNull();
  });

  it("counts a mapped address with its IPv4 form", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkContactRequest("198.51.100.7", "5000")).toBeNull();
    }
    expect(checkContactRequest("::ffff:198.51.100.7", "5000")).toBe(
      "rate-limited",
    );
  });
});

describe("clientIp", () => {
  it("prefers the address Netlify sets over a spoofable forwarded chain", () => {
    const headers = new Headers({
      "x-nf-client-connection-ip": "203.0.113.9",
      "x-forwarded-for": "1.1.1.1, 203.0.113.9",
    });
    expect(clientIp(headers)).toBe("203.0.113.9");
  });

  it("falls back to the first forwarded address, then to unknown", () => {
    expect(
      clientIp(new Headers({ "x-forwarded-for": " 203.0.113.9 , 10.0.0.1" })),
    ).toBe("203.0.113.9");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});

describe("maskIp", () => {
  it.each([
    ["203.0.113.9", "203.0.113.0/24"],
    ["2001:db8:85a3:8d3:1319:8a2e:370:7348", "2001:db8:85a3::/48"],
    ["2001:db8::1", "2001:db8:0::/48"],
    ["::ffff:203.0.113.9", "203.0.113.0/24"],
    ["unknown", "unknown"],
  ])("masks %s", (ip, masked) => {
    expect(maskIp(ip)).toBe(masked);
  });
});
