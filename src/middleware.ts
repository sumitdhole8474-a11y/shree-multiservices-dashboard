import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  // If user is NOT logged in
  if (!token) {
    // Allow only login page
    if (pathname.startsWith("/admin-login")) {
      return NextResponse.next();
    }

    // Redirect everything else to login
    return NextResponse.redirect(
      new URL("/admin-login", request.url)
    );
  }

  // If user IS logged in and tries to access login page
  if (token && pathname.startsWith("/admin-login")) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};