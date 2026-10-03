import Image from "next/image";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import GlassBackground from "@/components/ui/GlassBackground";
import PeopleSideScene from "@/components/people/PeopleSideScene";
import { people } from "@/data/people";

export const metadata = {
  title: "People | Transpeed Logistics",
};

export default function PeoplePage() {
  return (
    <>
      <GlassBackground page="people" canvas="#4A4D52" />
      <PageHero
        scene="people"
        eyebrow="People"
        title="Our Team Is Our Greatest Asset"
        description="Our people are our greatest asset, and it's their dedication and expertise that transform vision into results."
      />

      {/* Soft brand-red top glow behind the content area (2026-09-14, per
          Vignesh, relaying meeting feedback that the site read as "pure
          white and plain" and needed actual colour). Centered, matching the
          Services page's treatment since both are simple single-column card
          lists under a dark PageHero. */}
      <section id="people-content" className="relative">
        <PeopleSideScene targetId="people-content" />
        <Container className="space-y-20 py-20">
          {/* Redesigned (2026-09-14, per Vignesh: "make the people's page
              more like a website, modern aesthetic professional and
              advanced"). The old layout was one repeated bordered box with
              a giant translucent numeral clipped awkwardly into a corner.
              This alternates the photo side left/right per profile (an
              editorial "feature" rhythm rather than a stacked template),
              frames each portrait with a soft brand-tinted glow instead of
              a flat border, replaces the oversized ghost numeral with a
              small solid index badge that sits on the photo itself, and
              turns the flat bullet list into a light vertical timeline. */}
          {people.map((person, i) => {
            const reversed = i % 2 === 1;
            return (
              <Reveal key={person.slug} delay={Math.min(i * 60, 240)}>
                <article className="relative">
                  <div
                    className={`relative grid gap-10 lg:grid-cols-[26rem_1fr] lg:items-start lg:gap-16 ${
                      reversed ? "lg:[direction:rtl]" : ""
                    }`}
                  >
                    {/* Photo — glow frame behind it for depth, plus a solid
                        index badge sitting on the corner instead of a huge
                        faded numeral clipped over the whole card. */}
                    <div className={reversed ? "lg:[direction:ltr]" : ""}>
                      <Reveal
                        variant="image"
                        className="relative mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none"
                      >
                        <div
                          className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand/25 via-brand/5 to-transparent blur-md"
                          aria-hidden="true"
                        />
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_25px_50px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
                          <Image
                            src={person.photo}
                            alt={person.name}
                            fill
                            sizes="(min-width: 1024px) 26rem, 90vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                        </div>
                      </Reveal>
                    </div>

                    {/* Details */}
                    <div className={reversed ? "lg:[direction:ltr]" : ""}>
                      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-brand-dark/40 p-6 shadow-[0_24px_55px_-14px_rgba(0,0,0,0.45),0_8px_24px_-4px_rgba(255,49,49,0.13),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_32px_70px_-16px_rgba(0,0,0,0.55),0_12px_32px_-6px_rgba(255,49,49,0.21),inset_0_1px_0_rgba(255,255,255,0.1)] sm:p-8">
                      <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
                      <h3 data-tp="words" className="relative text-2xl font-bold text-white sm:text-3xl">{person.name}</h3>
                      <span className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-white">
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="7" width="18" height="13" rx="2" />
                          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        {person.role}
                      </span>

                      <div className="relative z-10 mt-6 max-w-2xl">
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -left-3 -top-4 select-none font-display text-6xl font-bold text-brand/[0.08]"
                        >
                          &ldquo;
                        </span>
                        <p className="relative text-lg leading-relaxed text-white/70">{person.bio}</p>
                      </div>

                      {person.experience && (
                        <ul className="relative mt-7 max-w-2xl space-y-5 border-t border-white/10 pt-6">
                          {person.experience.map((exp) => (
                            <li key={exp.org} className="relative flex gap-3.5 text-base text-white/70">
                              <span className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                                <span className="absolute h-2.5 w-2.5 rounded-full bg-brand/20" />
                                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                              </span>
                              <span>
                                <span className="font-semibold text-white/90">{exp.org}</span>{" "}
                                {exp.period && <span className="text-white/50">({exp.period})</span>}{" "}
                                {exp.detail}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {person.leadershipNote && (
                        <div className="relative mt-7 max-w-2xl rounded-2xl bg-brand/5 p-5">
                          <p className="text-base italic leading-relaxed text-white/70">
                            {person.leadershipNote}
                          </p>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>
                </article>
                {/* Separator between profiles (2026-10-02, per Vignesh: "add
                    separation line in people's page"): a hairline that fades
                    out at both ends, with a small brand-red diamond at its
                    centre. Not after the last profile. */}
                {i < people.length - 1 && (
                  <div aria-hidden="true" className="relative mt-20 flex items-center justify-center">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/25" />
                    <span className="mx-4 h-2.5 w-2.5 rotate-45 bg-brand shadow-[0_0_14px_rgba(255,49,49,0.55)]" />
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/25" />
                  </div>
                )}
              </Reveal>
            );
          })}
        </Container>
      </section>
    </>
  );
}
