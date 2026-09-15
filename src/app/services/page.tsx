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
      {/* Real headline carried over from Transpeed's own previous site
          ("Global and Domestic Supply Chain Solutions"), given the same
          dark glow/grid treatment as the homepage hero for a consistent
          brand feel across pages instead of the old flat gray banner. */}
      <PageHero
        eyebrow="Transpeed Logistics"
        title="Global and Domestic Supply Chain Solutions"
        description="Six services, one coordinated logistics partner, each handled end-to-end by our own team."
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
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
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

                      <div className={reversed ? "lg:order-1" : ""}>
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
                            {service.tagline}
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
                          {service.name}
                        </h3>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
                          {service.description}
                        </p>

                        {service.steps && (
                          <ServiceProcess
                            steps={service.steps}
                            diagram={service.diagram}
                            serviceName={service.name}
                          />
                        )}
                      </div>
                    </div>

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
