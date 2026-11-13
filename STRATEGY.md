# DeskFlow AI — Strategy (Source of Truth)

**Product:** DeskFlow AI — Your 24/7 Business Operations Assistant
**Tagline:** "Your Business Never Misses a Customer."
**Live site:** https://deskflowai.vercel.app (target; see Deployment)
**Repo:** https://github.com/rjrajput-web3/deskflow-ai (public, MIT)
**Owner:** Smart Start Guides / Rohit Rajput (brand identity only — zero PII on public pages)

## 1. Vision

DeskFlow AI is a premium international SaaS for English-speaking markets
(USA, UK, Canada, Australia + others). It answers every customer message
24/7, explains services and prices, books appointments, collects leads,
sends follow-ups, hands difficult queries to human staff, and sends the
business owner a daily performance report.

It is NOT just a WhatsApp chatbot. Future scope: WhatsApp AI receptionist,
website live chat, voice AI receptionist, appointment management, lead
generation, customer support, automated follow-ups.

The existing **$9 n8n template stays a SEPARATE product** — the demo at
https://deskflow-receptionist.vercel.app and the Gumroad listing
https://smartstartguideshq.gumroad.com/l/deskflow-whatsapp-receptionist
are untouched and linked from this site as the Live Demo / self-hosted
one-time option. Template sales and SaaS subscriptions are separate.

## 2. Pricing (binding — never promise "unlimited")

| Plan | Price | Replies / month | Highlights |
|---|---|---|---|
| Starter | $19/mo | 500 AI replies | 1 WhatsApp channel, basic FAQ answers, email summary |
| Growth | $49/mo | 2,500 AI replies | Appointment booking, PDF/URL knowledge base, Lead CRM, automated follow-ups |
| Pro | $99/mo | 10,000 AI replies | Multi-staff human handoff, advanced conversion analytics, Calendar + webhook integrations, daily owner reports |
| Agency | Custom | Custom limits | Multi-workspace client management, white-label options |

WhatsApp / AI / voice usage costs are calculated separately or included
with clearly defined usage limits. No plan promises unlimited usage.

## 3. The 8 modules

1. **WhatsApp AI Receptionist** — 24/7 replies on the official Meta Cloud API.
2. **Website Live Chat** — the same receptionist on the business website.
3. **Voice AI Receptionist** — phone answering + voice notes (add-on).
4. **Lead Management CRM** — customer details, lead status, notes, follow-up history.
5. **Automation Engine** — n8n workflows, notifications, routing, scheduled follow-ups.
6. **Analytics Dashboard** — messages, leads, bookings, response times, conversion rates.
7. **Human Handoff** — staff takeover, escalation, full conversation history.
8. **SaaS Administration** — subscriptions, billing, usage limits, tenant management,
   permissions + a separate super-admin panel for the owner.

## 4. Industry templates (ready-to-use AI receptionists)

Dental clinics · Hotels · Restaurants · Salons · Real estate · Auto services ·
Online stores. Each ships with services, USD prices, hours, FAQs and booking
behaviour pre-configured.

## 5. Onboarding flow (7 steps)

1. Create an account → 2. Create workspace → 3. Configure business (name,
   services, prices, hours, policies) → 4. Connect WhatsApp (Meta onboarding)
   → 5. Train AI (PDF / URL / FAQ upload) → 6. Test receptionist
   → 7. Activate subscription → Monitor dashboard.

## 6. Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 + TypeScript (App Router) |
| UI | Tailwind CSS 3 + shadcn-style components, Space Grotesk + Inter |
| Hosting | Vercel (Hobby, free, no card) |
| Database | Supabase PostgreSQL (free tier) |
| Auth | Supabase Auth — **DEFERRED, see §8** |
| AI | Gemini (free tier) / OpenAI — live only via server env key |
| WhatsApp | Official Meta Cloud API (sandbox first) |
| Automation | n8n (subject to licensing) |
| Calendar | Google Calendar API |
| Storage | Supabase Storage |
| Analytics | PostHog (later) |
| Errors | Sentry (later) |

## 7. Phases

- **Phase 1 — Premium marketing website (Sprint 1, DONE):** Home, Features,
  How It Works, Industries, Live Demo (6 verticals + Custom, interactive
  WhatsApp simulator), Pricing, Integrations, Docs, Contact. CTAs: Try Live
  Demo + Join Waitlist / Contact.
- **Phase 2 — Business dashboard + super admin (Sprint 2, DONE as open demo):**
  `/dashboard` (setup, knowledge-base trainer, Gemini test sandbox, inbox with
  human takeover, Leads CRM, appointments, analytics + daily report) and
  `/admin` (tenants, plans/usage, logs, revenue overview). Open demo access,
  clearly labelled demo data. Webhook endpoint `/api/webhooks/whatsapp` ready.
- **Phase 3 — Real WhatsApp integration:** Meta onboarding, webhook
  verification, message handling, templates, delivery status.
- **Phase 4 — CRM + bookings:** Google Calendar integration, appointment
  confirmation + reminders.
