// WhatsApp webhook receiver (Meta Cloud API) — Sprint 2 demo stub.
// No real Meta credentials are wired in: verification uses
// WHATSAPP_VERIFY_TOKEN if set, otherwise the demo fallback "deskflow-demo".
// POST only logs the payload (console) and returns 200 { received: true }.
// Real handling (signature check, message routing, AI reply) is a later phase.
//
// Meta setup (later): in the Meta app dashboard set the callback URL to
// https://<your-domain>/api/webhooks/whatsapp and the verify token to the
// same value as WHATSAPP_VERIFY_TOKEN. Subscribe to the `messages` field.

import { NextResponse } from "next/server";

const FALLBACK_TOKEN = "deskflow-demo";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = process.env.WHATSAPP_VERIFY_TOKEN || FALLBACK_TOKEN;

  if (mode === "subscribe" && token === expected && challenge) {
    return new Response(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Demo only: log and acknowledge. Nothing is stored or replied to yet.
    console.log("[whatsapp-webhook] received payload:", JSON.stringify(body).slice(0, 2000));
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: false, error: "Invalid JSON" }, { status: 400 });
  }
}
