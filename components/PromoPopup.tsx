"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

const DISMISSED_KEY = "deskflow-promo-dismissed";
const SHOW_ON = ["/", "/demo", "/pricing"];

/**
 * 50% OFF side popup — advertises the $9 self-hosted n8n template.
 * Clicking it opens the Gumroad BUY page in a new tab (NOT the demo).
 * Gentle shake every few seconds; dismissible with × (stays dismissed for
 * the session). Sits mid-right on desktop and above the bottom edge on
 * mobile so it never covers main CTAs or the chat input.
 */
export default function PromoPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!SHOW_ON.includes(pathname)) return;
    try {
      if (window.sessionStorage.getItem(DISMISSED_KEY) === "1") return;
    } catch {
      // sessionStorage unavailable — still show
    }
    setVisible(true);
  }, [pathname]);

  if (!visible) return null;

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <div
      className="fixed bottom-24 right-2 z-40 md:bottom-auto md:right-4 md:top-1/2 md:-translate-y-1/2"
      role="complementary"
      aria-label="50 percent off the DeskFlow n8n template"
    >
      <div className="anim-shake relative">
        <a
          href={SITE.gumroadTemplate}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get the DeskFlow n8n template — 50 percent off, $9 on Gumroad"
          className="flex w-[148px] flex-col items-center gap-1 rounded-2xl border border-brand-600/30 bg-white px-3 py-3 text-center shadow-xl shadow-slate-900/15 transition hover:shadow-2xl md:w-[168px]"
        >
          <Image src="/logo.svg" alt="DeskFlow AI" width={36} height={36} className="h-9 w-9" />
          <span className="font-display text-lg font-bold leading-none text-brand-700">50% OFF</span>
          <span className="text-[11px] font-semibold leading-tight text-ink-950">
            n8n Template — only $9
          </span>
          <span className="text-[11px] leading-tight text-slate-500 line-through">Regular $19</span>
          <span className="mt-0.5 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold text-white">
            Get it now →
          </span>
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss this offer"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-bold leading-none text-slate-500 shadow hover:text-ink-950"
        >
          ×
        </button>
      </div>
    </div>
  );
}
