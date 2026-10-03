import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import HeadingMotion from "@/components/ui/HeadingMotion";
import QuoteProvider from "@/components/quote/QuoteProvider";
import "./globals.css";

// Site-wide font switched to Segoe UI (2026-09-21, per Vignesh). Dropped the
// Geist Sans/Mono + Oswald Google Font loads entirely — nothing in
// globals.css references their CSS variables anymore, so keeping them
// imported here would just be dead weight downloaded on every page load.
// See globals.css's @theme inline block for the actual font stack.

export const metadata: Metadata = {
  title: "Transpeed Logistics | Freight, Customs & Warehousing",
  description:
    "Transpeed Logistics: AEO-certified freight forwarding, customs clearance, project logistics, warehousing and distribution, transportation, and sourcing across India and overseas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {/* QuoteProvider: the "Get a Quote" pop-up any page can open (2026-10-03). */}
        <QuoteProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatbotWidget />
        </QuoteProvider>
        <HeadingMotion />
      </body>
    </html>
  );
}
