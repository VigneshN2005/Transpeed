import Image from "next/image";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ServiceJourney from "@/components/services/ServiceJourney";
import ServiceProcess from "@/components/services/ServiceProcess";
import GlassBackground from "@/components/ui/GlassBackground";
import { services } from "@/data/services";
import { GetQuoteButton, WhatsAppQuoteLink } from "@/components/quote/QuoteButtons";

export const metadata = {
  title: "Services | Transpeed Logistics",
};

// Whitish-grey page canvas trial (2026-10-02, Vignesh: "try whitish grey
// background ... not the box"). Canvas -> #e6e6e6, then Warm stone #EDE8E2 (picked from a 6-swatch comparison), then Slate grey #4A4D52; each service box given a
// solid #2a2a2a fill (was bg-brand-dark/8, i.e. nearly transparent, so it only
// LOOKED dark because the dark canvas showed through) so the boxes keep their
// current dark look and white text on the light page. Divider between
// services flipped to black/10 so it still shows on the light canvas.
export default function ServicesPage() {
  return (
    <>
      <GlassBackground page="services" canvas="#4A4D52" />
      {/* Headline/description updated (2026-09-21, per Vignesh) from the
          original "Global and Domestic Supply Chain Solutions" carried
          over from Transpeed's previous site, to the new brand line. Same
          dark glow/grid treatment as the homepage hero either way. */}
      <PageHero
        scene="services"
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
      <section className="relative py-12 sm:py-14">
        {/* Animated shipment-journey route + truck in the side gutters
            (2026-10-02, Vignesh) — see ServiceJourney.tsx. */}
        <ServiceJourney />
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
                stacked on top of each other.

                Background photos (2026-10-01, per Vignesh: "increase the
                images based on the page length... decide how many images
                per page") — one per PAIR of services (3 groups for 6
                services) rather than forcing a fixed 2 across the whole
                list, since a flat top/bottom split on a page this long
                either cropped the subject out or left most of the page on
                plain canvas. Each group is its own `relative
                overflow-hidden` wrapper sized naturally to that pair's own
                height — same proven technique as the Home page, just
                repeated as many times as this page's actual length calls
                for. All three photos are dedicated, freshly generated
                images (2026-10-01) — none reused from the earlier
                cargo/truck pair.

                Wrapper moved outside Container (2026-10-01, per Vignesh:
                "it is covering only the boxes?") — it was nested INSIDE
                Container before, so BgPhoto's absolute inset-0 only ever
                filled the max-w-6xl content column, not the viewport.
                Everything outside that column (the gutters either side on
                a wide screen) was plain canvas, not photo — exactly like a
                box rather than a true full-bleed background. Now the
                `relative overflow-hidden` + BgPhoto wrapper sits OUTSIDE
                Container, same nesting Home uses, so the photo spans edge
                to edge and Container just centers the cards on top of it. */}
            {/* Background photos REMOVED and the 3 two-service groups
                flattened back into ONE list (2026-10-02, Vignesh: photos read
                as a "double image" next to each service's own photo, then
                "there are extra gaps between each service box, remove the
                extra gap"). The per-group padding stacked up to ~320px
                between pairs and ~192px within a pair; now a single even
                gap (space-y-12/14 + divider mt-12/14, ~100-112px total)
                between every service. */}
            <Container>
                <div className="relative space-y-12 sm:space-y-14">
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
                        the expanded step content gets below it.

                        Card opacity dropped 40% -> 15% -> 8%, blur eased
                        2xl -> lg (2026-10-01, per Vignesh: "why didn't u
                        apply like in first page" then "i want it to be
                        more") — 15% plus a heavy 2xl blur was still
                        smearing the photo into a vague tint rather than
                        letting it read as an actual image through the
                        glass. At 8% with a lighter blur the photo comes
                        through clearly; text keeps its own drop-shadow
                        (added below) rather than leaning on a dark fill
                        for contrast. */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#2a2a2a] p-6 shadow-[0_24px_55px_-14px_rgba(0,0,0,0.45),0_8px_24px_-4px_rgba(255,49,49,0.13),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-lg backdrop-saturate-150 transition-all duration-500 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_32px_70px_-16px_rgba(0,0,0,0.55),0_12px_32px_-6px_rgba(255,49,49,0.21),inset_0_1px_0_rgba(255,255,255,0.1)] sm:p-10">
                    <span aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-brand/7 blur-3xl" />
                    <div className="relative grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
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
                        <div data-tp="line" className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FF3131,#B91C1C)] text-sm font-bold text-white shadow-[0_6px_16px_-4px_rgba(255,49,49,0.32)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
                            {service.tagline}
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] sm:text-4xl">
                          {service.name}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="mt-3 block h-1 w-14 rounded-full bg-[linear-gradient(90deg,#FF3131,#B91C1C)]"
                        />
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
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
                      <div className="relative">
                        <ServiceProcess
                          steps={service.steps}
                          serviceName={service.name}
                        />
                      </div>
                    )}

                    {/* Call to action at the end of each service (2026-10-03,
                        per Vignesh relaying Sharanya): the moment someone
                        finishes reading about a service, they can ask for a
                        quote for it. One quiet row, not a banner. */}
                    <div className="relative mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[linear-gradient(110deg,rgba(255,49,49,0.12),rgba(255,255,255,0.03)_45%,transparent)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <div>
                        <p className="text-base font-semibold text-white">Need {service.name.toLowerCase()}?</p>
                        <p className="mt-0.5 text-sm text-white/60">Tell us about your shipment and we&apos;ll come back with a quote.</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3">
                        <GetQuoteButton service={service.name} />
                        <WhatsAppQuoteLink service={service.name} />
                      </div>
                    </div>
                    </div>

                    {i < services.length - 1 && (
                      <div className="mt-12 border-t border-white/10 sm:mt-14 lg:invisible" aria-hidden="true" />
                    )}
                        </article>
                      </Reveal>
                    );
                  })}
                </div>

                {/* Closing call to action for anyone who read everything
                    (2026-10-03, per Vignesh relaying Sharanya). */}
                <Reveal>
                  <div className="relative mt-16 overflow-hidden rounded-3xl border border-white/15 bg-brand-dark/60 p-8 text-center shadow-[0_24px_55px_-14px_rgba(0,0,0,0.45),0_8px_24px_-4px_rgba(255,49,49,0.15)] backdrop-blur-2xl sm:p-12">
                    <span aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
                    <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-brand">Let&apos;s talk</p>
                    <h2 className="relative mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Not sure which service you need?</h2>
                    <p className="relative mx-auto mt-3 max-w-xl text-base text-white/70">
                      Tell us what you&apos;re moving and where. Our team will recommend the right solution and send you a quote.
                    </p>
                    <div className="relative mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
                      <GetQuoteButton>Talk to our team</GetQuoteButton>
                      <WhatsAppQuoteLink />
                    </div>
                  </div>
                </Reveal>
            </Container>
      </section>
    </>
  );
}
