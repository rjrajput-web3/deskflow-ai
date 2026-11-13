"use client";

// WhatsApp connection status (Mode B): shows exactly one honest status —
// Not Connected / Sandbox / Connected / Error — fetched from
// /api/whatsapp-status, which derives it from server env config. Used on
// /integrations and /dashboard/integrations. Never presents the simulation
// as a live integration.

import { useEffect, useState } from "react";

type StatusKey = "not_connected" | "sandbox" | "connected" | "error";

type StatusResponse = {
  status: StatusKey;
  label: string;
  detail: string;
  hasVerifyToken: boolean;
  hasAccessToken: boolean;
  hasAppSecret: boolean;
  hasPhoneNumberId: boolean;
};

const BADGE: Record<StatusKey, string> = {
  not_connected: "badge-demo",
  sandbox: "badge-demo",
  connected: "badge-live",
  error: "inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700",
};

export default function WhatsAppStatus() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/whatsapp-status")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j: StatusResponse) => {
        if (!cancelled) setData(j);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <div>
        <span className={BADGE.error}>● Error</span>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          The connection status could not be checked just now. The webhook endpoint itself is a stub — nothing is
          connected to Meta until credentials are configured.
        </p>
      </div>
    );
  }

  if (!data) {
    return <span className="badge-demo">● Checking connection…</span>;
  }

  const configured: Array<[string, boolean]> = [
    ["Verify token", data.hasVerifyToken],
    ["Access token", data.hasAccessToken],
    ["App secret", data.hasAppSecret],
    ["Phone number id", data.hasPhoneNumberId],
  ];

  return (
    <div>
      <span className={BADGE[data.status]}>● {data.label}</span>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{data.detail}</p>
      <p className="mt-3 text-xs text-slate-500">
        Configured:{" "}
        {configured.map(([label, on]) => `${label} ${on ? "✓" : "—"}`).join(" · ")}
      </p>
    </div>
  );
}
