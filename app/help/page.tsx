import { cookies } from "next/headers";

import HelpClient from "./HelpClient";

export default async function HelpPage() {
  const role = (await cookies()).get("now-auth")?.value;
  return <HelpClient isAdmin={role === "admin"} />;
}
