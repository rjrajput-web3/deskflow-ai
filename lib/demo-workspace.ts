// DeskFlow AI — Sprint 2 demo workspace seed data.
// ALL DATA IS FICTIONAL DEMO DATA. No real people, addresses or phone numbers.
// Demo emails use example.com on purpose. Real auth + billing arrive after
// the first sale; this workspace is an open demo with no login wall.

export type Service = { id: string; name: string; price: number };

export type KnowledgeDoc = {
  id: string;
  title: string;
  kind: "url" | "text" | "file";
  content: string;
  createdAt: string;
};

export type LeadStatus = "New" | "Contacted" | "Booked" | "Won" | "Lost";
export type Lead = {
  id: string;
  name: string;
  email: string;
  source: string;
  status: LeadStatus;
  value: number;
  notes: string;
  createdAt: string;
};

export type Appointment = {
  id: string;
  customer: string;
  service: string;
  date: string; // YYYY-MM-DD (local)
  time: string; // e.g. "10:30 AM"
  amount: number;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
};

export type ChatMessage = {
  id: string;
  from: "customer" | "ai" | "staff";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  customer: string;
  email: string;
  channel: "WhatsApp" | "Website chat";
  escalated: boolean;
  takenOver: boolean;
  unread: number;
  lastMessage: string;
  messages: ChatMessage[];
};

export type DayStat = {
  date: string;
  label: string;
  messages: number;
  leads: number;
  bookings: number;
};

export type Workspace = {
  businessName: string;
  tagline: string;
  services: Service[];
  hours: string;
  openTime: string;
  closeTime: string;
  daysOpen: string;
  escalationRules: string[];
  knowledgeDocs: KnowledgeDoc[];
  leads: Lead[];
  appointments: Appointment[];
  conversations: Conversation[];
  analytics: DayStat[];
};

export type Tenant = {
  id: string;
  business: string;
  owner: string;
  plan: string;
  repliesUsed: number;
  repliesLimit: number;
  status: "Active" | "Suspended" | "Trial";
  createdAt: string;
};

export type SystemLog = {
  id: string;
  time: string;
  event: string;
  detail: string;
  level: "info" | "success" | "warning";
};

export type RevenueMonth = { month: string; demoRevenue: number; workspaces: number };

function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return localISO(d);
}

function shortLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

const ANALYTICS_RAW: Array<[number, number, number]> = [
  [18, 2, 1], [24, 3, 2], [21, 1, 1], [29, 4, 2], [26, 2, 3],
  [31, 5, 2], [22, 2, 1], [35, 4, 3], [28, 3, 2], [33, 5, 4],
  [27, 2, 2], [38, 6, 3], [30, 3, 2], [34, 4, 3],
];

