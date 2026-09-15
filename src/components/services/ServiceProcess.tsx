"use client";

import { useState } from "react";
import Image from "next/image";

type Step = { title: string; text: string };

// Collapsed by default so this service's card starts at the same height as
// the other five (which have no steps/diagram) — the full six-step
// breakdown and process diagram are still all there, one click away,
// rather than being cut or shrunk to fit.
export default function ServiceProcess({
  steps,
  diagram,
  serviceName,
}: {
  steps: Step[];
  diagram?: string;
  serviceName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 border-t border-zinc-100 pt-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-sm font-semibold text-brand-dark">
          See the full {steps.length}-step process
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-transform duration-200 ${
            open ? "rotate-45 border-brand text-brand" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {open && (
        <div className="mt-5 space-y-6">
          {diagram && (
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-4">
              <Image
                src={diagram}
                alt={`${serviceName} process flow`}
                width={2172}
                height={724}
                className="h-auto w-full"
              />
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {i + 1}. {step.title}
                </p>
                <p className="mt-1.5 text-sm text-zinc-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
