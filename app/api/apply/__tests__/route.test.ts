import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/email", () => ({
  isEmailConfigured: vi.fn(),
  sendApplicationEmail: vi.fn(),
}));

import { POST } from "@/app/api/apply/route";
import { isEmailConfigured, sendApplicationEmail } from "@/lib/email";

const body = {
  name: "John", email: "john@example.com", drawingIn: "alone",
  availability: "nights", priorExperience: "", agreement: true, website: "",
};

function req(b: unknown) {
  return new Request("http://test/api/apply", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(b),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NODE_ENV", "production");
});

describe("POST /api/apply", () => {
  it("returns 200 on a confirmed send", async () => {
    vi.mocked(isEmailConfigured).mockReturnValue(true);
    vi.mocked(sendApplicationEmail).mockResolvedValue();
    const res = await POST(req(body));
    expect(res.status).toBe(200);
  });

  it("returns 400 on validation failure", async () => {
    const res = await POST(req({ ...body, email: "nope" }));
    expect(res.status).toBe(400);
  });

  it("silently drops a bot with 200 and no send", async () => {
    const res = await POST(req({ ...body, website: "spam" }));
    expect(res.status).toBe(200);
    expect(sendApplicationEmail).not.toHaveBeenCalled();
  });

  it("PRODUCTION: returns 502 when email is not configured (fail loud)", async () => {
    vi.mocked(isEmailConfigured).mockReturnValue(false);
    const res = await POST(req(body));
    expect(res.status).toBe(502);
    expect(sendApplicationEmail).not.toHaveBeenCalled();
  });

  it("PRODUCTION: returns 502 when send throws (fail loud)", async () => {
    vi.mocked(isEmailConfigured).mockReturnValue(true);
    vi.mocked(sendApplicationEmail).mockRejectedValue(new Error("resend down"));
    const res = await POST(req(body));
    expect(res.status).toBe(502);
  });

  it("DEV: soft-succeeds with 200 when email is not configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.mocked(isEmailConfigured).mockReturnValue(false);
    const res = await POST(req(body));
    expect(res.status).toBe(200);
  });
});
