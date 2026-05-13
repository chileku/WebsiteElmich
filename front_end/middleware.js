import { NextResponse } from "next/server";
import { getUserFromToken } from "./app/lib/auth";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const user = getUserFromToken(token);
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") && user?.role !== 1) {
      return NextResponse.rewrite(new URL("/404", req.url));
  }

  if (
    (path.startsWith("/profile") ||
      path.startsWith("/orders") ||
      path.startsWith("/settings") ||
      path.startsWith("/checkout")) &&
    !user
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

/** Giới hạn route cần kiểm tra (tránh chạy middleware cho mọi file tĩnh) */
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/settings/:path*",
    "/checkout",
    "/checkout/:path*",
  ],
};
