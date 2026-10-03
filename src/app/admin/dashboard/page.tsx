"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import { createClient } from "@/lib/supabase/client";
import AnnouncementsPanel from "@/components/admin/AnnouncementsPanel";
import ChatbotPanel from "@/components/admin/ChatbotPanel";
import EnquiriesPanel from "@/components/admin/EnquiriesPanel";

type Tab = "enquiries" | "announcements" | "chatbot";

const TABS: { id: Tab; label: string }[] = [
  { id: "enquiries", label: "Enquiries" },
  { id: "announcements", label: "News & Updates" },
  { id: "chatbot", label: "Chatbot" },
];

// Reachable only for a signed-in session — middleware.ts redirects
// anyone else back to the (private) admin login before this ever renders.
export default function AdminDashboardPage() {
  const router = useRouter();
  // Private admin address (see middleware.ts): go "up" from /…/dashboard
  // to the login page without spelling the address out in browser code.
  const pathname = usePathname();
  const [tab, setTab] = useState<Tab>("enquiries");
  const [email, setEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(pathname.replace(/\/dashboard\/?$/, "") || "/");
    router.refresh();
  }

  return (
    <Container className="py-12">
      {/* marks this as an admin page: hides the public menu/footer and skips site animations */}
      <span data-admin-area hidden />
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Admin</h1>
          {email && <p className="mt-1 text-sm text-zinc-500">Signed in as {email}</p>}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 hover:border-brand hover:text-brand-dark disabled:opacity-60"
        >
          {loggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>

      <div className="mt-6 flex gap-2 border-b border-zinc-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "border-brand text-brand-dark"
                : "border-transparent text-zinc-500 hover:text-brand-dark"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "enquiries" && <EnquiriesPanel />}
        {tab === "announcements" && <AnnouncementsPanel />}
        {tab === "chatbot" && <ChatbotPanel />}
      </div>
    </Container>
  );
}
