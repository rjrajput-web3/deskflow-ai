// POST /api/ai-test — Live AI Test Sandbox backend.
// Body: { message, services: [{name, price}], knowledge: string,
//         businessName?: string, hours?: string }
// If GEMINI_API_KEY is set server-side, calls Gemini (gemini-2.0-flash) and
// returns { reply, source: "live" }. Otherwise a keyword mock responder
// grounded in the provided services returns { reply, source: "mock" }.
// The key is NEVER logged and NEVER included in any response.

import { NextResponse } from "next/server";

type ServiceInput = { name: string; price: number | string };

// Prices arrive as "$120" strings from the dashboard store or as numbers —
// never print "$$120".
function fmtPrice(price: number | string): string {
  const raw = String(price).trim();
  return raw.startsWith("$") ? raw : `$${raw}`;
}

function mockReply(
  message: string,
  services: ServiceInput[],
  knowledge: string,
  businessName: string,
  hours: string,
): string {
  const msg = message.toLowerCase();
  const list = services.map((s) => `${s.name} — ${fmtPrice(s.price)}`).join("; ");

  const priceHit = services.find((s) => msg.includes(s.name.toLowerCase().split(" ")[0]) || msg.includes(s.name.toLowerCase()));
  if (/price|cost|much|charge|fee/.test(msg) && priceHit) {
    return `Our ${priceHit.name} is ${fmtPrice(priceHit.price)}. Would you like me to book a slot for you?`;
  }
  if (/price|cost|much|charge/.test(msg)) {
    return `Here are our prices: ${list}. Which service would you like to book?`;
  }
  if (/book|appointment|slot|schedule|reserve/.test(msg)) {
    return `Happy to help you book! Our services: ${list}. Which one would you like, and what day and time suit you?`;
  }
  if (/hour|open|close|when are you/.test(msg)) {
    return `We're open ${hours}. Is there a time that works for you?`;
  }
  if (/cancel|reschedul/.test(msg)) {
    return `No problem — cancellations are free up to 24 hours before your appointment. What is the booking under, and what would you like instead?`;
  }
  if (knowledge && /policy|refund|child|arrive|early/.test(msg)) {
    return `Based on our information: ${knowledge.slice(0, 300)} Let me know if you'd like to book.`;
  }
  return `Hi! Thanks for messaging ${businessName}. Our services: ${list}. We're open ${hours}. How can I help — a price, a booking, or something else?`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body?.message ?? "").trim();
    const services = Array.isArray(body?.services) ? (body.services as ServiceInput[]) : [];
    const knowledge = String(body?.knowledge ?? "");
    const businessName = String(body?.businessName ?? "our business");
    const hours = String(body?.hours ?? "Mon–Sat, 9 AM–6 PM");

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const serviceList = services.map((s) => `- ${s.name}: ${fmtPrice(s.price)}`).join("\n");
      const prompt = [
        `You are the AI receptionist for ${businessName}.`,
        `Opening hours: ${hours}.`,
        "Services and USD prices:",
        serviceList || "(no services provided)",
        "Business knowledge:",
        knowledge || "(none provided)",
        "",
        "Answer the customer briefly, helpfully and in a human tone. Offer to book when relevant. Never invent prices or services not listed above.",
        `Customer message: ${message}`,
      ].join("\n");
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
            }),
          },
        );
        if (!res.ok) {
          // Fall back to the mock responder rather than failing the demo.
          return NextResponse.json({
            reply: mockReply(message, services, knowledge, businessName, hours),
            source: "mock" as const,
            note: "Live Gemini call failed — mock responder used.",
          });
        }
        const data = await res.json();
        const reply =
          data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("")?.trim() ||
          "";
        if (!reply) {
          return NextResponse.json({
            reply: mockReply(message, services, knowledge, businessName, hours),
            source: "mock" as const,
            note: "Live Gemini returned no text — mock responder used.",
          });
        }
        return NextResponse.json({ reply, source: "live" as const });
      } catch {
        return NextResponse.json({
          reply: mockReply(message, services, knowledge, businessName, hours),
          source: "mock" as const,
          note: "Live Gemini unreachable — mock responder used.",
        });
      }
    }

    return NextResponse.json({
      reply: mockReply(message, services, knowledge, businessName, hours),
      source: "mock" as const,
      note: "No GEMINI_API_KEY set — mock responder used. Set the key server-side for live replies.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
