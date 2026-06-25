import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Thanks from "@/app/thanks/page";

describe("/thanks", () => {
  it("confirms the application path, not a call RSVP", () => {
    render(<Thanks />);
    expect(screen.getByText(/read every application personally/i)).toBeInTheDocument();
  });
});
