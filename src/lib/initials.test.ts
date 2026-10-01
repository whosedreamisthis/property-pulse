import { describe, expect, it } from "vitest";
import { getInitials } from "@/lib/initials";

describe("getInitials", () => {
  it("uses the first letters of the first and last names", () => {
    expect(getInitials("Riley Renter")).toBe("RR");
    expect(getInitials("Mary Jane van der Berg")).toBe("MB");
  });

  it("uppercases and ignores extra whitespace", () => {
    expect(getInitials("  avery   admin ")).toBe("AA");
  });

  it("uses one letter for a single-word name", () => {
    expect(getInitials("Cher")).toBe("C");
  });

  it("falls back to the email's first letter when there is no name", () => {
    expect(getInitials(null, "olivia@example.com")).toBe("O");
    expect(getInitials("   ", "olivia@example.com")).toBe("O");
  });

  it("returns ? when there is no name or email", () => {
    expect(getInitials(undefined, undefined)).toBe("?");
    expect(getInitials("", "")).toBe("?");
  });

  it("does not split characters outside the basic plane", () => {
    expect(getInitials("😀 Smile")).toBe("😀S");
  });
});
