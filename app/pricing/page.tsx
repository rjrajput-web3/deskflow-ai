import type { Metadata } from "next";
import Link from "next/link";
import { PLANS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — DeskFlow AI",
  description:
    "Clear plans with clear reply limits: Starter $19, Growth $49, Pro $99 per month, Agency custom. No unlimited promises, no hidden fees. DeskFlow AI is in pre-launch — join the waitlist.",
  alternates: { canonical: "/pricing" },
};

const COMPARISON: { label: string; values: string[] }[] = [
  { label: "WhatsApp channels", values: ["1 channel", "1 channel + live chat", "WhatsApp + live chat · voice AI (Roadmap)", "Multi-workspace"] },
  { label: "AI replies / month", values: ["500", "2,500", "10,000", "Custom limits"] },
  { label: "Appointment booking", values: ["—", "✓", "✓", "✓"] },
  { label: "Knowledge base training", values: ["Basic FAQ", "PDF / URL", "PDF / URL", "✓"] },
  { label: "Lead CRM", values: ["—", "✓", "✓", "✓"] },
  { label: "Automated follow-ups", values: ["—", "✓", "✓", "✓"] },
  { label: "Human handoff", values: ["—", "Basic", "Multi-staff", "✓"] },
  { label: "Analytics & reports", values: ["Email summary", "Daily summary", "Advanced analytics + daily report", "Central dashboard"] },
  { label: "Support", values: ["Community", "Standard", "Priority", "Dedicated manager"] },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "What counts as an AI reply?",
    a: "One AI reply is one message the receptionist sends to a customer on your behalf. Incoming customer messages do not count — only the AI's replies do.",
  },
  {
    q: "What happens if I go over my monthly limit?",
    a: "Limits and billing will be confirmed when signup opens. In general, the receptionist pauses automatic replies once the plan's monthly reply limit is reached, and you can upgrade to a higher plan to continue.",
  },
  {
    q: "Which countries does DeskFlow AI work in?",
    a: "DeskFlow AI works wherever WhatsApp Business and Meta's WhatsApp Cloud API are available. Limits and billing will be confirmed when signup opens for your region.",
  },
  {
    q: "Can I cancel my plan?",
    a: "Yes. Limits and billing, including cancellation terms, will be confirmed when signup opens. There is no long-term lock-in promised here — check the terms shown when you activate.",
  },
  {
    q: "Do I need my own WhatsApp Business number?",
    a: "Yes — the live service connects to your own WhatsApp Business number through official Meta onboarding. You can test everything first in the Meta sandbox with a test number.",
  },
];

export default function PricingPage() {
  return (
    <main>
      {/* Page header */}
      <section className="container-x pb-10 pt-16 sm:pt-20">
        <span className="eyebrow anim-fade-up">Pricing</span>
        <h1 className="h-display mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl anim-fade-up">
          Clear limits. No surprises.
        </h1>
        <p className="lead mt-5 max-w-2xl anim-fade-up">
          Every plan states exactly how many AI replies you get each month. Pick the size
          that fits your message volume — upgrade any time as you grow.
        </p>
        <p className="mt-4 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm leading-relaxed text-amber-900 anim-fade-up">
          DeskFlow AI is in pre-launch — join the waitlist and we&rsquo;ll open your
          workspace when your region goes live.
        </p>
      </section>

      {/* Plan cards */}
      <section className="container-x grid gap-6 pb-6 lg:grid-cols-4 md:grid-cols-2">
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            className={`card card-pad relative flex flex-col ${plan.featured ? "border-2 border-brand-600 shadow-xl shadow-brand-600/10 lg:-translate-y-2" : ""}`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
                Most popular
              </span>
            )}
            <h2 className="h-display text-xl">{plan.name}</h2>
            <p className="mt-4">
              <span className="font-display text-4xl font-bold text-ink-950">{plan.price}</span>
              {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{plan.blurb}</p>
            <div className="mt-5 space-y-2 rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <p className="font-semibold text-ink-950">{plan.replies}</p>
              <p className="text-slate-600">{plan.channels}</p>
            </div>
            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              {plan.cta === "Contact Sales" ? (
                <Link href="/contact" className="btn-primary w-full">{plan.cta}</Link>
              ) : (
                <Link href="/#waitlist" className={plan.featured ? "btn-accent w-full" : "btn-ghost w-full"}>{plan.cta}</Link>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* Metered usage note */}
      <section className="container-x pb-6">
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900">
          WhatsApp, AI and voice usage is metered within the reply limits above — no plan
          includes unlimited usage, and there are no hidden fees beyond the plan price.
          Voice AI is on the roadmap and not included in any plan yet. Exact limits and
          billing will be confirmed when signup opens.
        </p>
      </section>

      {/* Self-host banner */}
      <section className="container-x pb-6">
        <div className="card card-pad flex flex-col items-start justify-between gap-5 bg-gradient-to-br from-brand-50 to-white sm:flex-row sm:items-center">
          <div>
            <span className="badge-live">One-time purchase</span>
            <h2 className="h-display mt-3 text-2xl">Prefer to self-host?</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              Get the one-time n8n template — $9 on Gumroad — and run the WhatsApp receptionist
              on your own n8n setup, with your own usage limits.
            </p>
          </div>
          <a href={SITE.gumroadTemplate} target="_blank" rel="noopener noreferrer" className="btn-accent shrink-0">
            Get the $9 template on Gumroad →
          </a>
        </div>
      </section>

      {/* Comparison table */}
      <section className="container-x pb-6 pt-6">
        <h2 className="h-display text-2xl sm:text-3xl">Compare plans</h2>
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="sticky left-0 bg-slate-50 px-5 py-4 font-semibold text-ink-950">Feature</th>
                {PLANS.map((plan) => (
                  <th key={plan.name} className="px-5 py-4 font-semibold text-ink-950">{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-slate-100 last:border-0">
                  <td className="sticky left-0 bg-white px-5 py-3.5 font-medium text-slate-700">{row.label}</td>
                  {row.values.map((value, i) => (
                    <td key={i} className="px-5 py-3.5 text-slate-600">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x max-w-4xl pb-8 pt-6">
        <h2 className="h-display text-2xl sm:text-3xl">Pricing questions</h2>
        <div className="mt-6 space-y-4">
          {FAQS.map((faq) => (
            <details key={faq.q} className="card card-pad group">
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
          <h2 className="h-display text-3xl text-white sm:text-4xl">Not sure which plan fits?</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-300">
            Try the live demo first to see the receptionist in action, then join the waitlist —
            we&apos;ll help you pick the right plan when your workspace is ready.
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
