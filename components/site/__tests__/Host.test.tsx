import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Host } from "@/components/site/Host";
import { siteConfig } from "@/site.config";

describe("Host", () => {
  it("renders both co-host names", () => {
    render(<Host />);
    expect(screen.getByText("Ccowl Humphries")).toBeInTheDocument();
    expect(screen.getByText("Charlie Grove")).toBeInTheDocument();
  });
  it("shows a loud bio placeholder when bio is null", () => {
    render(<Host />);
    expect(screen.getAllByText(/bio coming soon/i).length).toBeGreaterThanOrEqual(1);
  });
  it("renders the bio text when present", () => {
    const cfg = { ...siteConfig, hosts: [{ name: "Ccowl Humphries", bio: "Sat in circles since 2018.", photo: null }, { name: "Charlie Grove", bio: "Doing this with my brother.", photo: null }] };
    render(<Host config={cfg} />);
    expect(screen.getByText(/sat in circles since 2018/i)).toBeInTheDocument();
  });
});
