"use client";

import Image from "next/image";

export default function Home() {
  function logout() {
    document.cookie = "now-auth=; path=/; max-age=0";
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">

        <div className="flex justify-end mb-4">
          <button
            onClick={logout}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Logout
          </button>
        </div>

        <div className="mb-6">

          <div className="flex justify-center mb-6">
            <Image
              src="/now-logo.jpg"
              alt="NOW Courier"
              width={260}
              height={90}
              priority
            />
          </div>

          <p className="text-xs tracking-widest text-slate-400 font-bold">
            FOR INTERNAL USE ONLY · v0.5 INTERNAL BETA
          </p>

        </div>

        <div className="flex flex-col gap-4">

          <a
            href="/fast-quote-parcel"
            className="bg-[#0093aa] hover:bg-[#007c91] text-white text-xl font-bold py-5 rounded-2xl block shadow-lg"
          >
            FAST QUOTE — PARCEL
          </a>

          <a
            href="/fast-quote-commercial"
            className="bg-[#0093aa] hover:bg-[#007c91] text-white text-xl font-bold py-5 rounded-2xl block shadow-lg"
          >
            FAST QUOTE — COMMERCIAL
          </a>

          <a
            href="/detailed-quote"
            className="bg-slate-700 hover:bg-slate-800 text-white text-xl font-semibold py-5 rounded-2xl block shadow-lg"
          >
            DETAILED QUOTE
          </a>

          <a
            href="/dedicated-quote"
            className="bg-slate-700 hover:bg-slate-800 text-white text-xl font-semibold py-5 rounded-2xl block shadow-lg"
          >
            DEDICATED QUOTE
          </a>

        </div>

        <div className="mt-10 space-y-2">

          <p className="text-xs text-slate-500">
            Feedback / Issues:
          </p>

          <p className="text-xs text-slate-600">
            ahartshorn@nowcourier.com
          </p>

          <p className="text-xs text-slate-600">
            (317) 270-3077
          </p>

        </div>

      </div>
    </main>
  );
}