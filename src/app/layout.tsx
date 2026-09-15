import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Bold, condensed, industrial display face for hero-scale headlines — the
// highway-signage/shipping-manifest character suits a freight brand, used
// sparingly (hero only) so it reads as an intentional accent, not a
// wholesale font swap. Body copy and UI stay on Geist everywhere.
const oswald = Oswald({
  variable: "--font-display",
  weight: ["600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transpeed Logistics | Freight, Customs & Warehousing",
  description:
    "Transpeed Logistics: AEO-certified freight forwarding, customs clearance, project logistics, warehousing and distribution, transportation, and sourcing across India and overseas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatbotWidget />
      </body>
    </html>
  );
}
