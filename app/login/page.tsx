"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  function handleLogin() {
    if (password === "NOWQ2") {
      document.cookie = "now-auth=true; path=/; max-age=86400";
      router.push("/");
    } else {
      setError("Incorrect password");
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        <div className="flex justify-center mb-6">
          <Image
            src="/now-logo.jpg"
            alt="NOW Courier"
            width={260}
            height={90}
            priority
          />
        </div>

        <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-lg">

          <p className="text-xs tracking-widest text-slate-400 font-bold text-center mb-6">
            FOR INTERNAL USE ONLY · v0.5 INTERNAL BETA
          </p>

          <input
            type="text"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            className="w-full rounded-xl border border-slate-300 p-4 text-xl tracking-wide text-slate-900 mb-4"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-[#0093aa] hover:bg-[#007c91] text-white rounded-xl p-4 font-bold text-lg transition-all duration-200"
          >
            LOGIN
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-4 text-center">
              {error}
            </p>
          )}

        </div>

      </div>
    </main>
  );
}