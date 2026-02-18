import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Get the token
  const token = request.cookies.get("admin_token")?.value;

  // 2. Define the exact path to your dashboard folder
  // Looking at your image, it is: /admin-login/dashboard
  const isDashboardRoute = pathname.startsWith("/admin-login/dashboard");
  const isLoginPage = pathname === "/admin-login";

  // LOG FOR VERCEL DEBUGGING (Check your Vercel Logs)
  console.log(`Middleware hit: ${pathname} | Token exists: ${!!token}`);

  // PROTECT DASHBOARD
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  // REDIRECT IF ALREADY LOGGED IN
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin-login/dashboard", request.url));
  }

  return NextResponse.next();
}

// 3. BROAD MATCHER (Crucial)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};