import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Hidden admin address (2026-10-03, per Vignesh, relaying Sharanya: "The
// Admin button on the homepage: let that be hidden or be a different URL
// that cannot be seen by the public.").
//
//   - Staff reach the admin at a private address (ADMIN_PATH below), never
//     linked anywhere on the site. Requests there are served by the
//     existing /admin pages behind the scenes (a rewrite), so the address
//     bar keeps showing the private address.
//   - /admin itself, and anything under it, now shows the normal "page not
//     found" page to the public.
//   - Admin responses carry X-Robots-Tag: noindex so search engines never
//     list them. The private address is deliberately NOT in robots.txt or
//     any other public file, since that would give it away.
//   - This file runs only on the server, so the private address is never
//     sent to visitors' browsers. It can be overridden without a code
//     change by setting an ADMIN_PATH environment variable (e.g. in Vercel).
//
// The real protection is unchanged: everything except the login page needs
// a signed-in Supabase session. There is no sign-up flow anywhere in this
// app (every admin account is created by hand in the Supabase dashboard),
// so any valid session here can only ever belong to staff.
const ADMIN_PATH = (process.env.ADMIN_PATH || "/tp-staff-portal-i58lcq").replace(/\/+$/, "");

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Old public address: pretend nothing is here.
  if (path === "/admin" || path.startsWith("/admin/")) {
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }

  // Everything that isn't the private admin address passes straight through.
  if (path !== ADMIN_PATH && !path.startsWith(ADMIN_PATH + "/")) {
    return NextResponse.next();
  }

  const sub = path.slice(ADMIN_PATH.length).replace(/\/+$/, ""); // "" (login) or "/dashboard"
  const internal = new URL("/admin" + sub + request.nextUrl.search, request.url);
  const makeResponse = () => {
    const r = NextResponse.rewrite(internal, { request });
    r.headers.set("X-Robots-Tag", "noindex, nofollow");
    return r;
  };
  let response = makeResponse();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = makeResponse();
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() (not getSession()) — this actually revalidates the token
  // against Supabase rather than trusting whatever the cookie claims.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = sub === "";

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL(ADMIN_PATH, request.url));
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL(ADMIN_PATH + "/dashboard", request.url));
  }

  return response;
}

// Runs on page requests only (not on Next's static files or anything with a
// file extension, like images). Non-admin pages exit at the first check
// above, so there is no Supabase call for normal visitors.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
