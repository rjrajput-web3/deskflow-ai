import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";
import { FEATURES, INDUSTRIES, ONBOARDING_STEPS, PLANS } from "@/lib/site";

const METRICS = [
  { value: "24/7", label: "Coverage — nights, weekends, holidays" },
  { value: "6", label: "Industry presets, ready to configure" },
  { value: "7", label: "Steps from signup to live receptionist" },
  { value: "<10s", label: "First reply in the live demo" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="container-x grid items-center gap-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-2 lg:pb-24">
        <div className="anim-fade-up">
          <span className="eyebrow">AI Receptionist for Modern Businesses</span>
          <h1 className="h-display mt-5 text-5xl leading-[1.05] sm:text-6xl">
            Your Business Never Misses a Customer.
          </h1>
          <p className="lead mt-5 max-w-xl">
            DeskFlow AI answers every customer message around the clock, books
            appointments, captures leads and hands tricky conversations to your
            team — so no enquiry ever goes unanswered.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo" className="btn-accent">Try Live Demo</Link>
            <Link href="/#waitlist" className="btn-ghost">Join Waitlist</Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            No login needed to try the demo · Self-hosted template from $9
          </p>
        </div>

        {/* WhatsApp-style preview card (static preview — the interactive simulator lives on /demo) */}
        <div className="anim-fade-up anim-floaty">
          <Link href="/demo" className="card block overflow-hidden" aria-label="See the live demo">
            <div className="flex items-center gap-3 border-b border-slate-200 bg-[#075E54] px-5 py-3.5 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-display text-sm font-bold">DF</span>
              <div>
                <p className="text-sm font-semibold leading-tight">DeskFlow AI</p>
                <p className="text-xs text-white/80">Online · replies instantly</p>
              </div>
              <span className="badge-demo ml-auto">Demo</span>
            </div>
            <div className="space-y-3 bg-[#ECE5DD] px-5 py-5">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm shadow-sm">
                Hi! Do you have a teeth cleaning slot this week?
              </div>
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#D9FDD3] px-4 py-2.5 text-sm shadow-sm">
                Yes — we have Thursday at 10:30 AM. Shall I book it for you?
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm shadow-sm">
                Yes please, that works.
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200">
                <p className="flex items-center gap-2 font-semibold text-ink-950">
                  <span aria-hidden="true">✅</span> Booking confirmed
                </p>
                <p className="mt-1 text-slate-600">Teeth cleaning / scaling</p>
                <p className="text-slate-600">Thursday · 10:30 AM</p>
                <p className="mt-2 border-t border-slate-200 pt-2 font-display text-lg font-bold text-brand-700">$120</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3.5">
              <p className="text-sm font-medium text-slate-600">See it reply live — no login needed</p>
              <span className="text-sm font-semibold text-brand-700">Open demo →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="border-y border-slate-200 bg-slate-50" aria-label="At a glance">
        <div className="container-x grid grid-cols-2 gap-8 py-10 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label}>
              <p className="font-display text-3xl font-bold text-ink-950 sm:text-4xl">{m.value}</p>
              <p className="mt-1 text-sm text-slate-600">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-x py-20">
        <span className="eyebrow">Features</span>
        <h2 className="h-display mt-4 max-w-2xl text-3xl sm:text-4xl">Everything your front desk does — automatically.</h2>
        <p className="lead mt-3 max-w-2xl">
          One receptionist that answers, books, follows up and reports — tuned to your business.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="card card-pad">
              <span className="text-2xl" aria-hidden="true">{f.icon}</span>
              <h3 className="font-display mt-4 text-lg font-bold text-ink-950">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </article>
          ))}
          <Link href="/features" className="card card-pad flex flex-col justify-between bg-ink-950 text-white hover:bg-ink-900">
            <p className="font-display text-lg font-bold">See all features in detail</p>
            <p className="mt-2 text-sm text-slate-300">How each feature works, and what it does for your business.</p>
            <span className="mt-6 text-sm font-semibold text-brand-500">Explore Features →</span>
          </Link>
        </div>
      </section>

      {/* How It Works teaser */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="container-x py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">How It Works</span>
              <h2 className="h-display mt-4 text-3xl sm:text-4xl">Live in 7 simple steps.</h2>
            </div>
            <Link href="/how-it-works" className="btn-ghost">Full walkthrough →</Link>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ONBOARDING_STEPS.map((step) => (
              <li key={step.n} className="card card-pad">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-700">
                  {step.n}
                </span>
                <h3 className="font-display mt-4 text-base font-bold text-ink-950">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Industries */}
      <section className="container-x py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Industries</span>
            <h2 className="h-display mt-4 text-3xl sm:text-4xl">Built for the businesses that need it most.</h2>
          </div>
          <Link href="/industries" className="btn-ghost">All industries →</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind) => (
            <Link key={ind.slug} href="/industries" className="card card-pad block">
              <span className="text-3xl" aria-hidden="true">{ind.icon}</span>
              <h3 className="font-display mt-4 text-lg font-bold text-ink-950">{ind.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{ind.blurb}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-700">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="container-x py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Pricing</span>
              <h2 className="h-display mt-4 text-3xl sm:text-4xl">Clear plans, clear reply limits.</h2>
              <p className="lead mt-3 max-w-2xl">Every plan states exactly how many AI replies it includes — no surprises.</p>
            </div>
            <Link href="/pricing" className="btn-ghost">See full pricing →</Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`card card-pad flex flex-col ${plan.featured ? "ring-2 ring-brand-600" : ""}`}
              >
                {plan.featured && <span className="badge-live mb-3 self-start">Most popular</span>}
                <h3 className="font-display text-lg font-bold text-ink-950">{plan.name}</h3>
                <p className="mt-2">
                  <span className="font-display text-3xl font-bold text-ink-950">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{plan.blurb}</p>
                <p className="mt-4 text-sm font-semibold text-brand-700">{plan.replies}</p>
                <p className="text-sm text-slate-600">{plan.channels}</p>
                <Link href="/pricing" className="mt-auto pt-6 text-sm font-semibold text-brand-700">
                  {plan.cta} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="container-x scroll-mt-24 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Join the Waitlist</span>
          <h2 className="h-display mt-4 text-3xl sm:text-4xl">Be first when your region opens.</h2>
          <p className="lead mt-3">
            DeskFlow AI is rolling out region by region. Join the waitlist and we&rsquo;ll email you as soon as it&rsquo;s available for your business.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <WaitlistForm />
        </div>
      </section>

      {/* Final CTA band */}
      <section className="container-x pb-20">
        <div className="rounded-3xl bg-ink-950 px-6 py-14 text-center sm:px-12">
          <h2 className="h-display mx-auto max-w-2xl text-3xl text-white sm:text-4xl">
            Your Business Never Misses a Customer.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Try the live demo now — no login needed — or join the waitlist for your region.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="btn-accent">Try Live Demo</Link>
            <Link href="/#waitlist" className="btn-ghost !border-white/30 !bg-transparent !text-white hover:!border-white">
              Join Waitlist
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
