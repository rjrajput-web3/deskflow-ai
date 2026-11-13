"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import {
  DEMO_BUSINESSES,
  FLOW_STAGES,
  VOICE_NOTE_REPLY,
  VOICE_NOTE_TEXT,
  buildN8nPayload,
  generateReply,
  getBusiness,
  seedThreads,
  type BookingDetails,
  type ChatMessage,
} from "@/lib/demo-data";

type BookedEvent = {
  business: string;
  booking: BookingDetails;
  payload: ReturnType<typeof buildN8nPayload>;
};

let idCounter = 1000;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function nowTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function lastPreview(messages: ChatMessage[]) {
  const last = messages[messages.length - 1];
  if (!last) return "";
  if (last.kind === "voice") return `Voice note — ${VOICE_NOTE_TEXT}`;
  if (last.kind === "booking" && last.booking)
    return `Booking confirmed: ${last.booking.service} (${last.booking.amount})`;
  return last.text;
}

export default function WhatsAppSimulator() {
  const [activeSlug, setActiveSlug] = useState("dental");
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>(() => seedThreads());
  const [unread, setUnread] = useState<Record<string, boolean>>(() => {
    const out: Record<string, boolean> = {};
    for (const b of DEMO_BUSINESSES) out[b.slug] = b.slug !== "dental";
    return out;
  });
  const [query, setQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [bookings, setBookings] = useState<BookedEvent[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [flowOpen, setFlowOpen] = useState(false);

  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = timers.current;
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, []);

  const business = getBusiness(activeSlug);
  const messages = threads[activeSlug] ?? [];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  function later(ms: number, fn: () => void) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function selectBusiness(slug: string) {
    setActiveSlug(slug);
    setUnread((prev) => ({ ...prev, [slug]: false }));
    setTyping(false);
  }

  function appendMessage(slug: string, message: ChatMessage) {
    setThreads((prev) => ({ ...prev, [slug]: [...(prev[slug] ?? []), message] }));
  }

  function scheduleReply(slug: string, userText: string) {
    const target = getBusiness(slug);
    setTyping(true);
    later(900, () => {
      const { text, booking } = generateReply(target, userText);
      setTyping(false);
      const reply: ChatMessage = {
        id: nextId("m"),
        sender: "business",
        kind: booking ? "booking" : "text",
        text,
        time: nowTime(),
        booking,
      };
      appendMessage(slug, reply);
      if (booking) {
        const payload = buildN8nPayload(target, booking, userText);
        setBookings((prev) => [...prev, { business: target.name, booking, payload }]);
      }
    });
  }

  function sendMessage(rawText: string) {
    const text = rawText.trim();
    if (!text || typing) return;
    const slug = activeSlug;
    const userMsg: ChatMessage = {
      id: nextId("m"),
      sender: "customer",
      kind: "text",
      text,
      time: nowTime(),
      status: "sent",
    };
    appendMessage(slug, userMsg);
    setInput("");
    // Single grey tick flips to double blue ticks after ~650ms.
    later(650, () => {
      setThreads((prev) => ({
        ...prev,
        [slug]: (prev[slug] ?? []).map((m) => (m.id === userMsg.id ? { ...m, status: "read" } : m)),
      }));
    });
    scheduleReply(slug, text);
  }

  function sendVoiceNote() {
    if (typing) return;
    const slug = activeSlug;
    const voiceMsg: ChatMessage = {
      id: nextId("m"),
      sender: "customer",
      kind: "voice",
      text: VOICE_NOTE_TEXT,
      time: nowTime(),
      status: "sent",
    };
    appendMessage(slug, voiceMsg);
    later(650, () => {
      setThreads((prev) => ({
        ...prev,
        [slug]: (prev[slug] ?? []).map((m) => (m.id === voiceMsg.id ? { ...m, status: "read" } : m)),
      }));
    });
    setTyping(true);
    later(1100, () => {
      setTyping(false);
      appendMessage(slug, {
        id: nextId("m"),
        sender: "business",
        kind: "text",
        text: VOICE_NOTE_REPLY,
        time: nowTime(),
      });
    });
  }

  function resetConversation() {
    setMenuOpen(false);
    const fresh = seedThreads();
    setThreads((prev) => ({ ...prev, [activeSlug]: fresh[activeSlug] }));
    setTyping(false);
  }

  const filtered = DEMO_BUSINESSES.filter((b) => {
    if (unreadOnly && !unread[b.slug]) return false;
    if (query.trim() && !b.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const latestPayload = bookings.length > 0 ? bookings[bookings.length - 1].payload : null;

  return (
    <div>
      {/* Industry pills — visible on all sizes, scrollable on mobile */}
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Choose an industry">
        {DEMO_BUSINESSES.map((b) => {
          const active = b.slug === activeSlug;
          return (
            <button
              key={b.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectBusiness(b.slug)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                  : "border-slate-300 bg-white text-ink-950 hover:border-ink-950"
              }`}
            >
              {b.icon} {b.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        {/* Business list — desktop */}
        <div className="card hidden overflow-hidden lg:block">
          <div className="border-b border-slate-200 p-4">
            <label className="label" htmlFor="demo-search">
              Search businesses
            </label>
            <input
              id="demo-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by business name…"
              className="input"
            />
            <button
              type="button"
              onClick={() => setUnreadOnly((v) => !v)}
              aria-pressed={unreadOnly}
              className={`mt-3 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                unreadOnly ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-ink-950"
              }`}
            >
              Unread only
            </button>
          </div>
          <ul className="divide-y divide-slate-100">
            {filtered.map((b) => {
              const thread = threads[b.slug] ?? [];
              const active = b.slug === activeSlug;
              return (
                <li key={b.slug}>
                  <button
                    type="button"
                    onClick={() => selectBusiness(b.slug)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      active ? "bg-brand-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xl" aria-hidden="true">
                      {b.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-ink-950">{b.name}</span>
                        <span className="shrink-0 text-xs text-slate-400">
                          {thread.length > 0 ? thread[thread.length - 1].time : ""}
                        </span>
                      </span>
                      <span className="block truncate text-xs text-slate-500">{lastPreview(thread)}</span>
                    </span>
                    {unread[b.slug] && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                        1
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-4 py-6 text-sm text-slate-500">No businesses match that search.</li>
            )}
          </ul>
        </div>

        {/* Phone column */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink-950 shadow-sm transition hover:border-ink-950"
          >
            <span aria-hidden="true">⚡</span> Calendar &amp; n8n
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
              {bookings.length} booking{bookings.length === 1 ? "" : "s"}
            </span>
          </button>

          {/* Phone */}
          <div className="w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-slate-300 bg-white shadow-xl shadow-slate-900/10">
            {/* Phone header */}
            <div className="flex items-center gap-3 bg-brand-700 px-4 py-3 text-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl" aria-hidden="true">
                {business.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{business.name}</p>
                <p className="text-xs text-white/80" aria-live="polite">
                  {typing ? "typing…" : "online — replies instantly (simulated)"}
                </p>
              </div>
              <div className="relative shrink-0">
                <button
                  type="button"
                  aria-label="Conversation options"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="rounded-full px-2 py-1 text-lg font-bold leading-none hover:bg-white/15"
                >
                  ⋮
                </button>
                {menuOpen && (
                  <div role="menu" className="absolute right-0 top-9 z-20 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white text-ink-950 shadow-xl">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={resetConversation}
                      className="block w-full px-4 py-3 text-left text-sm font-medium hover:bg-slate-50"
                    >
                      Reset Conversation
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        setFlowOpen(true);
                      }}
                      className="block w-full border-t border-slate-100 px-4 py-3 text-left text-sm font-medium hover:bg-slate-50"
                    >
                      View 29-Node n8n Flow
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Chat thread */}
            <div ref={scrollRef} className="h-[440px] space-y-3 overflow-y-auto bg-[#ECE5DD] px-3 py-4 sm:h-[480px]">
              <p className="mx-auto w-fit rounded-full bg-white/80 px-3 py-1 text-center text-[11px] font-medium text-slate-500 shadow-sm">
                Demo chat — simulated replies, no real messages are sent
              </p>
              {messages.map((m) => {
                const isCustomer = m.sender === "customer";
                return (
                  <div key={m.id} className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                        isCustomer
                          ? "rounded-br-sm bg-[#DCF8C6] text-ink-950"
                          : "rounded-bl-sm bg-white text-ink-950"
                      }`}
                    >
                      {m.kind === "voice" ? (
                        <span className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white" aria-hidden="true">
                            ▶
                          </span>
                          <span aria-hidden="true">🎤</span>
                          <span className="font-medium">0:04</span>
                          <span className="text-slate-400">▂▄▆▇▆▄▂</span>
                        </span>
                      ) : null}
                      {m.kind === "booking" && m.booking ? (
                        <span className="block">
                          <span className="block">{m.text}</span>
                          <span className="mt-2 block rounded-xl border border-brand-100 bg-brand-50 p-3 text-[13px]">
                            <span className="mb-1 flex items-center justify-between gap-2">
                              <span className="font-bold text-ink-950">Booking confirmed ✓</span>
                              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                Demo booking — provisional
                              </span>
                            </span>
                            <span className="block text-slate-600">Service: <span className="font-semibold text-ink-950">{m.booking.service}</span></span>
                            <span className="block text-slate-600">Date &amp; time: <span className="font-semibold text-ink-950">{m.booking.dateTime}</span></span>
                            <span className="block text-slate-600">Amount: <span className="font-semibold text-ink-950">{m.booking.amount}</span></span>
                            <span className="block text-xs text-slate-400">Ref: {m.booking.ref}</span>
                          </span>
                        </span>
                      ) : m.kind !== "voice" ? (
                        <span className="block">{m.text}</span>
                      ) : (
                        <span className="mt-1 block text-xs italic text-slate-500">“{m.text}”</span>
                      )}
                      <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                        {m.time}
                        {isCustomer && m.status === "sent" && <span aria-label="Sent">✓</span>}
                        {isCustomer && m.status === "read" && (
                          <span className="text-sky-500" aria-label="Read">✓✓</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-slate-500 shadow-sm" aria-live="polite">
                    <span className="animate-pulse">● ● ●</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies */}
            <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-slate-200 bg-white px-3 py-2">
              {business.quickReplies.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="shrink-0 rounded-full border border-brand-600/40 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Composer */}
            <form
              className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
            >
              <button
                type="button"
                onClick={sendVoiceNote}
                aria-label="Send a simulated voice note"
                title="Send a simulated voice note"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg text-white shadow transition hover:bg-brand-700"
              >
                🎤
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${business.name}…`}
                aria-label="Type a message"
                className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow transition hover:bg-brand-700"
              >
                ➤
              </button>
            </form>
          </div>

          <p className="mt-4 max-w-[420px] text-center text-sm text-slate-500">
            {business.tagline} Hours: {business.hours}. Prices shown are in USD.
          </p>
        </div>
      </div>

      {/* Calendar & n8n drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Calendar and n8n bookings">
          <button type="button" aria-label="Close bookings panel" onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-ink-950/50" />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="font-display text-lg font-bold text-ink-950">⚡ Calendar &amp; n8n</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close" className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold hover:border-ink-950">
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {bookings.length === 0 ? (
                <p className="text-sm leading-relaxed text-slate-600">
                  No bookings yet in this demo. Send a message like “Book an appointment” in the chat and the confirmed booking will appear here with its calendar event and n8n webhook payload.
                </p>
              ) : (
                <>
                  <h3 className="mb-2 text-sm font-bold text-ink-950">Booked calendar events ({bookings.length})</h3>
                  <ul className="space-y-2">
                    {bookings.map((b, i) => (
                      <li key={`${b.booking.ref}-${i}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                        <p className="font-semibold text-ink-950">{b.booking.service}</p>
                        <p className="text-slate-600">{b.business} — {b.booking.dateTime}</p>
                        <p className="text-slate-600">Amount: {b.booking.amount} · Ref: {b.booking.ref}</p>
                        <p className="text-xs font-semibold text-brand-700">Confirmed ✓ — Demo booking, provisional</p>
                      </li>
                    ))}
                  </ul>
                  {latestPayload && (
                    <>
                      <h3 className="mb-2 mt-5 text-sm font-bold text-ink-950">Live n8n webhook payload (latest booking)</h3>
                      <pre className="overflow-x-auto rounded-xl bg-ink-950 p-4 text-xs leading-relaxed text-green-300">
                        {JSON.stringify(latestPayload, null, 2)}
                      </pre>
                      <p className="mt-2 text-xs text-slate-500">
                        Simulated payload — in the real template this is posted to your n8n webhook on every confirmed booking.
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* 29-node n8n flow modal */}
      {flowOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="29-node n8n flow">
          <button type="button" aria-label="Close flow details" onClick={() => setFlowOpen(false)} className="absolute inset-0 bg-ink-950/50" />
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-ink-950">The 29-node n8n flow</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Every stage of the receptionist, automated end to end. Simulated overview — the full flow ships with the template.
                </p>
              </div>
              <button type="button" onClick={() => setFlowOpen(false)} aria-label="Close" className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold hover:border-ink-950">
                Close
              </button>
            </div>
            <ol className="mt-5 space-y-3">
              {FLOW_STAGES.map((stage, i) => (
                <li key={stage.stage} className="flex gap-3 rounded-xl border border-slate-200 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink-950">
                      {stage.stage} <span className="text-xs font-medium text-slate-500">· {stage.nodes} nodes</span>
                    </span>
                    <span className="block text-sm text-slate-600">{stage.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs font-semibold text-slate-500">Total: 29 nodes across 8 stages.</p>
            <a href={SITE.gumroadTemplate} target="_blank" rel="noreferrer" className="btn-accent mt-5 w-full">
              Get the $9 self-hosted template
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
