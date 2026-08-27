import { NextResponse } from "next/server";

import { createSessionToken, sessionMaxAge } from "@/lib/auth-session";

type LoginBody = { password?: string };

export async function POST(request: Request) {
  const { password } = (await request.json()) as LoginBody;
  const staffPassword = process.env.STAFF_PASSWORD;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!staffPassword || !adminPassword || !process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Login is temporarily unavailable" }, { status: 503 });
  }

  let role: "staff" | "admin" | null = null;
  if (adminPassword && password === adminPassword) role = "admin";
  else if (password === staffPassword) role = "staff";

  if (!role) {
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ role });
  response.cookies.set("now-auth", await createSessionToken(role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAge,
    path: "/",
  });
  response.cookies.set("now-role", role, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAge,
    path: "/",
  });

  return response;
}
