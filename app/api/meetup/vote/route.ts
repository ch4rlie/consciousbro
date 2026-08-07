import { NextResponse } from "next/server";
import { getStore } from "@/lib/meetup/store";
import { PEOPLE, WEEKENDS, VALID_VOTES } from "@/lib/meetup/config";
import type { VoteValue } from "@/lib/meetup/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      person?: string;
      weekendId?: string;
      value?: string | null;
    };
    const { person, weekendId, value } = body;

    if (!person || !PEOPLE.includes(person)) {
      return NextResponse.json({ error: "Unknown person." }, { status: 400 });
    }
    if (!weekendId || !WEEKENDS.some((w) => w.id === weekendId)) {
      return NextResponse.json({ error: "Unknown weekend." }, { status: 400 });
    }
    const clearing = value === null || value === undefined || value === "";
    if (!clearing && !VALID_VOTES.includes(value)) {
      return NextResponse.json({ error: "Invalid vote value." }, { status: 400 });
    }

    // Read-modify-write only this person's row, so two guys voting at once
    // can't clobber each other.
    const store = getStore();
    const row = await store.getRow(person);
    if (clearing) delete row[weekendId];
    else row[weekendId] = value as VoteValue;
    await store.setRow(person, row);

    return NextResponse.json({ ok: true, person, row });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
