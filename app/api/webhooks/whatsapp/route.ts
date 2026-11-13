// WhatsApp webhook receiver (Meta Cloud API) — endpoint stub, hardened.
// HONEST STATE (2026-11-14): no Meta app is connected. This endpoint can
// verify a subscription challenge (when WHATSAPP_VERIFY_TOKEN is set) and
// log incoming payloads, but nothing is connected to Meta and no message
// is ever replied to here. Real handling (routing, AI reply) is a later phase.
//
// Security (audit #4 / Mode B):
// - NO public fallback verify token. Verification fails closed when
//   WHATSAPP_VERIFY_TOKEN is unset: any challenge is rejected with 403.
// - X-Hub-Signature-256 (HMAC-SHA256 over the raw body) is validated when
//   WHATSAPP_APP_SECRET is configured; a bad or missing signature is
//   rejected with 401. When no secret is configured the payload is
//   accepted and logged, and the response says signature_verified: false.
// - Duplicate-message protection: message ids are deduped in memory (a
//   serverless restart clears the set — noted, not hidden). Duplicates are
//   acknowledged without re-processing.
// - Malformed payloads never crash the handler: invalid JSON -> 400.
//
// Meta setup (later): in the Meta app dashboard set the callback URL to
// https://<your-domain>/api/webhooks/whatsapp and the verify token to the
// same value as WHATSAPP_VERIFY_TOKEN. Subscribe to the `messages` field.

import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory dedupe set (module scope). Serverless restarts clear it —
// acceptable for a stub; a durable store arrives with the real handler.
const seenMessageIds = new Set<string>();
const seenOrder: string[] = [];
const MAX_SEEN = 1000;

function rememberMessageId(id: string): boolean {
  if (seenMessageIds.has(id)) return false;
  seenMessageIds.add(id);
  seenOrder.push(id);
  if (seenOrder.length > MAX_SEEN) {
    const oldest = seenOrder.shift();
    if (oldest) seenMessageIds.delete(oldest);
  }
  return true;
}

function extractMessageIds(body: unknown): string[] {
  const ids: string[] = [];
  if (!body || typeof body !== "object") return ids;
  const entry = (body as { entry?: unknown }).entry;
  if (!Array.isArray(entry)) return ids;
  for (const e of entry) {
    if (!e || typeof e !== "object") continue;
    const changes = (e as { changes?: unknown }).changes;
    if (!Array.isArray(changes)) continue;
    for (const c of changes) {
      if (!c || typeof c !== "object") continue;
      const value = (c as { value?: unknown }).value;
      if (!value || typeof value !== "object") continue;
      const messages = (value as { messages?: unknown }).messages;
      if (!Array.isArray(messages)) continue;
      for (const m of messages) {
        if (m && typeof m === "object" && typeof (m as { id?: unknown }).id === "string") {
          ids.push((m as { id: string }).id);
        }
      }
    }
  }
  return ids;
}

function signatureIsValid(secret: string, rawBody: string, header: string | null): boolean {
  if (!header || !header.startsWith("sha256=")) return false;
  const expectedHex = header.slice("sha256=".length);
  let expected: Buffer;
  let actual: Buffer;
  try {
    expected = Buffer.from(expectedHex, "hex");
    actual = createHmac("sha256", secret).update(rawBody).digest();
  } catch {
    return false;
  }
  if (expected.length !== actual.length) return false;
  try {
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  // Fail closed: no token configured means no challenge is ever echoed.
  const expected = process.env.WHATSAPP_VERIFY_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: "Verification failed: no verify token is configured on this endpoint" },
      { status: 403 },
    );
  }
  if (mode === "subscribe" && token === expected && challenge) {
    return new Response(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: Request) {
  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ received: false, error: "Could not read request body" }, { status: 400 });
  }

  // Signature check (only when an app secret is configured).
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  let signatureVerified = false;
  if (appSecret) {
    const signature = req.headers.get("x-hub-signature-256");
    if (!signatureIsValid(appSecret, rawBody, signature)) {
      console.warn("[whatsapp-webhook] rejected: bad or missing X-Hub-Signature-256");
      return NextResponse.json({ received: false, error: "Invalid signature" }, { status: 401 });
    }
    signatureVerified = true;
  }

  let body: unknown;
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return NextResponse.json({ received: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Duplicate protection: acknowledge repeats without re-processing.
  const messageIds = extractMessageIds(body);
  const freshIds = messageIds.filter((id) => rememberMessageId(id));
  if (messageIds.length > 0 && freshIds.length === 0) {
    return NextResponse.json({ received: true, duplicate: true, signature_verified: signatureVerified });
  }

  // Demo stub only: log and acknowledge. Nothing is stored or replied to yet.
  if (!appSecret) {
    console.log(
      "[whatsapp-webhook] received payload (signature NOT verified — no WHATSAPP_APP_SECRET configured):",
      JSON.stringify(body).slice(0, 2000),
    );
  } else {
    console.log("[whatsapp-webhook] received payload:", JSON.stringify(body).slice(0, 2000));
  }
  return NextResponse.json({ received: true, signature_verified: signatureVerified });
}
