import Link from "next/link";
import { INDUSTRIES } from "@/lib/site";

export default function IndustriesPage() {
  return (
    <main>
      {/* Page header */}
      <section className="container-x pb-10 pt-16 sm:pt-20">
        <span className="eyebrow anim-fade-up">Industries</span>
        <h1 className="h-display mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl anim-fade-up">
          Built for the businesses that live on WhatsApp.
        </h1>
        <p className="lead mt-5 max-w-2xl anim-fade-up">
          Every industry preset comes pre-loaded with the right services, prices and answers —
          so your AI receptionist sounds like it has worked at your front desk for years.
        </p>
      </section>

      {/* Industry sections */}
      <section className="container-x grid gap-6 pb-8 md:grid-cols-2">
        {INDUSTRIES.map((industry) => (
          <article key={industry.slug} id={industry.slug} className="card card-pad flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                {industry.icon}
              </span>
              <Link
                href="/demo"
                className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
              >
                Try this industry in the live demo →
              </Link>
            </div>
            <h2 className="h-display mt-5 text-2xl">{industry.name}</h2>
            <p className="mt-2 leading-relaxed text-slate-600">{industry.blurb}</p>

            <h3 className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-400">What it handles</h3>
            <ul className="mt-3 space-y-2.5">
              {industry.useCases.map((useCase) => (
                <li key={useCase} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">✓</span>
                  {useCase}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-400">Sample services in the demo</h3>
            <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {industry.sampleServices.map((service) => (
                <li key={service.name} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="text-slate-700">{service.name}</span>
                  <span className="font-semibold text-ink-950">{service.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Sample prices shown in the demo preset — your own prices are configured in your workspace.
            </p>
          </article>
        ))}

        {/* Online stores — coming soon */}
        <article className="card card-pad flex flex-col border-dashed bg-slate-50/60">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">🛍️</span>
          <h2 className="h-display mt-5 text-2xl">Online Stores</h2>
          <p className="mt-2 leading-relaxed text-slate-600">
            Order questions, delivery updates and product enquiries for e-commerce stores.
          </p>
          <span className="badge-demo mt-5 self-start">Coming soon</span>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            The online stores preset is not available yet. We are building it after the six
            presets above — join the waitlist and we will let you know when it launches.
          </p>
          <div className="mt-auto pt-6">
            <Link href="/#waitlist" className="btn-ghost">Join Waitlist</Link>
          </div>
        </article>
      </section>

      {/* Final CTA band */}
      <section className="container-x pb-20 pt-8">
        <div className="card card-pad bg-ink-950 text-center sm:p-12">
          <h2 className="h-display text-3xl text-white sm:text-4xl">Your industry, already loaded in the demo.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-300">
            Pick your industry preset in the live demo and watch the receptionist answer,
            quote prices and book — exactly as it would for your business.
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
