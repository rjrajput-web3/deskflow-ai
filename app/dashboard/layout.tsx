import type { Metadata } from "next";
import type { ReactNode } from "react";
import DashboardShell from "@/components/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard — DeskFlow AI (Demo)",
  description:
    "Open demo workspace for DeskFlow AI: business setup, knowledge base, AI test sandbox, conversations, leads, appointments and analytics. Demo data — no login, no real customers.",
  alternates: { canonical: "/dashboard" },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
