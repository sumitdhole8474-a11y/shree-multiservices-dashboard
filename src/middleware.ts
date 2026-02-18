import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes (no auth needed)
  if (pathname.startsWith("/admin-login")) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith("/admin-login/dashboard")) {
    const token = request.cookies.get("admin_token")?.value;

    // ❌ Not logged in → redirect to login
    if (!token) {
      const loginUrl = new URL("/admin-login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

/* Apply middleware only on these paths */
export const config = {
  matcher: ["/dashboard/:path*", "/admin-login"],
};
