import { getSessionRole } from "@/lib/auth-server";

import RoutingGuideClient from "./RoutingGuideClient";

export default async function RoutingGuidePage() {
  const isAdmin = (await getSessionRole()) === "admin";
  return <RoutingGuideClient isAdmin={isAdmin} />;
}
