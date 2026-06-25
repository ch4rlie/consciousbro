import { describe, it, expect } from "vitest";
import { size, contentType } from "@/app/opengraph-image";

describe("opengraph-image", () => {
  it("declares a real 1200x630 PNG so unfurls are never blank", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
  });
});
