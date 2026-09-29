import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import BranchesMap from "@/components/company/BranchesMap";
import GlobalNetworkMap from "@/components/company/GlobalNetworkMap";
import { locations, overseasPresence } from "@/data/contact";
import {
  aboutUs,
  philosophy,
  whatDrivesUs,
  journey,
  vision,
  visionPillars,
  missionStatement,
  missionNarrative,
  missionCommitments,
  coreValues,
  csrEyebrow,
  csrHeading,
  csrStatement,
} from "@/data/company";

export const metadata = {
  title: "Company | Transpeed Logistics",
};

const JUMP_LINKS = [
  { id: "offices", label: "Our Offices" },
  { id: "global-network", label: "Global Network" },
  { id: "who-we-are", label: "Who We Are" },
  { id: "csr", label: "CSR" },
  { id: "journey", label: "Our Journey" },
  { id: "vision-mission", label: "Vision & Mission" },
  { id: "values", label: "Core Values" },
];

export default function CompanyPage() {
  return (
    <>
      {/* The real "About Us" copy, given the same hero treatment as the
          homepage and Services page rather than living as a small text
          block halfway down the page. */}
      <PageHero eyebrow="About Us" title="Who We Are" description={aboutUs}>
        <nav aria-label="Jump to a section" className="mt-8 flex flex-wrap gap-2">
          {JUMP_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 backdrop-blur-sm transition-colors hover:border-brand hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </PageHero>

      {/* Soft brand-red top glow behind the content area (2026-09-14, per
          Vignesh, relaying meeting feedback that the site read as "pure
          white and plain" and needed actual colour). Top-anchored, offset
          left so it doesn't fight the Offices card's own zinc-50 fill right
          underneath it. */}
      <section className="relative bg-[radial-gradient(ellipse_70%_50%_at_20%_0%,rgba(255,49,49,0.07),transparent_60%)]">
        <Container className="space-y-20 py-20">
          {/* Scroll-reveal (2026-09-14, per Vignesh: "things appearing from
              top to its current position as i scroll" + "image based
              visual effects"). Applied throughout this page at the level
              of each meaningful block/card rather than the page as a
              whole, so a long page like this settles in section by
              section as you scroll instead of all at once on load. */}
          {/* Redesigned (2026-09-15, per Vignesh: "in company page can u
              make this look good too" — the same pass already given to the
              Contact page's location cards). Flat zinc-50 box became a real
              white card with a stat pill next to the heading, the map got a
              soft brand-tinted glow frame instead of a bare grey border
              (Leaflet's own zoom/attribution controls are restyled globally
              in globals.css since that markup comes from the library, not
              this JSX), and the city list below turned into pin-icon chips
              matching the Contact page's overseas chips instead of bare
              text pills. */}
          <div id="offices" className="scroll-mt-28 relative overflow-hidden rounded-3xl border border-white/10 bg-brand-dark/[0.94] p-6 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.5),0_10px_28px_-10px_rgba(255,49,49,0.18)] backdrop-blur-md backdrop-saturate-150 sm:p-10">
          {/* Whole card filled black/dark-glass to match the rest of the
              site (2026-09-25, per Vignesh: "fill the background with
              black color" — the map itself stays as the original Esri
              street tiles; only this card's own background changed, along
              with the text/pills/badge on it so they stay readable on
              dark). Two soft corner glows echo the dark cards used
              elsewhere on the site (hero cards, process step cards). */}
          <span aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <Reveal>
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">Where We Are</p>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Our Offices Across India
                </h2>
                {/* Body-copy paragraphs across this page bumped from
                    text-base/text-sm to text-lg/text-base (2026-09-15, per
                    Vignesh — a second round after the site-wide token bump
                    in globals.css read as too subtle on this specific page).
                    This is a direct, visible size jump on the actual
                    className rather than relying only on the token nudge. */}
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/70">
                  {locations.length} offices across India, from the Bangalore headquarters out to every
                  branch below — click a pin for the full address and directions.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#FF3131,#B91C1C)] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,49,49,0.45)]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11z" />
                  <circle cx="12" cy="10" r="2.3" />
                </svg>
                {locations.length} Offices
              </span>
            </div>
          </Reveal>
          <Reveal variant="image" delay={80} className="relative mt-8">
            <div
              className="pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-brand/25 via-transparent to-transparent blur-md"
              aria-hidden="true"
            />
            <div className="relative">
              <BranchesMap />
            </div>
          </Reveal>
          <div className="relative mt-6 flex flex-wrap gap-2.5">
            {locations.map((location) => (
              <span
                key={location.city}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white/15"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-brand" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11z" />
                  <circle cx="12" cy="10" r="1.8" />
                </svg>
                {location.city}
                {location.isHeadquarters && (
                  <span className="ml-0.5 rounded-full bg-[linear-gradient(135deg,#FF3131,#B91C1C)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    HQ
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Global network map (2026-09-14, per Vignesh: "add one more map
            which shows the global level map with there locations
            pointed"). Sits right after the domestic offices map — same
            "where we are" theme, but worldwide instead of India-only. See
            GlobalNetworkMap.tsx for why it's a coded animated SVG rather
            than a generated image. */}
        <div id="global-network" className="scroll-mt-28">
          <Reveal>
            <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              Worldwide Reach
            </span>
            {/* Heading pass (2026-09-21, per Vignesh: "highlight the heading
                properly for each content ... make the content look
                better"). Already bumped to text-3xl/4xl to match every
                other section heading on the page (Philosophy, Core Values,
                and every other page's PageHero/SectionHeading); this pass
                adds the same small gradient accent-rule between eyebrow and
                title as the SectionHeading `accent` variant below, so this
                hand-rolled heading (it isn't built from that component)
                still reads as part of the same system. */}
            <span
              className="mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-brand to-brand/20"
              aria-hidden="true"
            />
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Our Global Network Presence
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-600">
              Beyond our {locations.length} Indian offices, our sourcing and procurement network
              reaches {overseasPresence.join(", ")} — every overseas route below runs back through
              our Bangalore headquarters.
            </p>
          </Reveal>
          <Reveal variant="image" delay={80} className="mt-6 aspect-[16/10] w-full sm:aspect-[2/1]">
            <GlobalNetworkMap />
          </Reveal>
        </div>

        <div id="who-we-are" className="scroll-mt-28">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <SectionHeading eyebrow="Who We Are" title="Our Philosophy" accent />
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600">{philosophy}</p>
            </Reveal>
            <Reveal
              variant="image"
              className="relative aspect-video overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 lg:aspect-[4/5]"
            >
              <Image
                src="/images/company/company-team.jpg"
                alt="The Transpeed Logistics team"
                fill
                className="object-cover"
              />
            </Reveal>
          </div>

          {/* Redesigned (2026-09-14, per Vignesh: "make the content look
              better, too plane like ppt, change how the content appear as
              well as the alignment"). Previously four identical bordered
              white boxes in a row — replaced with a divided list (a thin
              rule between items on larger screens instead of four separate
              card outlines) so it reads as one connected strip of ideas
              rather than four slide tiles. */}
          <div className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-zinc-200">
            {whatDrivesUs.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 60, 240)} className={i > 0 ? "lg:pl-10" : ""}>
                <span
                  aria-hidden="true"
                  className="select-none font-display text-4xl font-bold text-brand/60"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Underline swapped for a short accent-rule (2026-09-21,
                    per Vignesh: "remove the line for each point, just add
                    some design which suits better") — same gradient rule
                    used on the section headings above, scaled down, so the
                    ghost number, this bridge, and the title read as one
                    deliberate motif instead of a plain underlined word. */}
                <span
                  aria-hidden="true"
                  className="mt-3 mb-2.5 block h-0.5 w-8 rounded-full bg-gradient-to-r from-brand to-brand/30"
                />
                <h4 className="text-xl font-bold text-brand-dark">{item.title}</h4>
                <p className="mt-2 text-base leading-relaxed text-zinc-600">
                  {item.description}
                  {item.title === "People" && (
                    <>
                      {" "}
                      Meet the team on the{" "}
                      <Link href="/people" className="font-medium text-brand hover:underline">
                        People page
                      </Link>
                      .
                    </>
                  )}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CSR statement (2026-09-21, supplied by Vignesh; repositioned from
            the very end of the page to sit here instead, per Vignesh:
            "put in the top or middle, in a more better way"). Placed right
            after "Who We Are"/"What Drives Us" — Sustainability is already
            one of those four pillars, so this reads as that pillar backed
            up with a real statement, rather than a disconnected afterthought
            tacked onto the bottom of the page.
            Given its own dark, full-bleed "moment" instead of another light
            section: the inverted brand-dark card reuses the dark hero's
            .hero-grid texture and brand-red corner glows, the oversized
            ghost quotation mark echoes the People page's pull-quotes, and
            the icon badge on the right (a filled heart in a soft pulsing
            ring, Tailwind's built-in animate-ping) gives the block a second
            focal point instead of being a single wall of text — all
            patterns already used elsewhere on the site, not a one-off. */}
        <div id="csr" className="scroll-mt-28">
          <Reveal variant="image">
            <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-8 py-14 sm:px-14 sm:py-16">
              <div
                className="hero-grid pointer-events-none absolute inset-0 opacity-70"
                aria-hidden="true"
              />
              {/* Mobile-scaled (2026-09-29, per Vignesh) — same fix as
                  elsewhere on the site, scoped to this card. */}
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand/15 blur-[50px] sm:-right-20 sm:-top-24 sm:h-72 sm:w-72 sm:bg-brand/25 sm:blur-[90px]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-brand/10 blur-[50px] sm:-bottom-24 sm:-left-16 sm:h-64 sm:w-64 sm:blur-[90px]"
                aria-hidden="true"
              />

              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand backdrop-blur-sm">
                    {csrEyebrow}
                  </span>

                  <div className="relative mt-7">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-2 -top-8 select-none font-display text-8xl font-bold text-white/[0.08] sm:-top-10"
                    >
                      &ldquo;
                    </span>
                    <h2 className="relative font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                      {csrHeading}
                    </h2>
                    <p className="relative mt-6 text-lg leading-relaxed text-white/70 sm:text-xl">
                      {csrStatement}
                    </p>
                  </div>
                </div>

                {/* Icon badge — swapped the earlier heart glyph (2026-09-21,
                    per Vignesh: "remove the heart, put in better way") for
                    an abstract connected-nodes mark instead of another
                    literal/stock icon. It deliberately echoes the Global
                    Network map higher up this same page (dots + connecting
                    lines, one node pulsing) — the visual argument being
                    "we extend that same network to the community", which
                    fits a CSR statement more than a generic heart/hands
                    icon would, and ties the block back to a motif already
                    established on this page rather than a one-off symbol. */}
                <div className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 sm:h-44 sm:w-44">
                  <span className="absolute inset-4 rounded-full border border-white/10" aria-hidden="true" />
                  <svg
                    viewBox="0 0 64 64"
                    className="relative h-16 w-16 text-brand sm:h-[4.5rem] sm:w-[4.5rem]"
                    aria-hidden="true"
                  >
                    <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.4">
                      <line x1="32" y1="15" x2="16" y2="42" />
                      <line x1="32" y1="15" x2="48" y2="42" />
                      <line x1="16" y1="42" x2="48" y2="42" />
                      <line x1="32" y1="15" x2="32" y2="46" />
                    </g>
                    <circle cx="16" cy="42" r="4" fill="currentColor" opacity="0.55" />
                    <circle cx="48" cy="42" r="4" fill="currentColor" opacity="0.55" />
                    <circle cx="32" cy="46" r="3.5" fill="currentColor" opacity="0.4" />
                    <circle
                      className="map-ping"
                      cx="32"
                      cy="15"
                      r="5.5"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <circle cx="32" cy="15" r="5.5" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal variant="image" className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-sm">
          <Image
            src="/images/company/company-warehouse.jpg"
            alt="Inside a Transpeed Logistics warehouse"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
          <p className="absolute bottom-5 left-6 text-sm font-semibold uppercase tracking-wide text-white">
            Inside a Transpeed Logistics warehouse
          </p>
        </Reveal>

        <div id="journey" className="scroll-mt-28 grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal
            variant="image"
            className="relative aspect-video overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 lg:order-2 lg:aspect-[4/5]"
          >
            <Image
              src="/images/company/company-fleet.jpg"
              alt="The Transpeed Logistics fleet"
              fill
              className="object-cover"
            />
          </Reveal>
          <Reveal className="lg:order-1">
            <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              Est. 2005
            </span>
            <span
              className="mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-brand to-brand/20"
              aria-hidden="true"
            />
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">Our Journey</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-600">{journey}</p>
          </Reveal>
        </div>

        {/* Redesigned (2026-09-14, per Vignesh — same "looks like ppt"
            note). This was the clearest offender: two matching bordered
            white boxes side by side, each a heading over a bulleted list —
            literally a two-column comparison slide. Replaced with plain
            typography and a left accent rule instead of a boxed card, and
            the Vision statement is set larger/display-style since it's the
            single most important line in the section. */}
        {/* Vision/Mission heading pass (2026-09-21, per Vignesh: "make the
            vision and mission look better ... its plane"). Kept exactly the
            same structure Vignesh asked not to touch (left accent-rail
            block, two-column layout, statement then list) — the upgrade is
            entirely inside each block: the eyebrow pill gets a small paired
            icon instead of standing alone, an accent-rule bridges it to the
            statement (same motif as every other heading on this page now),
            and both lists move off a bare dot bullet onto a small
            checkmark-in-circle marker, so Vision and Mission finally read
            as a matched pair instead of one having a marker style
            (Vision's pillars) the other lacked entirely (Mission's
            commitments had no marker at all before this). */}
        <div id="vision-mission" className="scroll-mt-28 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="border-l-4 border-brand pl-6 sm:pl-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
              </svg>
              Vision
            </span>
            <span
              className="mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-brand to-brand/20"
              aria-hidden="true"
            />
            <p className="mt-4 text-xl font-medium leading-relaxed text-zinc-800 sm:text-2xl">
              {vision}
            </p>
            <ul className="mt-8 space-y-4">
              {visionPillars.map((pillar) => {
                const [label, ...rest] = pillar.split(": ");
                const detail = rest.join(": ");
                return (
                  <li key={pillar} className="flex gap-3 text-base text-zinc-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12l4 4L19 7" />
                      </svg>
                    </span>
                    <span>
                      <span className="font-semibold text-brand-dark">{label}</span>
                      {detail && <>: {detail}</>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={80} className="border-l-4 border-brand-dark pl-6 sm:pl-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-dark/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-dark">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 3v18" strokeLinecap="round" />
                <path d="M5 4h11l-3 4 3 4H5z" />
              </svg>
              Mission
            </span>
            <span
              className="mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-brand-dark to-brand-dark/20"
              aria-hidden="true"
            />
            <p className="mt-4 text-lg font-medium leading-relaxed text-zinc-800">
              {missionStatement}
            </p>
            <p className="mt-3 text-base leading-relaxed text-zinc-600">{missionNarrative}</p>
            <ul className="mt-8 space-y-4">
              {missionCommitments.map((item) => (
                <li key={item.title} className="flex gap-3 text-base leading-relaxed text-zinc-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-dark/10 text-brand-dark">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12l4 4L19 7" />
                    </svg>
                  </span>
                  <span>
                    <span className="font-semibold text-brand-dark">{item.title}.</span>{" "}
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div id="values" className="scroll-mt-28">
          <Reveal>
            <SectionHeading eyebrow="What We Stand For" title="Our Core Values" accent />
          </Reveal>
          {/* Redesigned (2026-09-14, per Vignesh — same note): six boxed
              cards became a plain numbered grid, matching the "What Drives
              Us" strip above for one consistent motif across the page
              instead of two different card-grid templates. */}
          <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, i) => (
              <Reveal key={value.title} delay={Math.min(i * 60, 240)}>
                <span
                  aria-hidden="true"
                  className="select-none font-display text-4xl font-bold text-brand/60"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Same accent-rule swap as "What Drives Us" above, for one
                    consistent point-heading motif across the page. */}
                <span
                  aria-hidden="true"
                  className="mt-3 mb-2.5 block h-0.5 w-8 rounded-full bg-gradient-to-r from-brand to-brand/30"
                />
                <h3 className="text-xl font-bold text-brand-dark">{value.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-zinc-600">{value.whatItMeans}</p>
                <p className="mt-2 text-base leading-relaxed text-zinc-500">{value.inPractice}</p>
              </Reveal>
            ))}
          </div>
          </div>
        </Container>
      </section>
    </>
  );
}