- **Phase 5 — SaaS monetization:** subscriptions, payment integration, usage
  metering, invoices, plan restrictions. **Gated on provider eligibility +
  first revenue (see §8).**
- **Phase 6 — Super admin + analytics (production):** owner dashboard, revenue
  reports, customer controls, monitoring, logs.
- **Phase 7 — Testing + launch:** security, mobile, integration testing,
  backups, documentation, production deployment.

## 8. Binding rules

- **LOGIN / PAYMENT DEFERRED (user order 2026-11-14):** No login/signup pages
  and no payment/subscription/billing integration until a sale / money comes
  in. Real Supabase Auth + payments are Phase-later, gated on first sale /
  revenue. Until then the dashboard is an open demo with labelled demo data.
- **FREE-TIER-FIRST:** No paid subscription, API credit or service is activated
  without the user's explicit permission. Paid APIs → free alternative or mock
  testing. Live customers earning first, then paid infrastructure.
- **ZERO CARD:** Vercel only. Never Render / Koyeb / Railway / Fly.io / AWS / GCP.
- **ZERO PII:** Never publish his personal address, city, phone or documents
  on any public page. Public brand identity only.
- **SEPARATION:** The $9 template + existing demo stay untouched and are linked
  as the self-hosted option. Never promise unlimited usage (see §2 caps).
- **BRANDING:** DeskFlow AI has its own bespoke SVG logo + favicon. Never reuse
  the Smart Start Guides rocket+book logo, the PulseNode logo, or the NoteWise logo.
- **VERIFICATION (Rule #11):** Every sprint verified twice — every page HTTP 200,
  zero console/404/500 errors, desktop + true-mobile screenshots opened and
  checked, no secrets in the repo (grep `.env` values, keys, webhooks before
  every commit).

## 9. Supabase schema (Sprint 2, demo-ready)

Tables (see `docs/supabase-schema.sql`): `workspaces`, `services`,
`knowledge_docs`, `conversations`, `leads`, `appointments`, `subscriptions`,
`usage_logs`. All workspace-scoped (multi-tenant). The live site runs in
**demo mode** (localStorage-backed store, `lib/store.ts`) until Supabase env
vars are configured — no auth gates, no login wall.

## 10. What needs the user's step (not built yet)

- Meta WhatsApp Business onboarding (his Meta Business account + phone number).
- Payment provider eligibility (Stripe/PayPal) — only after first sale.
- Supabase project creation + env keys — only when real auth/database is wanted.
- Gemini API key in Vercel env — only to switch the AI Test Sandbox from its
  built-in mock responder to live Gemini responses.
- Payhip: no DeskFlow product exists there — link Gumroad only (verified
  2026-11-13; do not invent a Payhip URL).

## 11. QA fix pass — 2026-11-14 (independent audit, all 13 gaps + 3 new reqs)

- Honest copy only: no backend exists yet — waitlist/contact open the
  visitor's mail app (mailto xyzcryp0@gmail.com) + localStorage backup; no
  "reply within 1 business day" promise anywhere.
- Calendar sync: demo bookings are provisional; real Google Calendar sync is
  a Pro integration set up after onboarding (never "automatic" today).
- Demo responder: hotel bookings use stay dates/nights (no clock time);
  service names render cleanly ("Deluxe room (per night)"); voice-note
  reschedule creates a matching booking card + counts in the ⚡ drawer.
- One canonical name per business everywhere (Oakridge Dental Studio,
  Harborview Realty, Velour Salon & Spa, Kinetix Gear, Custom Business);
  dental hours Mon–Sat 10 AM–8 PM, Sun closed, everywhere.
- One seeded dataset: Overview 14-day totals = Analytics (396 / 46 / 31);
  CRM 5 leads / $603 pipeline / 4 conversations; funnel conversion from the
  funnel itself (2 of 4 = 50%). All seeded appointments inside opening hours
  (store key bumped to v2 so old seeds are replaced).
- Industries: Online Stores preset built for real + Custom Business card;
  footer links anchor to each card.
- /terms + /privacy added and linked in the footer.
- Mobile: no horizontal page scroll (overflow-x clip + min-w-0 fixes),
  dashboard headers wrap, week grid stacks on phones, setup/appointments
  forms stack, demo disclaimer sits above the chat scroll area, industry
  pills have a scroll fade + hint.
- Reveal animation uses `backwards` fill + reduced-motion override — content
  is visible by default.
- Voice AI labelled "Roadmap" everywhere it appears; no plan includes it.
- Docs point to the real Dashboard → Integrations page (new in Sprint 2);
  "arrives with the Supabase step" wording replaced with honest status.
- Drawer Close buttons sit above a plain-div overlay (always clickable);
  webhook JSON wraps; ⚡ counter is session-wide with per-business counts.
- 50% OFF side popup (Home/Demo/Pricing, desktop + mobile): real DeskFlow
  logo, gentle shake, × dismiss (session), click opens the Gumroad BUY page.
- Simulation banner links are real: Gumroad template + full WhatsApp demo,
  both new tab.
