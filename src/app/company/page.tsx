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
} from "@/data/company";

export const metadata = {
  title: "Company | Transpeed Logistics",
};

const JUMP_LINKS = [
  { id: "offices", label: "Our Offices" },
  { id: "global-network", label: "Global Network" },
  { id: "who-we-are", label: "Who We Are" },
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
          <div id="offices" className="scroll-mt-28 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-10">
          <Reveal>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <SectionHeading eyebrow="Where We Are" title="Our Offices Across India" />
                {/* Body-copy paragraphs across this page bumped from
                    text-base/text-sm to text-lg/text-base (2026-09-15, per
                    Vignesh — a second round after the site-wide token bump
                    in globals.css read as too subtle on this specific page).
                    This is a direct, visible size jump on the actual
                    className rather than relying only on the token nudge. */}
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-600">
                  {locations.length} offices across India, from the Bangalore headquarters out to every
                  branch below — click a pin for the full address and directions.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-sm font-semibold text-white">
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
              className="pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-brand/15 via-transparent to-transparent blur-md"
              aria-hidden="true"
            />
            <div className="relative">
              <BranchesMap />
            </div>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {locations.map((location) => (
              <span
                key={location.city}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-600 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-sm"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-brand" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11z" />
                  <circle cx="12" cy="10" r="1.8" />
                </svg>
                {location.city}
                {location.isHeadquarters && (
                  <span className="ml-0.5 rounded-full bg-brand-dark px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
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
            <h2 className="mt-3 text-2xl font-bold text-brand-dark sm:text-3xl">Our Global Network</h2>
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
              <SectionHeading eyebrow="Who We Are" title="Our Philosophy" />
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
                <h4 className="mt-3 text-lg font-semibold text-brand-dark">{item.title}</h4>
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
            <h2 className="mt-3 text-2xl font-bold text-brand-dark sm:text-3xl">Our Journey</h2>
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
        <div id="vision-mission" className="scroll-mt-28 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="border-l-4 border-brand pl-6 sm:pl-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Vision</p>
            <p className="mt-4 text-xl font-medium leading-relaxed text-zinc-800 sm:text-2xl">
              {vision}
            </p>
            <ul className="mt-8 space-y-4">
              {visionPillars.map((pillar) => {
                const [label, ...rest] = pillar.split(": ");
                const detail = rest.join(": ");
                return (
                  <li key={pillar} className="flex gap-2.5 text-base text-zinc-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Mission</p>
            <p className="mt-4 text-lg font-medium leading-relaxed text-zinc-800">
              {missionStatement}
            </p>
            <p className="mt-3 text-base leading-relaxed text-zinc-600">{missionNarrative}</p>
            <ul className="mt-8 space-y-4">
              {missionCommitments.map((item) => (
                <li key={item.title} className="text-base leading-relaxed text-zinc-600">
                  <span className="font-semibold text-brand-dark">{item.title}.</span>{" "}
                  {item.description}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div id="values" className="scroll-mt-28">
          <Reveal>
            <SectionHeading eyebrow="What We Stand For" title="Our Core Values" />
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
                <h3 className="mt-3 text-lg font-semibold text-brand-dark">{value.title}</h3>
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
