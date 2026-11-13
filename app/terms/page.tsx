import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms — DeskFlow AI",
  description: "Terms for DeskFlow AI: a pre-launch demo site. No accounts, no payments yet.",
};

export default function TermsPage() {
  return (
    <main>
      <section className="container-x max-w-3xl pb-20 pt-16 sm:pt-20">
        <span className="eyebrow">Terms</span>
        <h1 className="h-display mt-5 text-4xl leading-tight sm:text-5xl">Terms of use</h1>
        <p className="mt-4 text-sm text-slate-500">Last updated: 14 November 2026</p>

        <div className="mt-10 space-y-8 text-slate-700">
          <section>
            <h2 className="h-display text-xl text-ink-950">What DeskFlow AI is</h2>
            <p className="mt-2 leading-relaxed">
              DeskFlow AI is a pre-launch product: a 24/7 AI receptionist for small
              businesses. This website is a marketing site and an interactive demo. There
              are no user accounts, no login, and no payments on this site yet — the live
              service, billing and real WhatsApp connections arrive after the first sale.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">The demo</h2>
            <p className="mt-2 leading-relaxed">
              The live demo is a simulation. The businesses, conversations, bookings,
              leads and numbers shown are fictional demo data. Demo bookings are
              provisional and are not real appointments, and no message you send in the
              demo reaches a real business or customer.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">Waitlist and enquiries</h2>
            <p className="mt-2 leading-relaxed">
              Joining the waitlist or sending an enquiry opens your own email app with a
              pre-filled message addressed to {SITE.contactEmail}. Nothing is sent until
              you press Send in your email app. A copy of your details is also saved in
              your own browser as a backup. Joining the waitlist does not create an
              account and does not guarantee access, pricing or availability.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">The $9 self-hosted template</h2>
            <p className="mt-2 leading-relaxed">
              The one-time $9 n8n template is sold separately on Gumroad by Smart Start
              Guides. That purchase is governed by Gumroad&apos;s terms and the template&apos;s
              own licence — it is not a DeskFlow AI subscription, and buying it does not
              create a DeskFlow AI account.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">Plans and pricing</h2>
            <p className="mt-2 leading-relaxed">
              Plan prices and reply limits shown on the Pricing page are the intended
              launch terms. Usage is metered — no plan includes unlimited usage. Exact
              limits, billing and cancellation terms are confirmed at signup, when the
              live service launches.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">No warranty</h2>
            <p className="mt-2 leading-relaxed">
              This site and the demo are provided &ldquo;as is&rdquo;, without warranties of any
              kind. We may change or remove any page, feature or demo content at any time.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">Contact</h2>
            <p className="mt-2 leading-relaxed">
              Questions about these terms:{" "}
              <a href={`mailto:${SITE.contactEmail}`} className="font-semibold text-brand-700 underline underline-offset-2">
                {SITE.contactEmail}
              </a>
              . See also our{" "}
              <Link href="/privacy" className="font-semibold text-brand-700 underline underline-offset-2">
                Privacy page
              </Link>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
