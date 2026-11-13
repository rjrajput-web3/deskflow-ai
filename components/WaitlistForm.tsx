"use client";

import { useState } from "react";
import { INDUSTRIES, SITE } from "@/lib/site";

const STORAGE_KEY = "deskflow-waitlist";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !businessName.trim() || !industry) {
      setError("Please fill in your email, business name and industry.");
      return;
    }
    // Validate the email format before opening the mailto — "abc" is not an
    // email, and a malformed address would silently never reach us.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid work email address (e.g. you@yourbusiness.com).");
      return;
    }
    // No backend yet: keep a local record AND open the visitor's email app
    // with a pre-filled request addressed to us — that is how the request
    // actually reaches us. Never claim it was "sent" when it only sits here.
    try {
      const entry = { email: email.trim(), businessName: businessName.trim(), industry, joinedAt: new Date().toISOString() };
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? (JSON.parse(raw) as unknown[]) : [];
      list.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Local storage unavailable (e.g. private mode) — mailto still works.
    }
    const subject = "DeskFlow AI Waitlist";
    const body = [
      "Hi DeskFlow AI team,",
      "",
      "Please add me to the waitlist.",
      "",
      `Name / business: ${businessName.trim()}`,
      `Work email: ${email.trim()}`,
      `Industry: ${industry}`,
      "",
      "Thanks!",
    ].join("\n");
    window.location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDone(true);
  }

  if (done) {
    return (
      <div className="card card-pad text-center" role="status">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl text-brand-700" aria-hidden="true">
          ✓
        </div>
        <p className="font-display text-xl font-bold text-ink-950">Your email app should now be open.</p>
        <p className="mt-2 text-slate-600">
          Press <strong className="text-ink-950">Send</strong> in your email app to deliver your
          waitlist request to {SITE.contactEmail} — that is what actually puts you on the
          list. We also saved your details in this browser as a backup.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          If no email app opened, email {SITE.contactEmail} directly with your name,
          business and industry.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card card-pad" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="waitlist-email" className="label">Work email</label>
          <input
            id="waitlist-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            className="input"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="waitlist-business" className="label">Business name</label>
          <input
            id="waitlist-business"
            type="text"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your business name"
            className="input"
            autoComplete="organization"
          />
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="waitlist-industry" className="label">Industry</label>
        <select
          id="waitlist-industry"
          required
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="input"
        >
          <option value="" disabled>Select your industry</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind.slug} value={ind.name}>{ind.name}</option>
          ))}
          <option value="Other">Other</option>
        </select>
      </div>
      {error && (
        <p className="mt-4 text-sm font-medium text-red-600" role="alert">{error}</p>
      )}
      <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
        Join the Waitlist
      </button>
      <p className="mt-3 text-xs text-slate-500">
        Your email app will open with a pre-filled request addressed to {SITE.contactEmail} —
        send it to join. We don&rsquo;t store your email on a server yet.
      </p>
    </form>
  );
}
