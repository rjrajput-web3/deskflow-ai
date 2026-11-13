"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { label: "Overview", href: "/dashboard", icon: "🏠" },
  { label: "Business Setup", href: "/dashboard/setup", icon: "⚙️" },
  { label: "Knowledge Base", href: "/dashboard/knowledge", icon: "📚" },
  { label: "AI Test Sandbox", href: "/dashboard/sandbox", icon: "🧪" },
  { label: "Conversations", href: "/dashboard/conversations", icon: "💬" },
  { label: "Leads CRM", href: "/dashboard/leads", icon: "🗂️" },
  { label: "Appointments", href: "/dashboard/appointments", icon: "📅" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "📊" },
  { label: "Integrations", href: "/dashboard/integrations", icon: "🔗" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-200 px-5 py-5">
          <Link href="/" className="font-display text-lg font-bold text-ink-950">
            DeskFlow AI
          </Link>
          <p className="mt-1 text-xs text-slate-500">Business Owner Dashboard</p>
          <span className="badge-demo mt-3">Demo workspace — demo data</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-ink-950"
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 px-5 py-4 text-xs leading-relaxed text-slate-500">
          Open demo — no login. Real auth + billing arrive after the first sale.
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <span className="badge-demo shrink-0">Demo workspace — demo data</span>
            <span className="hidden truncate text-xs text-slate-500 md:inline">
              BrightSmile Dental Studio (demo) · No real customers
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link href="/admin" className="hidden text-xs font-semibold text-slate-500 hover:text-ink-950 sm:inline">
              Super Admin →
            </Link>
            <Link href="/" className="btn-ghost !px-3 !py-1.5 text-[11px] sm:!px-4 sm:!py-2 sm:text-xs">
              ← Marketing site
            </Link>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 no-scrollbar md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8">{children}</main>
        <footer className="border-t border-slate-200 px-5 py-4 text-center text-xs text-slate-400">
          DeskFlow AI — open demo. All names, messages and numbers on this dashboard are
          fictional demo data. Real auth + billing arrive after the first sale.
        </footer>
      </div>
    </div>
  );
}
