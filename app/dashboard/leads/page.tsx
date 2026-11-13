"use client";

import { useEffect, useState } from "react";
import { getWorkspace, addLead, updateLead, newId, type Workspace, type Lead, type LeadStatus } from "@/lib/store";

const STATUSES: LeadStatus[] = ["New", "Contacted", "Booked", "Won", "Lost"];

export default function LeadsPage() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [filter, setFilter] = useState<"All" | LeadStatus>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [value, setValue] = useState("");
  const [source, setSource] = useState("WhatsApp");
  const [formError, setFormError] = useState("");

  useEffect(() => setWs(getWorkspace()), []);
  if (!ws) return <p className="text-sm text-slate-500">Loading demo workspace…</p>;

  const leads = ws.leads.filter((l) => (filter === "All" ? true : l.status === filter));
  const selected = ws.leads.find((l) => l.id === selectedId) ?? null;
  const pipelineValue = ws.leads.filter((l) => l.status !== "Lost").reduce((s, l) => s + l.value, 0);

  const refresh = (next: Lead[]) => setWs({ ...ws, leads: next });

  const submitLead = () => {
    // Show an inline error instead of silently doing nothing (audit #13).
    if (!name.trim()) {
      setFormError("Please enter a name for the lead.");
      return;
    }
    // A blank email stays blank — never invent demo@example.com for a real name.
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError("Please enter a valid email address, or leave it blank.");
      return;
    }
    setFormError("");
    refresh(addLead({
      id: newId("lead"), name: name.trim(), email: email.trim(),
      source, status: "New", value: Number(value) || 0, notes: "",
      createdAt: new Date().toISOString().slice(0, 10),
    }));
    setName(""); setEmail(""); setValue("");
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo workspace — demo data</span>
        <h1 className="h-display mt-3 text-3xl">Leads CRM</h1>
        <p className="lead mt-2 text-base">
          Every conversation becomes a lead. Pipeline value (excl. Lost):{" "}
          <strong className="text-ink-950">${pipelineValue}</strong> — demo data.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", ...STATUSES] as const).map((s) => (
          <button
            key={s} type="button" onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === s ? "bg-ink-950 text-white" : "border border-slate-300 bg-white"}`}
          >
            {s} ({s === "All" ? ws.leads.length : ws.leads.filter((l) => l.status === s).length})
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card overflow-hidden lg:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id} onClick={() => setSelectedId(l.id)} className={`cursor-pointer hover:bg-slate-50 ${selectedId === l.id ? "bg-brand-50" : ""}`}>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-ink-950">{l.name}</span>
                      <span className="block text-xs text-slate-400">{l.email}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{l.source}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">{l.status}</span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-ink-950">${l.value}</td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-6 text-slate-500">No leads with this status.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="card card-pad">
            <h2 className="font-display text-lg font-bold text-ink-950">Add lead</h2>
            <div className="mt-4 space-y-3">
              <input className="input" placeholder="Name (fictional demo only)" value={name} onChange={(e) => setName(e.target.value)} aria-label="Lead name" />
              <input className="input" type="email" placeholder="Email (demo)" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Lead email" />
              <div className="flex gap-2">
                <select className="input min-w-0 flex-1" value={source} onChange={(e) => setSource(e.target.value)}>
                  <option>WhatsApp</option>
                  <option>Website chat</option>
                  <option>Referral</option>
                </select>
                <input className="input w-28 min-w-0 shrink-0" type="number" min={0} placeholder="$ value" value={value} onChange={(e) => setValue(e.target.value)} />
              </div>
              {formError && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{formError}</p>
              )}
              <button type="button" className="btn-primary w-full !py-2.5 text-sm" onClick={submitLead}>+ Add lead</button>
            </div>
          </div>

          {selected && (
            <div className="card card-pad">
              <h2 className="font-display text-lg font-bold text-ink-950">Edit: {selected.name}</h2>
              <label className="label mt-4" htmlFor="lead-status">Status</label>
              <select
                id="lead-status" className="input" value={selected.status}
                onChange={(e) => refresh(updateLead(selected.id, { status: e.target.value as LeadStatus }))}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <label className="label mt-4" htmlFor="lead-notes">Notes</label>
              <textarea
                id="lead-notes" className="input min-h-24" value={selected.notes}
                onChange={(e) => refresh(updateLead(selected.id, { notes: e.target.value }))}
                placeholder="Follow-up notes…"
              />
              <p className="mt-3 text-xs text-slate-400">Changes save automatically to this browser (demo).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
