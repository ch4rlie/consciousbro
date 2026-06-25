import { describe, it, expect } from "vitest";
import { copy } from "@/lib/copy";

describe("copy", () => {
  it("footer disclaimer keeps the 988 line verbatim", () => {
    expect(copy.disclaimer).toContain("call/text **988**");
    expect(copy.disclaimer).toContain("not therapy");
  });
  it("FAQ keeps both 988 references", () => {
    const a = copy.faq.map((f) => f.a).join("\n");
    expect(a.match(/988/g)?.length).toBeGreaterThanOrEqual(2);
  });
  it("hero has the headline", () => {
    expect(copy.hero.headline).toBe("You were never meant to carry it alone.");
  });
});
