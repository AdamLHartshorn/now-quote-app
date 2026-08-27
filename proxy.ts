import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifySessionToken } from "@/lib/auth-session";

export async function proxy(request: NextRequest) {
  const role = await verifySessionToken(request.cookies.get("now-auth")?.value);
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!role && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
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
