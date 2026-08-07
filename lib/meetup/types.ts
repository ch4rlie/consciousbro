export type VoteValue = "yes" | "ifneeded" | "no";

export type Weekend = {
  id: string;
  label: string;
  month: string;
};

/** Per-person map of weekendId -> vote. A missing key means "hasn't voted". */
export type VotesByPerson = Record<string, Record<string, VoteValue>>;

export type PollState = {
  people: string[];
  weekends: Weekend[];
  votes: VotesByPerson;
};
