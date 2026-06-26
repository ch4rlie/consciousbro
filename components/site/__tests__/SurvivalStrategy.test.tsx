import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SurvivalStrategy } from "@/components/site/SurvivalStrategy";

describe("SurvivalStrategy", () => {
  it("renders the header and the strategy cards", () => {
    render(<SurvivalStrategy />);
    expect(
      screen.getByRole("heading", { name: /what's your survival strategy/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /the nice guy/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /the avoider/i })).toBeInTheDocument();
  });

  it("reveals a strategy's detail only after its card is clicked", async () => {
    render(<SurvivalStrategy />);
    expect(screen.queryByText(/practice disappointing people/i)).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: /the nice guy/i }));
    expect(screen.getByText(/practice disappointing people/i)).toBeInTheDocument();
  });

  it("lets several strategies stay open at once", async () => {
    render(<SurvivalStrategy />);
    await userEvent.click(screen.getByRole("button", { name: /the nice guy/i }));
    await userEvent.click(screen.getByRole("button", { name: /the lone wolf/i }));
    // both details remain visible simultaneously
    expect(screen.getByText(/practice disappointing people/i)).toBeInTheDocument();
    expect(screen.getByText(/brotherhood begins where self-protection ends/i)).toBeInTheDocument();
  });
});
