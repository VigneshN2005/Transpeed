export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base text-zinc-600">{description}</p>}
    </div>
  );
}
