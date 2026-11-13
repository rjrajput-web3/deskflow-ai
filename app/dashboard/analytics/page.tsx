"use client";

import { useEffect, useMemo, useState } from "react";
import { getWorkspace, type Workspace } from "@/lib/store";
import { AVG_FIRST_REPLY_SECONDS } from "@/lib/demo-workspace";

function Bars({ data, color }: { data: Array<{ label: string; value: number }>; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="mt-6 flex h-40 items-end gap-1.5">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5" title={`${d.label}: ${d.value}`}>
          <span className="text-[10px] font-semibold text-slate-500">{d.value}</span>
          <div className={`w-full rounded-t-md ${color}`} style={{ height: `${Math.max(6, (d.value / max) * 100)}%` }} />
          <span className="text-[10px] text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [ws, setWs] = useState<Workspace | null>(null);
  useEffect(() => setWs(getWorkspace()), []);

  const funnel = useMemo(() => {
    if (!ws) return null;
    const count = (s: string) => ws.leads.filter((l) => l.status === s).length;
    const stages = [
      { label: "New", value: count("New") + count("Contacted") + count("Booked") + count("Won") },
      { label: "Contacted", value: count("Contacted") + count("Booked") + count("Won") },
      { label: "Booked", value: count("Booked") + count("Won") },
      { label: "Won", value: count("Won") },
    ];
    return stages;
  }, [ws]);

  if (!ws || !funnel) return <p className="text-sm text-slate-500">Loading demo workspace…</p>;

  const totals = {
    messages: ws.analytics.reduce((s, d) => s + d.messages, 0),
    leads: ws.analytics.reduce((s, d) => s + d.leads, 0),
    bookings: ws.analytics.reduce((s, d) => s + d.bookings, 0),
  };
  const maxFunnel = Math.max(...funnel.map((f) => f.value), 1);
  const topServices = ws.services.map((s) => ({
    ...s,
    bookings: ws.appointments.filter((a) => a.service === s.name).length,
  })).sort((a, b) => b.bookings - a.bookings);
  const conversion = totals.leads > 0 ? Math.round((totals.bookings / totals.leads) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo workspace — demo data</span>
        <h1 className="h-display mt-3 text-3xl">Analytics</h1>
        <p className="lead mt-2 text-base">
          Last 14 days, demo data. {totals.messages} messages · {totals.leads} leads · {totals.bookings} bookings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Messages / day</h2>
          <Bars data={ws.analytics.map((d) => ({ label: d.label, value: d.messages }))} color="bg-brand-500" />
        </div>
        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Leads / day</h2>
          <Bars data={ws.analytics.map((d) => ({ label: d.label, value: d.leads }))} color="bg-accent-500" />
        </div>
        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Bookings / day</h2>
          <Bars data={ws.analytics.map((d) => ({ label: d.label, value: d.bookings }))} color="bg-ink-950" />
        </div>
        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Conversion funnel</h2>
          <p className="mt-1 text-xs text-slate-500">New → Contacted → Booked → Won (demo leads in this workspace).</p>
          <div className="mt-5 space-y-3">
            {funnel.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-ink-950">{f.label}</span>
                  <span className="text-slate-500">{f.value}</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${(f.value / maxFunnel) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Lead → booking conversion (14 days): <strong className="text-ink-950">{conversion}%</strong> (demo).
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Response times</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between"><span className="text-slate-600">Average first reply</span><strong className="text-ink-950">~{AVG_FIRST_REPLY_SECONDS}s</strong></li>
            <li className="flex justify-between"><span className="text-slate-600">Median first reply (demo)</span><strong className="text-ink-950">~24s</strong></li>
            <li className="flex justify-between"><span className="text-slate-600">Replies within 1 minute</span><strong className="text-ink-950">94% (demo)</strong></li>
            <li className="flex justify-between"><span className="text-slate-600">Missed messages (14 days)</span><strong className="text-ink-950">0</strong></li>
          </ul>
        </div>
        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Top services by bookings</h2>
          <ul className="mt-4 space-y-3">
            {topServices.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{s.name} <span className="text-slate-400">(${s.price})</span></span>
                <strong className="text-ink-950">{s.bookings} booking{s.bookings === 1 ? "" : "s"}</strong>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            📥 CSV export arrives with the Supabase step — these charts are computed from the
            demo workspace in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
