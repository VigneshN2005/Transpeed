import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-client";
import { sendEnquiryEmail } from "@/lib/email";

// "Get a Quote" form endpoint (2026-10-03, per Vignesh relaying Sharanya).
// Validates the enquiry, then (1) saves it to the `enquiries` table so it
// shows in the admin dashboard and (2) emails it to ENQUIRY_EMAIL. Either
// one succeeding counts as received; only if both fail does the visitor see
// an error (with a WhatsApp fallback). The WhatsApp hand-off itself happens
// in the visitor's browser (a pre-filled wa.me link), not here.
//
// Light spam protection, invisible to real visitors: a hidden "website"
// field that only bots fill in, and a minimum time between opening the form
// and sending it.

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots: pretend success, store nothing.
  const openedAt = Number(body.openedAt) || 0;
  if (clean(body.website, 200) || (openedAt && Date.now() - openedAt < 2500)) {
    return NextResponse.json({ ok: true });
  }

  const e = {
    service: clean(body.service, 80) || "General enquiry",
    name: clean(body.name, 80),
    phone: clean(body.phone, 30),
    email: clean(body.email, 120),
    company: clean(body.company, 120),
    origin: clean(body.origin, 120),
    destination: clean(body.destination, 120),
    message: typeof body.message === "string" ? body.message.trim().slice(0, 1500) : "",
  };

  if (e.name.length < 2) return bad("Please enter your name.");
  if (e.phone.replace(/\D/g, "").length < 7) return bad("Please enter a valid phone number.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) return bad("Please enter a valid email address.");

  let saved = false;
  let emailed = false;

  try {
    const supabase = createRouteClient();
    const { error } = await supabase.from("enquiries").insert({
      service: e.service,
      name: e.name,
      phone: e.phone,
      email: e.email,
      company: e.company || null,
      origin: e.origin || null,
      destination: e.destination || null,
      message: e.message || null,
    });
    saved = !error;
    if (error) console.error("[enquiry] save failed:", error.message);
  } catch (err) {
    console.error("[enquiry] save failed:", err);
  }

  try {
    await sendEnquiryEmail(e);
    emailed = true;
  } catch (err) {
    console.error("[enquiry] email failed:", err);
  }

  if (!saved && !emailed) {
    return NextResponse.json(
      { ok: false, error: "We couldn't send your request just now. Please reach us on WhatsApp instead." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}

function bad(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
