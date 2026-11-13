import type { Metadata } from "next";
import localFont from "next/font/local";
// Fonts are self-hosted (public/fonts) — next/font/google cannot fetch at build time on this VM.
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const spaceGrotesk = localFont({
  src: [
    { path: "../public/fonts/spacegrotesk-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/spacegrotesk-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/spacegrotesk-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../public/fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/inter-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deskflowai-tau.vercel.app"),
  title: "DeskFlow AI — Your 24/7 Business Operations Assistant",
  description:
    "DeskFlow AI — Your Business Never Misses a Customer. A 24/7 AI receptionist that answers messages, books appointments, captures leads and hands off to your team.",
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    title: "DeskFlow AI — Your 24/7 Business Operations Assistant",
    description:
      "Your Business Never Misses a Customer. A 24/7 AI receptionist for modern businesses.",
    type: "website",
    url: "https://deskflowai-tau.vercel.app",
    siteName: "DeskFlow AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "DeskFlow AI — Your Business Never Misses a Customer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DeskFlow AI — Your 24/7 Business Operations Assistant",
    description: "Your Business Never Misses a Customer. A 24/7 AI receptionist for modern businesses.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
