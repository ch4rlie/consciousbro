import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/site/Section";

describe("Section", () => {
  it("renders children and applies its id", () => {
    render(<Section id="circles">hello</Section>);
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(document.getElementById("circles")).not.toBeNull();
  });
});
