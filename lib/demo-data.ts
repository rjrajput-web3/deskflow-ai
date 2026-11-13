// DeskFlow AI — live demo data: fictional demo businesses, seed threads,
// keyword reply engine and the simulated n8n payload builder.
// Everything here is simulated demo content. All prices are in USD only.
//
// NAMING (2026-11-14, user order): the simulator uses exactly the business
// set the user named for the WhatsApp demo — Oakridge Dental Studio,
// Harborview Realty, Velour Salon & Spa, Kinetix Gear + Custom Business —
// so visitors see the same businesses here and on the full WhatsApp demo
// (deskflow-receptionist.vercel.app). The old BrightSmile / Harborview
// Hotel / Olive & Oak / Glow / Skyline / Apex / Everline set is retired;
// verticals that no longer exist in the simulator (hotels, restaurants,
// auto) live on only as marketing descriptions on /industries, with demo
// links pointing at /demo (default) instead.

export type MessageSender = "customer" | "business";
export type MessageKind = "text" | "booking" | "voice";

export type BookingDetails = {
  service: string;
  dateTime: string;
  amount: string;
  ref: string;
  /** Label shown on the booking card: "Date & time" (default), "Tour" or "Delivery slot". */
  label?: string;
};

export type ChatMessage = {
  id: string;
  sender: MessageSender;
  kind: MessageKind;
  text: string;
  time: string;
  /** Delivery ticks on customer messages: sent = single grey tick, read = double blue ticks. */
  status?: "sent" | "read";
  booking?: BookingDetails;
};

export type DemoService = { name: string; price: string };

export type DemoBusiness = {
  slug: string;
  name: string;
  industry: string;
  icon: string;
  tagline: string;
  hours: string;
  quickReplies: string[];
  services: DemoService[];
  seed: ChatMessage[];
};

function msg(
  id: string,
  sender: MessageSender,
  text: string,
  time: string,
  extra?: Partial<ChatMessage>,
): ChatMessage {
  return { id, sender, kind: "text", text, time, ...extra };
}

