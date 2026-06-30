import { describe, it, expect } from "vitest";
import { siteConfig, hasLumaUrl, hasCallDate, hostHasBio, lumaEventId } from "@/site.config";

describe("siteConfig", () => {
  it("has two co-hosts with real names", () => {
    expect(siteConfig.hosts.map((h) => h.name)).toEqual(["Ccowl Humphries", "Charlie Grove"]);
  });
  it("treats null lumaUrl as no luma", () => {
    expect(hasLumaUrl({ ...siteConfig, lumaUrl: null })).toBe(false);
    expect(hasLumaUrl({ ...siteConfig, lumaUrl: "https://lu.ma/x" })).toBe(true);
  });
  it("treats null date as no call date", () => {
    expect(hasCallDate({ ...siteConfig, nextCall: { ...siteConfig.nextCall, date: null } })).toBe(false);
    expect(hasCallDate({ ...siteConfig, nextCall: { ...siteConfig.nextCall, date: "July 17" } })).toBe(true);
  });
  it("extracts the evt- id from a Luma event URL", () => {
    expect(lumaEventId({ ...siteConfig, lumaUrl: "https://luma.com/event/evt-ABC123" })).toBe("evt-ABC123");
    expect(lumaEventId({ ...siteConfig, lumaUrl: null })).toBeNull();
    expect(lumaEventId({ ...siteConfig, lumaUrl: "https://lu.ma/vanity" })).toBeNull();
  });
  it("treats null bio as no bio", () => {
    expect(hostHasBio({ name: "x", bio: null, photo: null })).toBe(false);
    expect(hostHasBio({ name: "x", bio: "hi", photo: null })).toBe(true);
  });
});
