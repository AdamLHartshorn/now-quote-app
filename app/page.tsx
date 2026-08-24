import { cookies } from "next/headers";

import HomeClient from "./HomeClient";

export default async function Home() {
  const role = (await cookies()).get("now-auth")?.value;
  return <HomeClient isAdmin={role === "admin"} />;
}
