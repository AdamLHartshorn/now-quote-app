"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import BrandLockup from "@/components/BrandLockup";

type IconName = "car" | "truck" | "dollar" | "clock" | "compass" | "books" | "search" | "help" | "settings";

function AppIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    car: <><path d="M5 17h14l-1.5-5h-11L5 17Z"/><path d="m7 12 2-4h6l2 4M7 17v2m10-2v2"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></>,
    truck: <><path d="M3 7h11v10H3zM14 11h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    dollar: <><circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.7-.7-1.6-1-3-1-1.7 0-3 .8-3 2s1 1.8 3 2.3 3 1.1 3 2.5-1.3 2.2-3 2.2c-1.4 0-2.5-.4-3.3-1.2M12 5v14"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></>,
    books: <><path d="M5 4h4v16H5zM10 4h4v16h-4zM15 5l3-.8L21 19l-3 .8z"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.3 2.2c-.8.4-1.1.9-1.1 1.8M12 17h.01"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7-.5-1.2.9-1.9-2.1-2.1-1.9.9-1.2-.5-.7-2h-3l-.7 2-1.2.5-1.9-.9-2.1 2.1.9 1.9-.5 1.2-2 .7v3l2 .7.5 1.2-.9 1.9 2.1 2.1 1.9-.9 1.2.5.7 2h3l.7-2 1.2-.5 1.9.9 2.1-2.1-.9-1.9.5-1.2 2-.7Z"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function MenuCard({ href, title, description, icon, tone = "light", badge }: { href: string; title: string; description: string; icon: ReactNode; tone?: "light" | "teal" | "navy" | "soft"; badge?: string }) {
  const tones = {
    light: "border-slate-200 bg-white text-[#15394b] hover:border-[#8ebec7]",
    teal: "border-transparent bg-gradient-to-br from-[#00a1b8] to-[#007c91] text-white shadow-[0_14px_30px_rgba(0,126,148,.22)]",
    navy: "border-transparent bg-gradient-to-br from-[#183f52] to-[#102d3d] text-white shadow-[0_14px_30px_rgba(16,45,61,.18)]",
    soft: "border-[#a9ccd2] bg-[#e3f0f2] text-[#244c5a] hover:border-[#008da3]",
  };
  return <Link href={href} className={`menu-card group relative flex min-h-28 items-center gap-4 rounded-[22px] border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${tones[tone]}`}><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${tone === "teal" || tone === "navy" ? "bg-white/14 text-white" : "bg-[#edf6f7] text-[#007f94]"}`}>{icon}</span><span className="min-w-0"><span className="menu-card-title block text-base font-extrabold tracking-[-.01em]">{title}</span><span className={`mt-1 block text-sm leading-5 ${tone === "teal" || tone === "navy" ? "text-white/75" : "text-slate-500"}`}>{description}</span></span>{badge && <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[8px] font-extrabold tracking-wider text-[#00798d]">{badge}</span>}</Link>;
}

function MenuGroup({ title, children }: { title: string; children: ReactNode }) {
  return <section><div className="mb-3 flex items-center gap-3"><h2 className="text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-500">{title}</h2><span className="h-px flex-1 bg-slate-200" /></div><div className="grid gap-3 sm:grid-cols-2">{children}</div></section>;
}

export default function HomeClient({ isAdmin }: { isAdmin: boolean }) {
  function logout() { void fetch("/api/logout", { method: "POST" }).then(() => { window.location.href = "/login"; }); }

  return <main className="app-shell"><div className="mx-auto w-full max-w-2xl"><div className="home-brand-row mb-11 flex justify-center"><BrandLockup /></div><div className="space-y-10">
    <MenuGroup title="Create a quote"><MenuCard href="/fast-quote-parcel" title="Parcel quote" description="Car, small truck, and Sprinter estimates." icon={<AppIcon name="car" />} tone="teal" /><MenuCard href="/fast-quote-commercial" title="Commercial quote" description="Dock truck, flatbed, and semi estimates." icon={<AppIcon name="truck" />} tone="teal" /><MenuCard href="/detailed-quote" title="Detailed quote" description="Full shipment details and accessorials." icon={<AppIcon name="dollar" />} tone="navy" /><MenuCard href="/dedicated-quote" title="Dedicated quote" description="Hourly equipment with minimums and fuel." icon={<AppIcon name="clock" />} tone="navy" /></MenuGroup>
    <MenuGroup title="Plan & reference"><MenuCard href="/routing-guide" title="Routing guide" description="Build and work optimized prospect routes." icon={<AppIcon name="compass" />} tone="soft" /><MenuCard href="/quote-archive" title="Quote archive" description="Find previously saved calculations." icon={<AppIcon name="books" />} /><MenuCard href="/sales-reference" title="Quick reference" description="Approved services, equipment, and sales guidance." icon={<AppIcon name="search" />} /><MenuCard href="/help" title="Help center" description="Learn the workflows, rules, and assumptions." icon={<AppIcon name="help" />} /></MenuGroup>
    {isAdmin && <MenuGroup title="Administration"><MenuCard href="/admin" title="Pricing settings" description="Publish shared rates and manage pricing rules." icon={<AppIcon name="settings" />} tone="soft" /></MenuGroup>}
  </div><footer className="mt-12 flex items-end justify-between gap-5 border-t border-slate-200 pt-6 text-xs leading-5 text-slate-500"><div><p>Feedback or issues</p><a className="block font-bold text-[#00798d]" href="mailto:ahartshorn@nowcourier.com">ahartshorn@nowcourier.com</a><a className="block" href="tel:+13172703077">(317) 270-3077</a></div><button onClick={logout} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 font-bold tracking-wide text-slate-600 shadow-sm hover:border-[#8fc6cf] hover:text-[#00798d]">Log out</button></footer></div></main>;
}
