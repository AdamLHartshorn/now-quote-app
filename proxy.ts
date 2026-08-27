import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const auth = request.cookies.get("now-auth");
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!auth && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin") && auth?.value !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/fast-quote-parcel",
    "/fast-quote-commercial",
    "/detailed-quote",
    "/dedicated-quote",
    "/help",
    "/routing-guide",
    "/quote-archive",
    "/sales-reference",
    "/admin/:path*",
  ],
};
