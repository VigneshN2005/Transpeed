import type { ReactNode } from "react";
import Container from "@/components/ui/Container";

// Shared shell for the three legal pages (Terms & Conditions, Privacy
// Policy, Cookie Policy) — consistent title/last-updated treatment and
// prose styling so none of the three drift from the others.
export default function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <Container className="max-w-3xl py-20">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Legal</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-zinc-500">Last updated: {lastUpdated}</p>

      <div className="mt-10 space-y-8">{children}</div>
    </Container>
  );
}

// One labeled block of body copy — consistent heading/paragraph rhythm
// across all three legal pages.
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-brand-dark">{heading}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-zinc-600">{children}</div>
    </section>
  );
}