export const DEMO_BUSINESSES: DemoBusiness[] = [
  {
    slug: "dental",
    name: "Oakridge Dental Studio",
    industry: "Dental Clinics",
    icon: "🦷",
    tagline: "Gentle, modern dentistry — same-week appointments.",
    hours: "Mon–Sat, 10:00 AM – 8:00 PM (Sun closed)",
    quickReplies: [
      "How much is a cleaning?",
      "Book an appointment",
      "What are your hours?",
      "Talk to a human",
    ],
    services: [
      { name: "Teeth cleaning / scaling", price: "$120" },
      { name: "Consultation", price: "$40" },
      { name: "Tooth filling", price: "$150 – $310" },
      { name: "Root canal treatment", price: "$650 – $950" },
      { name: "Tooth extraction", price: "$100 – $250" },
      { name: "Teeth whitening", price: "$199" },
      { name: "Braces consultation", price: "$75" },
      { name: "Kids dental checkup", price: "$40" },
    ],
    seed: [
      msg("dental-1", "customer", "Hi! How much is a teeth cleaning?", "09:12"),
      msg(
        "dental-2",
        "business",
        "Hi there! A teeth cleaning / scaling is $120, and a consultation is $40. Would you like me to book you in?",
        "09:12",
      ),
      msg("dental-3", "customer", "Yes please — tomorrow morning if you have anything.", "09:13"),
      msg(
        "dental-4",
        "business",
        "You are booked in for tomorrow at 10:00 AM. I will send a reminder the evening before. Anything else I can help with?",
        "09:13",
      ),
    ],
  },
  {
    slug: "real-estate",
    name: "Harborview Realty",
    industry: "Real Estate",
    icon: "🏡",
    tagline: "Rentals and sales across the city — viewings daily.",
    hours: "Open every day, 10:00 AM – 7:00 PM",
    quickReplies: [
      "How much is the 2-bed apartment?",
      "Book a tour",
      "Do you offer home loans?",
      "Talk to a human",
    ],
    services: [
      { name: "2-bed luxury apartment", price: "$2,400/mo" },
      { name: "3-bed luxury apartment", price: "$3,800/mo" },
      { name: "Luxury villa", price: "$12,000/mo" },
      { name: "Residential lot", price: "$450,000" },
      { name: "1-bed apartment", price: "$1,850/mo" },
      { name: "Rental homes", price: "$2,200/mo onwards" },
    ],
    seed: [
      msg("real-estate-1", "customer", "Hi, how much is the 2-bed apartment per month?", "14:05"),
      msg(
        "real-estate-2",
        "business",
        "Hello! The 2-bed luxury apartment is $2,400 per month. A tour is free, and so is a valuation call. Would you like to book a tour?",
        "14:05",
      ),
      msg("real-estate-3", "customer", "Yes please, tomorrow if possible.", "14:06"),
      msg(
        "real-estate-4",
        "business",
        "Done — I have pencilled in a tour tomorrow at 11:00 AM. Our agent will meet you at the building entrance.",
        "14:06",
      ),
    ],
  },
  {
    slug: "salons",
    name: "Velour Salon & Spa",
    industry: "Salons",
    icon: "💇",
    tagline: "Skin, hair and colour — booked in seconds.",
    hours: "Tue–Sun, 10:00 AM – 8:00 PM (Mon closed)",
    quickReplies: [
      "How much is a Hydrafacial?",
      "Book an appointment",
      "What are your hours?",
      "Talk to a human",
    ],
    services: [
      { name: "Haircut + styling", price: "$65" },
      { name: "Hair color", price: "$120 onwards" },
      { name: "Signature Hydrafacial", price: "$95" },
      { name: "Bridal package", price: "$450" },
      { name: "Manicure + pedicure", price: "$70" },
      { name: "Head massage + spa", price: "$85" },
      { name: "Keratin treatment", price: "$220" },
    ],
    seed: [
      msg("salons-1", "customer", "Hi! How much is a Hydrafacial?", "11:40"),
      msg(
        "salons-2",
        "business",
        "Hi! Our signature Hydrafacial is $95. A haircut + styling is $65 and hair color starts at $120. Would you like to book a Hydrafacial?",
        "11:40",
      ),
      msg("salons-3", "customer", "Yes — do you have anything tomorrow afternoon?", "11:41"),
      msg(
        "salons-4",
        "business",
        "Yes, I can book you tomorrow at 3:00 PM for the Hydrafacial ($95). Shall I confirm that slot?",
        "11:41",
      ),
    ],
  },
  {
    slug: "online-stores",
    name: "Kinetix Gear",
    industry: "Online Stores",
    icon: "🛍️",
    tagline: "Everyday essentials, shipped fast — tracked at every step.",
    hours: "Support every day, 9:00 AM – 9:00 PM",
    quickReplies: [
      "Where is my order?",
      "How long is delivery?",
      "Do you take returns?",
      "Talk to a human",
    ],
    services: [
      { name: "Wireless headphones", price: "$79" },
      { name: "Smartwatch", price: "$129" },
      { name: "Running shoes", price: "$119" },
      { name: "Yoga mat", price: "$45" },
      { name: "Travel backpack", price: "$89" },
      { name: "Bluetooth speaker", price: "$59" },
      { name: "UV sunglasses", price: "$39" },
    ],
    seed: [
      msg("online-stores-1", "customer", "Hi! Where is my order #KX-8492?", "13:15"),
      msg(
        "online-stores-2",
        "business",
        "Hi there! Order #KX-8492 is out for delivery and should arrive today by 5:00 PM. Delivery is free above $50. Anything else I can help with?",
        "13:15",
      ),
      msg("online-stores-3", "customer", "Can I return something if it doesn't fit?", "13:16"),
      msg(
        "online-stores-4",
        "business",
        "Of course — returns are free within 7 days, no questions asked. I can start a return for you any time, just share the order number.",
        "13:16",
      ),
    ],
  },
  {
    slug: "custom",
    name: "Your Business",
    industry: "Custom Business",
    icon: "✨",
    tagline: "Any business, any services — the receptionist learns from your info.",
    hours: "Set your own hours when you configure the template",
    quickReplies: [
      "How does this work?",
      "What does it cost?",
      "Book a setup call",
      "Talk to a human",
    ],
    services: [
      { name: "Setup call", price: "Free" },
      { name: "Starter setup", price: "$49" },
      { name: "Monthly receptionist", price: "$19" },
    ],
    seed: [
      msg(
        "custom-1",
        "business",
        "Welcome! Tell me about your business — your services, prices and opening hours — and I will answer your customers for you, day and night.",
        "09:00",
      ),
      msg(
        "custom-2",
        "customer",
        "Hi! I run a small local business. Can this receptionist really work for me?",
        "09:01",
      ),
      msg(
        "custom-3",
        "business",
        "Yes — it works for any business. Add your services and prices once, connect WhatsApp, and it answers customers, books appointments and hands tricky chats to your team.",
        "09:01",
      ),
    ],
  },
];