export function seedWorkspace(): Workspace {
  const analytics: DayStat[] = ANALYTICS_RAW.map(([messages, leads, bookings], i) => {
    const date = daysAgo(13 - i);
    return { date, label: shortLabel(date), messages, leads, bookings };
  });
  const today = daysAgo(0);
  const tuesday = daysAgo(-3);
  return {
    businessName: "BrightSmile Dental Studio",
    tagline: "Gentle, modern dentistry — same-week appointments.",
    services: [
      { id: "svc-cleaning", name: "Teeth cleaning / scaling", price: 120 },
      { id: "svc-checkup", name: "Check-up + X-ray", price: 85 },
      { id: "svc-whitening", name: "Whitening session", price: 199 },
    ],
    // Canonical hours — one source of truth, used everywhere on the site.
    hours: "Mon–Sat, 9:00 AM – 6:00 PM (Sun closed)",
    openTime: "9:00 AM",
    closeTime: "6:00 PM",
    daysOpen: "Mon–Sat",
    escalationRules: [
      "Escalate bookings over $500 to staff",
      "Escalate complaints immediately",
      "Escalate dental emergencies to staff within 5 minutes",
    ],
    knowledgeDocs: [
      {
        id: "doc-faq", title: "FAQs — prices, hours & policies", kind: "text",
        content: "Teeth cleaning is $120, check-up + X-ray is $85, whitening is $199. We are open Mon–Sat 9 AM–6 PM, closed Sundays. Same-week appointments are usually available. Please arrive 10 minutes early for your first visit. Cancellations are free up to 24 hours before the appointment.",
        createdAt: daysAgo(6),
      },
      {
        id: "doc-services", title: "Service list — brightsmiledental.example.com/services", kind: "url",
        content: "Source: https://brightsmiledental.example.com/services — Teeth cleaning / scaling $120 (45 min), Check-up + X-ray $85 (30 min), Whitening session $199 (60 min). All treatments by licensed dentists. Emergency slots held daily at 9 AM and 4 PM.",
        createdAt: daysAgo(5),
      },
      {
        id: "doc-policy", title: "Booking & cancellation policy", kind: "text",
        content: "Bookings are confirmed by WhatsApp message. A reminder goes out 24 hours before. No-show fee $25 after two missed appointments. Children under 12 must be accompanied by an adult.",
        createdAt: daysAgo(4),
      },
    ],
    leads: [
      { id: "lead-1", name: "Alex Morgan", email: "alex.morgan@example.com", source: "WhatsApp", status: "Booked", value: 120, notes: "Asked about cleaning; booked for this week.", createdAt: daysAgo(2) },
      { id: "lead-2", name: "Priya Sharma", email: "priya.sharma@example.com", source: "Website chat", status: "Contacted", value: 199, notes: "Interested in whitening before a wedding.", createdAt: daysAgo(1) },
      { id: "lead-3", name: "Jordan Lee", email: "jordan.lee@example.com", source: "WhatsApp", status: "New", value: 85, notes: "Asked for check-up prices.", createdAt: daysAgo(0) },
      { id: "lead-4", name: "Sam Carter", email: "sam.carter@example.com", source: "WhatsApp", status: "Won", value: 199, notes: "Whitening completed, very happy.", createdAt: daysAgo(3) },
      { id: "lead-5", name: "Nina Patel", email: "nina.patel@example.com", source: "Website chat", status: "Lost", value: 85, notes: "Chose a clinic closer to home.", createdAt: daysAgo(5) },
    ],
    appointments: [
      // All inside opening hours (Mon–Sat 9 AM–6 PM, Sun closed). Today is
      // Saturday, so nothing is seeded on Sunday.
      { id: "appt-1", customer: "Alex Morgan", service: "Teeth cleaning / scaling", date: today, time: "10:30 AM", amount: 120, status: "Confirmed" },
      { id: "appt-2", customer: "Priya Sharma", service: "Whitening session", date: today, time: "2:00 PM", amount: 199, status: "Confirmed" },
      { id: "appt-3", customer: "Jordan Lee", service: "Check-up + X-ray", date: today, time: "4:30 PM", amount: 85, status: "Pending" },
      { id: "appt-4", customer: "Sam Carter", service: "Whitening session", date: today, time: "11:00 AM", amount: 199, status: "Confirmed" },
      { id: "appt-5", customer: "Alex Morgan", service: "Check-up + X-ray", date: tuesday, time: "9:00 AM", amount: 85, status: "Confirmed" },
    ],
    conversations: [
      {
        id: "conv-1", customer: "Alex Morgan", email: "alex.morgan@example.com",
        channel: "WhatsApp", escalated: false, takenOver: false, unread: 0,
        lastMessage: "Great, see you Thursday at 10:30!",
        messages: [
          { id: "m1", from: "customer", text: "Hi! How much is a teeth cleaning?", time: "9:02 AM" },
          { id: "m2", from: "ai", text: "Hi Alex! A teeth cleaning / scaling is $120 and takes about 45 minutes. Would you like to book a slot this week?", time: "9:02 AM" },
          { id: "m3", from: "customer", text: "Yes please, Thursday morning if you have anything.", time: "9:05 AM" },
          { id: "m4", from: "ai", text: "Thursday at 10:30 AM is free. I've pencilled you in for a cleaning ($120). I'll send a reminder the day before — does that work?", time: "9:05 AM" },
          { id: "m5", from: "customer", text: "Great, see you Thursday at 10:30!", time: "9:07 AM" },
        ],
      },
      {
        id: "conv-2", customer: "Priya Sharma", email: "priya.sharma@example.com",
        channel: "Website chat", escalated: false, takenOver: false, unread: 1,
        lastMessage: "Is whitening safe for sensitive teeth?",
        messages: [
          { id: "m1", from: "customer", text: "Hi, I'm getting married next month — is whitening safe for sensitive teeth?", time: "11:40 AM" },
          { id: "m2", from: "ai", text: "Hi Priya, congratulations! Our whitening session is $199 (60 min) and we use a gentle formula — many guests with sensitive teeth do fine, and the dentist checks first. Would you like me to book a consultation?", time: "11:40 AM" },
          { id: "m3", from: "customer", text: "Is whitening safe for sensitive teeth?", time: "11:44 AM" },
        ],
      },
      {
        id: "conv-3", customer: "Jordan Lee", email: "jordan.lee@example.com",
        channel: "WhatsApp", escalated: true, takenOver: false, unread: 2,
        lastMessage: "This is urgent — I'm in a lot of pain.",
        messages: [
          { id: "m1", from: "customer", text: "Hi, do you have any appointments today?", time: "8:15 AM" },
          { id: "m2", from: "ai", text: "Hi Jordan! We open at 9 AM. A check-up + X-ray is $85. What time works for you today?", time: "8:15 AM" },
          { id: "m3", from: "customer", text: "This is urgent — I'm in a lot of pain.", time: "8:20 AM" },
        ],
      },
      {
        id: "conv-4", customer: "Sam Carter", email: "sam.carter@example.com",
        channel: "WhatsApp", escalated: false, takenOver: true, unread: 0,
        lastMessage: "Thanks, the whitening looks great!",
        messages: [
          { id: "m1", from: "customer", text: "Can I reschedule my whitening to tomorrow?", time: "Yesterday" },
          { id: "m2", from: "ai", text: "Of course — tomorrow at 11:00 AM is free for whitening ($199). Shall I move you there?", time: "Yesterday" },
          { id: "m3", from: "customer", text: "Yes please.", time: "Yesterday" },
          { id: "m4", from: "staff", text: "Done — moved to tomorrow 11:00 AM, Sam. See you then!", time: "Yesterday" },
          { id: "m5", from: "customer", text: "Thanks, the whitening looks great!", time: "Yesterday" },
        ],
      },
    ],
    analytics,
  };
}

