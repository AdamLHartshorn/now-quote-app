import { getSessionRole } from "@/lib/auth-server";
import QuoteArchiveClient from "./QuoteArchiveClient";

export default async function QuoteArchivePage() {
  return <QuoteArchiveClient isAdmin={(await getSessionRole()) === "admin"} />;
}
