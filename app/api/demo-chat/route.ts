// POST /api/demo-chat — the /demo simulator's live AI path.
// Ported from the full WhatsApp demo's api/demo-chat.js (same reply chain,
// same business data, same grounded answers) so the SaaS simulator and the
// full demo answer identically.
//
// Reply chain (never fails the request — always HTTP 200):
//   1. deterministic intent engine grounded in the business's own data
//      (services, USD prices, hours, booking rules) — instant, no AI call.
//      Bookings are PROVISIONAL everywhere; closed days are refused with a
//      redirect to the next open day; reschedules keep the original service
//      + amount (they are a move, never a new booking); tours are free.
//   2. Gemini free tier, IF process.env.GEMINI_API_KEY is set
//      (gemini-2.5-flash, falls back to gemini-2.0-flash on 404).
//   3. Pollinations Text API (keyless) — the zero-key live AI.
//   4. smart local fallback — never a 500, never a raw error.
//
// POST { businessId, message, history?, customBusiness?, customerName?, bookings? }
// -> { reply, booking?, engine }
// booking: { service, dayLabel, dayOffset, time, amount, amountLabel?, extraRow?, reschedule? }
// The key is NEVER logged and NEVER included in any response.

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ServiceEntry = [keyword: string, label: string, price: string, detail?: string];

type Business = {
  id: string;
  name: string;
  type: string;
  phone: string;
  closedDay: number;
  openRanges: Array<[number, number]>;
  hoursText: string;
  address: string;
  bookingNoun: string;
  bookingVerb: string;
  notes?: string;
  services: ServiceEntry[];
  amounts: string[];
};

type BookingOut = {
  service: string;
  dayLabel: string;
  dayOffset: number;
  time: string;
  amount: string;
  amountLabel?: string;
  extraRow?: [string, string];
  reschedule?: boolean;
};

type CustomBusinessInput = {
  name?: string;
  type?: string;
  phone?: string;
  closedDay?: number;
  openRanges?: Array<[number, number]>;
  hoursText?: string;
  address?: string;
  services?: ServiceEntry[];
};

type HistoryItem = { role?: string; text?: string };

