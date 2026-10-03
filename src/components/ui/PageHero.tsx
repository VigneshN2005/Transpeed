import type { CSSProperties, ReactNode } from "react";
import Container from "@/components/ui/Container";
import MobileBannerScene, { type MobileSceneKind } from "@/components/ui/MobileBannerScene";

// Dark hero banner for interior pages — same visual language as the
// homepage hero (glow blobs + route-grid on brand-dark), scaled down to an
// intro band rather than a full landing hero. `children` is for anything
// that belongs directly under the copy (a quick-jump strip, stat row, etc).
//
// Load motion (2026-10-02, per Vignesh: premium, not cheesy): the eyebrow
// slides in, the title's words rise one after another from behind an
// invisible line, the title then gains its soft shadow, and the description
// and anything below fade up in turn. Pure CSS (globals.css, .tp-*), plays
// once on load, off for reduced-motion users. The title text stays real
// text in the HTML for search engines and screen readers.
const v = (vars: Record<string, string>) => vars as CSSProperties;

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
  scene,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Phone/tablet-only banner animation for this page (see MobileBannerScene). */
  scene?: MobileSceneKind;
}) {
  const words = title.split(" ");
  const START = 250, STEP = 170; // slowed 2026-10-02 per Vignesh so the motion is clearly visible
  const wordsEnd = START + words.length * STEP;
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* Mobile-scaled (2026-09-29, per Vignesh) — same fix as the
            homepage hero: this one glow reaches every interior page
            (Company, Services, People, Locations, Announcements). */}
        <div className="absolute -top-14 right-[-5rem] h-48 w-48 rounded-full bg-brand/7 blur-[60px] sm:-top-28 sm:right-[-10rem] sm:h-[26rem] sm:w-[26rem] sm:bg-brand/14 sm:blur-[110px]" />
        <div className="hero-grid absolute inset-0" />
      </div>
      {scene && <MobileBannerScene kind={scene} />}

      <Container className="relative py-20 sm:py-24">
        {eyebrow && (
          <p className="tp-fade-x text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
            {eyebrow}
          </p>
        )}
        <h1
          className="tp-title mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-brand sm:text-5xl lg:text-6xl"
          style={v({ "--tp-shadow-delay": `${wordsEnd + 900}ms` })}
        >
          {words.map((w, i) => (
            <span key={i}>
              <span className="tp-wmask" style={v({ "--tp-delay": `${START + i * STEP}ms` })}>
                <span className="tp-word" style={v({ "--tp-delay": `${START + i * STEP}ms` })}>
                  {w}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        {description && (
          <p
            className="tp-fade mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
            style={v({ "--tp-delay": `${wordsEnd + 600}ms` })}
          >
            {description}
          </p>
        )}
        {children && (
          <div className="tp-fade" style={v({ "--tp-delay": `${wordsEnd + 950}ms` })}>
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
