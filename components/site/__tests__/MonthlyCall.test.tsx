import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MonthlyCall } from "@/components/site/MonthlyCall";
import { siteConfig } from "@/site.config";

describe("MonthlyCall", () => {
  it("shows a loud date placeholder when no date is set", () => {
    render(<MonthlyCall config={{ ...siteConfig, nextCall: { date: null, time: "TBD", tz: "TBD" } }} />);
    expect(screen.getByText(/next date announced soon/i)).toBeInTheDocument();
  });
  it("renders the date when set", () => {
    render(<MonthlyCall config={{ ...siteConfig, nextCall: { date: "July 17", time: "7pm", tz: "ET" } }} />);
    // scope to the "When" line — the Save-seat button also carries the date now
    expect(screen.getByText(/next one is July 17/)).toBeInTheDocument();
  });
});
