import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import BrandLockup from "@/components/BrandLockup";
import { getSessionRole } from "@/lib/auth-server";
import { loadProspectWatch } from "@/lib/prospect-watch-server";
import { researchDate } from "@/lib/prospect-watch";

export default async function ProspectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ rep?: string; q?: string; new?: string }> }) {
  if (!(await getSessionRole())) redirect("/login");
  const [{ id }, search, collection] = await Promise.all([params, searchParams, loadProspectWatch()]);
  const p = collection.records.find(item => item.id === id);
  if (!p) notFound();
  const back = new URLSearchParams();
  for (const key of ["rep", "q", "new"] as const) if (search[key]) back.set(key, search[key]);
  return <main className="app-shell"><div className="page-frame" style={{ maxWidth: 800 }}>
    <header className="topbar"><Link href={`/prospect-watch?${back}`} className="back-link">← Prospect Watch</Link><BrandLockup compact /></header>
    <div className="page-heading"><p className="eyebrow">{p.owner} · {p.city}{p.zip ? ` · ${p.zip}` : ""}</p><h1 className="page-title" style={{ fontSize: "clamp(30px, 7vw, 44px)", lineHeight: 1.1 }}>{p.company}</h1><p className="page-subtitle">{p.address}</p></div>
    <div className="form-stack">
      <section className="panel"><p className="eyebrow">Hiring evidence</p><h2 className="mb-4 text-2xl font-extrabold text-[#183443]">{p.role}</h2><p className="text-base leading-relaxed text-slate-700">{p.evidence}</p><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-base text-slate-600"><p>Checked <strong>{researchDate(p.checkedOn)}</strong></p>{p.postedOn && <p>Employer posting date: {researchDate(p.postedOn)}</p>}</div><a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-[#183443] px-5 py-3 text-base font-bold text-white">View hiring source ↗</a><p className="mt-3 text-sm text-slate-500">{p.sourceLabel}. Availability can change after the checked date.</p></section>
      <section className="panel"><p className="eyebrow">Conversation starter</p><h2 className="mb-4 text-2xl font-extrabold text-[#183443]">Where NOW might help</h2><p className="text-lg leading-relaxed text-slate-700">{p.opportunity}</p><h3 className="mt-6 mb-3 text-base font-bold text-[#183443]">Possible equipment fit</h3><div className="flex flex-wrap gap-2">{p.equipment.map(item => <span key={item} className="rounded-full bg-[#e3f0f2] px-4 py-2 text-base font-bold text-[#196273]">{item}</span>)}</div><p className="mt-5 text-base leading-relaxed text-slate-700">{p.qualification}</p><p className="mt-4 text-sm text-slate-500">Suggested sales angle based on the role. The company has not confirmed an outsourcing need.</p></section>
      <section className="panel"><h2 className="panel-title">Start with the right person</h2><p className="text-lg font-bold text-[#183443]">Ask for the {p.contactRole.toLowerCase()}.</p><p className="mt-3 text-base text-slate-600">Suggested role to ask for, not a verified individual decision-maker.</p>{p.phone && <a href={`tel:${p.phone.replace(/[^\d+]/g, "")}`} className="mt-5 inline-flex min-h-12 items-center rounded-xl border border-[#a9ccd2] bg-[#edf6f7] px-5 py-3 font-bold text-[#196273]">Call {p.phone}</a>}{p.locationSourceUrl && <a href={p.locationSourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block min-h-11 py-2 font-bold text-[#007f94] underline underline-offset-4">Location / business source ↗</a>}</section>
      <p className="px-1 text-base text-slate-600">Use Salesforce for account ownership, outreach history, and follow-up. Territory labels here follow the current ZIP assignments.</p>
    </div>
  </div></main>;
}