// Demo tenants for the Super Admin panel (fictional businesses, demo data).
// Business names are the SAME canonical names as the live demo (/demo).
export const DEMO_TENANTS: Tenant[] = [
  { id: "ten-1", business: "BrightSmile Dental Studio", owner: "demo-owner@example.com", plan: "Growth", repliesUsed: 1840, repliesLimit: 2500, status: "Active", createdAt: "2026-10-02" },
  { id: "ten-2", business: "Glow Studio Salon", owner: "demo-owner@example.com", plan: "Starter", repliesUsed: 420, repliesLimit: 500, status: "Active", createdAt: "2026-10-18" },
  { id: "ten-3", business: "The Harborview Hotel", owner: "demo-owner@example.com", plan: "Pro", repliesUsed: 6210, repliesLimit: 10000, status: "Active", createdAt: "2026-09-21" },
  { id: "ten-4", business: "Apex Auto Care", owner: "demo-owner@example.com", plan: "Starter", repliesUsed: 96, repliesLimit: 500, status: "Trial", createdAt: "2026-11-10" },
  { id: "ten-5", business: "Skyline Property Group", owner: "demo-owner@example.com", plan: "Growth", repliesUsed: 2310, repliesLimit: 2500, status: "Active", createdAt: "2026-10-27" },
  { id: "ten-6", business: "Olive & Oak Bistro", owner: "demo-owner@example.com", plan: "Starter", repliesUsed: 0, repliesLimit: 500, status: "Suspended", createdAt: "2026-11-01" },
];

export const SYSTEM_LOGS: SystemLog[] = [
  { id: "log-1", time: "Today, 9:07 AM", event: "AI reply sent", detail: "WhatsApp reply to Alex Morgan (cleaning booking).", level: "success" },
  { id: "log-2", time: "Today, 8:20 AM", event: "Escalation raised", detail: "Jordan Lee — pain / urgent, flagged for staff.", level: "warning" },
  { id: "log-3", time: "Today, 8:15 AM", event: "Webhook received", detail: "WhatsApp inbound message (demo payload).", level: "info" },
  { id: "log-4", time: "Yesterday, 4:12 PM", event: "Booking created", detail: "Sam Carter — whitening, tomorrow 11:00 AM ($199).", level: "success" },
  { id: "log-5", time: "Yesterday, 2:40 PM", event: "Lead status changed", detail: "Priya Sharma — New → Contacted.", level: "info" },
  { id: "log-6", time: "Yesterday, 11:05 AM", event: "Knowledge doc added", detail: "Booking & cancellation policy (text).", level: "info" },
  { id: "log-7", time: "2 days ago", event: "AI reply sent", detail: "Website chat reply to Priya Sharma (whitening).", level: "success" },
  { id: "log-8", time: "2 days ago", event: "Webhook received", detail: "WhatsApp inbound message (demo payload).", level: "info" },
];

export const DEMO_REVENUE: RevenueMonth[] = [
  { month: "Jun", demoRevenue: 0, workspaces: 1 },
  { month: "Jul", demoRevenue: 0, workspaces: 2 },
  { month: "Aug", demoRevenue: 0, workspaces: 3 },
  { month: "Sep", demoRevenue: 0, workspaces: 4 },
  { month: "Oct", demoRevenue: 0, workspaces: 5 },
  { month: "Nov", demoRevenue: 0, workspaces: 6 },
];

export const AVG_FIRST_REPLY_SECONDS = 38;
