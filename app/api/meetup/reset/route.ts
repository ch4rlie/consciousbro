import { NextResponse } from "next/server";
import { getStore, usingLocalStore } from "@/lib/meetup/store";

export const dynamic = "force-dynamic";

// Wipes all meetup votes.
// - Local dev (no Upstash configured): always allowed, for convenience.
// - Production: allowed only when MEETUP_RESET_TOKEN is set and matches ?token=...
// Usage: POST /api/meetup/reset?token=YOUR_SECRET
export async function POST(req: Request) {
  const secret = process.env.MEETUP_RESET_TOKEN;
  const provided = new URL(req.url).searchParams.get("token");
  const allowed = usingLocalStore || (!!secret && provided === secret);
  if (!allowed) {
    return NextResponse.json({ error: "Reset disabled or bad token." }, { status: 403 });
  }
  try {
    await getStore().clear();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
