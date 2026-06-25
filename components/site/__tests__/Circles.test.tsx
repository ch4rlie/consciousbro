import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Circles } from "@/components/site/Circles";
import { WhoFor } from "@/components/site/WhoFor";

describe("Circles", () => {
  it("is the #circles anchor and links to /apply, with no public buy button", () => {
    render(<Circles />);
    expect(document.getElementById("circles")).not.toBeNull();
    expect(screen.getByRole("link", { name: /apply for a circle/i })).toHaveAttribute("href", "/apply");
    expect(screen.queryByRole("link", { name: /buy|checkout|subscribe/i })).toBeNull();
  });
});

describe("WhoFor", () => {
  it("renders both columns", () => {
    render(<WhoFor />);
    expect(screen.getByText(/this is for you if/i)).toBeInTheDocument();
    expect(screen.getByText(/this isn't for you if/i)).toBeInTheDocument();
  });
});
