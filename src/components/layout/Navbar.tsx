"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import Container from "@/components/ui/Container";
import Logo from "@/components/layout/Logo";
import { services } from "@/data/services";
import { useQuote } from "@/components/quote/QuoteProvider";

// CEVA-style dropdown nav: Services reveals all six services on hover
// (desktop) or tap-to-expand (mobile). "Admin" is included per the
// architecture brief's explicit instruction to add it as its own nav item.
//
// Breakpoint note (2026-09-14, per Vignesh's mobile/desktop-fit pass): the
// full horizontal nav was measured overflowing its container at real
// in-between widths (e.g. 851px, a common small-laptop/tablet-landscape
// size) — "Client Announcements" and "Contact Us" wrapped mid-word and the
// Admin pill got clipped past the edge. The row simply needs more room than
// the old md (768px) breakpoint gave it, so the switch to the hamburger
// menu now happens at lg (1024px) instead, and the gap between items was
// tightened (gap-8 -> gap-6) with whitespace-nowrap added so no link can
// ever wrap mid-phrase again even right at the edge of that breakpoint.
// Small helper for the top-level text links (2026-09-25, per Vignesh:
// "can anything be done to this" re: the plain white/black navbar) — a
// red-gradient underline that grows in on hover instead of just a color
// change, so the bar reads as branded rather than a generic corporate nav.
function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative whitespace-nowrap py-1 text-sm font-medium text-white/80 transition-colors hover:text-brand"
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-brand-dark transition-transform duration-200 group-hover:scale-x-100"
      />
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openQuote } = useQuote();
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-dark/95 shadow-[0_1px_0_rgba(0,0,0,0.2),0_16px_32px_-24px_rgba(0,0,0,0.5)] backdrop-blur">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"
      />
      <Container className="flex h-20 items-center justify-between">
        <Logo variant="dark" />

        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink href="/">Home</NavLink>

          <div className="group relative">
            <Link
              href="/services"
              className="flex items-center gap-1 whitespace-nowrap py-1 text-sm font-medium text-white/80 transition-colors hover:text-brand"
            >
              Services
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mt-0.5">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-brand-dark transition-transform duration-200 group-hover:scale-x-100"
            />
            <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-1 rounded-xl border border-white/10 bg-brand-dark p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services#${service.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-brand"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          <NavLink href="/company">Company</NavLink>
          <NavLink href="/people">People</NavLink>
          <NavLink href="/announcements">News & Updates</NavLink>
          <NavLink href="/contact">Contact Us</NavLink>
          {/* Admin button removed (2026-10-03, per Sharanya via Vignesh):
              the admin now lives at a private address that isn't linked
              anywhere on the public site. See middleware.ts. Its spot is
              now the always-visible "Get a Quote" call to action. */}
          <button
            type="button"
            onClick={() => openQuote()}
            className="btn-glint whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#FF3131,#B91C1C)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_4px_12px_-2px_rgba(255,49,49,0.4)] transition-transform hover:scale-105"
          >
            Get a Quote
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>☰
        </button>
      </Container>

      {mobileOpen && (
        <nav className="border-t border-white/10 bg-brand-dark lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-brand"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium text-white/80 hover:bg-white/10 hover:text-brand"
            >
              Services
              <span>{mobileServicesOpen ? "−" : "+"}</span>
            </button>
            {mobileServicesOpen && (
              <div className="ml-3 flex flex-col gap-1 border-l border-white/10 pl-3">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services#${service.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-2 py-1.5 text-sm text-white/70 hover:text-brand"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}

            {[
              { href: "/company", label: "Company" },
              { href: "/people", label: "People" },
              { href: "/announcements", label: "News & Updates" },
              { href: "/contact", label: "Contact Us" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openQuote();
              }}
              className="mt-2 rounded-full bg-[linear-gradient(135deg,#FF3131,#B91C1C)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Get a Quote
            </button>
          </Container>
        </nav>
      )}
    </header>
  );
}
