import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), 303);
  response.cookies.delete("now-auth");
  response.cookies.delete("now-role");
  return response;
}
