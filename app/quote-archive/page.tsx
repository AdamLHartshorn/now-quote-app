import { cookies } from "next/headers";
import QuoteArchiveClient from "./QuoteArchiveClient";

export default async function QuoteArchivePage() {
  return <QuoteArchiveClient isAdmin={(await cookies()).get("now-auth")?.value === "admin"} />;
}
