"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

function MenuCard({ href, title, description, icon, tone = "light", badge }: { href: string; title: string; description: string; icon: ReactNode; tone?: "light" | "teal" | "navy" | "soft"; badge?: string }) {
  const tones = {
    light: "border-slate-200 bg-white text-[#15394b] hover:border-[#8ebec7]",
    teal: "border-transparent bg-gradient-to-br from-[#00a1b8] to-[#007c91] text-white shadow-[0_14px_30px_rgba(0,126,148,.22)]",
    navy: "border-transparent bg-gradient-to-br from-[#183f52] to-[#102d3d] text-white shadow-[0_14px_30px_rgba(16,45,61,.18)]",
    soft: "border-[#a9ccd2] bg-[#e3f0f2] text-[#244c5a] hover:border-[#008da3]",
  };
  return <Link href={href} className={`group relative flex min-h-24 items-center gap-4 rounded-[22px] border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${tones[tone]}`}><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${tone === "teal" || tone === "navy" ? "bg-white/14 text-white" : "bg-[#edf6f7] text-[#007f94]"}`}>{icon}</span><span className="min-w-0"><span className="block text-sm font-extrabold tracking-[-.01em]">{title}</span><span className={`mt-1 block text-xs leading-5 ${tone === "teal" || tone === "navy" ? "text-white/70" : "text-slate-500"}`}>{description}</span></span>{badge && <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[8px] font-extrabold tracking-wider text-[#00798d]">{badge}</span>}</Link>;
}

function MenuGroup({ title, children }: { title: string; children: ReactNode }) {
  return <section><div className="mb-3 flex items-center gap-3"><h2 className="text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-500">{title}</h2><span className="h-px flex-1 bg-slate-200" /></div><div className="grid gap-3 sm:grid-cols-2">{children}</div></section>;
}

export default function HomeClient({ isAdmin }: { isAdmin: boolean }) {
  function logout() { void fetch("/api/logout", { method: "POST" }).then(() => { window.location.href = "/login"; }); }

  return <main className="app-shell"><div className="mx-auto w-full max-w-2xl"><div className="mb-6 flex items-center justify-between"><Image src="/now-logo.jpg" alt="NOW Courier" width={178} height={62} priority className="brand-logo !h-14" /><button onClick={logout} className="text-xs font-bold tracking-wide text-slate-500 hover:text-slate-700">Log out</button></div><div className="mb-10"><p className="eyebrow">NOW Sales Workspace</p><h1 className="page-title">What are we working on?</h1><p className="page-subtitle">Pricing, prospect planning, and the references you need—all in one place.</p></div><div className="space-y-8">
    <MenuGroup title="Create a quote"><MenuCard href="/fast-quote-parcel" title="Parcel quote" description="Car, small truck, and Sprinter estimates." icon="P" tone="teal" /><MenuCard href="/fast-quote-commercial" title="Commercial quote" description="Dock truck, flatbed, and semi estimates." icon="C" tone="teal" /><MenuCard href="/detailed-quote" title="Detailed quote" description="Full shipment details and accessorials." icon="D" tone="navy" /><MenuCard href="/dedicated-quote" title="Dedicated quote" description="Hourly equipment with minimums and fuel." icon="H" tone="navy" /></MenuGroup>
    <MenuGroup title="Plan & reference"><MenuCard href="/routing-guide" title="Routing guide" description="Build and work optimized prospect routes." icon="R" tone="soft" badge="NEW" /><MenuCard href="/quote-archive" title="Quote archive" description="Find previously saved calculations." icon="A" /><MenuCard href="/sales-reference" title="Sales quick reference" description="Approved services, equipment, and sales guidance." icon="S" /><MenuCard href="/help" title="Help center" description="Learn the workflows, rules, and assumptions." icon="?" /></MenuGroup>
    {isAdmin && <MenuGroup title="Administration"><MenuCard href="/admin" title="Pricing settings" description="Publish shared rates and manage pricing rules." icon="⚙" tone="soft" /></MenuGroup>}
  </div><footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs leading-5 text-slate-500"><p>Feedback or issues</p><a className="font-bold text-[#00798d]" href="mailto:ahartshorn@nowcourier.com">ahartshorn@nowcourier.com</a><span className="mx-2">·</span><a href="tel:+13172703077">(317) 270-3077</a></footer></div></main>;
}
