import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Problem } from "@/components/site/Problem";
import { Ownership } from "@/components/site/Ownership";
import { BeingSeen } from "@/components/site/BeingSeen";

describe("prose sections", () => {
  it("Problem renders its header", () => {
    render(<Problem />);
    expect(screen.getByRole("heading", { name: /most men are doing it alone/i })).toBeInTheDocument();
  });
  it("Ownership renders its header", () => {
    render(<Ownership />);
    expect(screen.getByRole("heading", { name: /nothing changes until you own it/i })).toBeInTheDocument();
  });
  it("BeingSeen renders its header", () => {
    render(<BeingSeen />);
    expect(screen.getByRole("heading", { name: /what it's like to actually be heard/i })).toBeInTheDocument();
  });
});
