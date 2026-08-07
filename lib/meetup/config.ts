import type { Weekend } from "./types";

/** The 7 guys. Order here is the order shown in the app. */
export const PEOPLE: string[] = [
  "Charlie",
  "Duane",
  "Brian",
  "Andrew",
  "Pete",
  "Ty",
  "Rob",
];

/** The proposed weekends, in calendar order. Edit this list to add/remove options. */
export const WEEKENDS: Weekend[] = [
  { id: "oct-22-25", label: "Oct 22–25", month: "October" },
  { id: "nov-19-22", label: "Nov 19–22", month: "November" },
  { id: "dec-3-6", label: "Dec 3–6", month: "December" },
  { id: "dec-10-13", label: "Dec 10–13", month: "December" },
  { id: "jan-7-10", label: "Jan 7–10", month: "January" },
  { id: "jan-14-17", label: "Jan 14–17", month: "January" },
  { id: "jan-20-24", label: "Jan 20–24", month: "January" },
  { id: "jan-27-31", label: "Jan 27–31", month: "January" },
  { id: "feb-4-7", label: "Feb 4–7", month: "February" },
  { id: "feb-25-28", label: "Feb 25–28", month: "February" },
  { id: "mar-4-7", label: "Mar 4–7", month: "March" },
];

export const VALID_VOTES: string[] = ["yes", "ifneeded", "no"];
