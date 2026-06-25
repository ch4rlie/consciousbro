import { describe, it, expect } from "vitest";
import { validateApply } from "@/lib/apply-schema";

const valid = {
  name: "John",
  email: "john@example.com",
  drawingIn: "Tired of doing it alone.",
  availability: "Weeknights",
  priorExperience: "",
  agreement: true,
  website: "",
};

describe("validateApply", () => {
  it("accepts a valid application", () => {
    const r = validateApply(valid);
    expect(r.ok).toBe(true);
  });
  it("flags a filled honeypot as a bot", () => {
    const r = validateApply({ ...valid, website: "http://spam" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.botDetected).toBe(true);
      expect(r.errors).toEqual({});
    }
  });
  it("flags a non-string honeypot value as a bot", () => {
    const r = validateApply({ ...valid, website: 1 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.botDetected).toBe(true);
  });
  it("rejects a truthy non-boolean agreement value", () => {
    const r = validateApply({ ...valid, agreement: "on" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.agreement).toBeDefined();
  });
  it("rejects an invalid email", () => {
    const r = validateApply({ ...valid, email: "nope" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toBeDefined();
  });
  it("rejects when agreement is not accepted", () => {
    const r = validateApply({ ...valid, agreement: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.agreement).toBeDefined();
  });
});
