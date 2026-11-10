import { getSessionRole } from "@/lib/auth-server";

import TerritoryMapClient from "./TerritoryMapClient";

export default async function TerritoryMapPage() {
  return <TerritoryMapClient isAdmin={(await getSessionRole()) === "admin"} />;
}
