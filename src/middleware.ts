import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import protectedRoutes from "@/config/authRoute";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Only check auth if the pathname starts with one of the protected routes
  const requiresAuth = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (!requiresAuth) {
    return NextResponse.next();
  }

  // Attempt to retrieve the JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token, redirect to the sign-in page
  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Only match routes that need auth protection
export const config = {
  matcher: ["/account/:path*", "/checkout"],
};
