"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

const PLAN_OPTIONS = ["Starter", "Growth", "Pro", "Agency"] as const;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [planInterest, setPlanInterest] = useState<string>("Growth");
  const [message, setMessage] = useState("");
  const [joinWaitlist, setJoinWaitlist] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !businessName.trim() || !workEmail.trim() || !message.trim()) {
      setError("Please fill in all fields before sending.");
      return;
    }
    const payload = {
      name: name.trim(),
      businessName: businessName.trim(),
      workEmail: workEmail.trim(),
      planInterest,
      message: message.trim(),
      joinWaitlist,
      submittedAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("deskflow-contact") ?? "[]");
      const list = Array.isArray(existing) ? existing : [existing];
      list.push(payload);
      localStorage.setItem("deskflow-contact", JSON.stringify(list));
    } catch {
      // Local storage unavailable — mailto below still delivers the enquiry.
    }
    // No backend yet: open the visitor's email app with the enquiry pre-filled
    // and addressed to us. The enquiry reaches us only when they press Send.
    const subject = `DeskFlow AI enquiry — ${businessName.trim()} (${planInterest})`;
    const body = [
      "Hi DeskFlow AI team,",
      "",
      `Name: ${name.trim()}`,
      `Business: ${businessName.trim()}`,
      `Work email: ${workEmail.trim()}`,
      `Plan interest: ${planInterest}`,
      `Join waitlist: ${joinWaitlist ? "Yes" : "No"}`,
      "",
      "Message:",
      message.trim(),
    ].join("\n");
    window.location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setError("");
    setSubmitted(true);
  }

  function handleReset() {
    setName("");
    setBusinessName("");
    setWorkEmail("");
    setPlanInterest("Growth");
    setMessage("");
    setJoinWaitlist(true);
    setSubmitted(false);
  }

  return (
    <main>
      {/* Page header */}
      <section className="container-x pb-10 pt-16 sm:pt-20">
        <span className="eyebrow anim-fade-up">Contact</span>
        <h1 className="h-display mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl anim-fade-up">
          Talk to us about your business.
        </h1>
        <p className="lead mt-5 max-w-2xl anim-fade-up">
          Sales and enterprise enquiries, Agency plans, or a question about the right setup
          for your business — send us a message and we will get back to you.
        </p>
      </section>

      <section className="container-x grid gap-8 pb-8 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="card card-pad text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-700">✓</span>
              <h2 className="h-display mt-5 text-2xl">Your email app should now be open.</h2>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-600">
                Press <strong className="text-ink-950">Send</strong> in your email app to deliver
                your enquiry to {SITE.contactEmail} — that is what actually sends it to us.
                We also saved a copy in this browser.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
                If no email app opened, email {SITE.contactEmail} directly. We read every
                enquiry that reaches us and reply as soon as we can.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/demo" className="btn-accent">Try Live Demo →</Link>
                <button type="button" onClick={handleReset} className="btn-ghost">
                  Send another enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card card-pad space-y-5">
              <div>
                <label htmlFor="contact-name" className="label">Your name</label>
                <input
                  id="contact-name"
                  type="text"
                  className="input"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-business" className="label">Business name</label>
                <input
                  id="contact-business"
                  type="text"
                  className="input"
                  placeholder="Your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="label">Work email</label>
                <input
                  id="contact-email"
                  type="email"
                  className="input"
                  placeholder="you@yourbusiness.com"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-plan" className="label">Plan interest</label>
                <select
                  id="contact-plan"
                  className="input"
                  value={planInterest}
                  onChange={(e) => setPlanInterest(e.target.value)}
                >
                  {PLAN_OPTIONS.map((plan) => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="label">Message</label>
                <textarea
                  id="contact-message"
                  className="input min-h-[140px] resize-y"
                  placeholder="Tell us about your business, your message volume, and what you need the receptionist to handle."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-brand-600"
                  checked={joinWaitlist}
                  onChange={(e) => setJoinWaitlist(e.target.checked)}
                />
                Join the waitlist — let me know when DeskFlow AI is ready for my business.
              </label>
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
              )}
              <button type="submit" className="btn-primary w-full sm:w-auto">
                Send enquiry →
              </button>
              <p className="text-xs leading-relaxed text-slate-500">
                Your enquiry opens in your email app, addressed to {SITE.contactEmail} — send
                it from there. A copy is also saved in this browser.
              </p>
            </form>
          )}
        </div>

        {/* Side info */}
        <aside className="space-y-6 lg:col-span-2">
          <div className="card card-pad">
            <h2 className="h-display text-xl">What happens next?</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">1</span>
                We read your enquiry and match it to the right plan or setup.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">2</span>
                We read every enquiry that reaches us and reply as soon as we can.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">3</span>
                For Agency enquiries, we arrange a short call to scope your workspaces.
              </li>
            </ul>
            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              We reply to every enquiry that reaches us.
            </p>
          </div>
          <div className="card card-pad bg-gradient-to-br from-brand-50 to-white">
            <h2 className="h-display text-xl">Want to see it first?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              The live demo shows the receptionist answering, booking and handing off —
              no setup, no account needed.
            </p>
            <Link href="/demo" className="btn-primary mt-5">Try Live Demo →</Link>
          </div>
          <div className="card card-pad">
            <h2 className="h-display text-xl">Prefer to explore first?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Compare plans and limits, or read the setup guides before you talk to us.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/pricing" className="btn-ghost !px-4 !py-2 text-xs">Pricing</Link>
              <Link href="/docs" className="btn-ghost !px-4 !py-2 text-xs">Docs</Link>
              <Link href="/features" className="btn-ghost !px-4 !py-2 text-xs">Features</Link>
            </div>
          </div>
        </aside>
      </section>

      {/* Final CTA band */}
      <section className="container-x pb-20 pt-8">
        <div className="card card-pad bg-ink-950 text-center sm:p-12">
          <h2 className="h-display text-3xl text-white sm:text-4xl">Not ready to talk yet?</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-300">
            Try the live demo, or join the waitlist and we will let you know when your
            workspace is ready.
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
