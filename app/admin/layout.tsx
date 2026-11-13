import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminShell from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "Super Admin — DeskFlow AI (Demo)",
  description:
    "Super Admin demo for DeskFlow AI: tenants, plans and limits, system logs and revenue. All figures are fictional demo data; $0 real revenue.",
  alternates: { canonical: "/admin" },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
