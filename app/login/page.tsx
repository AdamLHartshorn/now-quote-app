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
    <main className="min-h-screen flex items-center justify-center p-5 bg-[#eef5f6] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#00a5bb] to-[#006f83]" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="w-full max-w-sm relative">

        <div className="flex justify-center mb-8">
          <Image
            src="/now-logo.jpg"
            alt="NOW Courier"
            width={230}
            height={80}
            priority
          />
        </div>

        <div className="bg-white/95 border border-white rounded-[28px] p-7 shadow-[0_24px_70px_rgba(16,45,61,0.16)] backdrop-blur">

          <p className="eyebrow text-center !mb-2">
            NOW PRICING PORTAL
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-center text-[#102d3d] mb-2">Welcome back</h1>
          <p className="text-sm text-slate-500 text-center mb-6">Enter your team password to continue.</p>

          <form onSubmit={(event) => { event.preventDefault(); void handleLogin(); }}>
            <input type="text" name="username" value="NOW Field Desk" autoComplete="username" readOnly className="sr-only" tabIndex={-1} aria-hidden="true" />
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              aria-label="Password"
              className="control mb-4 text-center tracking-widest"
            />

            <button type="submit" disabled={loading || !password} className="primary-button">
              {loading ? "LOGGING IN…" : "LOGIN"}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">This device will remain signed in for 90 days unless you log out or clear browser data.</p>

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
