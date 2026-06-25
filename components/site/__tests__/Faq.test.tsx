import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Faq } from "@/components/site/Faq";

describe("Faq", () => {
  it("renders all questions including the 988 ones", () => {
    render(<Faq />);
    expect(screen.getByText("Is this therapy?")).toBeInTheDocument();
    expect(screen.getByText("What if I'm really struggling right now?")).toBeInTheDocument();
  });
});
