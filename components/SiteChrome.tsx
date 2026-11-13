"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { INDUSTRIES, NAV_LINKS, SITE } from "@/lib/site";

const PRODUCT_LINKS = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Live Demo", href: "/demo" },
];

const RESOURCE_LINKS = [
  { label: "Integrations", href: "/integrations" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Dashboard and admin have their own shells — no marketing nav/footer there.
  const bare = pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname === "/admin" || pathname.startsWith("/admin/");
  if (bare) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-ink-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/demo" className="btn-accent !px-5 !py-2.5">Try Live Demo</Link>
            <Link href="/#waitlist" className="btn-ghost !px-5 !py-2.5">Join Waitlist</Link>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-ink-950 lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="text-xl leading-none">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden" aria-label="Mobile">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-950 transition hover:bg-brand-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/demo" className="btn-accent" onClick={() => setMenuOpen(false)}>Try Live Demo</Link>
                <Link href="/#waitlist" className="btn-ghost" onClick={() => setMenuOpen(false)}>Join Waitlist</Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-ink-950 text-slate-300">
        <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">Product</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">Industries</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {INDUSTRIES.map((ind) => (
                <li key={ind.slug}>
                  <Link href="/industries" className="transition hover:text-white">{ind.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">Resources</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">{link.label}</Link>
                </li>
              ))}
              <li>
                <a href={SITE.gumroadTemplate} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  Self-hosted $9 n8n template
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">DeskFlow AI</h3>
            <p className="mt-4 text-sm leading-relaxed">{SITE.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed">
              Built for businesses in the USA, UK, Canada, Australia and beyond.
            </p>
            <p className="mt-3 text-sm">
              <a href={`mailto:${SITE.contactEmail}`} className="text-brand-500 transition hover:text-brand-100">
                {SITE.contactEmail}
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-x flex flex-col gap-2 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 DeskFlow AI. All rights reserved.</p>
            <p>Demo data is clearly labelled where simulated.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
