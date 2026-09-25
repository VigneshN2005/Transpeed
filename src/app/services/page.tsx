import Image from "next/image";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ServiceProcess from "@/components/services/ServiceProcess";
import { services } from "@/data/services";

export const metadata = {
  title: "Services | Transpeed Logistics",
};

export default function ServicesPage() {
  return (
    <>
      {/* Headline/description updated (2026-09-21, per Vignesh) from the
          original "Global and Domestic Supply Chain Solutions" carried
          over from Transpeed's previous site, to the new brand line. Same
          dark glow/grid treatment as the homepage hero either way. */}
      <PageHero
        eyebrow="Transpeed Logistics"
        title="END TO END SUPPLY CHAIN SOLUTIONS"
        description="You don't need five vendors to move your business forward. You need one partner who gets it right, on schedule, at the right price, every time."
      >
        <nav aria-label="Jump to a service" className="mt-8 flex flex-wrap gap-2">
          {services.map((service, i) => (
            <a
              key={service.slug}
              href={`#${service.slug}`}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 backdrop-blur-sm transition-colors hover:border-brand hover:text-brand"
            >
              <span className="text-brand">{String(i + 1).padStart(2, "0")}</span> {service.name}
            </a>
          ))}
        </nav>
      </PageHero>

      {/* Soft brand-red top glow behind the content area (2026-09-14, per
          Vignesh, relaying meeting feedback that the site read as "pure
          white and plain" and needed actual colour, not just the ivory
          tint + watermark from the first pass at this). Faint, top-anchored
          under the dark PageHero, fading into the plain page canvas by the
          time it reaches the card list — keeps the white service cards
          fully legible. */}
      <section className="relative bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(255,49,49,0.07),transparent_60%)]">
        <Container className="py-16">
          <div className="space-y-20 sm:space-y-24">
            {/* Redesigned (2026-09-14, per Vignesh: "make the alignment
                look differently, i mean it looks like ppt not like
                website"). The previous version was six identical bordered
                white boxes, each a small thumbnail pinned beside a
                paragraph — literally the "image + text block" shape of a
                slide, repeated. Replaced with an alternating editorial
                layout instead: photo and copy swap sides every other
                service (same lg:order-1/2 technique already used for the
                Company page's "Our Journey" block), photos get real room
                rather than a small corner tile, the card border/box is
                dropped in favour of open whitespace, and a hairline rule
                — not a boxed edge — separates one service from the next.
                Reads as a page you scroll through rather than slides
                stacked on top of each other. */}
            {services.map((service, i) => {
              const reversed = i % 2 === 1;
              return (
                <Reveal key={service.slug} delay={Math.min(i * 40, 200)}>
                  <article id={service.slug} className="scroll-mt-28">
                    {/* items-start (2026-09-25, per Vignesh: "the image
                        should be beside the content") — was items-center,
                        which vertically centered the short photo against
                        the whole text+diagram+step-cards block once that
                        block grew much taller than the photo, so the photo
                        drifted down away from the title/description it's
                        meant to sit beside. items-start keeps it pinned to
                        the top, beside the title, regardless of how tall
                        the expanded step content gets below it. */}
                    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
                      {/* secondPhoto (2026-09-21, per Vignesh, for
                          Warehousing and Distribution: "along with the
                          image that is already there ... can u add the
                          image asked too"). Only this service has one so
                          far — everyone else keeps the original single
                          full-width photo untouched below. */}
                      {service.secondPhoto ? (
                        // (2026-09-21, per Vignesh: "add an arrow or
                        // something" → "remove arrow, make it somehow look
                        // better" → "nah it doesn't look good, align them
                        // in a better way" → "noooo better make the image 1
                        // look first, then 2nd image beside it"). Back to
                        // side by side per this last instruction, but not
                        // the original equal 50/50 split — the main photo
                        // ("image 1") leads at roughly 3/5 width, the
                        // loading-dock shot sits beside it narrower at 2/5,
                        // so there's a clear primary/secondary read instead
                        // of two identical flat halves.
                        <Reveal
                          variant="image"
                          className={`group flex aspect-[4/3] w-full gap-3 ${reversed ? "lg:order-2" : ""}`}
                        >
                          <div className="relative w-3/5 overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5">
                            {service.photo && (
                              <Image
                                src={service.photo}
                                alt={`${service.name} — warehouse interior, Transpeed Logistics`}
                                fill
                                sizes="(min-width: 1024px) 24rem, 60vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                          </div>
                          <div className="relative w-2/5 overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5">
                            <Image
                              src={service.secondPhoto}
                              alt={`${service.name} — loading dock, Transpeed Logistics`}
                              fill
                              sizes="(min-width: 1024px) 16rem, 40vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        </Reveal>
                      ) : (
                        <Reveal
                          variant="image"
                          className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_20px_45px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5 ${
                            reversed ? "lg:order-2" : ""
                          }`}
                        >
                          {service.photo ? (
                            <Image
                              src={service.photo}
                              alt={`${service.name} — Transpeed Logistics`}
                              fill
                              sizes="(min-width: 1024px) 40rem, 100vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-brand/5">
                              {service.icon && (
                                <Image
                                  src={service.icon}
                                  alt={`${service.name} icon`}
                                  width={160}
                                  height={160}
                                  className="h-32 w-32 object-contain opacity-60"
                                />
                              )}
                            </div>
                          )}
                        </Reveal>
                      )}

                      <div className={reversed ? "lg:order-1" : ""}>
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FF3131,#B91C1C)] text-sm font-bold text-white shadow-[0_6px_16px_-4px_rgba(255,49,49,0.45)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
                            {service.tagline}
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
                          {service.name}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="mt-3 block h-1 w-14 rounded-full bg-[linear-gradient(90deg,#FF3131,#B91C1C)]"
                        />
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Moved out of the 2-column grid above and full width
                        across the whole article (2026-09-25, per Vignesh:
                        "make the full 6 step extend under the image too i
                        mean the space is being left why make the 6 step
                        process con[ge]st under the content only?"). Was
                        nested inside the text column, so the expanded
                        diagram + step cards were squeezed into column 2's
                        width while all of column 1 (below the photo) sat
                        empty. Now it spans the full article width and uses
                        that space instead of scrolling/cramming into half
                        of it. */}
                    {service.steps && (
                      <ServiceProcess
                        steps={service.steps}
                        serviceName={service.name}
                      />
                    )}

                    {i < services.length - 1 && (
                      <div className="mt-20 border-t border-zinc-200 sm:mt-24" aria-hidden="true" />
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
