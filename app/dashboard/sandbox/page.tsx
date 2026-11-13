"use client";

import { useEffect, useState } from "react";
import { getWorkspace, type Workspace } from "@/lib/store";

type ChatEntry = { from: "customer" | "ai"; text: string; source?: "live" | "mock" };

export default function SandboxPage() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatEntry[]>([
    { from: "ai", text: "Hi! I'm the demo receptionist. Ask me a price, opening hours, or to book — e.g. “How much is whitening?”", source: "mock" },
  ]);
  const [payload, setPayload] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [lastSource, setLastSource] = useState<"live" | "mock" | null>(null);

  useEffect(() => setWs(getWorkspace()), []);
  // Greet with the workspace's own business name once it loads.
  useEffect(() => {
    if (!ws) return;
    setChat((c) => {
      if (c.length !== 1 || c[0].from !== "ai") return c;
      return [{ from: "ai", text: `Hi! I'm the demo receptionist for ${ws.businessName}. Ask me a price, opening hours, or to book — e.g. “How much is whitening?”`, source: "mock" }];
    });
  }, [ws]);

  if (!ws) return <p className="text-sm text-slate-500">Loading demo workspace…</p>;

  const knowledge = ws.knowledgeDocs.map((d) => `${d.title}: ${d.content}`).join("\n\n");

  const send = async () => {
    const message = input.trim();
    if (!message || sending) return;
    setInput("");
    setChat((c) => [...c, { from: "customer", text: message }]);
    setSending(true);
    const body = {
      message,
      services: ws.services.map((s) => ({ name: s.name, price: s.price })),
      knowledge,
      businessName: ws.businessName,
      hours: ws.hours,
    };
    setPayload(JSON.stringify(body, null, 2));
    try {
      const res = await fetch("/api/ai-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const source = data.source === "live" ? "live" : "mock";
      setLastSource(source);
      setChat((c) => [...c, { from: "ai", text: String(data.reply ?? "No reply returned (demo)."), source }]);
    } catch {
      setLastSource("mock");
      setChat((c) => [...c, { from: "ai", text: "The test API could not be reached (demo). Try again.", source: "mock" }]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = [
    "How much is a teeth cleaning?",
    "What are your opening hours?",
    "I'd like to book a whitening session",
    "What is your cancellation policy?",
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo workspace — demo data</span>
        <h1 className="h-display mt-3 text-3xl">AI Test Sandbox</h1>
        <p className="lead mt-2 text-base">
          Talk to the receptionist exactly as a customer would. It answers from your
          services, hours and knowledge base — live via Gemini when a key is set,
          otherwise with the built-in mock responder.
        </p>
        {lastSource && (
          <p className="mt-3">
            <span className={lastSource === "live" ? "badge-live" : "badge-demo"}>
              {lastSource === "live" ? "● Live Gemini" : "● Mock responder"}
            </span>
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card flex flex-col overflow-hidden lg:col-span-3">
          <div className="border-b border-slate-200 px-5 py-3">
            <p className="text-sm font-semibold text-ink-950">{ws.businessName} — test chat</p>
            <p className="text-xs text-slate-500">Demo conversation · nothing is sent to a real customer</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5" style={{ minHeight: 320 }}>
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.from === "customer" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "customer" ? "bg-ink-950 text-white" : "bg-slate-100 text-ink-950"
                  }`}
                >
                  {m.text}
                  {m.from === "ai" && m.source && (
                    <span className="mt-1 block text-[10px] font-bold uppercase opacity-60">
                      {m.source === "live" ? "Live Gemini" : "Mock responder"}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {sending && <p className="text-xs text-slate-400">Receptionist is typing…</p>}
          </div>
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => setInput(s)} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200">
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input" placeholder="Type a customer message…" value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") void send(); }}
              />
              <button type="button" className="btn-primary shrink-0 !px-5" onClick={() => void send()} disabled={sending}>
                {sending ? "…" : "Send"}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card card-pad">
            <h2 className="font-display text-lg font-bold text-ink-950">Exact payload sent</h2>
            <p className="mt-1 text-xs text-slate-500">
              Full transparency: this JSON is POSTed to /api/ai-test. No API key is ever
              included — the key (if set) lives server-side only.
            </p>
            <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-ink-950 p-4 text-[11px] leading-relaxed text-green-200">
              {payload || "Send a message to see the payload here."}
            </pre>
          </div>
          <div className="card card-pad mt-6">
            <h2 className="font-display text-base font-bold text-ink-950">Grounded in</h2>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>• {ws.services.length} services with USD prices</li>
              <li>• Hours: {ws.hours}</li>
              <li>• {ws.knowledgeDocs.length} knowledge docs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
