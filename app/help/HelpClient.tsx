"use client";

import Image from "next/image";
import Link from "next/link";

import { usePricingSettings } from "@/lib/pricing-settings";

function GuideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h2 className="panel-title">{title}</h2>
      <div className="space-y-3 text-sm leading-6 text-slate-600">{children}</div>
    </section>
  );
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="ml-5 list-decimal space-y-2 marker:font-extrabold marker:text-[#008da3]">{children}</ol>;
}

export default function HelpClient({ isAdmin }: { isAdmin: boolean }) {
  const pricing = usePricingSettings();
  const { config } = pricing;

  return (
    <main className="app-shell">
      <div className="page-frame">
        <header className="topbar">
          <Link href="/" className="back-link">← Quote menu</Link>
          <Image src="/now-logo.jpg" alt="NOW Courier" width={130} height={45} priority className="brand-logo" />
        </header>

        <div className="page-heading">
          <p className="eyebrow">{isAdmin ? "Administrator guide" : "User guide"}</p>
          <h1 className="page-title">Help center</h1>
          <p className="page-subtitle">
            {isAdmin
              ? "A complete operating guide for quoting, pricing assumptions, and publishing shared rates."
              : "A quick guide to choosing the right quote and using each workflow confidently."}
          </p>
        </div>

        <div className="form-stack">
          <GuideSection title="Choose the right quote">
            <p><strong className="text-[#102d3d]">Fast Quote — Parcel</strong> is for car, small-truck, and Sprinter work when a quick customer estimate is enough.</p>
            <p><strong className="text-[#102d3d]">Fast Quote — Commercial</strong> is for dock trucks, flatbeds, and semis when only the core shipment charges are needed.</p>
            <p><strong className="text-[#102d3d]">Detailed Quote</strong> adds wait time, extra stops, appointments, after-hours service, no-load, liftgate, Moffett, hazmat, and airport charges.</p>
            <p><strong className="text-[#102d3d]">Dedicated Quote</strong> prices equipment by the hour with the configured minimum and billing increment.</p>
          </GuideSection>

          <GuideSection title="Recommended workflow">
            <Steps>
              <li>Choose the quote type that matches the equipment and level of detail required.</li>
              <li>Enter trip miles—not round-trip miles unless the shipment itself is round trip.</li>
              <li>Enter shipment weight and every applicable stop or accessorial.</li>
              <li>Review the line-item breakdown before sharing the estimate.</li>
              <li>Use the copy control on detailed quotes to transfer the summary accurately.</li>
            </Steps>
            <p className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800">Quotes are estimates. Confirm unusual freight, special handling, or exceptions with Operations.</p>
          </GuideSection>

          <GuideSection title="Routing guide">
            <p>Build and reuse prospect routes from the shared route library. Begin every route title with your name, select one of the eight compass territories, enter the donut shop as the locked starting location, then add 1–20 businesses.</p>
            <p>A full street address is not required. Enter an address, street, neighborhood, or city; the app combines it with the business name and automatically uses the first best location match. It then recommends an efficient driving order.</p>
            <p>Work down the list, marking each stop complete or skipped. Use the arrow controls when local knowledge makes a manual adjustment preferable.</p>
            <p>Route mileage and drive time cover the donut shop through the final prospect; they do not include travel to the donut shop or a return trip.</p>
          </GuideSection>

          <GuideSection title="Quote archive">
            <p>Every calculator can save its current result to the shared Quote Archive. A customer name is required; after a name has been used once, it becomes available in the customer-name suggestions.</p>
            <p>The archive is reference-only. Saving a quote does not create Salesforce activity, a pipeline record, ownership, follow-up tasks, or a won/lost status.</p>
          </GuideSection>

          <GuideSection title="Sales quick reference">
            <p>This library will hold approved services, equipment, pricing guidance, discovery questions, objection responses, and escalation rules. Content will be added from the source documents provided by sales leadership.</p>
          </GuideSection>

          {isAdmin && (
            <>
              <GuideSection title="Publishing rates">
                <Steps>
                  <li>Open <Link href="/admin" className="font-bold text-[#007f94] underline">Admin — Pricing Settings</Link>.</li>
                  <li>Expand a rate group and update only the approved values.</li>
                  <li>Set the effective date so the change is documented.</li>
                  <li>Select <strong className="text-[#102d3d]">Save & Publish Pricing</strong>. The new version becomes active for every user and device immediately.</li>
                  <li>If another admin published first, reload before attempting to save again.</li>
                </Steps>
                <p>Fuel percentages are entered as percentages in Admin, then stored and calculated as decimals.</p>
              </GuideSection>

              <GuideSection title="Current rules and assumptions">
                {pricing.error && <p className="rounded-xl bg-red-50 p-3 font-semibold text-red-700">Live shared rates could not be loaded. Do not rely on the figures below until the connection is restored.</p>}
                <ul className="space-y-3">
                  <li><strong className="text-[#102d3d]">Parcel mileage:</strong> through {config.globalPricingRules.parcelMileageThreshold} miles, the selected service rate applies. Above it, the selected vehicle’s long-distance per-mile rate applies.</li>
                  <li><strong className="text-[#102d3d]">Dock Truck:</strong> above {config.commercialEquipmentConfig["Dock Truck"].overMileageThreshold} miles, the written full-trip rate replaces the normal per-mile rate for every trip mile; the service base remains.</li>
                  <li><strong className="text-[#102d3d]">Flatbeds and semis:</strong> their threshold surcharge applies only to miles beyond the equipment threshold; the normal base and mileage remain.</li>
                  <li><strong className="text-[#102d3d]">Fuel:</strong> calculated on transportation charges, using parcel, commercial, or heavy-commercial fuel class.</li>
                  <li><strong className="text-[#102d3d]">Weight:</strong> excess pounds are rounded up to the next 100 pounds before the CWT rate is applied.</li>
                  <li><strong className="text-[#102d3d]">Wait time:</strong> pickup and delivery wait are combined, free minutes are deducted once, then the per-minute rate applies.</li>
                  <li><strong className="text-[#102d3d]">Stops:</strong> the first stop is included; each additional stop is ${config.globalPricingRules.additionalStopCharge.toFixed(2)}.</li>
                  <li><strong className="text-[#102d3d]">No-load:</strong> transportation and fuel become zero, and the equipment no-load fee applies.</li>
                  <li><strong className="text-[#102d3d]">Dedicated:</strong> {config.globalPricingRules.dedicatedMinimumHours}-hour minimum, rounded up in {config.globalPricingRules.dedicatedBillingIncrementHours}-hour increments, with fuel loaded into the hourly rate.</li>
                  <li><strong className="text-[#102d3d]">Equipment restrictions:</strong> liftgate and Moffett charges apply only where the chosen equipment allows them.</li>
                </ul>
              </GuideSection>

              <GuideSection title="Admin safeguards">
                <p>Pricing is versioned. A stale browser cannot silently overwrite a newer version published elsewhere.</p>
                <p>All values must be zero or greater, required fields cannot be removed, and the dedicated billing increment must be greater than zero.</p>
                <p>The service-role database credential is server-only. It is never sent to the browser or exposed to staff users.</p>
              </GuideSection>
            </>
          )}

          <GuideSection title="Need assistance?">
            <p>For an unusual quote, pricing exception, or app issue, contact Adam Hartshorn.</p>
            <p><a className="font-bold text-[#007f94]" href="mailto:ahartshorn@nowcourier.com">ahartshorn@nowcourier.com</a><br /><a className="font-bold text-[#007f94]" href="tel:+13172703077">(317) 270-3077</a></p>
          </GuideSection>
        </div>
      </div>
    </main>
  );
}
