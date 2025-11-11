import { describe, expect, it } from "vitest";
import { formatMoney } from "./money";

// Guard against regressions in how we format raw cent values into USD strings.

describe("formatMoney", () => {
  it("formats 1999 cents as $19.99", () => {
    expect(formatMoney(1999)).toBe("$19.99");
  });

  it("display 2 decimals", () => {
    expect(formatMoney(1090)).toBe("$10.90");
    expect(formatMoney(100)).toBe("$1.00");
  });

  it("formats 0 cents as $0.00", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });

  it("formats -999 cents as -$9.99", () => {
    expect(formatMoney(-999)).toBe("-$9.99");
  });

  it("formats -100 cents as -$1.00", () => {
    expect(formatMoney(-100)).toBe("-$1.00");
  });
});
