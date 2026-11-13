import type { Metadata } from "next";
import WhatsAppSimulator from "@/components/whatsapp-simulator";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Live Demo — DeskFlow AI",
  description:
    "Try the DeskFlow AI WhatsApp receptionist live: pick an industry, send a message, and watch it quote prices, book appointments and see them in the Calendar & n8n drawer. Simulated demo.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <main className="container-x py-12 sm:py-16">
      <header className="mx-auto max-w-3xl text-center">
        <span className="eyebrow">Live Demo</span>
        <h1 className="h-display mt-4 text-4xl sm:text-5xl">Try the live demo</h1>
        <p className="lead mt-4">
          Pick an industry, send a message, and watch the AI receptionist quote real
          prices in USD, confirm a booking, and show it in the Calendar &amp; n8n drawer
          — all in seconds, exactly as your customers would experience it.
        </p>
        <p className="mt-4">
          <span className="badge-demo">Live simulation — simulated data, provisional bookings</span>
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
          Replies come from a live AI path when available — grounded in each
          business&rsquo;s real prices and hours — with an instant local fallback.
          Nothing here books a real appointment or sends a real message.
        </p>
      </header>

      <section className="mt-10" aria-label="Interactive WhatsApp demo">
        <WhatsAppSimulator />
      </section>

      <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-slate-600">
        This is an interactive simulation. For the real self-hosted template, see the{" "}
        <a
          href={SITE.gumroadTemplate}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-600"
        >
          $9 n8n template on Gumroad
        </a>
        . You can also{" "}
        <a
          href={SITE.demoUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-600"
        >
          open the full WhatsApp demo
        </a>
        .
      </p>
    </main>
  );
}
