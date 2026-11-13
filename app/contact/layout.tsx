import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact — DeskFlow AI",
  description:
    "Talk to the DeskFlow AI team about plans, setup or agency workspaces. Your email app opens with a pre-filled enquiry — no account needed.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
