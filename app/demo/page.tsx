import type { Metadata } from "next";
import WhatsAppSimulator from "@/components/whatsapp-simulator";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Live Demo — DeskFlow AI",
  description:
    "Try the DeskFlow AI WhatsApp receptionist live: pick an industry, send a message, and watch it quote prices, book appointments and sync to Calendar and n8n. Simulated demo.",
};

export default function DemoPage() {
  return (
    <main className="container-x py-12 sm:py-16">
      <header className="mx-auto max-w-3xl text-center">
        <span className="eyebrow">Live Demo</span>
        <h1 className="h-display mt-4 text-4xl sm:text-5xl">Try the live demo</h1>
        <p className="lead mt-4">
          Pick an industry, send a message, and watch the AI receptionist quote real
          prices in USD, confirm a booking, and sync it to Calendar and n8n — all in
          seconds, exactly as your customers would experience it.
        </p>
        <p className="mt-4">
          <span className="badge-demo">Demo — simulated replies</span>
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
