import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/site/Hero";

describe("Hero", () => {
  it("renders the headline and a secondary link to #circles", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { name: /you were never meant to carry it alone/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore the circles/i })).toHaveAttribute("href", "#circles");
  });
});
