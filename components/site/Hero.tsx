import { SaveSeatButton } from "./SaveSeatButton";
import { SecondaryLink } from "./SecondaryLink";
import { copy } from "@/lib/copy";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[88svh] items-start overflow-hidden py-16 md:items-center md:py-20">
      {/* Poster = LCP, and the only thing reduced-motion users ever see */}
      <img
        src="/embers-poster.jpg"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      {/* Video: motion-safe only. translateZ keeps it on a stable compositing layer. */}
      <video
        poster="/embers-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 z-0 hidden h-full w-full object-cover [transform:translateZ(0)] motion-safe:block"
      >
        {/* webm first (smaller, Chrome/Firefox); mp4 fallback for Safari */}
        <source src="/embers.webm" type="video/webm" />
        <source src="/embers-h264.mp4" type="video/mp4" />
      </video>

      {/* Dark scrim so the headline stays readable as the embers shift */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-b from-charcoal/70 via-charcoal/55 to-charcoal/85"
      />

      {/* Content on its own layer ([transform:translateZ(0)]) so iOS Safari paints
          it over the autoplaying video without needing a scroll to repaint. */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center [transform:translateZ(0)]">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-ember/50 bg-charcoal/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-bone shadow-sm backdrop-blur-sm sm:text-sm">
          <span className="size-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
          {copy.hero.eyebrow}
        </p>
        <h1 className="font-serif text-4xl leading-tight text-bone sm:text-6xl">{copy.hero.headline}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-bone/80">{copy.hero.subhead}</p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <SaveSeatButton />
          <SecondaryLink href="#circles">{copy.hero.secondary}</SecondaryLink>
        </div>
      </div>
    </section>
  );
}
