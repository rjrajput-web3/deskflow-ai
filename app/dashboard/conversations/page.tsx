"use client";

import { useEffect, useState } from "react";
import {
  getWorkspace, addMessage, updateConversation, newId, type Workspace, type Conversation,
} from "@/lib/store";

export default function ConversationsPage() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "escalated">("all");
  const [reply, setReply] = useState("");

  useEffect(() => setWs(getWorkspace()), []);
  useEffect(() => {
    if (ws && !selectedId) setSelectedId(ws.conversations[0]?.id ?? null);
  }, [ws, selectedId]);

  if (!ws) return <p className="text-sm text-slate-500">Loading demo workspace…</p>;

  const list = ws.conversations.filter((c) => (filter === "escalated" ? c.escalated : true));
  const selected = ws.conversations.find((c) => c.id === selectedId) ?? list[0];

  const refresh = (convs: Conversation[]) => setWs({ ...ws, conversations: convs });

  const sendReply = () => {
    if (!selected || !reply.trim()) return;
    const from = selected.takenOver ? "staff" : "ai";
    refresh(addMessage(selected.id, {
      id: newId("m"), from, text: reply.trim(),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    }));
    setReply("");
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="badge-demo">Demo workspace — demo data</span>
        <h1 className="h-display mt-3 text-3xl">Conversations</h1>
        <p className="lead mt-2 text-base">Every WhatsApp and website-chat thread, in one inbox. All demo data.</p>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setFilter("all")} className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === "all" ? "bg-ink-950 text-white" : "bg-white border border-slate-300"}`}>All ({ws.conversations.length})</button>
        <button type="button" onClick={() => setFilter("escalated")} className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === "escalated" ? "bg-red-600 text-white" : "bg-white border border-slate-300"}`}>⚠️ Escalated ({ws.conversations.filter((c) => c.escalated).length})</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card overflow-hidden lg:col-span-2">
          <ul className="divide-y divide-slate-100">
            {list.map((c) => (
              <li key={c.id}>
                <button
                  type="button" onClick={() => setSelectedId(c.id)}
                  className={`block w-full px-5 py-4 text-left transition ${selected?.id === c.id ? "bg-brand-50" : "hover:bg-slate-50"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink-950">{c.customer}</span>
                    <span className="text-xs text-slate-400">{c.channel}</span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-slate-500">{c.lastMessage}</span>
                  <span className="mt-1.5 flex gap-1.5">
                    {c.escalated && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">ESCALATED</span>}
                    {c.takenOver && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">STAFF</span>}
                    {c.unread > 0 && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">{c.unread} new</span>}
                  </span>
                </button>
              </li>
            ))}
            {list.length === 0 && <li className="px-5 py-6 text-sm text-slate-500">No conversations match this filter.</li>}
          </ul>
        </div>

        <div className="card flex flex-col overflow-hidden lg:col-span-3">
          {!selected ? (
            <p className="px-5 py-8 text-sm text-slate-500">Select a conversation.</p>
          ) : (
            <>
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink-950">{selected.customer}</p>
                    <p className="text-xs text-slate-500">{selected.email} · {selected.channel} (demo)</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold">
                      <input
                        type="checkbox" checked={selected.takenOver}
                        onChange={(e) => refresh(updateConversation(selected.id, { takenOver: e.target.checked }))}
                      />
                      Human takeover
                    </label>
                    <button
                      type="button"
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${selected.escalated ? "bg-red-600 text-white" : "border border-red-300 text-red-600"}`}
                      onClick={() => refresh(updateConversation(selected.id, { escalated: !selected.escalated }))}
                    >
                      {selected.escalated ? "✓ Escalated" : "⚠️ Escalate"}
                    </button>
                  </div>
                </div>
                {selected.takenOver && (
                  <p className="mt-3 rounded-xl bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800">
                    🙋 Staff has taken over — AI paused. Replies below go out as staff.
                  </p>
                )}
                {selected.escalated && !selected.takenOver && (
                  <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                    ⚠️ Escalated — needs staff attention (rule: {ws.escalationRules[0] ?? "escalate to staff"}).
                  </p>
                )}
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5" style={{ minHeight: 280 }}>
                {selected.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "customer" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.from === "customer" ? "bg-slate-100 text-ink-950" : m.from === "staff" ? "bg-sky-600 text-white" : "bg-brand-600 text-white"}`}>
                      {m.text}
                      <span className="mt-1 block text-[10px] font-bold uppercase opacity-70">
                        {m.from === "customer" ? "Customer" : m.from === "staff" ? "Staff" : "AI"} · {m.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex min-w-0 gap-2 border-t border-slate-200 px-4 py-3">
                <input
                  className="input min-w-0 flex-1" placeholder={selected.takenOver ? "Reply as staff…" : "Reply as AI…"} value={reply}
                  aria-label={selected.takenOver ? "Reply as staff" : "Reply as AI"}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }}
                />
                <button type="button" className="btn-primary shrink-0 !px-5" onClick={sendReply}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
