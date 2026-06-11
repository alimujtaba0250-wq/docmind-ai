import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/chat", "/documents", "/settings"];
const authRoutes = ["/login"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("docmind_token")?.value;
  const { pathname } = request.nextUrl;

  // Redirect logged-out users away from protected pages
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in users away from login page
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/documents/:path*", "/settings/:path*", "/login"],
};
