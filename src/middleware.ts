import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Gates everything under /admin behind a signed-in Supabase session.
// /admin itself is the login page and stays reachable by anyone, but
// redirects straight to /admin/dashboard if a session already exists.
// There is no sign-up flow anywhere in this app — every admin account is
// created by hand in the Supabase dashboard — so any valid session here
// can only ever belong to staff.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

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
          response = NextResponse.next({ request });
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

  const isLoginPage = request.nextUrl.pathname === "/admin";

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
