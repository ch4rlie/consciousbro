import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SaveSeatButton } from "@/components/site/SaveSeatButton";
import { siteConfig } from "@/site.config";

describe("SaveSeatButton", () => {
  it("renders a Luma checkout link when lumaUrl is set", () => {
    render(<SaveSeatButton config={{ ...siteConfig, lumaUrl: "https://luma.com/event/evt-ABC123", nextCall: { date: "July 17", time: "7pm", tz: "ET" } }} />);
    const link = screen.getByRole("link", { name: /save your seat/i });
    expect(link).toHaveAttribute("href", "https://luma.com/event/evt-ABC123");
    expect(link).toHaveTextContent("July 17");
    // wires the lazily-loaded checkout-button.js modal; href is the no-JS fallback
    expect(link).toHaveAttribute("data-luma-action", "checkout");
    expect(link).toHaveAttribute("data-luma-event-id", "evt-ABC123");
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
