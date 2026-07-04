import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SaveSeatButton } from "@/components/site/SaveSeatButton";
import { siteConfig } from "@/site.config";

describe("SaveSeatButton", () => {
  it("renders a live link to the Luma event when lumaUrl is set", () => {
    render(<SaveSeatButton config={{ ...siteConfig, lumaUrl: "https://luma.com/ryyv3hx9", nextCall: { date: "July 17", time: "7pm", tz: "ET" } }} />);
    const link = screen.getByRole("link", { name: /save your seat/i });
    expect(link).toHaveAttribute("href", "https://luma.com/ryyv3hx9");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveTextContent("July 17");
  });

  it("uses a custom label when provided", () => {
    render(<SaveSeatButton config={{ ...siteConfig, lumaUrl: "https://luma.com/ryyv3hx9", nextCall: { date: "July 17", time: "7pm", tz: "ET" } }} label="Save your seat" />);
    const link = screen.getByRole("link", { name: /^save your seat$/i });
    expect(link).not.toHaveTextContent("July 17");
  });

  it("renders 'Save your seat' without a date when lumaUrl is set but no date", () => {
    render(<SaveSeatButton config={{ ...siteConfig, lumaUrl: "https://lu.ma/x", nextCall: { date: null, time: "TBD", tz: "TBD" } }} />);
    const link = screen.getByRole("link", { name: /^save your seat$/i });
    expect(link).toHaveAttribute("href", "https://lu.ma/x");
    expect(link).not.toHaveTextContent(/next call/i);
  });

  it("degrades to a disabled 'Dates announced soon' control with no link when lumaUrl is null", () => {
    render(<SaveSeatButton config={{ ...siteConfig, lumaUrl: null }} />);
    expect(screen.queryByRole("link")).toBeNull();
    const btn = screen.getByRole("button", { name: /dates announced soon/i });
    expect(btn).toBeDisabled();
  });
});
