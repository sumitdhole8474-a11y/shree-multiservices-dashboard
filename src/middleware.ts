import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  // 1. Identify Protected and Auth routes
  // Adjust these strings to match your actual folder names in /app
  const isDashboardRoute = pathname.startsWith("/dashboard"); 
  const isLoginRoute = pathname === "/admin-login";

  // 2. PROTECT DASHBOARD: If no token and trying to access dashboard
  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/admin-login", request.url);
    // Optional: add a redirect parameter so user returns here after login
    // loginUrl.searchParams.set("from", pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // 3. PREVENT DOUBLE LOGIN: If token exists and trying to access login page
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

/* IMPORTANT: Matcher must include the exact base paths you are checking above 
*/
export const config = {
  matcher: [
    "/dashboard/:path*", // Matches /dashboard and everything under it
    "/admin-login"       // Matches the login page
  ],
};