"use client";

import Link from "next/link";

import BrandLockup from "@/components/BrandLockup";
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
          <BrandLockup compact />
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
              <li>On Detailed Quote, copy the run details or open a prepared Fleet Dispatch email after reviewing the result.</li>
            </Steps>
            <p className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800">Quotes are estimates. Confirm unusual freight, special handling, or exceptions with Operations.</p>
          </GuideSection>

          <GuideSection title="Put NOW Field Desk on your phone’s Home Screen">
            <p className="text-base font-semibold text-[#102d3d]">Do this once for one-tap access—just like opening an app.</p>
            <div className="grid gap-4 pt-1 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-base font-extrabold text-[#102d3d]">Apple iPhone or iPad</h3>
                <Steps>
                  <li>Open <strong className="text-[#102d3d]">Safari</strong>. Do not use the Google app or another in-app browser for these steps.</li>
                  <li>Go to <strong className="text-[#102d3d]">nowfielddesk.vercel.app</strong> and sign in.</li>
                  <li>Tap the <strong className="text-[#102d3d]">Share</strong> button—the square with an arrow pointing upward. Depending on your Safari layout, it may be at the top or bottom of the screen.</li>
                  <li>Scroll down and tap <strong className="text-[#102d3d]">Add to Home Screen</strong>. If it is missing, scroll to the bottom, tap <strong className="text-[#102d3d]">Edit Actions</strong>, and add it.</li>
                  <li>Leave the name as <strong className="text-[#102d3d]">NOW Field Desk</strong>, turn on <strong className="text-[#102d3d]">Open as Web App</strong> if shown, then tap <strong className="text-[#102d3d]">Add</strong>.</li>
                  <li>Return to your Home Screen and tap the Field Desk icon to open it.</li>
                </Steps>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-base font-extrabold text-[#102d3d]">Android phone or tablet</h3>
                <Steps>
                  <li>Open <strong className="text-[#102d3d]">Google Chrome</strong>.</li>
                  <li>Go to <strong className="text-[#102d3d]">nowfielddesk.vercel.app</strong> and sign in.</li>
                  <li>Tap the <strong className="text-[#102d3d]">three-dot menu</strong> to the right of the address bar.</li>
                  <li>Tap <strong className="text-[#102d3d]">Install and create shortcut</strong>, then <strong className="text-[#102d3d]">Create shortcut</strong>. On some Android versions this appears as <strong className="text-[#102d3d]">Add to Home screen</strong> or <strong className="text-[#102d3d]">Install app</strong>.</li>
                  <li>Leave the name as <strong className="text-[#102d3d]">NOW Field Desk</strong>, tap <strong className="text-[#102d3d]">Add</strong>, and confirm placement if your phone asks.</li>
                  <li>Return to your Home Screen and tap the Field Desk icon to open it.</li>
                </Steps>
              </div>
            </div>
            <p className="rounded-xl bg-[#e8f5f6] p-3 text-sm font-semibold text-[#205563]">Your secure sign-in lasts for 90 days on that device. If the app asks for a password again after this security update, sign in once more; the Home Screen shortcut does not change your password.</p>
          </GuideSection>

          <GuideSection title="Routing guide">
            <p>Build and reuse prospect routes from the shared route library. Begin every route title with your name, select one of the eight compass territories, enter the donut shop as the locked starting location, then add 1–20 businesses.</p>
            <p>A full street address is not required. Enter an address, street, neighborhood, or city; the app combines it with the business name and automatically uses the first best location match. It then recommends an efficient driving order.</p>
            <p>Work down the list, marking each stop complete or skipped. Use the arrow controls when local knowledge makes a manual adjustment preferable.</p>
            <p>Route mileage and drive time cover the donut shop through the final prospect; they do not include travel to the donut shop or a return trip.</p>
          </GuideSection>

          <GuideSection title="Prospect Watch — Hiring & Delivery Signals">
            <p>Open <strong className="text-[#102d3d]">Prospect Watch</strong> next to Territory Map on the home page. Choose ALL, Adam, Brad, Dawn, Jon, or Shawn, then search by company, city, ZIP, or equipment.</p>
            <p>Each card shows a current or earlier hiring role and a suggested NOW opportunity. Use Hiring signal to view all prospects, current openings, or prior hiring signals. Tap it for the full profile, hiring source, checked date, possible equipment fit, and published business contact information where available.</p>
            <p><strong className="text-[#102d3d]">New to collection</strong> identifies a location added to this research collection; it does not mean the employer posted the job today. Current opening means a live hiring signal was confirmed on the shown date. Prior hiring signal preserves earlier research even when an ad expired or current hiring could not be confirmed. It does not claim the company is still hiring or paid for an ad. Openings can close after review.</p>
            <p>Rep filters follow the current ZIP assignments, including admin changes, when the page loads. ALL also includes market-wide postings without a confirmed branch ZIP and locations outside the assigned ZIP list. Those are not guessed into a rep’s territory.</p>
            <p>Earlier prospects remain available; duplicate research entries are consolidated. Profiles show location caveats and limited-fit warnings where needed. The suggested equipment and sales angle are research-based ideas. Confirm actual freight, handling, service requirements, and outsourcing needs with the business and Operations. Keep account ownership, activity, and follow-up in Salesforce.</p>
            <p>Research is refreshed in published editions. Send the next research update to Adam for the planned two-week review; the displayed checked date reflects the evidence review, not an automatic live job feed.</p>
          </GuideSection>

          <GuideSection title="Territory map">
            <p>Open <strong className="text-[#102d3d]">Territory Map</strong> to see the current sales assignments from the November 10 territory sheet. Choose ALL, Adam, Brad, Dawn, Jon, or Shawn; the map automatically frames that rep’s complete territory, so no manual zooming or scanning is required. I-465, I-70, I-65, I-74, and I-69 appear as thin lines with interstate shields to help you orient yourself. Use Hide highways for a ZIP-only view; the lines do not block selecting a ZIP.</p>
            <Steps>
              <li>Choose a rep or search by ZIP, city, county, or rep name.</li>
              <li>Tap a colored ZIP to see its owner and location details.</li>
              <li>Prospect Watch shows companies with a confirmed branch ZIP matching your selection, with current openings first and prior hiring signals clearly labeled. Tap a company for its full profile, then use the ZIP link to return to the map. Market-wide postings without a confirmed ZIP remain in Prospect Watch under ALL.</li>
              <li>Local business ideas contains up to five researched businesses per ZIP, with street addresses, source links, call buttons where a number is available, and suggested conversation starters. All map ZIPs were researched for the November 10 edition. Some have fewer than five suitable matches; those gaps are explained instead of filled with uncertain or nearby businesses.</li>
              <li>Check the research source and confirm current business details before visiting. Use Open map or Call when available. The business ideas are a saved research snapshot, separate from Prospect Watch hiring signals.</li>
            </Steps>
            <p>Gray ZIPs were absent from the original territory sheet and await admin assignment. Twelve source ZIPs have no matching shape in the available Census boundary dataset; they remain searchable. Map shapes are approximate Census statistical areas.</p>
            {isAdmin && <p className="rounded-xl bg-[#e8f5f6] p-3 text-sm font-semibold text-[#205563]">Admins can open any ZIP, choose a different rep, and select Save Assignment. The change becomes visible to the whole sales team immediately.</p>}
          </GuideSection>

          <GuideSection title="Quote archive">
            <p>Every calculator can save its current result to the shared Quote Archive. A customer name is required; after a name has been used once, it becomes available in the customer-name suggestions. Select Test Order when practicing.</p>
            <p>The archive is reference-only. Saving a quote does not create Salesforce activity, a pipeline record, ownership, follow-up tasks, or a won/lost status.</p>
          </GuideSection>

          <GuideSection title="Copy or email a run to Fleet Dispatch">
            <p>After completing a Detailed Quote, use <strong className="text-[#102d3d]">Copy Quote</strong> to place the complete formatted run details on your clipboard. This existing option remains available and unchanged.</p>
            <Steps>
              <li>Enter or select the customer name. Use <strong className="text-[#102d3d]">Test Order</strong> when practicing.</li>
              <li>Select the correct equipment and finish calculating the quote.</li>
              <li>Select <strong className="text-[#102d3d]">Email Dispatch</strong>. The app opens a new Outlook draft addressed to <strong className="text-[#102d3d]">fleetdispatch@nowcourier.com</strong>.</li>
              <li>Confirm the subject shows the customer and actual selected equipment—for example, <strong className="text-[#102d3d]">Acme NEW Dock Truck ORDER</strong>.</li>
              <li>Review the recipient, subject, and complete run details, make any necessary edits, and send the message from Outlook.</li>
            </Steps>
            <p className="rounded-xl bg-[#e8f5f6] p-3 text-sm font-semibold text-[#205563]">Email Dispatch only prepares a draft. NOW Field Desk never sends the email automatically.</p>
          </GuideSection>

          <GuideSection title="Quick reference">
            <p>Open Equipment for approved vehicle capacities and dimensions, Services for the current service levels used by the calculators, or Pricing Rules for the written assumptions behind every quote.</p>
            <p>Vehicle maximums do not guarantee availability or fit. Confirm unusually sized, heavy, or special-handling freight with Operations.</p>
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
