import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  // 1. Define the protected path (based on your 'src/app/dashboard' folder)
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/admin-login";

  // 2. Protection Logic: If trying to access dashboard without a cookie
  if (isDashboardPage) {
    if (!token) {
      // No cookie found, redirect to the login page
      const loginUrl = new URL("/admin-login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Optional: Redirect logged-in users away from the login page
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

/* Matcher ensures the middleware runs on these specific paths */
export const config = {
  matcher: ["/dashboard/:path*", "/admin-login"],
};