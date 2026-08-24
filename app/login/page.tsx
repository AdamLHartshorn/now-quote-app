"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = (await response.json()) as { role?: "staff" | "admin"; error?: string };
    setLoading(false);

    if (!response.ok || !result.role) {
      setError(result.error ?? "Unable to log in");
      return;
    }

    router.push(result.role === "admin" ? "/admin" : "/");
    router.refresh();
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
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            onKeyDown={(event) => {
              if (event.key === "Enter") void handleLogin();
            }}
            className="w-full rounded-xl border border-slate-300 p-4 text-xl tracking-wide text-slate-900 mb-4"
          />

          <button
            onClick={() => void handleLogin()}
            disabled={loading || !password}
            className="w-full bg-[#0093aa] hover:bg-[#007c91] text-white rounded-xl p-4 font-bold text-lg transition-all duration-200"
          >
            {loading ? "LOGGING IN…" : "LOGIN"}
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
