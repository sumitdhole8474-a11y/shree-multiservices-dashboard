import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 1. PERFORM YOUR AUTHENTICATION LOGIC HERE
    // (e.g., check against a database or hardcoded credentials)
    const isValidUser = username === "admin" && password === "password123";

    if (!isValidUser) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2. CREATE THE RESPONSE
    const response = NextResponse.json(
      { message: "Login successful", success: true },
      { status: 200 }
    );

    // 3. SET THE COOKIE
    // This is what the middleware looks for
    response.cookies.set("admin_token", "your_generated_token_here", {
      httpOnly: true,    // Secure: hidden from frontend JavaScript
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "lax",
      path: "/",         // IMPORTANT: Accessible by the whole site
      maxAge: 60 * 60 * 24, // 1 day expiration
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}