import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy — DeskFlow AI",
  description: "Privacy for DeskFlow AI: no server-side tracking, no accounts yet. Demo data stays in your browser.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="container-x max-w-3xl pb-20 pt-16 sm:pt-20">
        <span className="eyebrow">Privacy</span>
        <h1 className="h-display mt-5 text-4xl leading-tight sm:text-5xl">Privacy</h1>
        <p className="mt-4 text-sm text-slate-500">Last updated: 14 November 2026</p>

        <div className="mt-10 space-y-8 text-slate-700">
          <section>
            <h2 className="h-display text-xl text-ink-950">The short version</h2>
            <p className="mt-2 leading-relaxed">
              This site has no accounts, no login and no server database yet. We do not
              collect, store or sell your information on any server. Anything you type
              into the demo dashboard stays in your own browser.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">What stays in your browser</h2>
            <p className="mt-2 leading-relaxed">
              The demo dashboard, waitlist form and contact form save their data to your
              browser&apos;s local storage (on your device only) so the demo can work
              without a server. We never see that data. Clearing your browser data
              removes it.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">Waitlist and enquiries</h2>
            <p className="mt-2 leading-relaxed">
              When you join the waitlist or send an enquiry, your email app opens with a
              pre-filled message addressed to {SITE.contactEmail}. Your details are sent
              to us only if you press Send in your email app. We use that email only to
              reply about DeskFlow AI availability — we do not share it or sell it.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">Cookies and tracking</h2>
            <p className="mt-2 leading-relaxed">
              We do not set tracking cookies and do not run third-party analytics on this
              site. The only storage used is your browser&apos;s local storage for the demo,
              as described above.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">The $9 template (Gumroad)</h2>
            <p className="mt-2 leading-relaxed">
              If you buy the self-hosted n8n template, that purchase happens on Gumroad
              and is covered by Gumroad&apos;s privacy policy — we do not receive your
              payment details.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">Changes</h2>
            <p className="mt-2 leading-relaxed">
              When accounts, a real database or analytics arrive, this page will be
              updated to say exactly what is collected and why. Until then, the rule
              above stands: nothing leaves your browser unless you send it yourself.
            </p>
          </section>

          <section>
            <h2 className="h-display text-xl text-ink-950">Contact</h2>
            <p className="mt-2 leading-relaxed">
              Privacy questions:{" "}
              <a href={`mailto:${SITE.contactEmail}`} className="font-semibold text-brand-700 underline underline-offset-2">
                {SITE.contactEmail}
              </a>
              . See also our{" "}
              <Link href="/terms" className="font-semibold text-brand-700 underline underline-offset-2">
                Terms of use
              </Link>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
