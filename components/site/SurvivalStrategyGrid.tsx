"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";

export function SurvivalStrategyGrid() {
  const strategies = copy.survivalStrategy.strategies;
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="mt-8 space-y-3">
      {strategies.map((s, i) => {
        const isOpen = open.has(i);
        return (
          <div
            key={s.name}
            className={cn(
              "overflow-hidden rounded-lg border transition",
              isOpen ? "border-ember bg-charcoal/70" : "border-bone/10 bg-charcoal/40",
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`strategy-${i}`}
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-charcoal/60"
            >
              <span>
                <span className="block font-serif text-lg text-bone">{s.name}</span>
                <span className="mt-1 block text-sm italic text-bone/60">
                  &ldquo;{s.belief}&rdquo;
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-5 shrink-0 text-ember transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen && (
              <div
                id={`strategy-${i}`}
                className="grid gap-8 border-t border-bone/10 p-5 sm:grid-cols-2"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-ember">How it shows up</p>
                  <ul className="mt-3 space-y-2 text-bone/80">
                    {s.showsUp.map((t, j) => (
                      <li key={j}>• {t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-ember">The way forward</p>
                  <div className="mt-3 space-y-2 text-bone/80">
                    {s.wayForward.map((t, j) => (
                      <p key={j}>{t}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
