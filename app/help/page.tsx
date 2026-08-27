import HelpClient from "./HelpClient";
import { getSessionRole } from "@/lib/auth-server";

export default async function HelpPage() {
  const role = await getSessionRole();
  return <HelpClient isAdmin={role === "admin"} />;
}
