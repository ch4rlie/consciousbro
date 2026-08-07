"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PollState, VoteValue, Weekend } from "@/lib/meetup/types";
import "./meetup.css";

const CHOICES: { value: VoteValue; label: string; sel: string }[] = [
  { value: "yes", label: "Yes", sel: "sel-yes" },
  { value: "ifneeded", label: "If needed", sel: "sel-if" },
  { value: "no", label: "No", sel: "sel-no" },
];

type StatusKind = "allin" | "workable" | "pending" | "dead";

type WeekendResult = {
  weekend: Weekend;
  kind: StatusKind;
  rank: number;
  yes: string[];
  ifneeded: string[];
  no: string[];
  missing: string[];
  statusText: string;
};

function initial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function joinNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function computeResult(weekend: Weekend, people: string[], state: PollState): WeekendResult {
  const yes: string[] = [];
  const ifneeded: string[] = [];
  const no: string[] = [];
  const missing: string[] = [];

  for (const p of people) {
    const v = state.votes[p]?.[weekend.id];
    if (v === "yes") yes.push(p);
    else if (v === "ifneeded") ifneeded.push(p);
    else if (v === "no") no.push(p);
    else missing.push(p);
  }

  let kind: StatusKind;
  let statusText: string;

  if (no.length > 0) {
    kind = "dead";
    statusText = `Out: ${joinNames(no)}`;
  } else if (missing.length > 0) {
    kind = "pending";
    statusText = `Waiting on ${joinNames(missing)}`;
  } else if (ifneeded.length > 0) {
    kind = "workable";
    statusText = `Everyone's in — but only works if ${joinNames(ifneeded)} ${
      ifneeded.length === 1 ? "makes" : "make"
    } it work`;
  } else {
    kind = "allin";
    statusText = "All 7 are a Yes 🎉";
  }

  const rank = { allin: 0, workable: 1, pending: 2, dead: 3 }[kind];
  return { weekend, kind, rank, yes, ifneeded, no, missing, statusText };
}

export default function MeetupApp() {
  const [state, setState] = useState<PollState | null>(null);
  const [me, setMe] = useState<string | null>(null);
  const [tab, setTab] = useState<"vote" | "results">("vote");
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/meetup/state", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setState(data as PollState);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Initial load + restore selected name.
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? window.localStorage.getItem("meetup-me") : null;
    if (saved) setMe(saved);
    load();
  }, [load]);

  // Live refresh: poll while visible, and refresh on focus.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 5000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  const pickName = (name: string) => {
    setMe(name);
    window.localStorage.setItem("meetup-me", name);
  };
  const changeName = () => {
    setMe(null);
    window.localStorage.removeItem("meetup-me");
  };

  const vote = async (weekendId: string, current: VoteValue | undefined, value: VoteValue) => {
    if (!me || !state) return;
    const next: VoteValue | null = current === value ? null : value; // tap again to clear

    // Optimistic update.
    setState((prev) => {
      if (!prev) return prev;
      const myRow = { ...(prev.votes[me] ?? {}) };
      if (next === null) delete myRow[weekendId];
      else myRow[weekendId] = next;
      return { ...prev, votes: { ...prev.votes, [me]: myRow } };
    });

    try {
      const res = await fetch("/api/meetup/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person: me, weekendId, value: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
    } catch (e) {
      setError((e as Error).message);
      load(); // revert to server truth
    }
  };

  const results = useMemo(() => {
    if (!state) return [];
    return state.weekends
      .map((w) => computeResult(w, state.people, state))
      .sort((a, b) => a.rank - b.rank);
  }, [state]);

  const winners = results.filter((r) => r.kind === "allin");

  if (!loaded) {
    return (
      <div className="meetup-scope">
        <div className="wrap">
          <div className="spinner">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="meetup-scope">
      <div className="wrap">
        <h1>Men&apos;s Meetup</h1>
        <p className="sub">
          {tab === "vote"
            ? "Tap your name, then mark each weekend. We need all 7 guys on one weekend."
            : "Green means it works for everyone. Sorted best weekend first."}
        </p>

        {error && <div className="err">{error}</div>}

        <div className="tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "vote"}
            className={`tab ${tab === "vote" ? "active" : ""}`}
            onClick={() => setTab("vote")}
          >
            <span className="tab-ico">🗳️</span> Cast your vote
          </button>
          <button
            role="tab"
            aria-selected={tab === "results"}
            className={`tab ${tab === "results" ? "active" : ""}`}
            onClick={() => setTab("results")}
          >
            <span className="tab-ico">📊</span> See results
            {winners.length ? <span className="tab-count">{winners.length} ✓</span> : null}
          </button>
        </div>

        {tab === "vote" ? (
          <VoteTab me={me} state={state} onPick={pickName} onChange={changeName} onVote={vote} />
        ) : (
          <ResultsTab results={results} />
        )}

        <p className="note">Tap a choice again to clear it. Answers save instantly for everyone.</p>
      </div>
    </div>
  );
}

function VoteTab({
  me,
  state,
  onPick,
  onChange,
  onVote,
}: {
  me: string | null;
  state: PollState | null;
  onPick: (n: string) => void;
  onChange: () => void;
  onVote: (weekendId: string, current: VoteValue | undefined, value: VoteValue) => void;
}) {
  if (!state) return null;

  if (!me) {
    return (
      <div>
        <p className="sub">Who are you?</p>
        <div className="pickgrid">
          {state.people.map((p) => (
            <button key={p} className="pickbtn" onClick={() => onPick(p)}>
              {p}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const myRow = state.votes[me] ?? {};

  return (
    <div>
      <div className="whoami">
        <div>
          Voting as <span className="name">{me}</span>
        </div>
        <button className="linkbtn" onClick={onChange}>
          Not you?
        </button>
      </div>

      {state.weekends.map((w) => {
        const current = myRow[w.id];
        return (
          <div key={w.id} className="voterow">
            <div className="wk">{w.label}</div>
            <div className="choices">
              {CHOICES.map((c) => (
                <button
                  key={c.value}
                  className={`choice ${current === c.value ? c.sel : ""}`}
                  onClick={() => onVote(w.id, current, c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ResultsTab({ results }: { results: WeekendResult[] }) {
  return (
    <div>
      <div className="legend">
        <span>
          <i className="dot yes" /> Yes
        </span>
        <span>
          <i className="dot if" /> If needed
        </span>
        <span>
          <i className="dot no" /> No
        </span>
        <span>
          <i className="dot none" /> Not voted
        </span>
      </div>

      {results.map((r) => (
        <div key={r.weekend.id} className={`rescard ${r.kind}`}>
          <div className="reshead">
            <div className="wk">{r.weekend.label}</div>
            <div className={`badge ${r.kind}`}>
              {r.kind === "allin"
                ? "ALL IN"
                : r.kind === "workable"
                ? "WORKABLE"
                : r.kind === "pending"
                ? "PENDING"
                : "DEAD"}
            </div>
          </div>
          <div className="status">{r.statusText}</div>
          <div className="people">
            {[
              ...r.yes.map((n) => ({ n, k: "yes" })),
              ...r.ifneeded.map((n) => ({ n, k: "if" })),
              ...r.no.map((n) => ({ n, k: "no" })),
              ...r.missing.map((n) => ({ n, k: "none" })),
            ].map(({ n, k }) => (
              <span key={n} className={`chip ${k}`}>
                <span className="ini">{initial(n)}</span>
                {n}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
