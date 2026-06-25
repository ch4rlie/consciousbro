import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/site/Footer";

describe("Footer", () => {
  it("renders the disclaimer with a bold 988", () => {
    render(<Footer />);
    expect(screen.getByText(/not therapy, counseling/i)).toBeInTheDocument();
    expect(screen.getByText("988")).toBeInTheDocument(); // rendered as <strong>988</strong>
  });
});
