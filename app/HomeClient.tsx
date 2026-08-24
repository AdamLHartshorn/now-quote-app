"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomeClient({ isAdmin }: { isAdmin: boolean }) {
  function logout() {
    void fetch("/api/logout", { method: "POST" }).then(() => {
      window.location.href = "/login";
    });
  }

  return (
    <main className="app-shell flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-5">
          <button onClick={logout} className="text-xs font-bold tracking-wide text-slate-500 hover:text-slate-700">Logout</button>
        </div>

        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Image src="/now-logo.jpg" alt="NOW Courier" width={260} height={90} priority />
          </div>
          <p className="eyebrow !mb-0">NOW PRICING PORTAL</p>
        </div>

        <div className="grid gap-3">
          {isAdmin && (
            <Link href="/admin" className="flex min-h-[54px] items-center justify-center rounded-2xl border border-cyan-200 bg-white px-5 py-4 text-center text-sm font-extrabold tracking-wide text-[#006f83] shadow-sm hover:border-[#0093aa]">
              ADMIN — PRICING SETTINGS
            </Link>
          )}
          <Link href="/fast-quote-parcel" className="bg-gradient-to-br from-[#00a1b8] to-[#007c91] text-white text-lg font-extrabold py-5 px-5 rounded-2xl block shadow-[0_12px_28px_rgba(0,126,148,.22)] text-center">FAST QUOTE — PARCEL</Link>
          <Link href="/fast-quote-commercial" className="bg-gradient-to-br from-[#00a1b8] to-[#007c91] text-white text-lg font-extrabold py-5 px-5 rounded-2xl block shadow-[0_12px_28px_rgba(0,126,148,.22)] text-center">FAST QUOTE — COMMERCIAL</Link>
          <Link href="/detailed-quote" className="bg-[#15394b] hover:bg-[#102f40] text-white text-lg font-bold py-5 px-5 rounded-2xl block shadow-[0_12px_28px_rgba(16,45,61,.16)] text-center">DETAILED QUOTE</Link>
          <Link href="/dedicated-quote" className="bg-[#15394b] hover:bg-[#102f40] text-white text-lg font-bold py-5 px-5 rounded-2xl block shadow-[0_12px_28px_rgba(16,45,61,.16)] text-center">DEDICATED QUOTE</Link>
          <div
            className="relative mt-1 flex min-h-[54px] items-center justify-center rounded-2xl border border-[#b9cbd2] bg-[#e4ecef] px-5 py-4 text-center text-sm font-extrabold tracking-wide text-[#365562] shadow-sm"
            aria-label="Routing Guide, coming soon"
          >
            <span>ROUTING GUIDE</span>
            <span className="absolute right-3 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[8px] font-extrabold tracking-[0.1em] text-[#607984]">
              COMING SOON
            </span>
          </div>
        </div>

        <div className="mt-9 pt-6 border-t border-slate-200 text-center space-y-1">
          <p className="text-xs text-slate-500">Feedback / Issues</p>
          <p className="text-xs text-slate-600">ahartshorn@nowcourier.com</p>
          <p className="text-xs text-slate-600">(317) 270-3077</p>
        </div>
      </div>
    </main>
  );
}
