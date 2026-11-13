import Link from "next/link";
import { FEATURES } from "@/lib/site";

const CAPABILITIES: Record<string, string[]> = {
  "24/7 AI Receptionist": [
    "Replies in seconds, day and night — including weekends and holidays",
    "Answers in the customer's language from your business information",
    "Knows your opening hours, services and prices before it replies",
    "Flags urgent messages for your team right away",
  ],
  "Knowledge Base Training": [
    "Upload PDFs, brochures and price lists",
    "Add your website URLs and frequently asked questions",
    "Answers stay grounded in your own business information",
    "Update the knowledge base any time — replies improve immediately",
  ],
  "Appointment Booking": [
    "Books, confirms and reschedules appointments in the chat",
    "Checks real availability before offering a time slot",
    "Sends automatic reminders to reduce no-shows",
    "Syncs confirmed bookings to your calendar",
  ],
  "Lead CRM": [
    "Every conversation becomes a lead with contact details",
    "Status tracking: new, contacted, booked, converted",
    "Notes and full conversation history on every lead",
    "See at a glance which leads still need a reply",
  ],
  "Automated Follow-Ups": [
    "Nudges customers who asked for a quote and went quiet",
    "Reminds customers about unfinished bookings",
    "Re-engages past customers with a timely check-in",
    "You control the timing and the message — nothing sends without your rules",
  ],
  "Human Handoff": [
    "High-value or sensitive conversations move to your staff",
    "Full conversation history travels with the handoff",
    "The AI steps aside instead of guessing on what matters",
    "Your team picks up exactly where the AI left off",
  ],
  "Daily Owner Reports": [
    "One clear morning summary in your inbox",
    "Messages, new leads, bookings and response times",
    "Conversion at a glance — no dashboard digging required",
    "Spot busy hours and missed opportunities quickly",
  ],
};

function Visual({ title }: { title: string }) {
  switch (title) {
    case "24/7 AI Receptionist":
      return (
        <div className="space-y-3">
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-sm text-slate-700">
            Hi! Do you have any appointments tomorrow?
          </div>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-brand-600 px-4 py-3 text-sm text-white">
            Yes — we have 10:30 AM and 2:00 PM open. Shall I book you in?
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-sm text-slate-700">
            10:30 works for me, thanks!
          </div>
          <p className="pt-1 text-xs font-semibold text-brand-700">Answered in 4 seconds · 11:42 PM</p>
        </div>
      );
    case "Knowledge Base Training":
      return (
        <div className="space-y-2.5">
          {["Services & price list.pdf", "Clinic website — FAQ page", "Opening hours & policies"].map((doc) => (
            <div key={doc} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm">📄</span>
              <span className="flex-1 truncate text-sm font-medium text-ink-950">{doc}</span>
              <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">Trained</span>
            </div>
          ))}
          <p className="pt-1 text-xs text-slate-500">3 sources · 128 answers grounded in your business info</p>
        </div>
      );
    case "Appointment Booking":
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Booking confirmed</p>
          <p className="mt-2 text-base font-bold text-ink-950">Teeth cleaning — Dr. Patel</p>
          <p className="mt-1 text-sm text-slate-600">Saturday, 15 Nov · 10:30 AM · 45 min</p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">Confirmed</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Reminder set</span>
          </div>
        </div>
      );
    case "Lead CRM":
      return (
        <div className="space-y-2.5">
          {[
            { name: "Sarah M.", detail: "Whitening enquiry · 2h ago", status: "Booked", tone: "bg-brand-100 text-brand-700" },
            { name: "James K.", detail: "Price question · 5h ago", status: "Follow-up due", tone: "bg-amber-100 text-amber-800" },
            { name: "Aisha R.", detail: "New patient · yesterday", status: "New", tone: "bg-slate-100 text-slate-600" },
          ].map((lead) => (
            <div key={lead.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-950 text-xs font-bold text-white">
                {lead.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink-950">{lead.name}</span>
                <span className="block truncate text-xs text-slate-500">{lead.detail}</span>
              </span>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${lead.tone}`}>{lead.status}</span>
            </div>
          ))}
        </div>
      );
    case "Automated Follow-Ups":
      return (
        <div className="space-y-3">
          {[
            { when: "Day 1 · 10:00 AM", text: "Hi Sarah — just checking you got the whitening quote. Any questions?" },
            { when: "Day 3 · 4:00 PM", text: "A quick reminder: your 10:30 slot on Saturday is still open if you'd like it." },
          ].map((msg) => (
            <div key={msg.when} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold text-brand-700">{msg.when}</p>
              <p className="mt-1 text-sm text-slate-700">{msg.text}</p>
            </div>
          ))}
          <p className="text-xs text-slate-500">Scheduled by your follow-up rules — sent only when a lead goes quiet.</p>
        </div>
      );
    case "Human Handoff":
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">AR</span>
            <div>
              <p className="text-sm font-semibold text-ink-950">Handed to Ana — Reception</p>
              <p className="text-xs text-slate-500">Full chat history attached · just now</p>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            “I&apos;d like to discuss a complex treatment plan before booking.”
          </p>
          <p className="mt-3 text-xs font-semibold text-brand-700">AI stepped aside — a person is now replying.</p>
        </div>
      );
    case "Daily Owner Reports":
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">This morning · 8:00 AM</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            {[
              { v: "42", l: "Messages" },
              { v: "9", l: "New leads" },
              { v: "6", l: "Bookings" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg bg-slate-50 px-2 py-3">
                <p className="font-display text-xl font-bold text-ink-950">{s.v}</p>
                <p className="text-xs text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2 rounded-full bg-slate-100"><div className="h-2 w-3/4 rounded-full bg-brand-600" /></div>
            <p className="text-xs text-slate-500">Avg. first reply: 6 seconds · 0 missed conversations</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function FeaturesPage() {
  return (
    <main>
      {/* Page header */}
      <section className="container-x pb-10 pt-16 sm:pt-20">
        <span className="eyebrow anim-fade-up">Features</span>
        <h1 className="h-display mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl anim-fade-up">
          Everything your front desk does. Done by AI, around the clock.
        </h1>
        <p className="lead mt-5 max-w-2xl anim-fade-up">
          DeskFlow AI answers customers, books appointments, captures leads and follows up —
          so no enquiry ever waits for opening hours again.
        </p>
      </section>

      {/* Feature sections */}
      <section className="container-x space-y-16 pb-8 sm:space-y-20">
        {FEATURES.map((feature, i) => (
          <article
            key={feature.title}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
          >
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                {feature.icon}
              </span>
              <h2 className="h-display mt-5 text-2xl sm:text-3xl">{feature.title}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{feature.desc}</p>
              <ul className="mt-6 space-y-3">
                {(CAPABILITIES[feature.title] ?? []).map((cap) => (
                  <li key={cap} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">✓</span>
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <div className="card card-pad bg-gradient-to-br from-slate-50 to-brand-50/60">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {feature.title}
                </p>
                <Visual title={feature.title} />
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Final CTA band */}
      <section className="container-x pb-20 pt-16">
        <div className="card card-pad bg-ink-950 text-center sm:p-12">
          <h2 className="h-display text-3xl text-white sm:text-4xl">See every feature working live.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-300">
            Try the live demo with your own industry preset — or join the waitlist and we&apos;ll
            let you know when your workspace is ready.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/demo" className="btn-accent">Try Live Demo →</Link>
            <Link href="/#waitlist" className="btn-ghost !border-slate-600 !bg-transparent !text-white hover:!border-white">Join Waitlist</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
