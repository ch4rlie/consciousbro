import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { HeaderNav } from "@/components/site/HeaderNav";

describe("HeaderNav", () => {
  it("renders the section links", () => {
    render(<HeaderNav />);
    expect(screen.getAllByRole("link", { name: "The call" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "The circles" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "FAQ" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Apply" }).length).toBeGreaterThan(0);
  });

  it("toggles the mobile menu open and closed via the hamburger", () => {
    render(<HeaderNav />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the menu when a link is clicked", () => {
    render(<HeaderNav />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    const panel = document.getElementById("mobile-menu")!;
    fireEvent.click(within(panel).getByRole("link", { name: "The call" }));
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute("aria-expanded", "false");
  });
});
