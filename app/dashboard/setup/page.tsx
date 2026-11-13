"use client";

import { useEffect, useState } from "react";
import { getWorkspace, saveWorkspace, newId, type Workspace } from "@/lib/store";

export default function BusinessSetupPage() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [saved, setSaved] = useState(false);
  const [newRule, setNewRule] = useState("");
  const [newSvcName, setNewSvcName] = useState("");
  const [newSvcPrice, setNewSvcPrice] = useState("");

  useEffect(() => setWs(getWorkspace()), []);

  if (!ws) return <p className="text-sm text-slate-500">Loading demo workspace…</p>;

  const update = (patch: Partial<Workspace>) => {
    setWs({ ...ws, ...patch });
    setSaved(false);
  };

  const save = () => {
    saveWorkspace(ws);
    setSaved(true);
  };

  const setService = (id: string, patch: { name?: string; price?: number }) =>
    update({ services: ws.services.map((s) => (s.id === id ? { ...s, ...patch } : s)) });

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo workspace — demo data</span>
        <h1 className="h-display mt-3 text-3xl">Business Setup</h1>
        <p className="lead mt-2 text-base">
          This is what the AI receptionist answers from. Changes save to this browser only
          (demo — no server yet).
        </p>
      </div>

      <div className="card card-pad space-y-6">
        <div>
          <label className="label" htmlFor="biz-name">Business name</label>
          <input
            id="biz-name" className="input" value={ws.businessName}
            onChange={(e) => update({ businessName: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="biz-tagline">Tagline</label>
          <input
            id="biz-tagline" className="input" value={ws.tagline}
            onChange={(e) => update({ tagline: e.target.value })}
          />
        </div>

        <div>
          <span className="label">Services &amp; USD prices</span>
          <div className="space-y-2">
            {ws.services.map((s) => (
              <div key={s.id} className="flex flex-col gap-2 sm:flex-row">
                <input
                  className="input min-w-0 flex-1" value={s.name} aria-label="Service name"
                  onChange={(e) => setService(s.id, { name: e.target.value })}
                />
                <div className="flex w-full items-center gap-1 sm:w-32 sm:shrink-0">
                  <span className="text-sm text-slate-500">$</span>
                  <input
                    className="input min-w-0 flex-1" type="number" min={0} value={s.price} aria-label="Service price in USD"
                    onChange={(e) => setService(s.id, { price: Number(e.target.value) || 0 })}
                  />
                </div>
                <button
                  type="button" onClick={() => update({ services: ws.services.filter((x) => x.id !== s.id) })}
                  className="shrink-0 self-start rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 sm:self-auto"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              className="input min-w-0 flex-1" placeholder="New service name" value={newSvcName}
              onChange={(e) => setNewSvcName(e.target.value)}
            />
            <input
              className="input w-full sm:w-32 sm:shrink-0" type="number" min={0} placeholder="$ price" value={newSvcPrice}
              onChange={(e) => setNewSvcPrice(e.target.value)}
            />
            <button
              type="button"
              className="btn-ghost shrink-0 !px-4 !py-2 text-xs"
              onClick={() => {
                if (!newSvcName.trim()) return;
                update({ services: [...ws.services, { id: newId("svc"), name: newSvcName.trim(), price: Number(newSvcPrice) || 0 }] });
                setNewSvcName(""); setNewSvcPrice("");
              }}
            >
              + Add service
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="days-open">Days open</label>
            <input id="days-open" className="input" value={ws.daysOpen} onChange={(e) => update({ daysOpen: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="open-time">Opens</label>
            <input id="open-time" className="input" value={ws.openTime} onChange={(e) => update({ openTime: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="close-time">Closes</label>
            <input id="close-time" className="input" value={ws.closeTime} onChange={(e) => update({ closeTime: e.target.value })} />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Shown to customers as: {ws.daysOpen}, {ws.openTime} – {ws.closeTime}.
        </p>

        <div>
          <span className="label">Escalation rules</span>
          <ul className="space-y-2">
            {ws.escalationRules.map((rule, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
                <span>{rule}</span>
                <button
                  type="button" className="text-xs font-semibold text-red-600 hover:underline"
                  onClick={() => update({ escalationRules: ws.escalationRules.filter((_, j) => j !== i) })}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              className="input min-w-0 flex-1" placeholder='e.g. "Escalate bookings over $500 to staff"' value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
            />
            <button
              type="button" className="btn-ghost shrink-0 !px-4 !py-2 text-xs"
              onClick={() => {
                if (!newRule.trim()) return;
                update({ escalationRules: [...ws.escalationRules, newRule.trim()] });
                setNewRule("");
              }}
            >
              + Add rule
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="btn-primary" onClick={save}>Save business settings</button>
          {saved && <span className="text-sm font-semibold text-brand-700">✓ Saved to this browser (demo).</span>}
        </div>
      </div>
    </div>
  );
}
