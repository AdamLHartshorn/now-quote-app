import { cookies } from "next/headers";

import { verifySessionToken } from "@/lib/auth-session";

export async function getSessionRole() {
  return verifySessionToken((await cookies()).get("now-auth")?.value);
}
