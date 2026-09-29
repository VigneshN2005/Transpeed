import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import VideoShowcase from "@/components/home/VideoShowcase";
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
          {/* Blob sizes/opacity/blur scaled down below sm: (2026-09-29,
              per Vignesh: "the redness... is more and not good" on
              mobile) — the fixed rem sizes below were proportionally
              huge on a ~390px viewport, so the glow read as a solid
              reddish-brown wash over the whole hero instead of a
              corner accent. sm: and up is the exact original desktop
              treatment, untouched. */}
          <div className="absolute -top-16 right-[-5rem] h-56 w-56 rounded-full bg-brand/15 blur-[70px] sm:-top-32 sm:right-[-10rem] sm:h-[30rem] sm:w-[30rem] sm:bg-brand/25 sm:blur-[120px]" />
          <div className="absolute -bottom-20 left-[-4rem] h-48 w-48 rounded-full bg-brand/10 blur-[60px] sm:-bottom-40 sm:left-[-8rem] sm:h-[26rem] sm:w-[26rem] sm:blur-[110px]" />
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

          {/* self-stretch overrides the grid row's items-center just for
              this column, so it's forced to the same height as the taller
              text column on the left, instead of shrink-wrapping to just
              the slideshow's own height. flex + justify-between then
              splits that full height between the slideshow (top) and the
              License card (bottom) — filling what was previously dead
              black space in the hero on large screens, rather than the
              card floating at an arbitrary height. On mobile (no
              self-stretch/flex-col there) it just stacks normally below
              the slideshow. */}
          <div className="relative lg:flex lg:h-full lg:flex-col lg:justify-between lg:self-stretch">
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

            {/* Lifetime Customs Clearance License — real achievement,
                supplied by Vignesh (2026-09-21). First attempt placed this
                as its own section below the whole hero; per Vignesh, the
                actual ask was the empty space inside the hero itself, below
                the slideshow photo. Styled as frosted glass rather than a
                solid card — matches the "AEO-Certified..." pill at the top
                of the hero and the outlined "About Us" button (both
                border-white/* + bg-white/5 + backdrop-blur), so it reads as
                native to the dark hero instead of a light card dropped onto
                a dark background. The seal reuses the exact shield-check
                glyph already used for the "Compliance & Accreditation"
                badge further down this page. Copy tightened into the
                site's we/our voice ("awarded us" instead of "awarded
                Transpeed Logistics") and the em-dash dropped, matching the
                em-dash-free house style already applied everywhere else. */}
            <Reveal variant="image" delay={120} className="mt-6 lg:mt-8">
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/20 blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinejoin="round" />
                      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                      Recognized by Indian Customs
                    </p>
                    <h2 className="mt-1 font-display text-lg font-bold leading-snug text-white sm:text-xl">
                      Lifetime Customs Clearance License
                    </h2>
                  </div>
                </div>
                <p className="relative mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                  In recognition of our consistent service quality and regulatory compliance, Indian
                  Customs has awarded us a Lifetime Customs Clearance License, a distinction held by
                  very few logistics operators in India, reflecting our long-standing commitment to
                  compliant, reliable, and high-quality customs operations.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Mission & Vision (2026-09-21, supplied by Vignesh). Fifth pass.
          Placement stays exactly where Vignesh corrected it to — the light
          gap between the hero and "Our Services" — but the structure is
          now genuinely different, not another variation on "two boxes side
          by side". Mission and Vision are rendered as ONE continuous card,
          split down the middle into two solid colour halves (brand-dark,
          brand-red gradient) with a single connecting badge straddling the
          seam, so the two ideas read as one continuum rather than two
          competing tiles. The connector is a crisp white circle with a
          hard box-shadow, not a blurred glow, so it can't smear the way
          the earlier overlapping cards did — that failure mode is
          structurally impossible here, there is nothing translucent or
          blurred crossing an edge. Each half keeps a large low-opacity
          outline-icon watermark in its corner for depth, plus the
          `.hero-grid` texture already used on the hero and the Company
          page's CSR panel, so the piece reads as part of the same design
          system rather than a one-off.

          CAUGHT AND FIXED same day: `.hero-grid` carries its own
          mask-image (a radial fade), and that mask applies to the whole
          element it's on, not just the grid lines. Putting the class
          directly on each panel div faded out the panel's own background
          colour and its text along with the grid, which is what produced
          the broken, near-invisible Vision half and the dark blob on
          Mission that Vignesh flagged as "not at all good". Fixed by
          giving each panel its own `absolute inset-0` overlay div carrying
          `.hero-grid` and nothing else, so the mask only ever fades that
          textured layer, never the panel's real background or content.
          Any future reuse of `.hero-grid` on a smaller, content-bearing
          element should go through this same overlay pattern, not applied
          to the element directly.

          A thin two-tone bar across the very top ties both halves
          together before the eye even reaches the icons. Still the short
          homepage tagline versions, distinct from
          the longer Vision/Mission paragraphs on the Company page. */}
      <section className="relative bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(255,49,49,0.06),transparent_65%)] py-20">
        <Container>
          <Reveal className="mx-auto max-w-xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand">
              What Drives Every Shipment
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Mission &amp; Vision
            </h2>
          </Reveal>

          <Reveal className="mt-12">
            <div className="relative isolate overflow-hidden rounded-3xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-x-0 top-0 z-10 h-1.5 bg-gradient-to-r from-brand-dark via-white/60 to-brand" aria-hidden="true" />

              <div className="grid lg:grid-cols-2">
                <div className="relative overflow-hidden bg-brand-dark p-10 pt-12 sm:p-12 lg:p-16">
                  <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 text-white/[0.05]"
                    aria-hidden="true"
                  >
                    <path d="M5 21V4" strokeLinecap="round" />
                    <path d="M5 4h13l-3 4 3 4H5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-brand ring-1 ring-white/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M5 21V4" strokeLinecap="round" />
                      <path d="M5 4h13l-3 4 3 4H5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-brand">Mission</p>
                  <p className="relative mt-3 font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
                    We commit and stand with you: every mile, every shipment, every time.
                  </p>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-brand to-[#9c0f0b] p-10 pt-12 sm:p-12 lg:p-16">
                  <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 text-white/[0.08]"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.8-6.5 10-6.5 10 6.5 10 6.5-3.8 6.5-10 6.5S2 12 2 12Z" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2.7" />
                  </svg>
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M2 12s3.8-6.5 10-6.5 10 6.5 10 6.5-3.8 6.5-10 6.5S2 12 2 12Z" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="2.7" />
                    </svg>
                  </span>
                  <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">Vision</p>
                  <p className="relative mt-3 font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
                    To be India&apos;s most trusted logistics partner, recognized for reliability,
                    compliance, and an unwavering commitment to the businesses we serve.
                  </p>
                </div>
              </div>

              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white ring-8 ring-white/90 lg:flex"
                style={{ boxShadow: "0 12px 30px -8px rgba(0,0,0,0.45)" }}
                aria-hidden="true"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff3131" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14" strokeLinecap="round" />
                  <path d="M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Reveal>
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
            {/* New heading + description (2026-09-21, per Vignesh) — same
                brand line now used as the Services page's hero title,
                added here as a subheading directly below "Our Services"
                rather than replacing it. */}
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.15em] text-brand sm:text-base">
              End to End Supply Chain Solutions
            </p>
            <p className="mt-4 text-base text-zinc-600">
              You don&apos;t need five vendors to move your business forward. You need one partner who gets it
              right, on schedule, at the right price, every time.
            </p>
          </Reveal>
          {/* Scroll-reveal (2026-09-14, per Vignesh: "things appearing from
              top to its current position as i scroll"). Staggered by index
              (capped at 240ms) so the six cards settle in left-to-right,
              row-by-row rather than all landing at once. */}
          {/* Glass/color/shadow redesign (2026-09-25, per Vignesh: "make the
              punchcard have a color, shadow, glass effect... modern advanced
              better looking professional aesthetic... increase the size of
              the logos"). Supersedes the flat white GitHub-restored card
              above.
              Pass 1 (bg-white/70 + brand/15 blobs) read as "still white and
              plain" live. Pass 2 (a diagonal rose gradient baked into the
              whole card) read as "same color as the background" — the
              section's own pale pink wash swallowed a pink-washed card.
              Pass 3 (bright white card + corner glow) fixed the contrast
              problem but Vignesh's actual reference was the dark glass
              "Lifetime Customs Clearance License" card in the hero above —
              not just its glow, the whole treatment. Final: reuse that
              card's exact recipe (border-white/10-ish + a near-opaque
              brand-dark fill + backdrop-blur + a brand/blur corner glow),
              adapted from "light glass on a dark hero" to "dark glass on
              this light pink section" — same technique, inverted context,
              so it reads as premium/modern rather than just recoloring
              things black. Text flips to white/white-70 accordingly.
              Everything here is brand-red/near-black, matching the hero
              card's own palette, per Vignesh's earlier "noo only with the
              color the website matching with."
              Pass 5 (2026-09-25, per Vignesh, after seeing this dark
              version live): "make the logos bigger its very small" and
              "too much uneven red color in the punchcard making it look
              bad". Fixes: (a) icon badge grows again, 144px box -> 176px
              box (~152px visible icon, up from ~112px) with less padding
              so the icon itself reads noticeably larger, not just its
              frame; (b) the single big corner glow (224px, 35% opacity,
              blur-2xl) was overpowering and bled unevenly across most of
              the card instead of reading as a clean accent — shrunk to
              128px at 15% opacity and pushed further outside the card
              corner so only a soft, even highlight shows, letting the
              near-black glass itself carry the card rather than a red
              wash on top of it. */}
          {/* FOUND 2026-09-29 auditing "the entire website is still... not
              properly aligned" (per Vignesh): this wrapper was the one
              actual cause of the horizontal-scroll bug on mobile (the pink
              strip visible on the right edge of the hero in his
              screenshot) — these three glow blobs sit at negative
              offsets (up to -bottom-16/-left-10, 320px boxes) with no
              overflow clipping on their container, unlike every other
              decorative-glow spot on the site (hero, PageHero, video
              section, the Company page's offices card, ServiceProcess),
              which all already clip theirs. Confirmed via the browser's
              own scrollWidth/clientWidth at a real 375px viewport: 78px of
              page-wide overflow, traced to exactly this div. `overflow-hidden`
              added below fixes it without changing how the glows look on
              desktop — they were only ever meant to be soft background
              accents, not something that was supposed to bleed past this
              box's edges anyway. */}
          <div className="relative mt-10 overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none absolute -top-16 -left-10 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute top-1/3 right-4 h-72 w-72 rounded-full bg-brand/16 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 left-1/3 h-80 w-80 rounded-full bg-brand-dark/10 blur-3xl" />
            <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <Reveal key={service.slug} delay={Math.min(i * 60, 240)} className="h-full">
                <Link
                  href={`/services#${service.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-dark/[0.94] p-7 shadow-[0_24px_55px_-14px_rgba(0,0,0,0.55),0_8px_24px_-4px_rgba(255,49,49,0.22),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:bg-brand-dark hover:shadow-[0_32px_70px_-16px_rgba(0,0,0,0.6),0_14px_34px_-6px_rgba(255,49,49,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-brand/15 blur-2xl" />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  {service.icon && (
                    <span className="flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl border border-brand/25 bg-[radial-gradient(circle_at_30%_25%,rgba(255,49,49,0.22),rgba(255,49,49,0.04)_70%)] p-3 shadow-[0_10px_24px_-8px_rgba(255,49,49,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:border-brand/45">
                      <Image src={service.icon} alt="" width={176} height={176} className="h-full w-full object-contain drop-shadow-sm" />
                    </span>
                  )}
                  <div className="mt-5 flex flex-1 flex-col">
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand">{service.name}</h3>
                    <p className="mt-2 text-sm text-white/65">{service.shortDescription}</p>
                    {/* Always visible, not just on hover — otherwise nothing
                        signals these cards are clickable until the cursor
                        happens to land on one. Anchored to the bottom
                        (mt-auto) so it lines up evenly across a row even when
                        descriptions run different lengths. */}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand">
                      View service
                      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
                </Reveal>
              ))}
            </div>
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
              forever to finish settling in.

              2026-09-29 mobile fix: the responsive width used to live on
              the tile <div> itself, but that div's parent is the Reveal
              wrapper, which has no width of its own -- a percentage width
              can't resolve against an "auto" parent, so on mobile the
              tiles rendered as garbled, inconsistent-width slivers instead
              of a clean 2-column grid. Moved the width classes onto the
              Reveal wrapper (which IS a direct child of this flex row) and
              left the tile itself at w-full so it just fills its slot. */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            {certifications.map((cert, i) =>
              cert.logo ? (
                <Reveal
                  key={cert.name}
                  variant="image"
                  delay={Math.min(i * 40, 320)}
                  className="w-[calc(50%-10px)] sm:w-44"
                >
                <div
                  className="group flex h-24 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.24)] sm:h-28"
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
              Vignesh), same capped stagger as the Certifications wall.
              Same 2026-09-29 mobile-width fix as above -- width moved onto
              the Reveal wrapper, tile itself is w-full. */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            {clients.map((client, i) =>
              client.logo ? (
                <Reveal
                  key={client.name}
                  variant="image"
                  delay={Math.min(i * 40, 320)}
                  className="w-[calc(50%-10px)] sm:w-48"
                >
                <div
                  className="group flex h-24 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.24)] sm:h-28"
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

      {/* Corporate overview video — closing section of the home page
          (2026-09-29, per Vignesh: put the video "at the bottom", not as
          a hero, styled to match the rest of the site). Same header
          pattern (eyebrow badge + display heading + accent rule) as the
          Certifications / Our Clients sections above it, but on the dark
          brand background so it reads as a deliberate closing "capstone"
          moment rather than a stray embed at the end of a light page. See
          VideoShowcase.tsx for the player itself and the source notes.

          Background upgraded (2026-09-29, per Vignesh: "its plane... the
          background of the video") from a single flat glow to the same
          layered treatment as the hero — `.hero-grid` route texture plus
          three staggered brand-red/white glow blobs at different corners
          and sizes — so this closing section reads as richly as the hero
          it mirrors instead of a flatter afterthought. */}
      <section className="relative overflow-hidden bg-brand-dark py-20 text-white">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {/* Same mobile-scaling fix as the hero above, applied here too
              (2026-09-29, per Vignesh). */}
          <div className="absolute -top-16 -left-10 h-52 w-52 rounded-full bg-brand/10 blur-[70px] sm:-top-40 sm:-left-24 sm:h-[28rem] sm:w-[28rem] sm:bg-brand/20 sm:blur-[130px]" />
          <div className="absolute top-1/3 right-[-6rem] h-48 w-48 rounded-full bg-brand/10 blur-[60px] sm:right-[-12rem] sm:h-[26rem] sm:w-[26rem] sm:blur-[130px]" />
          <div className="absolute -bottom-20 left-1/3 h-44 w-44 -translate-x-1/2 rounded-full bg-white/[0.05] blur-[60px] sm:-bottom-44 sm:h-[24rem] sm:w-[24rem] sm:blur-[120px]" />
        </div>
        {/* Wider than the shared `Container` (max-w-6xl) on purpose —
            three rounds of "make the video bigger" from Vignesh (2026-09-29:
            "not that small", then "a bit more", then "still increased [it
            more]"), so this went from max-w-7xl/0.85:1.15 to
            max-w-[96rem]/0.8:1.2 to this: max-w-[110rem] (1760px) with the
            grid tilted hard toward the video (0.7fr text / 1.3fr video) and
            a tighter gap-10 reclaiming a little more width for it too. If
            this still reads small, the next lever is dropping the text
            column's width share further rather than nudging by degrees. */}
        <div className="relative mx-auto w-full max-w-[110rem] px-6">
          {/* Split layout (2026-09-29, per Vignesh: "put the content on the
              left and video on the right") — same grid device as the hero
              (text column + media column, vertically centered) rather than
              the centered-header-then-full-width-media pattern used by the
              lighter sections above, so this closing section visually
              rhymes with the hero it's meant to mirror. Text left-aligned
              to match; stacks to video-below-text on mobile/tablet since
              lg:grid-cols only kicks in at the lg breakpoint. */}
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand backdrop-blur-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
                See Us In Motion
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Transpeed, In Motion
              </h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand to-brand/20" aria-hidden="true" />
              <p className="mt-4 max-w-md text-base text-white/70">
                A closer look at the people, sites, and shipments behind every delivery we make.
              </p>
            </Reveal>
            {/* 2026-09-29, per Vignesh: bigger video on mobile too. The
                video already runs full-width inside the section's px-6
                gutter, so the only way to meaningfully grow it on a phone
                screen is to bleed past that gutter -- pull the card out to
                the section's own edges (-mx-6) below the sm breakpoint,
                then hand the gutter straight back (sm:mx-0) once the
                two-column layout has room to spare. */}
            <Reveal variant="image" className="-mx-6 sm:mx-0">
              <VideoShowcase />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
