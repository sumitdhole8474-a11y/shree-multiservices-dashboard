// frontend/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Log for debugging (Check Vercel logs to see if this triggers)
  console.log("--- Middleware running on:", pathname);

  // 2. Define exactly what path you want to protect
  // Based on your folder: /admin-login/dashboard
  const isDashboardPage = pathname.startsWith("/admin-login/dashboard");

  if (isDashboardPage) {
    if (!token) {
      console.log("No token! Redirecting to login...");
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
    console.log("Token found. Access granted.");
  }

  return NextResponse.next();
}

// 3. The Matcher must be broad enough to catch the subfolders
export const config = {
  matcher: ["/admin-login/:path*"], 
};