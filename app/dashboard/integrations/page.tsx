"use client";

import { useEffect, useState } from "react";

const N8N_KEY = "deskflow-demo-n8n-webhook";

/** Dashboard → Integrations: the real place to wire up webhooks and see
 *  connection status. Everything here is demo — nothing connects live yet. */
export default function DashboardIntegrationsPage() {
  const [n8nUrl, setN8nUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setN8nUrl(window.localStorage.getItem(N8N_KEY) ?? "");
    } catch {
      // ignore
    }
  }, []);

  const saveN8n = () => {
    try {
      window.localStorage.setItem(N8N_KEY, n8nUrl.trim());
    } catch {
      // ignore
    }
    setSaved(true);
  };

  const copyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/api/webhooks/whatsapp`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the URL is shown below to copy by hand
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo workspace — demo data</span>
        <h1 className="h-display mt-3 text-3xl">Integrations</h1>
        <p className="lead mt-2 text-base">
          Where DeskFlow AI connects to WhatsApp, your calendar and your own tools.
          Nothing here is connected live in this demo — statuses say so plainly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* WhatsApp webhook */}
        <div className="card card-pad">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">💬</span>
            <span className="badge-live">● Sandbox ready</span>
          </div>
          <h2 className="h-display mt-5 text-xl">Meta WhatsApp Cloud API</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            The official channel for your AI receptionist. Incoming WhatsApp messages
            arrive at this webhook endpoint — it verifies and logs them (try it from
            the Docs sandbox guide). Your own number connects through Meta onboarding
            after you sign up.
          </p>
          <p className="mt-4 break-all rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-semibold text-ink-950">Webhook URL: </span>
            /api/webhooks/whatsapp
          </p>
          <button type="button" className="btn-ghost mt-3 !px-4 !py-2 text-xs" onClick={() => void copyWebhook()}>
            {copied ? "✓ Copied" : "Copy webhook URL"}
          </button>
        </div>

        {/* Google Calendar */}
        <div className="card card-pad">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">📅</span>
            <span className="badge-demo">● Demo — not connected</span>
          </div>
          <h2 className="h-display mt-5 text-xl">Google Calendar</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Not connected in this demo. After onboarding, confirmed bookings are added
            to your Google Calendar automatically, with reminders attached. Until then,
            demo bookings are provisional and appear in the ⚡ Calendar &amp; n8n drawer
            on the live demo page.
          </p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-semibold text-ink-950">Status: </span>
            Not connected — set up after onboarding (Pro plan).
          </p>
        </div>

        {/* n8n webhooks */}
        <div className="card card-pad">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">🔗</span>
            <span className="badge-demo">● Demo — saved in this browser</span>
          </div>
          <h2 className="h-display mt-5 text-xl">n8n webhooks</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Paste your n8n webhook URL and DeskFlow AI forwards booking, lead and
            handoff events to it. In this demo the URL is saved in your browser only
            — no events are sent anywhere yet. The live demo drawer shows the exact
            payload that would be posted.
          </p>
          <label className="label mt-4" htmlFor="n8n-url">Your n8n webhook URL</label>
          <input
            id="n8n-url"
            className="input"
            placeholder="https://your-n8n.example.com/webhook/…"
            value={n8nUrl}
            onChange={(e) => { setN8nUrl(e.target.value); setSaved(false); }}
          />
          <button type="button" className="btn-primary mt-3 !px-5 !py-2.5 text-sm" onClick={saveN8n}>
            Save webhook URL
          </button>
          {saved && <span className="ml-3 text-sm font-semibold text-brand-700">✓ Saved in this browser (demo).</span>}
          <p className="mt-3 text-xs text-slate-500">
            Events forwarded when live: new lead, booking confirmed, booking cancelled,
            handoff requested.
          </p>
        </div>

        {/* Voice AI */}
        <div className="card card-pad">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">🎙️</span>
            <span className="badge-demo">● Roadmap — not live yet</span>
          </div>
          <h2 className="h-display mt-5 text-xl">Voice AI</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            A voice receptionist that answers calls, takes messages and books
            appointments — planned for a future release. It is not available today,
            and no plan includes it yet.
          </p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-semibold text-ink-950">Status: </span>
            Roadmap — join the waitlist to hear when it ships.
          </p>
        </div>
      </div>
    </div>
  );
}
