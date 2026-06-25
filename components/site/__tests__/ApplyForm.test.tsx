import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { ApplyForm } from "@/components/site/ApplyForm";

async function fill() {
  await userEvent.type(screen.getByLabelText(/your name/i), "John");
  await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
  await userEvent.type(screen.getByLabelText(/drawing you in/i), "Tired of going it alone");
  await userEvent.type(screen.getByLabelText(/availability/i), "Weeknights");
  await userEvent.click(screen.getByLabelText(/i understand/i));
}

beforeEach(() => { vi.clearAllMocks(); });

describe("ApplyForm", () => {
  it("redirects to /thanks on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 200, json: async () => ({ ok: true }) }));
    render(<ApplyForm />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /send my application/i }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/thanks"));
  });

  it("shows an error with a mailto fallback on 502 and does NOT redirect", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 502, json: async () => ({ ok: false, error: "send_failed" }) }));
    render(<ApplyForm />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /send my application/i }));
    await waitFor(() => expect(screen.getByText(/something went wrong sending/i)).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute("href", expect.stringContaining("mailto:"));
    expect(push).not.toHaveBeenCalled();
  });
});
