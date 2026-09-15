import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/layout/Logo";
import { contactChannels } from "@/data/contact";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-brand-dark text-zinc-300">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo variant="dark" />
          <p className="mt-3 text-sm text-zinc-400">
            AEO-certified freight forwarding, customs clearance, and logistics across India and overseas.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Navigate</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-brand">Services</Link></li>
            <li><Link href="/company" className="hover:text-brand">Company</Link></li>
            <li><Link href="/people" className="hover:text-brand">People</Link></li>
            <li><Link href="/announcements" className="hover:text-brand">Client Announcements</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            {contactChannels.filter((c) => c.label !== "Chatbot").map((c) => (
              <li key={c.label}><a href={c.href} className="hover:text-brand">{c.label}: {c.value}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Certified</p>
          <p className="mt-3 text-sm text-zinc-400">AEO &middot; ISO 9001:2015 &middot; MSME</p>
        </div>
      </Container>
      <div className="border-t border-white/10 py-4">
        <Container className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} Transpeed Logistics Pvt Ltd. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm text-zinc-500">
            <li><Link href="/terms-conditions" className="hover:text-brand">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-brand">Privacy Policy</Link></li>
            <li><Link href="/cookies-policy" className="hover:text-brand">Cookie Policy</Link></li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