export function getBusiness(slug: string): DemoBusiness {
  return DEMO_BUSINESSES.find((b) => b.slug === slug) ?? DEMO_BUSINESSES[0];
}

export function seedThreads(): Record<string, ChatMessage[]> {
  const out: Record<string, ChatMessage[]> = {};
  for (const b of DEMO_BUSINESSES) out[b.slug] = [...b.seed];
  return out;
}

/** Keyword reply engine, grounded in the active business's services, prices and hours.
 *  This is the LOCAL fallback for the /demo simulator — the live path is
 *  /api/demo-chat (deterministic engine → Gemini → Pollinations). */
export function generateReply(
  business: DemoBusiness,
  input: string,
): { text: string; booking?: BookingDetails } {
  const lower = input.toLowerCase().trim();
  const ref = `DF-${String(Math.floor(100000 + Math.random() * 900000))}`;

  const matchedService = business.services.find((s) => {
    const words = s.name.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
    return words.some((w) => lower.includes(w));
  });

  const serviceList = business.services.map((s) => `${s.name} — ${s.price}`).join(", ");

  if (/human|agent|staff|real person|someone real|person please/.test(lower)) {
    return {
      text: `Of course — I am passing this chat to a member of the team now, with the full conversation history. They usually reply within a few minutes during opening hours (${business.hours}). Is there anything else I can help with meanwhile?`,
    };
  }

  if (/book|appointment|reserve|schedule|slot|viewing|tour|table|room for|book my|book a|book an/.test(lower)) {
    const service = matchedService ?? business.services[0];
    // Real estate books free tours (the property price is shown, not charged).
    if (business.slug === "real-estate") {
      return {
        text: `Done — I have provisionally booked a tour for the ${service.name} for tomorrow at 11:00 AM. The tour is free — the property is ${service.price}. Our agent will confirm shortly and share the location pin.`,
        booking: { service: `Tour — ${service.name}`, dateTime: "Tomorrow, 11:00 AM", amount: "Free tour", ref, label: "Tour" },
      };
    }
    // Online stores schedule a delivery slot for the product.
    if (business.slug === "online-stores") {
      return {
        text: `Done — I have scheduled a delivery slot for the ${service.name} (${service.price}) for tomorrow at 11:00 AM. Delivery is free above $50, and returns are free within 7 days.`,
        booking: { service: `Delivery — ${service.name}`, dateTime: "Tomorrow, 11:00 AM", amount: service.price, ref, label: "Delivery slot" },
      };
    }
    const dateTime = "Tomorrow, 10:00 AM";
    return {
      text: `Done — I have booked the ${service.name} for ${dateTime}. You will get a confirmation and a reminder before your slot.`,
      booking: { service: service.name, dateTime, amount: service.price, ref },
    };
  }

  if (/price|cost|how much|much is|much does|rate|charge|fee|quote/.test(lower)) {
    if (matchedService) {
      return {
        text: `The ${matchedService.name} is ${matchedService.price}. Would you like me to book it for you?`,
      };
    }
    return {
      text: `Here are our prices: ${serviceList}. Which one would you like to book?`,
    };
  }

  if (/hour|open|close|when are you|timing|what time/.test(lower)) {
    return {
      text: `Our hours are ${business.hours}. The AI receptionist answers messages at any hour, even when the team is away.`,
    };
  }

  if (/track|where is my order|order status|delivery status/.test(lower) && business.slug === "online-stores") {
    const mOrder = input.match(/#[A-Za-z]{2}-\d{4}/);
    const oid = mOrder ? mOrder[0] : "your order";
    return {
      text: `Order ${oid} is out for delivery and should reach you today before 5:00 PM. You will get a text when the courier is nearby. Anything else I can help with?`,
    };
  }

  if (/return|refund|exchange/.test(lower)) {
    return {
      text: "Returns are free within 7 days of delivery — no questions asked. Refunds go back to your original payment method within 2–3 working days. Want me to start a return for an order?",
    };
  }

  if (/loan|emi|finance/.test(lower) && business.slug === "real-estate") {
    return {
      text: "Yes — we work with major banks for home loans, with pre-approval in 24 hours. Share your budget and I will match the right properties.",
    };
  }

  if (/how long.*deliver|delivery time|shipping time/.test(lower) && business.slug === "online-stores") {
    return {
      text: "Delivery takes 2–5 days across the US, and it is free above $50. Your order is tracked at every step — share the order number and I will check it.",
    };
  }

  if (/cancel|reschedul|change my|move my/.test(lower)) {
    return {
      text: "No problem — I can move or cancel your booking free of charge. What new day and time works for you?",
    };
  }

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(lower)) {
    return {
      text: `Hello! Welcome to ${business.name}. ${serviceList}. How can I help you today?`,
    };
  }

  if (/how does this work|how it works|what is this|what does it cost/.test(lower)) {
    return {
      text: "It is simple: you add your services, prices and hours once, connect WhatsApp, and the AI receptionist answers customers, books appointments and hands tricky chats to your team. The self-hosted template is a one-time $9 purchase on Gumroad.",
    };
  }

  return {
    text: `Happy to help! At ${business.name} we offer: ${serviceList}. You can ask about a price, book an appointment, or ask for our opening hours — or tap a suggestion below.`,
  };
}

