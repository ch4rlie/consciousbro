import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { PEOPLE } from "./config";
import { normalizeRow } from "./votes";
import type { VoteValue } from "./types";

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

const VOTES_KEY = "meetup:votes:v1";

type Row = Record<string, VoteValue>;
type AllRows = Record<string, Row>;

interface Store {
  getAll(): Promise<AllRows>;
  getRow(person: string): Promise<Row>;
  setRow(person: string, row: Row): Promise<void>;
  clear(): Promise<void>;
}

/** Production: one Redis hash, field = person, value = their {weekendId: vote} map. */
class UpstashStore implements Store {
  private redis = new Redis({ url, token });

  async getAll(): Promise<AllRows> {
    const raw = ((await this.redis.hgetall(VOTES_KEY)) ?? {}) as Record<string, unknown>;
    const out: AllRows = {};
    for (const p of PEOPLE) out[p] = normalizeRow(raw[p]);
    return out;
  }
  async getRow(person: string): Promise<Row> {
    return normalizeRow(await this.redis.hget(VOTES_KEY, person));
  }
  async setRow(person: string, row: Row): Promise<void> {
    await this.redis.hset(VOTES_KEY, { [person]: row });
  }
  async clear(): Promise<void> {
    await this.redis.del(VOTES_KEY);
  }
}

/** Local dev fallback: a JSON file under .data/ so no external service is needed. */
class LocalStore implements Store {
  private file = path.join(process.cwd(), ".data", "meetup-votes.json");

  private read(): AllRows {
    try {
      const obj = JSON.parse(fs.readFileSync(this.file, "utf8")) as Record<string, unknown>;
      const out: AllRows = {};
      for (const p of PEOPLE) out[p] = normalizeRow(obj[p]);
      return out;
    } catch {
      return {};
    }
  }
  private write(all: AllRows): void {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(all, null, 2));
  }

  async getAll(): Promise<AllRows> {
    const all = this.read();
    const out: AllRows = {};
    for (const p of PEOPLE) out[p] = all[p] ?? {};
    return out;
  }
  async getRow(person: string): Promise<Row> {
    return this.read()[person] ?? {};
  }
  async setRow(person: string, row: Row): Promise<void> {
    const all = this.read();
    all[person] = row;
    this.write(all);
  }
  async clear(): Promise<void> {
    try {
      fs.rmSync(this.file);
    } catch {
      /* already gone */
    }
  }
}

export const usingLocalStore = !(url && token);

let store: Store | null = null;
export function getStore(): Store {
  if (!store) store = usingLocalStore ? new LocalStore() : new UpstashStore();
  return store;
}
