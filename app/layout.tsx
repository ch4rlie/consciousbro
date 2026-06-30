import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig, hasLumaUrl } from "@/site.config";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: { default: siteConfig.name, template: `%s` },
  description: "A brotherhood for men who are done doing it alone. Start with one free monthly call.",
  openGraph: {
    title: siteConfig.name,
    description: "A brotherhood for men who are done doing it alone.",
    type: "website",
    url: `https://${siteConfig.domain}`,
  },
  twitter: { card: "summary_large_image", title: siteConfig.name },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-charcoal font-sans text-bone">
        {children}
        {siteConfig.analytics.vercel && <Analytics />}
        {hasLumaUrl(siteConfig) && (
          // Loads during browser idle time, after first-party content — keeps the
          // RSVP modal off the critical path. Buttons stay usable links until it binds.
          <Script src="https://embed.lu.ma/checkout-button.js" strategy="lazyOnload" />
        )}
      </body>
    </html>
  );
}
