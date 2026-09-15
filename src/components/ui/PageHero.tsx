import type { ReactNode } from "react";
import Container from "@/components/ui/Container";

// Dark hero banner for interior pages — same visual language as the
// homepage hero (glow blobs + route-grid on brand-dark), scaled down to an
// intro band rather than a full landing hero. `children` is for anything
// that belongs directly under the copy (a quick-jump strip, stat row, etc).
export default function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-28 right-[-10rem] h-[26rem] w-[26rem] rounded-full bg-brand/20 blur-[110px]" />
        <div className="hero-grid absolute inset-0" />
      </div>

      <Container className="relative py-20 sm:py-24">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-brand sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
