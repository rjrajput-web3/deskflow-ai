import type { Metadata } from "next";
import Link from "next/link";
import WhatsAppStatus from "@/components/WhatsAppStatus";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Integrations — DeskFlow AI",
  description:
    "DeskFlow AI connects to Meta WhatsApp Cloud API, Google Calendar, n8n webhooks and website live chat. Statuses are labelled honestly — what is live, what is a demo, and what is still on the roadmap.",
  alternates: { canonical: "/integrations" },
};

type Integration = {
  name: string;
  icon: string;
  status: "Not connected" | "Demo" | "Roadmap";
  what: string;
  needs: string;
};

const INTEGRATIONS: Integration[] = [
  {
    name: "Meta WhatsApp Cloud API",
    icon: "💬",
    status: "Not connected",
    what: "The official channel for your AI receptionist — customer messages arrive over WhatsApp and replies go back through Meta's Cloud API. The webhook endpoint below exists as a stub until Meta credentials are connected; the live demo uses a simulated conversation, not Meta.",
    needs: "Meta Business account + verified number + webhook credentials (verify token, access token, app secret) — your step.",
  },
  {
    name: "Google Calendar",
    icon: "📅",
    status: "Demo",
    what: "Once connected after onboarding, confirmed appointments are added to your Google Calendar automatically, with reminders attached — no double-booking, no manual entry. In the demo, bookings are provisional and appear in the Calendar & n8n drawer, not on a real calendar.",
    needs: "Your Google account connected in the workspace after onboarding (Pro plan) — your step.",
  },
  {
    name: "n8n webhooks",
    icon: "🔗",
    status: "Demo",
    what: "Send bookings, leads and conversation events to your own n8n workflows — connect DeskFlow AI to the rest of your stack.",
    needs: "Your n8n instance URL and webhook endpoint — your step.",
  },
  {
    name: "Website live chat",
    icon: "💻",
    status: "Demo",
    what: "The same AI receptionist answers visitors on your website, with the same knowledge base, booking and lead capture.",
    needs: "Add the chat widget to your website — your step.",
  },
  {
    name: "Lead CRM",
    icon: "🗂️",
    status: "Demo",
    what: "Every conversation becomes a lead with contact details, status, notes and follow-up history — built in, no separate tool needed.",
    needs: "Nothing extra — included with the Growth plan and above.",
  },
  {
    name: "Voice AI",
    icon: "🎙️",
    status: "Roadmap",
    what: "A voice receptionist that answers calls, takes messages and books appointments — planned for a future release.",
    needs: "Not live yet — join the waitlist to hear when it ships.",
  },
];

function StatusBadge({ status }: { status: Integration["status"] }) {
  if (status === "Not connected") return <span className="badge-demo">● Not connected</span>;
  if (status === "Roadmap") return <span className="badge-demo">● Roadmap — not live yet</span>;
  return <span className="badge-demo">● Demo</span>;
}

export default function IntegrationsPage() {
  return (
    <main>
      {/* Page header */}
      <section className="container-x pb-10 pt-16 sm:pt-20">
        <span className="eyebrow anim-fade-up">Integrations</span>
        <h1 className="h-display mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl anim-fade-up">
          Connected to the tools your business already uses.
        </h1>
        <p className="lead mt-5 max-w-2xl anim-fade-up">
          DeskFlow AI meets customers on WhatsApp, books into your calendar and sends leads
          where they belong. Statuses are labelled honestly — what is live, what is a demo,
          and what is still on the roadmap.
        </p>
      </section>

      {/* Integration cards */}
      <section className="container-x grid gap-6 pb-8 md:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((integration) => (
          <article key={integration.name} className="card card-pad flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                {integration.icon}
              </span>
              {integration.name === "Meta WhatsApp Cloud API" ? <WhatsAppStatus /> : <StatusBadge status={integration.status} />}
            </div>
            <h2 className="h-display mt-5 text-xl">{integration.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{integration.what}</p>
            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-semibold text-ink-950">What it needs: </span>
              {integration.needs}
            </p>
          </article>
        ))}
      </section>

      {/* Note */}
      <section className="container-x pb-8">
        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-relaxed text-slate-600">
          Integrations marked “Demo” are shown working in the live demo environment. Live
          connections use your own accounts — Meta, Google and n8n credentials are never
          shared with us beyond what each service requires to connect.
        </p>
      </section>

      {/* Final CTA band */}
      <section className="container-x pb-20 pt-8">
        <div className="card card-pad bg-ink-950 text-center sm:p-12">
          <h2 className="h-display text-3xl text-white sm:text-4xl">See the integrations in the live demo.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-300">
            Book an appointment, watch it appear in the Calendar &amp; n8n drawer, and see
            the lead appear in the CRM — all from one conversation.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={SITE.demoUrl} target="_blank" rel="noreferrer" className="btn-accent">Try Live Demo →</Link>
            <Link href="/#waitlist" className="btn-ghost !border-slate-600 !bg-transparent !text-white hover:!border-white">Join Waitlist</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
