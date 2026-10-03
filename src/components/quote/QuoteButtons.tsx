"use client";

// Small client buttons that open the shared "Get a Quote" pop-up
// (QuoteProvider). Server pages (e.g. Services) can drop these in directly.

import type { ReactNode } from "react";
import { useQuote, WhatsAppIcon } from "@/components/quote/QuoteProvider";
import { whatsappLink } from "@/data/enquiry";

export function GetQuoteButton({
  service,
  className = "",
  children = "Get a Quote",
}: {
  service?: string;
  className?: string;
  children?: ReactNode;
}) {
  const { open } = useQuote();
  return (
    <button
      type="button"
      onClick={() => open(service)}
      className={`btn-glint inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(255,49,49,0.5)] transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {children} <span aria-hidden="true" className="tp-arrow">→</span>
    </button>
  );
}

export function WhatsAppQuoteLink({ service, className = "" }: { service?: string; className?: string }) {
  const msg = service
    ? `Hi Transpeed, I'm interested in ${service}. Could you share a quote?`
    : "Hi Transpeed, I'd like to know which of your services suits my shipment.";
  return (
    <a
      href={whatsappLink(msg)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-white/65 transition-colors hover:text-white ${className}`}
    >
      <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
    </a>
  );
}