const TIME_RE = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i;
const DAY_WORDS = ["today", "tomorrow", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const BUSINESSES: Record<string, Business> = {
  dental: {
    id: "dental", name: "Oakridge Dental Studio", type: "Dental & Medical Clinic",
    phone: "+1 415 555 0132", closedDay: 0, openRanges: [[10, 20]],
    hoursText: "Monday to Saturday, 10:00 AM – 8:00 PM. Sunday is closed.",
    address: "1200 Oak Ridge Avenue, Suite 200. Dr. Emily Carter (DDS, 8 years) leads the clinic.",
    bookingNoun: "appointment", bookingVerb: "booked",
    notes: "Insurance: we accept most major dental insurance plans; coverage is verified before the visit. Payment: cards, cash, bank transfer; no advance needed. Parking: free parking right outside.",
    services: [
      ["cleaning", "Teeth cleaning / scaling", "$120"],
      ["scaling", "Teeth cleaning / scaling", "$120"],
      ["consultation", "Consultation", "$40"],
      ["consult", "Consultation", "$40"],
      ["filling", "Tooth filling", "$150 – $310"],
      ["root canal", "Root canal treatment", "$650 – $950"],
      ["extraction", "Tooth extraction", "$100 – $250"],
      ["whitening", "Teeth whitening", "$199"],
      ["braces", "Braces consultation", "$75"],
      ["kids", "Kids dental checkup", "$40"],
    ],
    amounts: ["$40", "$120", "$150", "$310", "$650", "$950", "$100", "$250", "$199", "$75"],
  },
  realestate: {
    id: "realestate", name: "Harborview Realty", type: "Real Estate Agency",
    phone: "+1 212 555 0184", closedDay: -1, openRanges: [[10, 19]],
    hoursText: "Open every day, 10:00 AM – 7:00 PM.",
    address: "88 Harbor Boulevard, Suite 400. Licensed brokerage — CA DRE #01998877.",
    bookingNoun: "tour", bookingVerb: "booked",
    notes: "Home loans: we work with major banks, pre-approval in 24 hours. Viewings run 7 days a week with an agent.",
    services: [
      ["2bhk", "2-bed luxury apartment", "$2,400/mo"],
      ["2 bhk", "2-bed luxury apartment", "$2,400/mo"],
      ["2bed", "2-bed luxury apartment", "$2,400/mo"],
      ["2 bed", "2-bed luxury apartment", "$2,400/mo"],
      ["2-bed", "2-bed luxury apartment", "$2,400/mo"],
      ["3bhk", "3-bed luxury apartment", "$3,800/mo"],
      ["3 bhk", "3-bed luxury apartment", "$3,800/mo"],
      ["3bed", "3-bed luxury apartment", "$3,800/mo"],
      ["3 bed", "3-bed luxury apartment", "$3,800/mo"],
      ["3-bed", "3-bed luxury apartment", "$3,800/mo"],
      ["villa", "Luxury villa", "$12,000/mo"],
      ["lot", "Residential lot", "$450,000"],
      ["1bhk", "1-bed apartment", "$1,850/mo"],
      ["1 bhk", "1-bed apartment", "$1,850/mo"],
      ["1bed", "1-bed apartment", "$1,850/mo"],
      ["1 bed", "1-bed apartment", "$1,850/mo"],
      ["1-bed", "1-bed apartment", "$1,850/mo"],
      ["rent", "Rental homes", "$2,200/mo onwards"],
      ["rental", "Rental homes", "$2,200/mo onwards"],
    ],
    amounts: ["$2,400/mo", "$3,800/mo", "$12,000/mo", "$450,000", "$1,850/mo", "$2,200/mo"],
  },
  salon: {
    id: "salon", name: "Velour Salon & Spa", type: "Salon & Wellness Spa",
    phone: "+1 310 555 0176", closedDay: 1, openRanges: [[10, 20]],
    hoursText: "Tuesday to Sunday, 10:00 AM – 8:00 PM. Monday is closed.",
    address: "45 Rosewater Lane, Beverly Hills.",
    bookingNoun: "salon slot", bookingVerb: "booked",
    notes: "Payment: cards, cash, bank transfer. Cancellation is free up to 24 hours before the slot.",
    services: [
      ["haircut", "Haircut + styling", "$65"],
      ["hair color", "Hair color", "$120 onwards"],
      ["hair colour", "Hair color", "$120 onwards"],
      ["colour", "Hair color", "$120 onwards"],
      ["color", "Hair color", "$120 onwards"],
      ["facial", "Signature Hydrafacial", "$95"],
      ["hydrafacial", "Signature Hydrafacial", "$95"],
      ["bridal", "Bridal package", "$450", "professional bridal makeup, hair styling, a trial session, false lashes, and draping assistance — about 3 hours with our senior artist"],
      ["manicure", "Manicure + pedicure", "$70"],
      ["pedicure", "Manicure + pedicure", "$70"],
      ["spa", "Head massage + spa", "$85"],
      ["massage", "Head massage + spa", "$85"],
      ["keratin", "Keratin treatment", "$220"],
    ],
    amounts: ["$65", "$120", "$95", "$450", "$70", "$85", "$220"],
  },
  ecommerce: {
    id: "ecommerce", name: "Kinetix Gear", type: "E-Commerce & D2C Store",
    phone: "+1 800 555 0142", closedDay: -1, openRanges: [[9, 21]],
    hoursText: "Support is available every day, 9:00 AM – 9:00 PM.",
    address: "Kinetix Gear online store — ships across the US in 2–5 days. Free delivery above $50.",
    bookingNoun: "delivery slot", bookingVerb: "scheduled",
    notes: "Returns: free within 7 days of delivery. Delivery: free above $50, 2–5 days across the US.",
    services: [
      ["headphones", "Wireless headphones", "$79"],
      ["watch", "Smartwatch", "$129"],
      ["shoes", "Running shoes", "$119"],
      ["sneakers", "Running shoes", "$119"],
      ["yoga", "Yoga mat", "$45"],
      ["mat", "Yoga mat", "$45"],
      ["backpack", "Travel backpack", "$89"],
      ["speaker", "Bluetooth speaker", "$59"],
      ["sunglasses", "UV sunglasses", "$39"],
    ],
    amounts: ["$79", "$129", "$119", "$45", "$89", "$59", "$39"],
  },
};

const ALIASES: Record<string, string> = {
  oakridge: "dental",
  harborview: "realestate",
  velour: "salon",
  kinetix: "ecommerce",
  // SaaS simulator slugs -> demo-chat ids.
  "real-estate": "realestate",
  salons: "salon",
  "online-stores": "ecommerce",
};

function resolveBusiness(businessId: unknown, customBusiness: unknown): Business {
  const id = String(businessId || "dental").toLowerCase().trim();
  if (id === "custom" && customBusiness && typeof customBusiness === "object") {
    const cb = customBusiness as CustomBusinessInput;
    if (cb.name) {
      const services = Array.isArray(cb.services) ? cb.services : [];
      const amounts: string[] = [];
      services.forEach((s) => {
        const m = String(s[2] || "").match(/\$\s?[\d,]+/);
        if (m && !amounts.includes(m[0])) amounts.push(m[0]);
      });
      return {
        id: "custom", name: String(cb.name).slice(0, 40),
        type: String(cb.type || "Business"),
        phone: String(cb.phone || ""),
        closedDay: typeof cb.closedDay === "number" ? cb.closedDay : 0,
        openRanges: Array.isArray(cb.openRanges) ? cb.openRanges : [[10, 20]],
        hoursText: String(cb.hoursText || "Monday to Saturday, 10:00 AM – 8:00 PM."),
        address: String(cb.address || ""),
        bookingNoun: "appointment", bookingVerb: "booked",
        services, amounts,
      };
    }
  }
  if (BUSINESSES[id]) return BUSINESSES[id];
  if (ALIASES[id]) return BUSINESSES[ALIASES[id]];
  const byName = Object.keys(BUSINESSES).find((k) => BUSINESSES[k].name.toLowerCase().includes(id));
  return byName ? BUSINESSES[byName] : BUSINESSES.dental;
}

/* ---------- deterministic intent engine (grounded, no AI) ---------- */

function findService(biz: Business, t: string): ServiceEntry | null {
  let best: ServiceEntry | null = null;
  for (const sv of biz.services) {
    if (t.includes(sv[0]) && (!best || sv[0].length > best[0].length)) best = sv;
  }
  return best;
}

function findDay(t: string): string | null {
  for (const w of DAY_WORDS) if (new RegExp(`\\b${w}\\b`).test(t)) return w;
  return null;
}

function dayOffsetFor(word: string): number {
  const w = String(word || "").toLowerCase();
  if (w === "today") return 0;
  if (w === "tomorrow") return 1;
  const target = DAY_WORDS.indexOf(w);
  if (target < 0) return 1;
  const jsDay = target === 8 ? 0 : target - 1;
  return (jsDay - new Date().getDay() + 7) % 7; /* same-day word = today (offset 0) */
}

function labelFor(off: number): string {
  return off === 0 ? "Today" : off === 1 ? "Tomorrow" : DAYS[(new Date().getDay() + off) % 7];
}

function isClosedDay(biz: Business, off: number): boolean {
  if (!(biz.closedDay >= 0)) return false;
  const d = new Date();
  d.setDate(d.getDate() + off);
  return d.getDay() === biz.closedDay;
}

function openDayOptions(biz: Business): string[] {
  const out: string[] = [];
  let o = 0;
  while (out.length < 2 && o < 7) {
    if (!isClosedDay(biz, o)) out.push(labelFor(o));
    o++;
  }
  return out.length ? out : ["Today", "Tomorrow"];
}

function closedDayReply(biz: Business, off: number): string {
  const d = new Date();
  d.setDate(d.getDate() + off);
  const dn = DAYS[d.getDay()];
  return `We're closed on ${dn}s — how about ${openDayOptions(biz).join(" or ")} instead? We're open ${biz.hoursText}`;
}

function inHours(biz: Business, h24: number): boolean {
  return biz.openRanges.some(([from, to]) => h24 >= from && h24 < to);
}

function normTime(biz: Business, m: RegExpExecArray): string | "closed" | null {
  const hh = parseInt(m[1], 10);
  if (hh < 1 || hh > 12) return null;
  const ap = m[3].toUpperCase();
  const h24 = ap === "PM" && hh !== 12 ? hh + 12 : ap === "AM" && hh === 12 ? 0 : hh;
  if (!inHours(biz, h24)) return "closed";
  return `${hh}:${m[2] || "00"} ${ap}`;
}

function capDay(w: string): string {
  return w === "today" ? "Today" : w === "tomorrow" ? "Tomorrow" : w.charAt(0).toUpperCase() + w.slice(1);
}

function greetPrefixFor(t: string): string {
  return /(how are you|how's it going|hows it going|what's up|whats up|how are u|how r u)/.test(t)
    ? "I'm doing great, thanks for asking! "
    : "";
}

function priceVerb(service: string): string {
  return /s$/i.test(String(service).trim()) ? "cost" : "costs";
}

function serviceLabel(biz: Business, sv: ServiceEntry): string {
  if (biz.id === "realestate") return `Tour — ${sv[1]}`;
  if (biz.id === "ecommerce") return `Delivery — ${sv[1]}`;
  return sv[1];
}

function nameAsk(customerName: string): string {
  return customerName ? "" : " May I have your name for the booking?";
}

type Ctx = { customerName: string; bookings: BookingOut[] };

function deterministic(
  biz: Business,
  text: string,
  ctx: Ctx,
): { text: string; booking?: BookingOut } | null {
  const t = ` ${text.toLowerCase()} `;
  const greet = greetPrefixFor(t);
  const customerName = ctx.customerName || "";
  const bookIntent = /(book|appointment|slot|tour|schedule|visit|reserve|deliver)/.test(t);

  if (/(severe pain|bleeding|swelling|emergency|tooth broke|accident)/.test(t)) {
    return { text: `I'm sorry to hear that. Please call us directly on ${biz.phone} right away so our team can help you immediately.` };
  }

  if (/reschedul|move (my|the|this|our)/.test(t)) {
    const d2 = findDay(t);
    const m2 = TIME_RE.exec(t);
    const current = ctx.bookings.length ? ctx.bookings[ctx.bookings.length - 1] : null;
    if (!current) {
      return { text: `${greet}You don't have a booking with us yet — would you like to make one? Just tell me the service, day and time.` };
    }
    if (!d2 && !m2) {
      return { text: `${greet}No problem — which day and time should I move your ${current.service} to?` };
    }
    const off2 = d2 ? dayOffsetFor(d2) : current.dayOffset;
    if (isClosedDay(biz, off2)) return { text: greet + closedDayReply(biz, off2) };
    if (m2) {
      const nt2 = normTime(biz, m2);
      if (nt2 === "closed") {
        return { text: `${greet}That time is outside our hours — we're open ${biz.hoursText} Would another slot work, like tomorrow at 11 AM?` };
      }
      if (nt2 === null) return { text: `${greet}What time would suit you? We're open ${biz.hoursText}` };
      const lbl2 = labelFor(off2);
      return {
        text: `${greet}Done — I've provisionally moved your ${current.service} to ${lbl2} at ${nt2}${current.amount ? ` (${current.amount})` : ""}. Our staff will confirm the new time shortly.`,
        booking: { service: current.service, dayLabel: lbl2, dayOffset: off2, time: nt2, amount: current.amount || "", reschedule: true },
      };
    }
    const lbl2b = labelFor(off2);
    return {
      text: `${greet}Done — I've provisionally moved your ${current.service} to ${lbl2b} at ${current.time || ""}${current.amount ? ` (${current.amount})` : ""}. Our staff will confirm the new time shortly.`,
      booking: { service: current.service, dayLabel: lbl2b, dayOffset: off2, time: current.time || "", amount: current.amount || "", reschedule: true },
    };
  }

  if (bookIntent) {
    const svc = findService(biz, t);
    const day = findDay(t);
    const m = TIME_RE.exec(t);
    if (day) {
      const off = dayOffsetFor(day);
      if (isClosedDay(biz, off)) return { text: greet + closedDayReply(biz, off) };
    }
    if (svc && day && m) {
      const nt = normTime(biz, m);
      if (nt === "closed") {
        return { text: `${greet}That time is outside our hours — we're open ${biz.hoursText} Would another slot work, like tomorrow at 11 AM?` };
      }
      if (nt === null) {
        return { text: `${greet}What time would suit you? We're open ${biz.hoursText}` };
      }
      const offB = dayOffsetFor(day);
      const label = capDay(day);
      const bk: BookingOut = { service: serviceLabel(biz, svc), dayLabel: label, dayOffset: offB, time: nt, amount: svc[2] };
      if (biz.id === "realestate") {
        bk.amountLabel = "Free tour";
        bk.extraRow = ["Property price", svc[2]];
      }
      let reply: string;
      if (biz.id === "realestate") {
        reply = `Done — I've provisionally booked a tour for a ${svc[1]} for ${label} at ${nt}. The tour is free — the property rents at ${svc[2]}. Our agent will confirm shortly and share the location pin.`;
      } else if (biz.id === "ecommerce") {
        reply = `Done — I've scheduled a delivery slot for ${svc[1]} (${svc[2]}) for ${label} at ${nt}. Delivery is free, and returns are free within 7 days.`;
      } else {
        reply = `Done — I've provisionally booked ${svc[1]} for ${label} at ${nt} (${svc[2]}). Our team will confirm shortly.${biz.id === "dental" || biz.id === "salon" ? " Please arrive 10 minutes early." : ""}`;
      }
      return { text: greet + reply + nameAsk(customerName), booking: bk };
    }
    if (svc && day) {
      return { text: `${greet}${svc[1]} ${priceVerb(svc[1])} ${svc[2]}. What time on ${day} would suit you? We're open ${biz.hoursText}` };
    }
    if (svc && m) {
      return { text: `${greet}${svc[1]} ${priceVerb(svc[1])} ${svc[2]}. Which day would you like — today or tomorrow?` };
    }
    if (svc) {
      return { text: `${greet}${svc[1]} ${priceVerb(svc[1])} ${svc[2]}. Would you like to book a slot? Just tell me the day and time.` };
    }
    return { text: `${greet}Sure — which service is this for? We offer ${biz.services.slice(0, 6).map((s) => `${s[1]} ${s[2]}`).join(", ")}.` };
  }

  if (/(talk to| speak to| speak with| connect me| transfer me| real (person|human|agent)|human\b| real support)/.test(t)) {
    return { text: `${greet}Of course — I'll hand this chat over to the team at ${biz.name}. You can also reach them directly on ${biz.phone}. What's the best number to reach you on, and they'll pick this up right away?` };
  }

  if (/track|where is my order|order status|delivery status/.test(t)) {
    const mOrder = text.match(/#[A-Za-z]{2}-\d{4}/) || text.match(/order\s+#?([A-Za-z0-9-]{4,})/i);
    const oid = mOrder ? mOrder[1] || mOrder[0] : "your order";
    return { text: `${greet}Order ${oid} is out for delivery and should reach you today before 5:00 PM. You'll get a text when the courier is nearby. Anything else I can help with?` };
  }

  if (/return|refund|exchange/.test(t)) {
    return { text: `${greet}Returns are free within 7 days of delivery — no questions asked. Refunds go back to your original payment method within 2–3 working days. Want me to start a return for an order?` };
  }

  if (/loan|emi|finance/.test(t) && biz.id === "realestate") {
    return { text: `${greet}Yes — we work with major banks for home loans, with pre-approval in 24 hours. Share your budget and I'll match the right properties.` };
  }

  const svc2 = findService(biz, t);
  if (svc2 && /(price|cost|how much|rate|charges|fee|includ|what('| i)s in)/.test(t)) {
    const detail = svc2[3] ? ` It includes ${svc2[3]}.` : "";
    return { text: `${greet}${svc2[1]} ${priceVerb(svc2[1])} ${svc2[2]}.${detail} Would you like to book a slot? Just tell me the day and time.` };
  }

  if (/(open|timing|hours|when are you|closed|close)/.test(t)) {
    return { text: `${greet}We're open ${biz.hoursText}` };
  }

  if (/(price|cost|how much|charges|fees|rate|budget|under)/.test(t)) {
    const list = biz.services.slice(0, 6).map((s) => `${s[1]} ${s[2]}`).join(", ");
    return { text: `${greet}Here are our prices: ${list}. Which one did you have in mind?` };
  }

  if (/(where|address|location|reach|directions)/.test(t)) {
    return { text: greet + (biz.address || `You can find us at ${biz.name}. Call ${biz.phone} for directions.`) };
  }

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(t.trim()) || /how are you/.test(t)) {
    return { text: `${greet}Welcome to ${biz.name}! How can I help you today — prices, opening hours, or booking a slot?` };
  }

  if (/(thank you|thanks|thankyou|thx|great|awesome|perfect|nice|wonderful)/.test(t)) {
    return { text: "You're very welcome! Anything else I can help you with today?" };
  }

  return null;
}

/* ---------- conversational fallback (warm, human — never a brush-off) ---------- */

function conversational(biz: Business, text: string): string {
  const t = ` ${text.toLowerCase()} `;
  if (/(how are you|how's it going|hows it going|what's up|whats up|how are u|how r u)/.test(t)) {
    return "I'm doing great, thanks for asking! How can I help you today — prices, timings, or booking a slot?";
  }
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(t.trim())) {
    return `Hello! Welcome to ${biz.name}. Ask me about prices, timings, or book a slot — I'm here 24/7.`;
  }
  if (/(thank you|thanks|thankyou|thx|great|awesome|perfect|nice|wonderful)/.test(t)) {
    return "You're very welcome! Anything else I can help you with today?";
  }
  if (/insurance/.test(t) && biz.id === "dental") {
    return "Yes — we accept most major dental insurance plans, and we'll verify your coverage before your visit so there are no surprises. Which plan do you have?";
  }
  if (/(pay|payment|card|cash|deposit|upi|online payment)/.test(t)) {
    return "We accept cards, cash, and bank transfer — you can pay at the visit, no advance needed. Would you like to book a slot?";
  }
  if (/(parking|park my car|where.*park)/.test(t)) {
    return `Yes, there's free parking right outside ${biz.name} at ${biz.address} Anything else before you visit?`;
  }
  if (/(who are you|are you a robot|are you human|are you ai|are you real)/.test(t)) {
    return `I'm the AI receptionist for ${biz.name} — I answer instantly, day or night. For anything tricky, I pass you straight to our human team.`;
  }
  if (/(bye|goodbye|good night|see you)/.test(t)) {
    return "Thanks for chatting! Have a great day — and just message here anytime you need us.";
  }
  return "Let me confirm that detail for you — one moment, I'll check with our team and get right back to you here.";
}

/* ---------- AI providers ---------- */

function fetchWithTimeout(url: string, opts: RequestInit, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

function systemPrompt(biz: Business): string {
  const facts = biz.services.map((s) => `${s[1]}: ${s[2]}`).join("; ");
  return (
    `You are the WhatsApp receptionist for ${biz.name}, a ${biz.type}. ` +
    `Hours: ${biz.hoursText} Phone: ${biz.phone}. Address: ${biz.address} ` +
    `Services and prices: ${facts}. ` +
    (biz.notes ? `Extra facts: ${biz.notes} ` : "") +
    "Bookings are provisional until staff confirm. Reply in under 40 words, warm and human, WhatsApp style. " +
    "Never invent prices or facts not listed here. If asked something not covered, say you will check with the team."
  );
}

function priceOk(biz: Business, txt: string): boolean {
  const found = txt.match(/\$\s?[\d,]+(\.\d{2})?/g) || [];
  return found.every((x) => {
    const norm = x.replace(/\s/g, "");
    return biz.amounts.some((a) => a.replace(/\s/g, "").includes(norm));
  });
}

async function geminiReply(
  biz: Business,
  message: string,
  history: HistoryItem[],
  timeoutMs: number,
): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const sys = systemPrompt(biz);
  const contents = history.map((h) => ({
    role: h.role === "assistant" ? "model" : "user",
    parts: [{ text: String(h.text || "").slice(0, 500) }],
  }));
  contents.push({ role: "user", parts: [{ text: message }] });
  const models = ["gemini-2.5-flash", "gemini-2.0-flash"];
  for (const model of models) {
    try {
      const r = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: sys }] },
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 200 },
          }),
        },
        timeoutMs,
      );
      if (r.status === 404) continue;
      if (!r.ok) return null;
      const j = await r.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const txt = (j?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "").trim();
      if (!txt) return null;
      return txt.slice(0, 400);
    } catch {
      return null;
    }
  }
  return null;
}

