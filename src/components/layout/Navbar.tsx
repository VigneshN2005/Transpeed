"use client";

import Link from "next/link";
import { useState } from "react";
import Container from "@/components/ui/Container";
import Logo from "@/components/layout/Logo";
import { services } from "@/data/services";

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
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/"
            className="whitespace-nowrap text-sm font-medium text-zinc-700 transition-colors hover:text-brand"
          >
            Home
          </Link>

          <div className="group relative">
            <Link
              href="/services"
              className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-zinc-700 transition-colors hover:text-brand"
            >
              Services
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mt-0.5">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
            <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-1 rounded-xl border border-zinc-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services#${service.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-brand"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/company"
            className="whitespace-nowrap text-sm font-medium text-zinc-700 transition-colors hover:text-brand"
          >
            Company
          </Link>
          <Link
            href="/people"
            className="whitespace-nowrap text-sm font-medium text-zinc-700 transition-colors hover:text-brand"
          >
            People
          </Link>
          <Link
            href="/announcements"
            className="whitespace-nowrap text-sm font-medium text-zinc-700 transition-colors hover:text-brand"
          >
            Client Announcements
          </Link>
          <Link
            href="/contact"
            className="whitespace-nowrap text-sm font-medium text-zinc-700 transition-colors hover:text-brand"
          >
            Contact Us
          </Link>
          <Link
            href="/admin"
            className="whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 transition-colors hover:border-brand hover:text-brand"
          >
            Admin
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-300 lg:hidden"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>☰
        </button>
      </Container>

      {mobileOpen && (
        <nav className="border-t border-zinc-200 bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-brand"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-brand"
            >
              Services
              <span>{mobileServicesOpen ? "−" : "+"}</span>
            </button>
            {mobileServicesOpen && (
              <div className="ml-3 flex flex-col gap-1 border-l border-zinc-200 pl-3">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services#${service.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-2 py-1.5 text-sm text-zinc-600 hover:text-brand"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}

            {[
              { href: "/company", label: "Company" },
              { href: "/people", label: "People" },
              { href: "/announcements", label: "Client Announcements" },
              { href: "/contact", label: "Contact Us" },
              { href: "/admin", label: "Admin" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
