import type { Metadata } from "next";
import MeetupApp from "./MeetupApp";

// Unlisted: keep it out of search engines. Not linked from the site nav.
export const metadata: Metadata = {
  title: "Meetup",
  robots: { index: false, follow: false },
};

export default function MeetupPage() {
  return <MeetupApp />;
}
