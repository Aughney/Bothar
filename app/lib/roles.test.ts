import { describe, it, expect } from "vitest";
import { parseRole, ROLES } from "./roles";

describe("parseRole", () => {
  it("returns 'passenger' when input is null (no ?role= param)", () => {
    expect(parseRole(null)).toBe("passenger");
  });

  it("returns 'passenger' when input is undefined", () => {
    expect(parseRole(undefined)).toBe("passenger");
  });

  it("returns 'passenger' when input is empty string", () => {
    expect(parseRole("")).toBe("passenger");
  });

  it("returns 'passenger' when input is the literal 'passenger'", () => {
    expect(parseRole("passenger")).toBe("passenger");
  });

  it("returns 'driver' when input is the literal 'driver'", () => {
    expect(parseRole("driver")).toBe("driver");
  });

  it("rejects unknown roles and falls back to 'passenger'", () => {
    expect(parseRole("admin")).toBe("passenger");
    expect(parseRole("guest")).toBe("passenger");
    expect(parseRole("operator")).toBe("passenger");
  });

  it("is case-sensitive (does not normalize)", () => {
    expect(parseRole("Driver")).toBe("passenger");
    expect(parseRole("DRIVER")).toBe("passenger");
    expect(parseRole("PASSENGER")).toBe("passenger");
  });

  it("treats whitespace as invalid", () => {
    expect(parseRole(" driver")).toBe("passenger");
    expect(parseRole("driver ")).toBe("passenger");
    expect(parseRole(" ")).toBe("passenger");
  });

  it("exposes ROLES as the canonical allowlist", () => {
    expect(ROLES).toEqual(["passenger", "driver"]);
  });
});
