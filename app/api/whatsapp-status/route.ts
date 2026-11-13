// GET /api/whatsapp-status — honest Meta WhatsApp connection status.
// Derived ONLY from server env config; nothing is faked. Exactly one of:
//   Not Connected — no Meta credentials are configured at all. The webhook
//     endpoint exists as a stub, but nothing is connected to Meta.
//   Sandbox — a verify token is set (the endpoint can verify a challenge)
//     but no access token / app secret, so no messages flow.
//   Connected — access token + app secret are set AND a lightweight Graph
//     API check against the configured phone number id succeeds.
//   Error — credentials are set but the Graph API check fails (or a
//     required piece, e.g. the phone number id, is missing).
// Today no credentials exist, so the honest live state is Not Connected.
// The Graph API is only called when credentials exist.

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type StatusKey = "not_connected" | "sandbox" | "connected" | "error";

const LABELS: Record<StatusKey, string> = {
  not_connected: "Not Connected",
  sandbox: "Sandbox",
  connected: "Connected",
  error: "Error",
};

export async function GET() {
  const hasVerifyToken = Boolean(process.env.WHATSAPP_VERIFY_TOKEN);
  const hasAccessToken = Boolean(process.env.WHATSAPP_ACCESS_TOKEN);
  const hasAppSecret = Boolean(process.env.WHATSAPP_APP_SECRET);
  const hasPhoneNumberId = Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID);
  const hasAnything = hasVerifyToken || hasAccessToken || hasAppSecret || hasPhoneNumberId;

  let status: StatusKey;
  let detail: string;

  if (!hasAnything) {
    status = "not_connected";
    detail =
      "Nothing is connected to Meta. The webhook endpoint exists as a stub — it can verify a challenge once a verify token is set — but no Meta credentials are configured, so no WhatsApp messages flow.";
  } else if (hasAccessToken && hasAppSecret) {
    if (!hasPhoneNumberId) {
      status = "error";
      detail =
        "An access token and app secret are set, but no phone number id is configured, so the connection cannot be verified.";
    } else {
      // Lightweight Graph API check, only because credentials exist.
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}?fields=id,display_phone_number`,
          { headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` }, signal: ctrl.signal },
        ).finally(() => clearTimeout(timer));
        if (res.ok) {
          status = "connected";
          detail = "Connected to the Meta WhatsApp Cloud API — the phone number check passed.";
        } else {
          status = "error";
          detail = `Credentials are set, but the Meta Graph API check failed (HTTP ${res.status}). Check the access token and phone number id.`;
        }
      } catch {
        status = "error";
        detail = "Credentials are set, but the Meta Graph API check could not be reached. Check the access token and phone number id.";
      }
    }
  } else {
    status = "sandbox";
    detail =
      "Endpoint live, not connected. The webhook can verify a challenge with the configured verify token, but no access token or app secret is set, so no WhatsApp messages flow yet.";
  }

  return NextResponse.json({
    status,
    label: LABELS[status],
    detail,
    hasVerifyToken,
    hasAccessToken,
    hasAppSecret,
    hasPhoneNumberId,
    checkedAt: new Date().toISOString(),
  });
}
