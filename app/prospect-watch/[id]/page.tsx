import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import BrandLockup from "@/components/BrandLockup";
import { getSessionRole } from "@/lib/auth-server";
import { loadProspectWatch } from "@/lib/prospect-watch-server";
import { researchDate } from "@/lib/prospect-watch";

export default async function ProspectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!(await getSessionRole())) redirect("/login");
  const [{ id }, search, collection] = await Promise.all([params, searchParams, loadProspectWatch()]);
  const p = collection.records.find(item => item.id === id);
  if (!p) notFound();
  const back = new URLSearchParams();
  for (const key of ["rep", "q", "new", "signal"]) if (typeof search[key] === "string") back.set(key, search[key]);
  const fromZip = typeof search.fromZip === "string" && /^\d{5}$/.test(search.fromZip) && search.fromZip === p.zip ? search.fromZip : null;
  const current = p.signalType === "current";
  return <main className="app-shell"><div className="page-frame" style={{ maxWidth: 800 }}>
    <header className="topbar"><Link href={fromZip ? `/territory-map?zip=${fromZip}` : `/prospect-watch?${back}`} className="back-link">{fromZip ? `← ZIP ${fromZip}` : "← Prospect Watch"}</Link><BrandLockup compact /></header>
    <div className="page-heading"><p className="eyebrow">{p.owner} · {p.city}{p.zip ? ` · ${p.zip}` : ""}</p><h1 className="page-title" style={{ fontSize: "clamp(30px, 7vw, 44px)", lineHeight: 1.1 }}>{p.company}</h1><p className="page-subtitle">{p.address}</p>{p.locationNote && <p className="mt-4 rounded-xl bg-white/70 p-4 text-base leading-relaxed text-slate-600">{p.locationNote}</p>}</div>
    <div className="form-stack">
      <section className="panel">
        <p className={`mb-3 text-base font-extrabold ${current ? "text-[#157259]" : "text-[#78591d]"}`}>{current ? "Current opening" : "Prior hiring signal"}</p>
        <h2 className="mb-4 text-2xl font-extrabold text-[#183443]">{p.role}</h2>
        <p className="text-base leading-relaxed text-slate-700">{p.evidence}</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-base text-slate-600"><p>{current ? "Confirmed" : "Research reviewed"} <strong>{researchDate(p.checkedOn)}</strong></p>{p.signalRecordedOn && <p>Earlier research: {researchDate(p.signalRecordedOn)}</p>}{p.postedOn && <p>Employer posting date: {researchDate(p.postedOn)}</p>}</div>
        <p className="mt-5 rounded-xl bg-slate-50 p-4 text-base leading-relaxed text-slate-700">{p.reviewNote}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {p.careerUrl && <a href={p.careerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-xl bg-[#183443] px-5 py-3 text-base font-bold text-white">{current ? "View current hiring source" : "Employer website / careers"} ↗</a>}
          {p.sourceUrl && p.sourceUrl !== p.careerUrl && <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-xl border border-slate-300 px-5 py-3 text-base font-bold text-[#183443]">{current ? "View hiring source" : "Original hiring source"} ↗</a>}
        </div>
        <p className="mt-3 text-base text-slate-500">{current ? "Availability can change after the review date." : "The original listing may no longer be available. A prior signal supports a conversation; it does not establish a current vacancy or paid advertising."}</p>
      </section>
      <section className="panel"><p className="eyebrow">Conversation starter</p><h2 className="mb-4 text-2xl font-extrabold text-[#183443]">Where NOW might help</h2>{p.limitedFit && <p className="mb-4 rounded-xl bg-amber-50 p-4 text-base font-semibold text-amber-900">Limited fit: explore a specific transport need. The advertised role may require equipment or services outside standard courier work.</p>}<p className="text-lg leading-relaxed text-slate-700">{p.opportunity}</p><h3 className="mt-6 mb-3 text-base font-bold text-[#183443]">Possible equipment fit</h3><div className="flex flex-wrap gap-2">{p.equipment.map(item => <span key={item} className="rounded-full bg-[#e3f0f2] px-4 py-2 text-base font-bold text-[#196273]">{item}</span>)}</div><p className="mt-5 text-base leading-relaxed text-slate-700">{p.qualification}</p><p className="mt-4 text-base text-slate-500">Suggested sales angle based on the role. The company has not confirmed an outsourcing need.</p></section>
      <section className="panel"><h2 className="panel-title">Start with the right person</h2><p className="text-lg font-bold text-[#183443]">Ask for the {p.contactRole.toLowerCase()}.</p><p className="mt-3 text-base text-slate-600">Suggested role to ask for, not a verified individual decision-maker.</p>{p.phone && <a href={`tel:${p.phone.replace(/[^\d+]/g, "")}`} className="mt-5 inline-flex min-h-12 items-center rounded-xl border border-[#a9ccd2] bg-[#edf6f7] px-5 py-3 font-bold text-[#196273]">Call {p.phone}</a>}{p.phone && p.contactResearchOn && <p className="mt-3 text-base text-slate-500">Business contact retained from the {researchDate(p.contactResearchOn)} research; not reconfirmed in this review.</p>}{p.locationSourceUrl && <a href={p.locationSourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block min-h-11 py-2 font-bold text-[#007f94] underline underline-offset-4">Location / business source ↗</a>}</section>
      <p className="px-1 text-base text-slate-600">Use Salesforce for account ownership, outreach history, and follow-up. Territory labels follow the current assignments for the identified branch ZIP; they do not prove a job reports to that branch.</p>
    </div>
  </div></main>;
}
