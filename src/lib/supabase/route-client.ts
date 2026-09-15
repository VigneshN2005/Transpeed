import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Plain (non-SSR) Supabase client for stateless API routes like
// /api/chatbot — there's no user session or cookies involved here, just
// anon-key reads/inserts, with access entirely governed by each table's
// Row Level Security policies (see chatbot_schema.sql). Don't reuse this
// for anything that needs a logged-in user's session — that's what
// lib/supabase/server.ts (cookie-aware) is for.
export function createRouteClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
