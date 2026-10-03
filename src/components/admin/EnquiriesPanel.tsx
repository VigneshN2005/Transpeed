"use client";

// Admin > Enquiries (2026-10-03, per Vignesh): every "Get a Quote" request
// from the website, newest first. Each one was also emailed to the team;
// this is the backup copy so nothing is lost if an email lands in spam.
// Staff can mark an enquiry handled or delete it. Reading needs a signed-in
// session (see enquiries_schema.sql).

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Enquiry = {
  id: string;
  created_at: string;
  service: string;
  name: string;
  phone: string;
  email: string;
  company: string | null;
  origin: string | null;
  destination: string | null;
  message: string | null;
  handled: boolean;
};

export default function EnquiriesPanel() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHandled, setShowHandled] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (err) {
      setError(
        err.message.includes("does not exist") || err.code === "42P01"
          ? "The enquiries table isn't set up yet. Run enquiries_schema.sql once in Supabase's SQL Editor."
          : err.message,
      );
    } else {
      setError(null);
      setItems((data as Enquiry[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleHandled(e: Enquiry) {
    const supabase = createClient();
    const { error: err } = await supabase.from("enquiries").update({ handled: !e.handled }).eq("id", e.id);
    if (!err) setItems((list) => list.map((x) => (x.id === e.id ? { ...x, handled: !e.handled } : x)));
  }

  async function remove(e: Enquiry) {
    if (!window.confirm(`Delete the enquiry from ${e.name}? This can't be undone.`)) return;
    const supabase = createClient();
    const { error: err } = await supabase.from("enquiries").delete().eq("id", e.id);
    if (!err) setItems((list) => list.filter((x) => x.id !== e.id));
  }

  const visible = items.filter((e) => showHandled || !e.handled);
  const openCount = items.filter((e) => !e.handled).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Quote requests {openCount > 0 && <span className="ml-1 rounded-full bg-brand px-2 py-0.5 text-[11px] text-white">{openCount} open</span>}
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2 text-zinc-600">
            <input type="checkbox" checked={showHandled} onChange={(e) => setShowHandled(e.target.checked)} />
            Show handled
          </label>
          <button type="button" onClick={load} className="font-semibold text-brand-dark hover:text-brand">
            Refresh
          </button>
        </div>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-6 text-sm text-zinc-500">Loading…</p>}
      {!loading && !error && visible.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">No {showHandled ? "" : "open "}enquiries yet.</p>
      )}

      <ul className="mt-6 space-y-4">
        {visible.map((e) => (
          <li key={e.id} className={`rounded-xl border p-5 ${e.handled ? "border-zinc-200 bg-zinc-50 opacity-70" : "border-zinc-300 bg-white"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">{e.service}</p>
                <p className="mt-1 text-base font-bold text-brand-dark">
                  {e.name}
                  {e.company && <span className="font-normal text-zinc-500"> · {e.company}</span>}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {new Date(e.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleHandled(e)}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:border-brand hover:text-brand-dark"
                >
                  {e.handled ? "Mark open" : "Mark handled"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(e)}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:border-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="font-medium text-brand-dark hover:text-brand">{e.phone}</a>
              <a href={`mailto:${e.email}?subject=${encodeURIComponent(`Your quote request: ${e.service}`)}`} className="font-medium text-brand-dark hover:text-brand">{e.email}</a>
              <a
                href={`https://wa.me/${e.phone.replace(/\D/g, "").replace(/^(?!91)(\d{10})$/, "91$1")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-dark hover:text-brand"
              >
                WhatsApp
              </a>
            </div>
            {(e.origin || e.destination) && (
              <p className="mt-2 text-sm text-zinc-600">
                <span className="font-semibold text-zinc-700">Route:</span> {e.origin || "?"} → {e.destination || "?"}
              </p>
            )}
            {e.message && <p className="mt-2 whitespace-pre-line text-sm text-zinc-600">{e.message}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
