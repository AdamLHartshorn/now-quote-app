import { cookies } from "next/headers";

import RoutingGuideClient from "./RoutingGuideClient";

export default async function RoutingGuidePage() {
  const isAdmin = (await cookies()).get("now-auth")?.value === "admin";
  return <RoutingGuideClient isAdmin={isAdmin} />;
}
