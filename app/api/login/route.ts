import { NextResponse } from "next/server";

type LoginBody = { password?: string };

export async function POST(request: Request) {
  const { password } = (await request.json()) as LoginBody;
  const staffPassword = process.env.STAFF_PASSWORD ?? "NOWQ3";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ADMINQ3";

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
  const ninetyDays = 60 * 60 * 24 * 90;
  response.cookies.set("now-auth", role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ninetyDays,
    path: "/",
  });
  response.cookies.set("now-role", role, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ninetyDays,
    path: "/",
  });

  return response;
}
