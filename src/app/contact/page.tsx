import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/ui/PageHero";
import ContactReveal from "@/components/contact/ContactReveal";
// Renamed on import (2026-09-14, per Vignesh's scroll-reveal request) to
// avoid a name collision with the existing ContactReveal component above,
// which is unrelated (handles the contact-channel buttons in the hero).
import ScrollReveal from "@/components/ui/Reveal";
import { locations, overseasPresence } from "@/data/contact";

export const metadata = {
  title: "Contact Us | Transpeed Logistics",
};

// Map-pin glyph used on every location card and PinIcon variant is also
// reused (outline only) inside the overseas chips.
function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5z" />
    </svg>
  );
}

// Flag emoji per overseas country — falls back to the plain globe tile
// (below) for any name not in this list rather than guessing.
const COUNTRY_FLAGS: Record<string, string> = {
  USA: "🇺🇸",
  "United States": "🇺🇸",
  Singapore: "🇸🇬",
  Germany: "🇩🇪",
  Italy: "🇮🇹",
};

export default function ContactPage() {
  return (
    <>
      {/* Every contact channel is right here on the card — no button to
          press first — so the hero copy invites rather than gates. */}
      <PageHero
        eyebrow="Contact Us"
        title="Let's Talk Logistics"
        description="However you'd rather reach us — WhatsApp, a call, an email, or our chatbot — pick whichever's fastest. No forms to fill in first."
      >
        <ContactReveal />
      </PageHero>

      {/* Soft brand-red top glow behind the content area (2026-09-14, per
          Vignesh, relaying meeting feedback that the site read as "pure
          white and plain" and needed actual colour). Top-right this time,
          for a bit of variety against the other pages' top-center/top-left
          glows. */}
      <section className="relative bg-[radial-gradient(ellipse_70%_50%_at_80%_0%,rgba(255,49,49,0.07),transparent_60%)]">
        <Container className="space-y-16 py-20">
          <div>
            <ScrollReveal>
              <SectionHeading eyebrow="Where We Are" title="Our Locations" />
            </ScrollReveal>
            {/* Redesigned (2026-09-15, per Vignesh: "make this our locations
                and overseas also look better"). The headquarters card is now
                visually distinct (dark, brand-lit, its own pin) rather than
                just a small "HQ" pill lost in an otherwise identical stack
                of cards — a real-office pin icon replaced the plain oversized
                ghost numeral, and every card gets a top accent bar plus a
                proper hover lift. */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {locations.map((location, i) => (
                <ScrollReveal key={location.city} delay={Math.min(i * 60, 240)}>
                  {location.isHeadquarters ? (
                    <div className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-[#241414] to-brand-dark p-6 text-white shadow-[0_20px_45px_-20px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1">
                      <div
                        className="pointer-events-none absolute inset-0 opacity-25"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                        }}
                        aria-hidden="true"
                      />
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-[0_0_0_3px_rgba(255,49,49,0.25)]">
                        <PinIcon className="h-5 w-5" />
                      </span>
                      <p className="relative mt-4 flex flex-wrap items-center gap-2 text-lg font-bold">
                        {location.city}
                        <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                          Headquarters
                        </span>
                      </p>
                      <p className="relative mt-2 text-sm leading-relaxed text-white/60">
                        {location.address}
                      </p>
                    </div>
                  ) : (
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl">
                      <span
                        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand/60 via-brand to-brand/60"
                        aria-hidden="true"
                      />
                      <span
                        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand/[0.06] blur-xl transition-opacity group-hover:bg-brand/[0.12]"
                        aria-hidden="true"
                      />
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-[#c81616] text-white shadow-md shadow-brand/20 transition-transform group-hover:scale-105">
                        <PinIcon className="h-5 w-5" />
                      </span>
                      <p className="relative mt-4 flex flex-wrap items-center gap-2 text-lg font-bold text-brand-dark">
                        {location.city}
                        {location.isBranch && (
                          <span className="rounded-full bg-brand-dark px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                            Branch
                          </span>
                        )}
                      </p>
                      <p className="relative mt-2 text-sm leading-relaxed text-zinc-500">{location.address}</p>
                    </div>
                  )}
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div>
            <ScrollReveal>
              <SectionHeading
                eyebrow="Global Network"
                title="Overseas Sourcing & Procurement Offices"
              />
            </ScrollReveal>
            {/* Given the same full card treatment as the location grid
                above (icon tile + top accent bar + hover lift) rather than
                the plain flat pills these used to be — a dark icon tile
                (vs. the domestic offices' brand-red one) and a country flag
                keep the two grids reading as related but distinct. */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {overseasPresence.map((country, i) => (
                <ScrollReveal key={country} delay={Math.min(i * 30, 240)}>
                  <div className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl">
                    <span
                      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-dark/50 via-brand-dark to-brand-dark/50"
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand/[0.06] blur-xl transition-opacity group-hover:bg-brand/[0.12]"
                      aria-hidden="true"
                    />
                    <div className="relative flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-dark to-[#3a1f1f] text-lg text-white shadow-md transition-transform group-hover:scale-105">
                        {COUNTRY_FLAGS[country] ?? <GlobeIcon className="h-5 w-5" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-brand-dark">{country}</p>
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Sourcing Office
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
