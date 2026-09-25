// `accent` is opt-in (default off) so every other page using this component
// renders exactly as before — added 2026-09-21 for the Company page's
// heading pass only (per Vignesh: "highlight the heading properly for each
// content... make the content look better, don't change alignment"). It
// adds one small gradient rule between the eyebrow and the title — no
// change to spacing/structure otherwise, so nothing shifts.
export default function SectionHeading({
  eyebrow,
  title,
  description,
  accent = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  accent?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
          {eyebrow}
        </p>
      )}
      {accent && (
        <span
          className="mb-3 block h-1 w-14 rounded-full bg-gradient-to-r from-brand to-brand/20"
          aria-hidden="true"
        />
      )}
      <h2 className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base text-zinc-600">{description}</p>}
    </div>
  );
}
