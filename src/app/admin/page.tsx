"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import { createClient } from "@/lib/supabase/client";

// Real Supabase Auth sign-in. There is no sign-up form anywhere on this
// site — accounts are created by hand in the Supabase dashboard — so a
// working login here only ever means a pre-approved staff account.
export default function AdminLoginPage() {
  const router = useRouter();
  // The admin lives at a private address (see middleware.ts). Navigate
  // relative to wherever we are, so that address never appears in the
  // site's browser code.
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Incorrect email or password.");
      return;
    }

    router.push(`${pathname.replace(/\/+$/, "")}/dashboard`);
    router.refresh();
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-20">
      {/* marks this as an admin page: hides the public menu/footer and skips site animations */}
      <span data-admin-area hidden />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-zinc-200 p-8"
      >
        <h1 className="text-xl font-bold text-brand-dark">Admin Login</h1>
        <p className="mt-1 text-sm text-zinc-500">Staff access only.</p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <label className="mt-6 block text-sm font-medium text-zinc-700">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-zinc-700">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:border-brand focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-brand py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </Container>
  );
}
