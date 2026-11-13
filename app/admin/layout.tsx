"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { label: "Overview", href: "/admin", icon: "🏠" },
  { label: "Tenants", href: "/admin/tenants", icon: "🏢" },
  { label: "Plans & Limits", href: "/admin/plans", icon: "💳" },
  { label: "System Logs", href: "/admin/logs", icon: "📋" },
  { label: "Revenue", href: "/admin/revenue", icon: "💰" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col bg-ink-950 text-white md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/" className="font-display text-lg font-bold">
            DeskFlow AI
          </Link>
          <p className="mt-1 text-xs text-white/60">Super Admin</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
            Demo data — $0 real revenue
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-5 py-4 text-xs leading-relaxed text-white/50">
          Super Admin demo — no login in this sprint. Real admin auth arrives with the
          billing step.
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-8">
          <span className="badge-demo shrink-0">Demo workspace — demo data</span>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link href="/dashboard" className="hidden text-xs font-semibold text-slate-500 hover:text-ink-950 sm:inline">
              Business Dashboard →
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
          DeskFlow AI Super Admin — demo only. All tenants, usage and revenue figures are
          fictional demo data; $0 real revenue.
        </footer>
      </div>
    </div>
  );
}
