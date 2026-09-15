import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import { services } from "@/data/services";
import { certifications } from "@/data/certifications";
import { clients } from "@/data/clients";

export default function Home() {
  return (
    <>
      {/* Hero — real headline from the current site, per Gokul's instruction
          to keep it but relabel the two CTAs and remove the video.
          Visual treatment upgraded: layered gradient-mesh + route-grid
          background, a display headline face, and a real-numbers stat row
          (founded year, office count, service count, certification count —
          all pulled from company.ts / services.ts / certifications.ts, not
          invented) replacing the previous flat solid-color panel. */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        {/* Decorative layer — glow blobs + route grid, purely visual */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-32 right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-brand/25 blur-[120px]" />
          <div className="absolute -bottom-40 left-[-8rem] h-[26rem] w-[26rem] rounded-full bg-brand/10 blur-[110px]" />
          <div className="hero-grid absolute inset-0" />
        </div>

        <Container className="relative grid gap-14 py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              AEO-Certified Freight &amp; Logistics
            </span>

            {/* The company name itself, given real hero-scale presence —
                previously it only appeared small in the navbar logo lockup.
                Base size stepped down from 6xl to 5xl (2026-09-14, mobile
                fit pass) — 60px was tight against the side padding on
                narrow phones; sm/lg sizes are unchanged so tablet/desktop
                looks exactly as before. */}
            <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              <span className="text-white">Transpeed</span>{" "}
              <span className="text-brand">Logistics</span>
            </h1>

            <p className="mt-6 max-w-xl border-l-2 border-brand/60 pl-5 text-lg leading-relaxed text-white/75 sm:text-xl">
              We&apos;ve mastered the art of navigating the complex and dynamic world of{" "}
              <span className="font-semibold text-white">global logistics.</span>
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(255,49,49,0.6)] transition-all hover:-translate-y-0.5 hover:bg-brand/90"
              >
                Get Services
              </Link>
              <Link
                href="/company"
                className="rounded-md border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/10"
              >
                About Us
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {[
                { value: "2005", label: "Founded" },
                { value: "9", label: "Offices in India" },
                { value: services.length.toString(), label: "Core Services" },
                { value: `${certifications.length}+`, label: "Certifications" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-3xl font-bold text-white">{stat.value}</dt>
                  <dd className="mt-1 text-xs font-medium uppercase tracking-wide text-white/50">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand/40 via-white/10 to-transparent blur-xl"
              aria-hidden
            />
            <div className="relative rounded-2xl ring-1 ring-white/15">
              <HeroSlideshow />
            </div>
            {/* Positioned at the top-left corner rather than bottom — the
                slideshow itself already uses the bottom edge for its caption
                text and slide-position dots, so a bottom-anchored card sat
                on top of both. */}
            <div className="absolute -top-6 -left-6 z-10 hidden items-center gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 text-brand-dark shadow-xl sm:flex">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7l9-4 9 4-9 4-9-4z" strokeLinejoin="round" />
                  <path d="M3 7v10l9 4 9-4V7" strokeLinejoin="round" />
                  <path d="M12 11v10" />
                </svg>
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold">9 Offices</p>
                <p className="text-xs text-zinc-500">Across India</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services — 2x3 clickable grid, each box linking to its service.
          Each card now carries the same line-art icon used on the Services
          page itself (service.icon) — previously this grid was text-only,
          so the six cards looked identical at a glance and the icons that
          already existed for every service went unused here. Per Vignesh
          (2026-09-14): "the second page services logo has to come in the
          home page services". Section now carries a soft brand-red gradient
          wash (top-left + bottom-right glows) — per Vignesh's meeting
          feedback the same day that the site read as "pure white and
          plain" and needed actual colour, not just the ivory tint + logo
          watermark from the first pass. Kept deliberately faint (~6-7%
          alpha) so the white cards and body copy on top stay fully
          legible. */}
      <section className="relative bg-[radial-gradient(ellipse_65%_55%_at_10%_-8%,rgba(255,49,49,0.07),transparent_60%),radial-gradient(ellipse_55%_45%_at_100%_108%,rgba(255,49,49,0.05),transparent_65%)] py-20">
        <Container>
          {/* Custom header, replacing the plain SectionHeading call
              (2026-09-14, per Vignesh: "the content look plane, i want it
              to have some shadow effect or some better looking effect").
              Kept left-aligned rather than the centered icon-badge
              treatment used for Certifications/Clients below (Vignesh
              turned that match down) — instead the eyebrow becomes a
              lifted white chip with a real shadow (same explicit-rgba
              shadow approach used on the cards below, since Tailwind's
              default shadow opacity reads as basically invisible), and
              the title gets a soft drop-shadow for a bit of depth against
              the flat pink page background, plus the display face already
              used on the other section titles on this page. */}
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand shadow-[0_6px_16px_-4px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
              What We Do
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-dark drop-shadow-[0_4px_8px_rgba(0,0,0,0.14)] sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              Six ways we keep your supply chain moving. Select one to see the full story.
            </p>
          </Reveal>
          {/* Scroll-reveal (2026-09-14, per Vignesh: "things appearing from
              top to its current position as i scroll"). Staggered by index
              (capped at 240ms) so the six cards settle in left-to-right,
              row-by-row rather than all landing at once. */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={Math.min(i * 60, 240)}>
              <Link
                href={`/services#${service.slug}`}
                // Card box itself given a visible default shadow (not just
                // on hover) and a slightly darker border, so all six read as
                // real boxes at rest rather than only revealing an edge on
                // hover. Per Vignesh (2026-09-14) — shadow-sm, then even
                // shadow-lg, both turned out too faint to actually register
                // at a glance (Tailwind's default shadow opacity is low).
                // Switched to an explicit, stronger shadow so it's
                // unmistakable rather than something you have to zoom in to
                // confirm is there.
                className="group flex flex-col rounded-xl border border-zinc-300 bg-white p-6 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.28)] transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.35)]"
              >
                {service.icon && (
                  // Icon tile bumped up again, h-24/w-96 -> h-28/w-112
                  // (2026-09-14, per Vignesh) — matching the Services page's
                  // own icon-box treatment. Background opacity raised from
                  // bg-brand/5 to bg-brand/10 (still a light pink, not the
                  // saturated brand red) so the box actually reads as a box
                  // rather than disappearing against the white card — the
                  // redundant ring was dropped in favour of a slightly
                  // stronger border doing that job on its own. Drop shadow
                  // added (2026-09-14, per Vignesh), then corrected the same
                  // day — the first attempt tinted the shadow brand/10,
                  // which at 10% opacity was basically invisible against the
                  // light card (confirmed from a screenshot). Switched to a
                  // plain neutral shadow at full default opacity, sized up
                  // to shadow-xl, which actually reads as a lift.
                  <span className="flex h-28 w-28 items-center justify-center rounded-2xl border border-brand/15 bg-brand/10 p-4 shadow-xl transition-all group-hover:border-brand/30 group-hover:bg-brand/15 group-hover:shadow-2xl">
                    <Image
                      src={service.icon}
                      alt=""
                      width={112}
                      height={112}
                      className="h-full w-full object-contain"
                    />
                  </span>
                )}
                <h3 className="mt-4 text-lg font-semibold text-brand-dark group-hover:text-brand">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">{service.shortDescription}</p>
                {/* Always visible now, not just on hover — otherwise nothing
                    signals these cards are clickable until the cursor
                    happens to land on one. Anchored to the bottom of the
                    card (mt-auto) so it lines up evenly across a row even
                    when descriptions run different lengths. */}
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand">
                  View service
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Certifications — redesigned (2026-09-14, per Vignesh: "make the
          certified and trusted a bit modern and better looking, professional
          and aesthetic"). Previously just a bare centered label above a flat
          wall of bordered logo tiles; then briefly used the same
          SectionHeading every other section on this page uses. First pass
          muted each logo to grayscale until hovered — Vignesh asked for the
          logos to just stay full colour instead, so that was dropped; only
          the shadow/border/lift treatment stayed. Header redesigned again
          the same day — a plain left-aligned SectionHeading sitting above a
          centered wall of logos read flat and "plane" (Vignesh's word), so
          it's now its own centered treatment: an icon badge/pill eyebrow, a
          display-face title, and a small brand accent rule, which reads as
          a proper trust-signal section rather than a reused generic page
          header. Dropped the flat zinc-50 band (2026-09-14, per Vignesh's
          meeting feedback) now that the page canvas itself carries colour
          — an opaque fill here would have blocked both the watermark and
          the gradient wash below, and broken consistency with the Clients
          wall right below it; the top border alone is enough to mark a new
          section. Carries its own centered top-anchored red glow, distinct
          from the Services section's corner glows above, so scrolling the
          page feels like a sequence of soft colour moments rather than one
          flat repeated tint. */}
      <section className="relative border-t border-zinc-200 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(255,49,49,0.08),transparent_65%)] py-20">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Compliance &amp; Accreditation
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Certified &amp; Trusted By
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand to-brand/20" aria-hidden="true" />
            <p className="mt-4 text-base text-zinc-600">
              AEO status, ISO certification, and membership with the chambers and alliances that keep our freight moving compliantly, worldwide.
            </p>
          </Reveal>
          {/* Logo tiles staggered in on scroll too (2026-09-14, per
              Vignesh), capped stagger so a wall of ~13 logos doesn't take
              forever to finish settling in. */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            {certifications.map((cert, i) =>
              cert.logo ? (
                <Reveal key={cert.name} variant="image" delay={Math.min(i * 40, 320)}>
                <div
                  className="group flex h-28 w-44 items-center justify-center rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.24)]"
                  title={cert.name}
                >
                  <Image
                    src={cert.logo}
                    alt={cert.name}
                    width={160}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </div>
                </Reveal>
              ) : (
                <Reveal key={cert.name} delay={Math.min(i * 40, 320)}>
                <span
                  className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-colors hover:border-brand/30"
                >
                  {cert.name}
                </span>
                </Reveal>
              )
            )}
          </div>
        </Container>
      </section>

      {/* Clients — same redesign pass and the same reasoning as the
          Certifications wall above: copy unchanged (still the real,
          carried-over "Our Clients" copy), but the header now gets the same
          centered icon-badge + display-title + accent-rule treatment as
          Certifications (2026-09-14, per Vignesh) so the two trust walls
          read as one consistent, professional system, full colour logos
          throughout. Gradient wash mirrored bottom-up (centered glow at the
          foot of the section rather than the top, 2026-09-14) so it reads
          as its own distinct colour moment rather than a repeat of the
          Certifications section right above it. */}
      <section className="relative bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(255,49,49,0.06),transparent_65%)] py-20">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="9" cy="8" r="3" />
                <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
                <circle cx="17" cy="9" r="2.5" />
                <path d="M15.5 14.2c2.3.5 4 2.5 4 4.8" strokeLinecap="round" />
              </svg>
              Who We Work With
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Our Clients
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand to-brand/20" aria-hidden="true" />
            <p className="mt-4 text-base text-zinc-600">
              At Transpeed Logistics, we have had the pleasure of working with some of the biggest names in the industry. Our clients trust us to deliver their goods safely and on time, every time.
            </p>
          </Reveal>
          {/* Logo tiles staggered in on scroll too (2026-09-14, per
              Vignesh), same capped stagger as the Certifications wall. */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            {clients.map((client, i) =>
              client.logo ? (
                <Reveal key={client.name} variant="image" delay={Math.min(i * 40, 320)}>
                <div
                  className="group flex h-28 w-48 items-center justify-center rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.24)]"
                  title={client.name}
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={176}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </div>
                </Reveal>
              ) : (
                <Reveal key={client.name} delay={Math.min(i * 40, 320)}>
                <span
                  className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-colors hover:border-brand/30"
                >
                  {client.name}
                </span>
                </Reveal>
              )
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
