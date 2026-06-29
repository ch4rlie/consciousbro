export type Host = { name: string; bio: string | null; photo: string | null };

export type SiteConfig = {
  name: string;
  domain: string;
  contactEmail: string;
  social: { instagram: string | null; youtube: string | null };
  nextCall: { date: string | null; time: string; tz: string };
  lumaUrl: string | null;
  hosts: Host[];
  analytics: { vercel: boolean; plausibleDomain: string | null };
};

export const siteConfig: SiteConfig = {
  name: "The Conscious Brotherhood",
  domain: "consciousbrotherhood.com", // TODO-CONTENT: confirm final domain
  contactEmail: "hello@consciousbrotherhood.com", // TODO-CONTENT: real inbox for /apply fallback + delivery
  social: { instagram: null, youtube: null }, // TODO-CONTENT: handles
  nextCall: { date: "July 23", time: "6pm PT", tz: "/ 9pm ET" }, // first brother call
  lumaUrl: null, // TODO-CONTENT: Luma event URL
  hosts: [
    { name: "Ccowl Humphries", bio: null, photo: null }, // TODO-CONTENT: Ccowl bio + photo
    { name: "Charlie Grove", bio: null, photo: null }, // TODO-CONTENT: Charlie bio + photo
  ],
  analytics: { vercel: true, plausibleDomain: null },
};

export const hasLumaUrl = (c: SiteConfig = siteConfig): c is SiteConfig & { lumaUrl: string } =>
  Boolean(c.lumaUrl);
export const hasCallDate = (c: SiteConfig = siteConfig): boolean => Boolean(c.nextCall.date);
export const hostHasBio = (h: Host): h is Host & { bio: string } => Boolean(h.bio);
