import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// admin-dashboard\src\middleware.ts 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  // 1. If user hits the root "/", send them to /dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Allow login page
  if (pathname.startsWith("/admin-login")) {
    // Optional: If they already have a token, don't let them see login, send to dashboard
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 3. Protect dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/admin-login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // This ensures the middleware runs on the root, dashboard, and login
  matcher: ["/", "/dashboard/:path*", "/admin-login"],
};