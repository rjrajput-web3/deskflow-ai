import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs — DeskFlow AI",
  description:
    "Setup guides, step by step: Meta WhatsApp Cloud API sandbox, knowledge base training, Google Calendar connection and n8n webhooks. Every guide says plainly what needs your own live account.",
  alternates: { canonical: "/docs" },
};

type Guide = {
  id: string;
  title: string;
  icon: string;
  status: string;
  statusTone: "live" | "demo";
  intro: string;
  steps: string[];
  note?: string;
};

const GUIDES: Guide[] = [
  {
    id: "whatsapp-sandbox",
    title: "Meta WhatsApp Cloud API sandbox setup",
    icon: "💬",
    status: "Endpoint stub — not connected",
    statusTone: "demo",
    intro: "Connect DeskFlow AI to WhatsApp through Meta's official Cloud API — starting in the sandbox with a test number, before you ever touch your live business number.",
    steps: [
      "Create a Meta developer app at developers.facebook.com and add the WhatsApp product.",
      "Use the test number Meta provides in the sandbox to send and receive test messages.",
      "Set the webhook callback URL to /api/webhooks/whatsapp and add a verify token.",
      "Subscribe the webhook to the messages field so incoming messages reach DeskFlow AI.",
      "Send a test message to the sandbox number — the endpoint currently logs the payload (demo stub) and does not reply; a live AI reply needs the Meta connection built in a later phase.",
      "When you are ready, add your own verified WhatsApp Business number through official Meta onboarding.",
    ],
    note: "Requires your Meta Business account — not connected in this demo. The live demo uses a simulated WhatsApp conversation, not your Meta account.",
  },
  {
    id: "knowledge-base",
    title: "Knowledge base training (PDF / URL / FAQ)",
    icon: "📚",
    status: "Demo",
    statusTone: "demo",
    intro: "Teach the receptionist your business: services, prices, policies and answers — so replies stay accurate instead of guessed.",
    steps: [
      "Open Knowledge Base in your workspace.",
      "Upload PDF brochures, price lists or policy documents.",
      "Add your website URLs — the AI reads the pages you list.",
      "Add frequently asked questions with your exact answers.",
      "Test with a few customer-style questions and correct any wrong reply.",
      "Update the knowledge base any time your services or prices change.",
    ],
  },
  {
    id: "google-calendar",
    title: "Google Calendar connection",
    icon: "📅",
    status: "Demo",
    statusTone: "demo",
    intro: "After onboarding, confirmed appointments appear on your Google Calendar automatically, so the receptionist never double-books you. In the demo, bookings are provisional and appear in the ⚡ Calendar & n8n drawer instead.",
    steps: [
      "Open Dashboard → Integrations in your workspace and choose Google Calendar.",
      "Sign in with the Google account that holds your business calendar.",
      "Grant calendar access so DeskFlow AI can create and check events.",
      "Choose which calendar receives bookings and your working hours.",
      "Send a test booking from the live demo chat and confirm it appears in the Calendar & n8n drawer (in the live service it lands on your calendar).",
    ],
    note: "Requires your Google account — not connected in this demo. Calendar sync is set up after onboarding, on the Pro plan.",
  },
  {
    id: "n8n-webhooks",
    title: "n8n webhook guide",
    icon: "🔗",
    status: "Demo",
    statusTone: "demo",
    intro: "Forward bookings, leads and conversation events to your own n8n workflows — for example, to a spreadsheet, your CRM or a notification channel.",
    steps: [
      "Create a Webhook node in your n8n workflow and copy its production URL.",
      "In DeskFlow AI, open Dashboard → Integrations → n8n webhooks and paste the URL (in this demo it is saved in your browser only).",
      "Choose the events to forward: new lead, booking confirmed, booking cancelled, handoff requested.",
      "Send a test booking from the live demo chat and check the ⚡ Calendar & n8n drawer — it shows the exact JSON payload that would be posted to your webhook.",
      "Map the fields in n8n to the next step in your workflow.",
    ],
    note: "Requires your own n8n instance — not connected in this demo. No events are sent anywhere from this demo; the drawer payload is a simulation of what would be posted.",
  },
];

const DOC_FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need a Meta Business account to use DeskFlow AI?",
    a: "For the live WhatsApp service, yes — the receptionist connects to your WhatsApp Business number through official Meta onboarding. The live demo works without one, using a simulated conversation.",
  },
  {
    q: "Can I test before connecting my real number?",
    a: "Yes. Meta provides a sandbox with a test number, and the DeskFlow AI demo lets you try the full receptionist flow before any live connection.",
  },
  {
    q: "What happens if the AI does not know an answer?",
    a: "It says so honestly and offers to hand the conversation to your team, instead of guessing. You can also add the missing answer to the knowledge base afterwards.",
  },
  {
    q: "Where do my bookings and leads go?",
    a: "In the live service, bookings go to your connected Google Calendar (set up after onboarding, Pro plan) and leads are stored in the built-in Lead CRM in your workspace. Webhooks can forward both to your own tools. In the demo, bookings appear in the Calendar & n8n drawer as provisional entries and leads live in the demo CRM.",
  },
];

export default function DocsPage() {
  return (
    <main>
      {/* Page header */}
      <section className="container-x pb-10 pt-16 sm:pt-20">
        <span className="eyebrow anim-fade-up">Docs</span>
        <h1 className="h-display mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl anim-fade-up">
          Setup guides, step by step.
        </h1>
        <p className="lead mt-5 max-w-2xl anim-fade-up">
          Everything you need to connect WhatsApp, train the AI, link your calendar and
          wire up webhooks. Every guide says plainly what needs your own live account.
        </p>
      </section>

      {/* Guides */}
      <section className="container-x space-y-8 pb-8">
        {GUIDES.map((guide) => (
          <article key={guide.id} id={guide.id} className="card card-pad">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                {guide.icon}
              </span>
              {guide.statusTone === "live" ? (
                <span className="badge-live">● {guide.status}</span>
              ) : (
                <span className="badge-demo">● {guide.status}</span>
              )}
            </div>
            <h2 className="h-display mt-5 text-2xl">{guide.title}</h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-slate-600">{guide.intro}</p>
            <ol className="mt-6 space-y-3">
              {guide.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-950 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span>
                    {step}
                    {guide.id === "whatsapp-sandbox" && i === 2 && (
                      <>
                        {" "}(<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-ink-950">/api/webhooks/whatsapp</code>)
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ol>
            {guide.note && (
              <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                {guide.note}
              </p>
            )}
          </article>
        ))}
      </section>

      {/* FAQ */}
      <section className="container-x max-w-4xl pb-8 pt-6">
        <h2 className="h-display text-2xl sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {DOC_FAQS.map((faq) => (
            <details key={faq.q} className="card card-pad">
              <summary className="cursor-pointer list-none font-display text-base font-bold text-ink-950 sm:text-lg">
                {faq.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA band */}
      <section className="container-x pb-20 pt-8">
        <div className="card card-pad bg-ink-950 text-center sm:p-12">
          <h2 className="h-display text-3xl text-white sm:text-4xl">Ready to see it working?</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-300">
            The live demo runs the full flow — message, booking, handoff — without any setup
            on your side. Join the waitlist when you want your own workspace.
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
