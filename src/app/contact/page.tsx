import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/ui/PageHero";
import ContactReveal from "@/components/contact/ContactReveal";
import GlassBackground from "@/components/ui/GlassBackground";
import ContactSideScene from "@/components/contact/ContactSideScene";
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
// (below) for any name not in this list rather than guessing. The 6 broader
// regions added 2026-09-21 (Far East, Central Asia, South Asia, South West
// Asia, Middle East, Africa) deliberately have no single flag and fall
// back to the globe tile; the 4 countries added alongside them do get one.
const COUNTRY_FLAGS: Record<string, string> = {
  USA: "🇺🇸",
  "United States": "🇺🇸",
  Singapore: "🇸🇬",
  Germany: "🇩🇪",
  Italy: "🇮🇹",
  Norway: "🇳🇴",
  Sweden: "🇸🇪",
  Denmark: "🇩🇰",
  Austria: "🇦🇹",
};

export default function ContactPage() {
  return (
    <>
      <GlassBackground page="contact" canvas="#4A4D52" />
      {/* Every contact channel is right here on the card — no button to
          press first — so the hero copy invites rather than gates. */}
      <PageHero
        scene="contact"
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
      <section id="contact-content" className="relative">
        <ContactSideScene targetId="contact-content" />
        <Container className="space-y-16 py-20">
          <div className="relative isolate overflow-hidden rounded-3xl border border-white/15 bg-brand-dark/55 p-6 shadow-[0_24px_55px_-14px_rgba(0,0,0,0.45),0_8px_24px_-4px_rgba(255,49,49,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-500 hover:border-brand/30 sm:p-10">
            {/* Glass box like the Company page sections (2026-10-02, per Vignesh: "put this entire things in 1 box and do the same for the global network as well"). */}
            <span aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 -z-10 h-72 w-72 rounded-full bg-brand/7 blur-3xl" />
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
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-[0_0_0_3px_rgba(255,49,49,0.17)]">
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
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(150deg,rgba(255,49,49,0.16)_0%,rgba(255,255,255,0.06)_40%,rgba(18,18,20,0.35)_100%)] hover:border-brand/40 p-6 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.28)] transition-all hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.38)]">
                      <span
                        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-brand to-transparent shadow-[0_0_12px_rgba(255,49,49,0.6)]"
                        aria-hidden="true"
                      />
                      <span
                        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/20 blur-2xl transition-colors duration-300 group-hover:bg-brand/35"
                        aria-hidden="true"
                      />
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-[#c81616] text-white shadow-md shadow-brand/20 transition-transform group-hover:scale-105">
                        <PinIcon className="h-5 w-5" />
                      </span>
                      <p className="relative mt-4 flex flex-wrap items-center gap-2 text-lg font-bold text-white">
                        {location.city}
                        {location.isBranch && (
                          <span className="rounded-full bg-brand-dark px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                            Branch
                          </span>
                        )}
                      </p>
                      <p className="relative mt-2 text-sm leading-relaxed text-white/60">{location.address}</p>
                      {location.phone && (
                        <a
                          href={`tel:${location.phone.replace(/\s/g, "")}`}
                          className="relative mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-brand"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" strokeLinejoin="round" />
                          </svg>
                          {location.phone}
                        </a>
                      )}
                    </div>
                  )}
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Separator between Our Locations and the overseas offices
              (2026-10-02, per Vignesh: "separate where we are and our
              locations with line"). Same hairline + red diamond as the
              People page, so the site uses one divider style. */}
          <div aria-hidden="true" className="flex items-center justify-center">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/25" />
            <span className="mx-4 h-2.5 w-2.5 rotate-45 bg-brand shadow-[0_0_14px_rgba(255,49,49,0.55)]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/25" />
          </div>

          <div className="relative isolate overflow-hidden rounded-3xl border border-white/15 bg-brand-dark/55 p-6 shadow-[0_24px_55px_-14px_rgba(0,0,0,0.45),0_8px_24px_-4px_rgba(255,49,49,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-500 hover:border-brand/30 sm:p-10">
            {/* Glass box like the Company page sections (2026-10-02, per Vignesh: "put this entire things in 1 box and do the same for the global network as well"). */}
            <span aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 -z-10 h-72 w-72 rounded-full bg-brand/7 blur-3xl" />
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
                  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(150deg,rgba(255,49,49,0.16)_0%,rgba(255,255,255,0.06)_40%,rgba(18,18,20,0.35)_100%)] hover:border-brand/40 p-5 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.28)] transition-all hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.38)]">
                    <span
                      className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-brand to-transparent shadow-[0_0_12px_rgba(255,49,49,0.6)]"
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/20 blur-2xl transition-colors duration-300 group-hover:bg-brand/35"
                      aria-hidden="true"
                    />
                    <div className="relative flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-[#b81b1b] text-lg text-white shadow-md shadow-brand/25 transition-transform group-hover:scale-105">
                        {COUNTRY_FLAGS[country] ?? <GlobeIcon className="h-5 w-5" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-white">{country}</p>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#ff9a90]/75">
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
