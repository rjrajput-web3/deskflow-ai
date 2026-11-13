// DeskFlow AI — single source of truth for marketing copy, pricing caps and industries.
// Pricing caps are BINDING: never promise "unlimited" anywhere on the site.
export const SITE = {
  name: "DeskFlow AI",
  tagline: "Your Business Never Misses a Customer.",
  demoUrl: "https://deskflow-receptionist.vercel.app",
  gumroadTemplate: "https://smartstartguideshq.gumroad.com/l/deskflow-whatsapp-receptionist",
  contactEmail: "hello@deskflowai.app",
};

export const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Industries", href: "/industries" },
  { label: "Live Demo", href: "/demo" },
  { label: "Pricing", href: "/pricing" },
  { label: "Integrations", href: "/integrations" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

export type Plan = {
  name: string; price: string; period: string; blurb: string;
  replies: string; channels: string; features: string[]; cta: string; featured?: boolean;
};
export const PLANS: Plan[] = [
  {
    name: "Starter", price: "$19", period: "/month",
    blurb: "For small businesses getting their first AI receptionist.",
    replies: "500 AI replies / month", channels: "1 WhatsApp channel",
    features: ["Basic FAQ answers from your business info", "Email summary of every conversation", "Business hours + services auto-answers", "Community support"],
    cta: "Join Waitlist",
  },
  {
    name: "Growth", price: "$49", period: "/month",
    blurb: "For growing businesses that book and follow up automatically.",
    replies: "2,500 AI replies / month", channels: "1 WhatsApp channel + website live chat",
    features: ["Appointment booking with confirmations", "PDF / URL knowledge base training", "Lead CRM with status + notes", "Automated follow-up messages", "Daily owner summary"],
    cta: "Join Waitlist", featured: true,
  },
  {
    name: "Pro", price: "$99", period: "/month",
    blurb: "For high-volume businesses with a team behind the AI.",
    replies: "10,000 AI replies / month", channels: "WhatsApp + live chat + voice AI (add-on)",
    features: ["Multi-staff human handoff + escalation", "Advanced conversion analytics", "Google Calendar + webhook integrations", "Daily owner performance report", "Priority support"],
    cta: "Join Waitlist",
  },
  {
    name: "Agency", price: "Custom", period: "",
    blurb: "For agencies managing receptionists for many clients.",
    replies: "Custom usage limits per workspace", channels: "Multi-workspace client management",
    features: ["White-label options", "Centralised client dashboard", "Per-client usage metering", "Dedicated success manager"],
    cta: "Contact Sales",
  },
];

export type Industry = {
  slug: string; name: string; icon: string; blurb: string;
  useCases: string[]; sampleServices: { name: string; price: string }[];
};
export const INDUSTRIES: Industry[] = [
  {
    slug: "dental", name: "Dental Clinics", icon: "🦷",
    blurb: "Appointments, services and patient enquiries — answered instantly, even at 2 AM.",
    useCases: ["Book cleanings, check-ups and whitening", "Answer treatment + price questions", "Send reminders and reduce no-shows", "Escalate emergencies to staff"],
    sampleServices: [{ name: "Teeth cleaning / scaling", price: "$120" }, { name: "Check-up + X-ray", price: "$85" }, { name: "Whitening session", price: "$199" }],
  },
  {
    slug: "hotels", name: "Hotels", icon: "🏨",
    blurb: "Room enquiries, booking requests and check-in information — handled around the clock.",
    useCases: ["Quote room rates + availability", "Take booking requests with dates", "Share check-in / check-out times", "Answer amenity + policy questions"],
    sampleServices: [{ name: "Deluxe room / night", price: "$189" }, { name: "Suite / night", price: "$329" }, { name: "Airport shuttle", price: "$25" }],
  },
  {
    slug: "restaurants", name: "Restaurants", icon: "🍽️",
    blurb: "Menu questions, table enquiries and reservations — without tying up your host stand.",
    useCases: ["Share the menu + daily specials", "Book tables for tonight", "Answer dietary + allergen questions", "Take large-party requests"],
    sampleServices: [{ name: "Table for 2 — dinner", price: "Free" }, { name: "Chef's tasting menu", price: "$65" }, { name: "Private dining (12 guests)", price: "$480" }],
  },
  {
    slug: "salons", name: "Salons", icon: "💇",
    blurb: "Service prices, schedules and appointments — booked while your stylists are busy.",
    useCases: ["Quote cut, colour + treatment prices", "Book with a preferred stylist", "Fill last-minute gaps automatically", "Remind clients before their slot"],
    sampleServices: [{ name: "Signature Hydrafacial", price: "$95" }, { name: "Cut + blow-dry", price: "$60" }, { name: "Balayage colour", price: "$140" }],
  },
  {
    slug: "real-estate", name: "Real Estate", icon: "🏡",
    blurb: "Property enquiries, lead capture and viewing requests — every lead answered in seconds.",
    useCases: ["Share listings + prices instantly", "Book property viewings", "Qualify buyers vs renters", "Hand hot leads to an agent"],
    sampleServices: [{ name: "2-bed apartment / month", price: "$2,400" }, { name: "Viewing tour", price: "Free" }, { name: "Valuation call", price: "Free" }],
  },
  {
    slug: "auto", name: "Auto Services", icon: "🔧",
    blurb: "Service estimates and workshop bookings — customers get answers, you get the job.",
    useCases: ["Quote oil change, brakes, tyres", "Book workshop slots", "Share opening hours + location", "Follow up on estimates"],
    sampleServices: [{ name: "Full service + MOT check", price: "$149" }, { name: "Oil change", price: "$59" }, { name: "Brake pads replacement", price: "$189" }],
  },
];

export const FEATURES = [
  { title: "24/7 AI Receptionist", desc: "Replies to every customer message in seconds — nights, weekends, holidays. Your business never misses a customer.", icon: "💬" },
  { title: "Knowledge Base Training", desc: "Train the AI on your PDFs, website, service lists, prices and policies. Answers stay accurate to your business.", icon: "📚" },
  { title: "Appointment Booking", desc: "Books, confirms and reschedules appointments, then sends reminders so no-shows drop.", icon: "📅" },
  { title: "Lead CRM", desc: "Every conversation becomes a lead with contact details, status, notes and follow-up history.", icon: "🗂️" },
  { title: "Automated Follow-Ups", desc: "Nudges quotes, reminds no-replies and re-engages past customers — automatically, on schedule.", icon: "🔁" },
  { title: "Human Handoff", desc: "Difficult or high-value conversations move to your staff with full history. The AI never guesses on what matters.", icon: "🙋" },
  { title: "Daily Owner Reports", desc: "One clear morning summary: messages, leads, bookings, response times and conversion.", icon: "📊" },
];

export const ONBOARDING_STEPS = [
  { n: 1, title: "Create an account", desc: "Sign up and create your business workspace in under two minutes." },
  { n: 2, title: "Configure your business", desc: "Enter your business name, services, prices, opening hours and policies." },
  { n: 3, title: "Connect WhatsApp", desc: "Securely connect an eligible WhatsApp Business account through Meta onboarding." },
  { n: 4, title: "Train your AI receptionist", desc: "Upload PDF brochures, website URLs, FAQs and service information." },
  { n: 5, title: "Test the receptionist", desc: "Send test messages and check replies, bookings and escalation." },
  { n: 6, title: "Activate your subscription", desc: "Select a plan with clear usage limits and activate the live service." },
  { n: 7, title: "Monitor your business", desc: "Check customers, appointments, leads and reports in the dashboard." },
];
