"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_TENANTS } from "@/lib/demo-workspace";

export default function TenantsPage() {
  const [suspended, setSuspended] = useState<Set<string>>(
    new Set(DEMO_TENANTS.filter((t) => t.status === "Suspended").map((t) => t.id)),
  );
  const [notice, setNotice] = useState("");

  const toggleSuspend = (id: string, business: string) => {
    setSuspended((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setNotice(`✓ ${business} re-activated (demo — not saved).`); }
      else { next.add(id); setNotice(`✓ ${business} suspended (demo — not saved).`); }
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo data — fictional tenants</span>
        <h1 className="h-display mt-3 text-3xl">Tenants</h1>
        <p className="lead mt-2 text-base">
          {DEMO_TENANTS.length} demo workspaces. Suspend / view actions are demo-only and
          are not saved.
        </p>
      </div>

      {notice && <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{notice}</div>}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Usage</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEMO_TENANTS.map((t) => {
                const isSuspended = suspended.has(t.id);
                const pct = Math.round((t.repliesUsed / t.repliesLimit) * 100);
                return (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <span className="font-semibold text-ink-950">{t.business}</span>
                      <span className="block text-xs text-slate-400">since {t.createdAt}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{t.plan}</td>
                    <td className="px-5 py-3">
                      <span className="text-slate-600">{t.repliesUsed.toLocaleString()} / {t.repliesLimit.toLocaleString()}</span>
                      <span className="mt-1 block h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                        <span className={`block h-full rounded-full ${pct > 90 ? "bg-red-500" : "bg-brand-500"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isSuspended ? "bg-red-100 text-red-700" : t.status === "Trial" ? "bg-amber-100 text-amber-800" : "bg-brand-100 text-brand-700"}`}>
                        {isSuspended ? "Suspended" : t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex gap-3">
                        <Link href="/dashboard" className="text-xs font-semibold text-brand-700 hover:underline">View →</Link>
                        <button type="button" onClick={() => toggleSuspend(t.id, t.business)} className="text-xs font-semibold text-red-600 hover:underline">
                          {isSuspended ? "Re-activate" : "Suspend"}
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-slate-400">
        “View” opens the demo business dashboard (the same open demo workspace for every
        tenant in this sprint — per-tenant workspaces arrive with Supabase + auth).
      </p>
    </div>
  );
}
