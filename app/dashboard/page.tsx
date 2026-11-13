"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getWorkspace, type Workspace } from "@/lib/store";
import { AVG_FIRST_REPLY_SECONDS } from "@/lib/demo-workspace";

function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DashboardOverview() {
  const [ws, setWs] = useState<Workspace | null>(null);
  useEffect(() => setWs(getWorkspace()), []);

  const stats = useMemo(() => {
    if (!ws) return null;
    const today = localISO(new Date());
    const last = ws.analytics[ws.analytics.length - 1];
    return {
      messagesToday: last?.messages ?? 0,
      newLeads: ws.leads.filter((l) => l.status === "New").length,
      bookingsToday: ws.appointments.filter((a) => a.date === today).length,
      totalMessages14: ws.analytics.reduce((s, d) => s + d.messages, 0),
      totalLeads14: ws.analytics.reduce((s, d) => s + d.leads, 0),
      totalBookings14: ws.analytics.reduce((s, d) => s + d.bookings, 0),
      todayAppts: ws.appointments.filter((a) => a.date === today),
    };
  }, [ws]);

  if (!ws || !stats) {
    return <p className="text-sm text-slate-500">Loading demo workspace…</p>;
  }

  const maxMsg = Math.max(...ws.analytics.map((d) => d.messages), 1);
  const report = `Today at ${ws.businessName}: ${stats.messagesToday} customer messages, ${stats.newLeads} new leads waiting, and ${stats.bookingsToday} bookings on the calendar. Over the last 14 days the AI handled ${stats.totalMessages14} messages, captured ${stats.totalLeads14} leads and made ${stats.totalBookings14} bookings. Average first reply: about ${AVG_FIRST_REPLY_SECONDS} seconds. Escalated conversations needing staff: ${ws.conversations.filter((c) => c.escalated).length}.`;

  const cards = [
    { label: "Messages today", value: String(stats.messagesToday), note: "AI replies, all channels" },
    { label: "New leads", value: String(stats.newLeads), note: "Waiting for follow-up" },
    { label: "Bookings today", value: String(stats.bookingsToday), note: "On the calendar" },
    { label: "Avg first reply", value: `~${AVG_FIRST_REPLY_SECONDS}s`, note: "Demo average" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo workspace — demo data</span>
        <h1 className="h-display mt-3 text-3xl sm:text-4xl">Good morning, {ws.businessName}</h1>
        <p className="lead mt-2 text-base">
          Your AI receptionist is on duty. Everything below is fictional demo data — real
          auth + billing arrive after the first sale.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card card-pad !p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{c.label}</p>
            <p className="font-display mt-2 text-3xl font-bold text-ink-950">{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card card-pad lg:col-span-3">
          <h2 className="font-display text-lg font-bold text-ink-950">Messages per day — last 14 days</h2>
          <p className="mt-1 text-xs text-slate-500">Demo analytics. CSV export arrives with the Supabase step.</p>
          <div className="mt-6 flex h-40 items-end gap-1.5">
            {ws.analytics.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5" title={`${d.date}: ${d.messages} messages, ${d.leads} leads, ${d.bookings} bookings`}>
                <span className="text-[10px] font-semibold text-slate-500">{d.messages}</span>
                <div
                  className="w-full rounded-t-md bg-brand-500"
                  style={{ height: `${Math.max(6, (d.messages / maxMsg) * 100)}%` }}
                />
                <span className="text-[10px] text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-ink-950">Daily owner report</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{report}</p>
          <Link href="/dashboard/analytics" className="btn-ghost mt-5 !px-4 !py-2 text-xs">
            Full analytics →
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card card-pad">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-950">Recent conversations</h2>
            <Link href="/dashboard/conversations" className="text-xs font-semibold text-brand-700 hover:underline">
              Open inbox →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {ws.conversations.slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink-950">
                    {c.customer}
                    {c.escalated && <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">ESCALATED</span>}
                    {c.takenOver && <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">STAFF</span>}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">{c.lastMessage}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{c.channel}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card card-pad">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-950">Today&apos;s appointments</h2>
            <Link href="/dashboard/appointments" className="text-xs font-semibold text-brand-700 hover:underline">
              Calendar →
            </Link>
          </div>
          {stats.todayAppts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No appointments today (demo).</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {stats.todayAppts.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-950">{a.customer}</p>
                    <p className="text-sm text-slate-500">{a.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink-950">{a.time}</p>
                    <p className="text-sm text-slate-500">${a.amount} · {a.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
