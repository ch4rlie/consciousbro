import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SaveSeatButton } from "@/components/site/SaveSeatButton";
import { siteConfig } from "@/site.config";

describe("SaveSeatButton", () => {
  it("renders a live link when lumaUrl is set", () => {
    render(<SaveSeatButton config={{ ...siteConfig, lumaUrl: "https://lu.ma/x", nextCall: { date: "July 17", time: "7pm", tz: "ET" } }} />);
    const link = screen.getByRole("link", { name: /save your seat/i });
    expect(link).toHaveAttribute("href", "https://lu.ma/x");
    expect(link).toHaveTextContent("July 17");
  });

  it("degrades to a disabled 'Dates announced soon' control with no link when lumaUrl is null", () => {
    render(<SaveSeatButton config={{ ...siteConfig, lumaUrl: null }} />);
    expect(screen.queryByRole("link")).toBeNull();
    const btn = screen.getByRole("button", { name: /dates announced soon/i });
    expect(btn).toBeDisabled();
  });
});