async function pollinationsReply(biz: Business, message: string, timeoutMs: number): Promise<string | null> {
  const prompt = `${systemPrompt(biz)} Customer: ${message}`;
  try {
    const r = await fetchWithTimeout(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai-fast`,
      {},
      timeoutMs,
    );
    if (!r.ok) return null;
    const txt = ((await r.text()) || "").trim();
    if (!txt) return null;
    return txt.slice(0, 400);
  } catch {
    return null;
  }
}

/* ---------- handler ---------- */

export async function GET() {
  return NextResponse.json({ ok: true, engine: "demo-chat" });
}

export async function POST(req: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      body = {};
    }
    const message = String(body.message || "").trim().slice(0, 500);
    if (!message) {
      return NextResponse.json({ reply: "Hi there! How can I help you today?", engine: "local-fallback" });
    }
    const biz = resolveBusiness(body.businessId, body.customBusiness);
    const history = Array.isArray(body.history) ? (body.history as HistoryItem[]).slice(-6) : [];
    const ctx: Ctx = {
      customerName: String(body.customerName || ""),
      bookings: Array.isArray(body.bookings) ? (body.bookings as BookingOut[]) : [],
    };
    const deadline = Date.now() + 9500;

    const intent = deterministic(biz, message, ctx);
    if (intent) {
      const out: Record<string, unknown> = { reply: intent.text, engine: "deterministic" };
      if (intent.booking) out.booking = intent.booking;
      return NextResponse.json(out);
    }

    const g = await geminiReply(biz, message, history, 5000);
    if (g && priceOk(biz, g)) {
      return NextResponse.json({ reply: g, engine: "gemini" });
    }

    const remain = deadline - Date.now();
    if (remain > 1500) {
      const p = await pollinationsReply(biz, message, Math.min(9000, remain));
      if (p && priceOk(biz, p)) {
        return NextResponse.json({ reply: p, engine: "pollinations" });
      }
    }

    return NextResponse.json({ reply: conversational(biz, message), engine: "local-fallback" });
  } catch {
    return NextResponse.json({
      reply: "Let me confirm that detail for you — one moment, I'll check with our team and get right back to you here.",
      engine: "local-fallback",
    });
  }
}
