import { NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

const protectedRoutes = [
  "/dashboard",
  "/projects",
  "/tasks",
  "/members",
  "/activity",
  "/settings",
];

const authRoutes = ["/login", "/register"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isAuthPage = authRoutes.includes(pathname);

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/members/:path*",
    "/activity/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
