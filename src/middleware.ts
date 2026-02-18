import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  /* ✅ If user is NOT logged in and tries to access dashboard */
  if (pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/admin-login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  /* ✅ If user IS logged in and tries to access login page */
  if (pathname === "/admin-login" && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

/* ✅ Apply middleware ONLY where needed */
export const config = {
  matcher: ["/dashboard/:path*", "/admin-login"],
};
