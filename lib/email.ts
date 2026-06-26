import { Resend } from "resend";
import { siteConfig } from "@/site.config";
import type { ApplyInput } from "@/lib/apply-schema";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendApplicationEmail(input: ApplyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const resend = new Resend(apiKey);
  const from = process.env.APPLY_FROM_EMAIL ?? "applications@" + siteConfig.domain;
  const { error } = await resend.emails.send({
    from,
    to: siteConfig.contactEmail,
    replyTo: input.email,
    subject: `New circle application from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `What's drawing you in: ${input.drawingIn}`,
      `Availability: ${input.availability}`,
      `Prior men's-work experience: ${input.priorExperience || "(none given)"}`,
    ].join("\n"),
  });
  if (error) throw new Error(error.message);
}
