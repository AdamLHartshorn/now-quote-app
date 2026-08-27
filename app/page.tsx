import HomeClient from "./HomeClient";
import { getSessionRole } from "@/lib/auth-server";

export default async function Home() {
  const role = await getSessionRole();
  return <HomeClient isAdmin={role === "admin"} />;
}
