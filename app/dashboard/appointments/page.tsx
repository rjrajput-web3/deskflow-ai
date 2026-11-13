"use client";

import { useEffect, useState } from "react";
import { getWorkspace, addAppointment, newId, type Workspace } from "@/lib/store";

function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AppointmentsPage() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [customer, setCustomer] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState(localISO(new Date()));
  const [time, setTime] = useState("10:00 AM");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => setWs(getWorkspace()), []);
  if (!ws) return <p className="text-sm text-slate-500">Loading demo workspace…</p>;

  const weekStart = new Date();
  const week: string[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return localISO(d);
  });

  // Opening hours: Mon–Sat 10:00 AM – 8:00 PM, Sun closed (Oakridge seed).
  function hoursError(dateISO: string, timeStr: string): string {
    const d = new Date(dateISO + "T12:00:00");
    if (d.getDay() === 0) return "We are closed on Sundays — pick another day (Mon–Sat).";
    const m = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp])[Mm]?$/);
    if (!m) return "Time should look like “10:00 AM”.";
    let h = parseInt(m[1], 10);
    const mins = parseInt(m[2] ?? "0", 10);
    if (/^[Pp]/.test(m[3]) && h !== 12) h += 12;
    if (/^[Aa]/.test(m[3]) && h === 12) h = 0;
    const total = h * 60 + mins;
    if (total < 10 * 60 || total >= 20 * 60) {
      return "Outside opening hours — pick a time between 10:00 AM and 8:00 PM.";
    }
    return "";
  }

  const submit = () => {
    if (!customer.trim() || !service) return;
    const err = hoursError(date, time.trim() || "10:00 AM");
    if (err) {
      setFormError(err);
      return;
    }
    setFormError("");
    const svc = ws.services.find((s) => s.name === service);
    const next = addAppointment({
      id: newId("appt"), customer: customer.trim(), service,
      date, time: time.trim() || "10:00 AM",
      amount: Number(amount) || svc?.price || 0, status: "Confirmed",
    });
    setWs({ ...ws, appointments: next });
    setCustomer(""); setAmount("");
  };

  const sorted = [...ws.appointments].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo workspace — demo data</span>
        <h1 className="h-display mt-3 text-3xl">Appointments</h1>
        <p className="lead mt-2 text-base">Bookings the AI made, plus ones you add by hand. All demo data.</p>
      </div>

      <div className="card card-pad">
        <h2 className="font-display text-lg font-bold text-ink-950">This week</h2>
        <p className="mt-1 text-xs text-slate-500">Opening hours: Mon–Sat 10:00 AM – 8:00 PM, Sun closed.</p>
        {/* Stacks vertically on phones (no clipped day columns), 7-across on desktop. */}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
          {week.map((day) => {
            const dayAppts = ws.appointments.filter((a) => a.date === day);
            const label = new Date(day + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
            const isToday = day === localISO(new Date());
            return (
              <div key={day} className={`min-h-28 rounded-xl border p-2 ${isToday ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white"}`}>
                <p className="text-xs font-bold text-ink-950">{label}{isToday ? " • Today" : ""}</p>
                <div className="mt-2 space-y-1.5">
                  {dayAppts.map((a) => (
                    <div key={a.id} className="rounded-lg bg-ink-950 px-2 py-1 text-[10px] leading-snug text-white">
                      {a.time} — {a.customer} · {a.service}
                    </div>
                  ))}
                  {dayAppts.length === 0 && <p className="text-[10px] text-slate-400">—</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card card-pad lg:col-span-3">
          <h2 className="font-display text-lg font-bold text-ink-950">All appointments ({sorted.length})</h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {sorted.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink-950">{a.customer}</p>
                  <p className="text-sm text-slate-500">{a.service} · {a.date} at {a.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink-950">${a.amount}</p>
                  <p className="text-xs text-slate-500">{a.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card card-pad lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-ink-950">Add appointment</h2>
          <div className="mt-4 space-y-3">
            <input className="input" placeholder="Customer name (fictional demo only)" value={customer} onChange={(e) => setCustomer(e.target.value)} />
            <select className="input" value={service} onChange={(e) => { setService(e.target.value); const s = ws.services.find((x) => x.name === e.target.value); if (s) setAmount(String(s.price)); }}>
              <option value="">Select a service…</option>
              {ws.services.map((s) => <option key={s.id} value={s.name}>{s.name} — ${s.price}</option>)}
            </select>
            <div className="flex gap-2">
              <input className="input min-w-0 flex-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <input className="input w-32 min-w-0 shrink-0" placeholder="10:00 AM" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <input className="input" type="number" min={0} placeholder="Amount $ (auto-filled from service)" value={amount} onChange={(e) => setAmount(e.target.value)} />
            {formError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{formError}</p>
            )}
            <button type="button" className="btn-primary w-full !py-2.5 text-sm" onClick={submit}>+ Add appointment</button>
            <p className="text-xs text-slate-400">Hours: Mon–Sat 10:00 AM – 8:00 PM, Sun closed. Calendar sync (Google Calendar) is set up after onboarding.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
