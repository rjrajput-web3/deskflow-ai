// DeskFlow AI — live demo data: fictional demo businesses, seed threads,
// keyword reply engine and the simulated n8n payload builder.
// Everything here is simulated demo content. All prices are in USD only.
import { INDUSTRIES } from "./site";

export type MessageSender = "customer" | "business";
export type MessageKind = "text" | "booking" | "voice";

export type BookingDetails = {
  service: string;
  dateTime: string;
  amount: string;
  ref: string;
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

function servicesFor(industrySlug: string): DemoService[] {
  const found = INDUSTRIES.find((i) => i.slug === industrySlug);
  return found ? found.sampleServices : [];
}

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
    name: "BrightSmile Dental Studio",
    industry: "Dental Clinics",
    icon: "🦷",
    tagline: "Gentle, modern dentistry — same-week appointments.",
    hours: "Mon–Sat, 9:00 AM – 6:00 PM",
    quickReplies: [
      "How much is a cleaning?",
      "Book an appointment",
      "What are your hours?",
      "Talk to a human",
    ],
    services: servicesFor("dental"),
    seed: [
      msg("dental-1", "customer", "Hi! How much is a teeth cleaning?", "09:12"),
      msg(
        "dental-2",
        "business",
        "Hi there! A teeth cleaning / scaling is $120, and a check-up + X-ray is $85. Would you like me to book you in?",
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
    slug: "hotels",
    name: "The Harborview Hotel",
    industry: "Hotels",
    icon: "🏨",
    tagline: "Waterfront stays with free breakfast and late check-out.",
    hours: "Front desk 24/7 — check-in from 3:00 PM, check-out by 11:00 AM",
    quickReplies: [
      "How much is a deluxe room?",
      "Book a room for this weekend",
      "What time is check-in?",
      "Talk to a human",
    ],
    services: servicesFor("hotels"),
    seed: [
      msg("hotels-1", "customer", "Hi, do you have a deluxe room free this weekend?", "10:02"),
      msg(
        "hotels-2",
        "business",
        "Hello! Yes — our deluxe room is $189 per night, and the suite is $329 per night. Both include breakfast. Shall I hold a deluxe room for you?",
        "10:02",
      ),
      msg("hotels-3", "customer", "What time is check-in?", "10:04"),
      msg(
        "hotels-4",
        "business",
        "Check-in is from 3:00 PM and check-out is by 11:00 AM. Our airport shuttle is $25 each way if you need one.",
        "10:04",
      ),
    ],
  },
  {
    slug: "restaurants",
    name: "Olive & Oak Bistro",
    industry: "Restaurants",
    icon: "🍽️",
    tagline: "Seasonal plates, local wines, and a sunny terrace.",
    hours: "Tue–Sun, 12:00 PM – 10:30 PM",
    quickReplies: [
      "Book a table for tonight",
      "How much is the tasting menu?",
      "Do you have vegan options?",
      "Talk to a human",
    ],
    services: servicesFor("restaurants"),
    seed: [
      msg("restaurants-1", "customer", "Hi! Can I book a table for 2 tonight?", "18:20"),
      msg(
        "restaurants-2",
        "business",
        "Of course! A table for 2 for dinner is free to reserve. Our chef's tasting menu is $65 per person — shall I book you for 7:00 PM tonight?",
        "18:20",
      ),
      msg("restaurants-3", "customer", "Yes, 7 PM works. Do you have vegan options?", "18:21"),
      msg(
        "restaurants-4",
        "business",
        "Perfect — table for 2 tonight at 7:00 PM is confirmed. Yes, we have a full vegan menu, just tell your server when you arrive.",
        "18:21",
      ),
    ],
  },
  {
    slug: "salons",
    name: "Glow Studio Salon",
    industry: "Salons",
    icon: "💇",
    tagline: "Skin, hair and colour — booked in seconds.",
    hours: "Tue–Sun, 10:00 AM – 8:00 PM",
    quickReplies: [
      "How much is a Hydrafacial?",
      "Book an appointment",
      "What are your hours?",
      "Talk to a human",
    ],
    services: servicesFor("salons"),
    seed: [
      msg("salons-1", "customer", "Hi! How much is a Hydrafacial?", "11:40"),
      msg(
        "salons-2",
        "business",
        "Hi! Our signature Hydrafacial is $95. A cut + blow-dry is $60 and balayage colour is $140. Would you like to book a Hydrafacial?",
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
    slug: "real-estate",
    name: "Skyline Property Group",
    industry: "Real Estate",
    icon: "🏡",
    tagline: "Rentals and sales across the city — viewings daily.",
    hours: "Mon–Sat, 9:00 AM – 7:00 PM",
    quickReplies: [
      "How much is the 2-bed apartment?",
      "Book a viewing",
      "Is a valuation call free?",
      "Talk to a human",
    ],
    services: servicesFor("real-estate"),
    seed: [
      msg("real-estate-1", "customer", "Hi, how much is the 2-bed apartment per month?", "14:05"),
      msg(
        "real-estate-2",
        "business",
        "Hello! The 2-bed apartment is $2,400 per month. A viewing tour is free, and so is a valuation call. Would you like to book a viewing?",
        "14:05",
      ),
      msg("real-estate-3", "customer", "Yes please, tomorrow if possible.", "14:06"),
      msg(
        "real-estate-4",
        "business",
        "Done — I have pencilled in a viewing tour tomorrow at 11:00 AM. Our agent will meet you at the building entrance.",
        "14:06",
      ),
    ],
  },
  {
    slug: "auto",
    name: "Apex Auto Care",
    industry: "Auto Services",
    icon: "🔧",
    tagline: "Honest pricing, same-day service on most jobs.",
    hours: "Mon–Sat, 8:00 AM – 6:00 PM",
    quickReplies: [
      "How much is a full service?",
      "Book my car in",
      "What are your hours?",
      "Talk to a human",
    ],
    services: servicesFor("auto"),
    seed: [
      msg("auto-1", "customer", "Hi! How much is a full service for my car?", "08:30"),
      msg(
        "auto-2",
        "business",
        "Hi! A full service + MOT check is $149. An oil change is $59 and brake pads replacement is $189. What would you like to book?",
        "08:30",
      ),
      msg("auto-3", "customer", "The full service, please. Any slots tomorrow?", "08:32"),
      msg(
        "auto-4",
        "business",
        "Yes — I can book the full service ($149) for tomorrow at 9:00 AM. Drop the car off any time from 8:30 AM.",
        "08:32",
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

/** Keyword reply engine, grounded in the active business's services, prices and hours. */
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

  if (/book|appointment|reserve|schedule|slot|viewing|table|room for|book my|book a|book an/.test(lower)) {
    const service = matchedService ?? business.services[0];
    const dateTime =
      business.slug === "restaurants" ? "Tonight, 7:00 PM" : "Tomorrow, 10:00 AM";
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

  if (/vegan|vegetarian|menu|special|dish/.test(lower) && business.slug === "restaurants") {
    return {
      text: "Yes — we have a full vegan and vegetarian menu, including a vegan tasting menu. The chef's tasting menu is $65 per person. Shall I book a table?",
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
export const VOICE_NOTE_REPLY =
  "Done — I have moved your booking to tomorrow at 3:00 PM. You will get a reminder one hour before.";
