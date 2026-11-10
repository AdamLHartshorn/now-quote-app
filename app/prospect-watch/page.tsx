import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth-server";
import { loadProspectWatch } from "@/lib/prospect-watch-server";
import ProspectWatchClient from "./ProspectWatchClient";

export default async function ProspectWatchPage({ searchParams }: { searchParams: Promise<{ rep?: string | string[]; q?: string | string[]; new?: string | string[] }> }) {
  if (!(await getSessionRole())) redirect("/login");
  const [collection, search] = await Promise.all([loadProspectWatch(), searchParams]);
  return <ProspectWatchClient {...collection} initialRep={typeof search.rep === "string" ? search.rep : "ALL"} initialQuery={typeof search.q === "string" ? search.q : ""} initialNew={search.new === "1"} />;
}
