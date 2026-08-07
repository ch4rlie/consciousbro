import { NextResponse } from "next/server";
import { getStore } from "@/lib/meetup/store";
import { PEOPLE, WEEKENDS } from "@/lib/meetup/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const votes = await getStore().getAll();
    return NextResponse.json({ people: PEOPLE, weekends: WEEKENDS, votes });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
