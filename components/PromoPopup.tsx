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
 * the session).
 *
 * Mobile fix (audit #3): on small screens this is a single-line dismissible
 * pill pinned to the bottom edge — never the tall card that used to cover
 * the waitlist submit button at 390px. While any form field (waitlist,
 * contact, demo composer, dashboard input) is focused the popup hides
 * entirely, and the body gets bottom padding on mobile so page content can
 * scroll clear of the pill.
 */
export default function PromoPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [formFocused, setFormFocused] = useState(false);

  useEffect(() => {
    if (!SHOW_ON.includes(pathname)) return;
    try {
      if (window.sessionStorage.getItem(DISMISSED_KEY) === "1") return;
    } catch {
      // sessionStorage unavailable — still show
    }
    setVisible(true);
  }, [pathname]);

  // Auto-hide while a form/composer field is focused, anywhere on the page.
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) {
        setFormFocused(true);
      }
    };
    const onFocusOut = () => setFormFocused(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // Reserve bottom space on mobile while the pill is up, so no CTA can sit
  // underneath it. Removed again when the pill hides or is dismissed.
  useEffect(() => {
    if (!visible || formFocused) {
      document.body.classList.remove("promo-pill-space");
      return;
    }
    document.body.classList.add("promo-pill-space");
    return () => document.body.classList.remove("promo-pill-space");
  }, [visible, formFocused]);

  if (!visible || formFocused) return null;

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
      className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:bottom-auto md:left-auto md:right-4 md:top-1/2 md:translate-x-0 md:-translate-y-1/2"
      role="complementary"
      aria-label="50 percent off the DeskFlow n8n template"
      data-testid="promo-popup"
    >
      {/* Mobile: one-line pill. Desktop: the full card. */}
      <div className="anim-shake relative">
        <a
          href={SITE.gumroadTemplate}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get the DeskFlow n8n template — 50 percent off, $9 on Gumroad"
          className="flex items-center gap-2 whitespace-nowrap rounded-full border border-brand-600/30 bg-white py-2 pl-2 pr-9 text-center shadow-xl shadow-slate-900/15 transition hover:shadow-2xl md:w-[168px] md:flex-col md:gap-1 md:whitespace-normal md:rounded-2xl md:px-3 md:py-3"
        >
          <Image src="/logo.svg" alt="DeskFlow AI" width={36} height={36} className="h-6 w-6 md:h-9 md:w-9" />
          <span className="font-display text-sm font-bold leading-none text-brand-700 md:text-lg">
            50% OFF
          </span>
          <span className="text-[11px] font-semibold leading-tight text-ink-950 md:block">
            n8n Template — only $9
          </span>
          <span className="hidden text-[11px] leading-tight text-slate-500 line-through md:block">
            Regular $19
          </span>
          <span className="hidden rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold text-white md:block">
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
