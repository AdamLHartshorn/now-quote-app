import Image from "next/image";

export default function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`field-desk-brand${compact ? " field-desk-brand--compact" : ""}`} aria-label="NOW Courier Field Desk">
      <div className="field-desk-brand__main">
        <Image src="/now-logo.jpg" alt="NOW Courier" width={324} height={139} priority />
        <div className="field-desk-brand__route" aria-hidden="true">
          <span className="field-desk-brand__compass">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="m15.5 8.5-2.1 5-4.9 2 2.1-5 4.9-2Z" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.15" fill="white" stroke="none" />
            </svg>
          </span>
          <span className="field-desk-brand__dash" />
          <span className="field-desk-brand__dot" />
        </div>
      </div>
      <div className="field-desk-brand__name">Field Desk</div>
    </div>
  );
}
