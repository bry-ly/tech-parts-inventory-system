import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  // Auth pages that logged-in users shouldn't access
  const authPages = ["/sign-in", "/sign-up", "/forgot-password"];
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not logged in and trying to access protected routes, redirect to sign-in
  if (!sessionCookie && !isAuthPage && pathname !== "/") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/inventory/:path*",
    "/add-product/:path*",
    "/settings/:path*",
  ],
};