/** Simulated n8n webhook payload for a confirmed demo booking. */
export function buildN8nPayload(
  business: DemoBusiness,
  booking: BookingDetails,
  customerMessage: string,
) {
  return {
    event: "booking.confirmed",
    simulated: true,
    source: "deskflow-whatsapp-demo",
    workflow: { name: "DeskFlow WhatsApp Receptionist", nodes: 29 },
    business: { name: business.name, industry: business.industry },
    customer_message: customerMessage,
    booking: {
      ref: booking.ref,
      service: booking.service,
      date_time: booking.dateTime,
      amount_usd: booking.amount,
      status: "confirmed",
    },
    calendar: {
      provider: "google_calendar",
      event: `${booking.service} — ${business.name}`,
      start: booking.dateTime,
      reminder: "1 hour before",
    },
    timestamp: new Date().toISOString(),
  };
}

export type FlowStage = { stage: string; nodes: number; detail: string };

/** The 29-node n8n flow, grouped into stages. Node counts add up to 29. */
export const FLOW_STAGES: FlowStage[] = [
  { stage: "WhatsApp trigger & webhook", nodes: 3, detail: "WhatsApp webhook, signature check, message dedupe." },
  { stage: "Message parsing", nodes: 3, detail: "Normalize text, detect language, extract dates and intent." },
  { stage: "Business knowledge lookup", nodes: 3, detail: "Load services, prices, hours and policies for this business." },
  { stage: "AI receptionist reply", nodes: 4, detail: "Draft reply, fact-check against the knowledge base, tone check, send." },
  { stage: "Booking & calendar sync", nodes: 5, detail: "Check availability, create booking, Google Calendar event, confirmation message, reminder." },
  { stage: "Human handoff & escalation", nodes: 3, detail: "Detect handoff intent, notify staff, hand over full chat history." },
  { stage: "Lead CRM & follow-up", nodes: 4, detail: "Save lead, tag status, schedule follow-up, log outcome." },
  { stage: "Owner reports & analytics", nodes: 4, detail: "Daily summary, response-time stats, booking count, error alerts." },
];

export const VOICE_NOTE_TEXT = "Can I reschedule to 3:00 PM?";

/**
 * Voice-note reschedule — business-aware, and the reply and the booking card
 * always agree on the same time. Tours and deliveries move to tomorrow at
 * 3:00 PM, same as appointments.
 */
export function voiceNoteResponse(business: DemoBusiness): { text: string; booking: BookingDetails } {
  const ref = `DF-${String(Math.floor(100000 + Math.random() * 900000))}`;
  if (business.slug === "real-estate") {
    const service = business.services[0];
    return {
      text: "Done — I have moved your tour to tomorrow at 3:00 PM. The tour is free — our agent will confirm the new time shortly.",
      booking: {
        service: `Tour — ${service?.name ?? "2-bed luxury apartment"}`,
        dateTime: "Tomorrow, 3:00 PM",
        amount: "Free tour",
        ref,
        label: "Tour",
      },
    };
  }
  if (business.slug === "online-stores") {
    const service = business.services[0];
    return {
      text: "Done — I have moved your delivery slot to tomorrow at 3:00 PM. You will get a reminder one hour before.",
      booking: {
        service: `Delivery — ${service?.name ?? "Wireless headphones"}`,
        dateTime: "Tomorrow, 3:00 PM",
        amount: service?.price ?? "$79",
        ref,
        label: "Delivery slot",
      },
    };
  }
  const service = business.services[0];
  return {
    text: "Done — I have moved your booking to tomorrow at 3:00 PM. You will get a reminder one hour before.",
    booking: {
      service: service?.name ?? "Appointment",
      dateTime: "Tomorrow, 3:00 PM",
      amount: service?.price ?? "",
      ref,
    },
  };
}
