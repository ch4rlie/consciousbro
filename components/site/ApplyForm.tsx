"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/site.config";

export function ApplyForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFailed(false);
    setErrors({});
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      drawingIn: form.get("drawingIn"),
      availability: form.get("availability"),
      priorExperience: form.get("priorExperience"),
      agreement: form.get("agreement") === "on",
      website: form.get("website"), // honeypot
    };
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 200) {
        router.push("/thanks");
        return;
      }
      if (res.status === 400) {
        const data = await res.json();
        setErrors(data.errors ?? {});
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  const field = "mt-1 w-full rounded-md border border-bone/20 bg-charcoal px-3 py-2 text-bone";
  const err = (k: string) => errors[k] ? <p id={`${k}-error`} className="mt-1 text-sm text-ember">{errors[k]}</p> : null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Honeypot: visually hidden, not announced to humans */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div>
        <label htmlFor="name" className="block text-sm">Your name</label>
        <input id="name" name="name" className={field} aria-describedby="name-error" required />
        {err("name")}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm">Email</label>
        <input id="email" name="email" type="email" className={field} aria-describedby="email-error" required />
        {err("email")}
      </div>
      <div>
        <label htmlFor="drawingIn" className="block text-sm">What&apos;s drawing you in?</label>
        <textarea id="drawingIn" name="drawingIn" rows={4} className={field} aria-describedby="drawingIn-error" required />
        {err("drawingIn")}
      </div>
      <div>
        <label htmlFor="availability" className="block text-sm">Availability</label>
        <input id="availability" name="availability" className={field} aria-describedby="availability-error" required />
        {err("availability")}
      </div>
      <div>
        <label htmlFor="priorExperience" className="block text-sm">Prior men&apos;s-work experience (optional)</label>
        <textarea id="priorExperience" name="priorExperience" rows={3} className={field} />
      </div>
      <div className="flex items-start gap-3">
        <input id="agreement" name="agreement" type="checkbox" className="mt-1" aria-describedby="agreement-error" required />
        <label htmlFor="agreement" className="text-sm text-bone/80">
          I understand circles are $99/month, month to month, cancel anytime, and by application.
        </label>
      </div>
      {err("agreement")}

      {failed && (
        <div role="alert" className="rounded-md border border-ember/40 bg-ember/10 p-4 text-sm">
          Something went wrong sending your application. Please{" "}
          <a className="underline" href={`mailto:${siteConfig.contactEmail}?subject=Circle application`}>
            email {siteConfig.contactEmail}
          </a>{" "}
          directly — we don&apos;t want your message to disappear.
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-ember px-6 py-3 font-semibold text-charcoal transition hover:bg-ember/90 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send my application"}
      </button>
    </form>
  );
}
