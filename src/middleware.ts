import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  /* ================================
     1️⃣ Allow login page if NOT logged in
  ================================= */
  if (pathname === "/admin-login" && !token) {
    return NextResponse.next();
  }

  /* ================================
     2️⃣ Protect dashboard routes
  ================================= */
  if (pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/admin-login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  /* ================================
     3️⃣ Prevent logged-in users
        from seeing login page
  ================================= */
  if (pathname === "/admin-login" && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

/* ================================
   Apply middleware only where needed
================================ */
export const config = {
  matcher: ["/dashboard/:path*", "/admin-login"],
};
