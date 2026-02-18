import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  // 1. Define the exact path to your dashboard
  const DASHBOARD_PATH = "/admin-login/dashboard";

  // 2. If trying to access dashboard WITHOUT a token -> Redirect to login
  if (pathname.startsWith(DASHBOARD_PATH) && !token) {
    console.log("No token found, redirecting to login...");
    const loginUrl = new URL("/admin-login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If ALREADY logged in and trying to go to login page -> Redirect to dashboard
  if (pathname === "/admin-login" && token) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-login/:path*", // Matches /admin-login and /admin-login/dashboard
  ],
};