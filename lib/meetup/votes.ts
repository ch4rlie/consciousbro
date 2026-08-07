import { WEEKENDS, VALID_VOTES } from "./config";
import type { VoteValue } from "./types";

const VALID_WEEKEND_IDS = new Set(WEEKENDS.map((w) => w.id));

/**
 * Coerce a stored row into a clean {weekendId: vote} map.
 * The Upstash client may hand us either a parsed object or a JSON string,
 * so handle both, and drop anything that isn't a known weekend/vote.
 */
export function normalizeRow(raw: unknown): Record<string, VoteValue> {
  let obj: unknown = raw;
  if (typeof raw === "string") {
    try {
      obj = JSON.parse(raw);
    } catch {
      return {};
    }
  }
  if (!obj || typeof obj !== "object") return {};

  const out: Record<string, VoteValue> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (VALID_WEEKEND_IDS.has(k) && typeof v === "string" && VALID_VOTES.includes(v)) {
      out[k] = v as VoteValue;
    }
  }
  return out;
}
