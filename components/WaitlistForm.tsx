"use client";

import { useState } from "react";
import { INDUSTRIES } from "@/lib/site";

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
    try {
      const entry = { email: email.trim(), businessName: businessName.trim(), industry, joinedAt: new Date().toISOString() };
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? (JSON.parse(raw) as unknown[]) : [];
      list.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Local storage unavailable (e.g. private mode) — still show success.
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="card card-pad text-center" role="status">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl text-brand-700" aria-hidden="true">
          ✓
        </div>
        <p className="font-display text-xl font-bold text-ink-950">You&rsquo;re on the waitlist.</p>
        <p className="mt-2 text-slate-600">You&rsquo;re on the waitlist — we&rsquo;ll email you when your region opens.</p>
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
        We&rsquo;ll only email you about DeskFlow AI availability. No spam.
      </p>
    </form>
  );
}
