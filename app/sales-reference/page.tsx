import Link from "next/link";

import BrandLockup from "@/components/BrandLockup";

const sections = [
  ["Services", "Definitions, timing, use cases, and customer-facing explanations."],
  ["Equipment", "Capacities, dimensions, restrictions, and selection guidance."],
  ["Pricing rules", "Mileage, weight, wait time, fuel, and accessorial assumptions."],
  ["Discovery questions", "The essential questions to ask before recommending service."],
  ["Objections & responses", "Clear, approved language for common customer questions."],
  ["When to escalate", "Situations that require Operations or leadership review."],
] as const;

export default function SalesReferencePage() {
  return <main className="app-shell"><div className="page-frame"><header className="topbar"><Link href="/" className="back-link">← Quote menu</Link><BrandLockup compact /></header><div className="page-heading"><p className="eyebrow">Field sales playbook</p><h1 className="page-title">Sales quick reference</h1><p className="page-subtitle">A searchable home for approved sales guidance. Source documents will populate this library next.</p></div><section className="panel mb-5"><input disabled className="control opacity-60" placeholder="Search reference library — available when content is added" /></section><div className="form-stack">{sections.map(([title, description]) => <section key={title} className="panel"><div className="flex items-start justify-between gap-4"><div><h2 className="font-extrabold text-[#102d3d]">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-slate-500">READY FOR CONTENT</span></div></section>)}</div></div></main>;
}
