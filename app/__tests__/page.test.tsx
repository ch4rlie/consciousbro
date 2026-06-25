import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("landing page", () => {
  it("renders hero headline and the circles anchor", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: /you were never meant to carry it alone/i })).toBeInTheDocument();
    expect(document.getElementById("circles")).not.toBeNull();
  });
});
