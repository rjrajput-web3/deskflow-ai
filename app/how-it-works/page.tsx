import Link from "next/link";
import { ONBOARDING_STEPS } from "@/lib/site";

export default function HowItWorksPage() {
  return (
    <main>
      {/* Page header */}
      <section className="container-x pb-10 pt-16 sm:pt-20">
        <span className="eyebrow anim-fade-up">How it works</span>
        <h1 className="h-display mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl anim-fade-up">
          From signup to a live AI receptionist in seven steps.
        </h1>
        <p className="lead mt-5 max-w-2xl anim-fade-up">
          No code, no hardware, no long setup project. Configure your business once,
          train the AI on your own information, test it — then switch it on.
        </p>
      </section>

      {/* Vertical timeline */}
      <section className="container-x pb-8">
        <ol className="relative mx-auto max-w-3xl space-y-10 border-l-2 border-brand-100 pl-8 sm:pl-12">
          {ONBOARDING_STEPS.map((step) => (
            <li key={step.n} className="relative">
              <span className="absolute -left-8 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-bold text-white shadow-lg shadow-brand-600/25 sm:-left-12">
                {step.n}
              </span>
              <div className="card card-pad">
                <h2 className="h-display text-xl sm:text-2xl">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-slate-600">{step.desc}</p>
                {step.n === 3 && (
                  <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    WhatsApp connection uses official Meta onboarding. You start in the Meta
                    sandbox with a test number, then move to your own verified business number.
                  </p>
                )}
                {step.n === 4 && (
                  <p className="mt-3 text-sm text-slate-500">
                    The more accurate your services, prices and policies, the better the replies.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* What happens after you activate */}
      <section className="container-x pb-8 pt-6">
        <div className="card card-pad bg-gradient-to-br from-brand-50 to-white">
          <span className="eyebrow">After you activate</span>
          <h2 className="h-display mt-4 text-2xl sm:text-3xl">What happens after you activate</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="font-display text-lg font-bold text-ink-950">1 · It starts replying</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Every incoming WhatsApp message gets an instant, accurate reply — day and night.
              </p>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink-950">2 · Leads and bookings land</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Conversations become leads in your CRM and confirmed bookings appear in your calendar once connected.
              </p>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink-950">3 · You get the morning report</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                A daily owner summary shows messages, leads, bookings and response times — no digging required.
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            WhatsApp connection uses official Meta onboarding, and you test everything in the
            Meta sandbox first — your customers only ever see the live service once you choose to switch it on.
          </p>
        </div>
      </section>

      {/* Setup guides link */}
      <section className="container-x pb-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="h-display text-xl sm:text-2xl">Need the detailed setup steps?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              The docs walk through WhatsApp sandbox setup, knowledge base training, calendar
              connection and webhooks — with honest notes on what needs your own live account.
            </p>
          </div>
          <Link href="/docs" className="btn-primary shrink-0">Read the setup guides →</Link>
        </div>
      </section>

      {/* Final CTA band */}
      <section className="container-x pb-20 pt-8">
        <div className="card card-pad bg-ink-950 text-center sm:p-12">
          <h2 className="h-display text-3xl text-white sm:text-4xl">Try it before you set anything up.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-300">
            The live demo shows exactly how the receptionist answers, books and hands off —
            pick your industry and send it a message.
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
