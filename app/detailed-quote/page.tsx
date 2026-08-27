"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { usePricingSettings } from "@/lib/pricing-settings";
import { calculateCommercialTransport } from "@/lib/pricing-engine";
import SaveQuote from "@/components/SaveQuote";
import MileageLookup from "@/components/MileageLookup";

export default function DetailedQuote() {
  const { config, version } = usePricingSettings();
  const {
    accessorialRates,
    commercialEquipmentConfig,
    fuelSurcharge,
    globalPricingRules,
  } = config;
  const [customerName, setCustomerName] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [equipment, setEquipment] =
    useState<keyof typeof commercialEquipmentConfig>("Dock Truck");

  const selectedEquipment = commercialEquipmentConfig[equipment];

  type ServiceType = keyof typeof selectedEquipment.serviceRates;

  const availableServices = Object.keys(
    selectedEquipment.serviceRates
  ) as ServiceType[];

  const [serviceType, setServiceType] = useState<string>("Direct");

  const safeServiceType = availableServices.includes(
    serviceType as ServiceType
  )
    ? (serviceType as ServiceType)
    : availableServices[0];

  const selectedService = selectedEquipment.serviceRates[safeServiceType];

  const [miles, setMiles] = useState("");
  const [weight, setWeight] = useState("");
  const [pallets, setPallets] = useState("");
  const [stops, setStops] = useState("1");

  const [pickWaitTime, setPickWaitTime] = useState("");
  const [dropWaitTime, setDropWaitTime] = useState("");

  const [afterHours, setAfterHours] = useState(false);
  const [sharp, setSharp] = useState(false);
  const [noLoad, setNoLoad] = useState(false);
  const [liftgate, setLiftgate] = useState(false);
  const [moffett, setMoffett] = useState(false);
  const [hazmat, setHazmat] = useState(false);
  const [airport, setAirport] = useState(false);

  const [copied, setCopied] = useState(false);

  const mileage = Number(miles) || 0;
  const shipmentWeight = Number(weight) || 0;
  const palletCount = Number(pallets) || 0;
  const stopCount = Number(stops) || 1;

  const pickWaitMinutes = Number(pickWaitTime) || 0;
  const dropWaitMinutes = Number(dropWaitTime) || 0;
  const totalWaitMinutes = pickWaitMinutes + dropWaitMinutes;

  const calculatedTransport = calculateCommercialTransport(
    mileage,
    selectedService,
    selectedEquipment
  );

  const transportBeforeFuel = noLoad
    ? 0
    : calculatedTransport;

  const fuelPercent = fuelSurcharge[selectedEquipment.fuelClass];
  const fuelCharge = transportBeforeFuel * fuelPercent;

  const overweightAmount = Math.max(
    0,
    shipmentWeight - selectedEquipment.includedWeight
  );

  const overweightCharge =
    Math.ceil(overweightAmount / 100) *
    selectedEquipment.overweightRatePerCwt;

  const additionalStopCharge =
    stopCount > 1
      ? (stopCount - 1) * globalPricingRules.additionalStopCharge
      : 0;

  const chargeableWaitMinutes = Math.max(
    0,
    totalWaitMinutes - selectedEquipment.freeWaitMinutes
  );

  const waitTimeCharge =
    chargeableWaitMinutes * selectedEquipment.waitRatePerMinute;

  const afterHoursCharge = afterHours ? selectedEquipment.afterHours : 0;
  const sharpCharge = sharp ? selectedEquipment.sharp : 0;
  const noLoadCharge = noLoad ? selectedEquipment.noLoad : 0;

  const liftgateCharge =
    liftgate && selectedEquipment.liftgateAllowed ? accessorialRates.liftgate : 0;

  const moffettCharge =
    moffett &&
    selectedEquipment.moffettAllowed &&
    "moffettCharge" in selectedEquipment
      ? selectedEquipment.moffettCharge
      : 0;

  const hazmatCharge = hazmat ? accessorialRates.hazmat : 0;
  const airportCharge = airport ? accessorialRates.airport : 0;

  const accessorialTotal =
    afterHoursCharge +
    sharpCharge +
    noLoadCharge +
    liftgateCharge +
    moffettCharge +
    hazmatCharge +
    airportCharge;

  const total =
    transportBeforeFuel +
    fuelCharge +
    overweightCharge +
    additionalStopCharge +
    waitTimeCharge +
    accessorialTotal;

  const selectedAccessorials = [
    afterHours ? "After Hours" : null,
    sharp ? "Sharp" : null,
    noLoad ? "No Load" : null,
    liftgate ? "Liftgate" : null,
    moffett ? "Moffett" : null,
    hazmat ? "Hazmat" : null,
    airport ? "Airport/TSA/SIDA" : null,
  ].filter(Boolean);

  const quoteText = `NOW COURIER - DETAILED QUOTE

CUSTOMER: ${customerName || "N/A"}

PICKUP:
${pickupAddress || "N/A"}

DELIVERY:
${deliveryAddress || "N/A"}

SERVICE: ${safeServiceType}
EQUIPMENT: ${equipment}

MILES: ${mileage}
WEIGHT: ${shipmentWeight || "N/A"} lbs
PALLETS: ${palletCount || "N/A"}
STOPS: ${stopCount}

PICK WAIT TIME: ${pickWaitMinutes} min
DROP WAIT TIME: ${dropWaitMinutes} min

ACCESSORIALS:
${
  selectedAccessorials.length
    ? selectedAccessorials.map((item) => `- ${item}`).join("\n")
    : "- None"
}

ESTIMATED QUOTE: $${total.toFixed(2)}

BREAKDOWN:
Transport: $${transportBeforeFuel.toFixed(2)}
Fuel (${(fuelPercent * 100).toFixed(1)}%): $${fuelCharge.toFixed(2)}
Overweight: $${overweightCharge.toFixed(2)}
Stops: $${additionalStopCharge.toFixed(2)}
Wait Time: $${waitTimeCharge.toFixed(2)}
Accessorials: $${accessorialTotal.toFixed(2)}

NOTE: Estimate only. Final invoice may vary based on actual shipment details.`;

  async function copyQuote() {
    await navigator.clipboard.writeText(quoteText);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <main className="app-shell">
      <div className="page-frame">
        <div className="topbar">
          <Link href="/" className="back-link">
            ← Back
          </Link>

          <Image
            src="/now-logo.jpg"
            alt="NOW Courier"
            width={130}
            height={45}
            priority
            className="brand-logo"
          />
        </div>

        <div className="page-heading">
          <p className="eyebrow">Full workflow</p>
          <h1 className="page-title">Detailed quote</h1>

          <p className="page-subtitle">
            Operational commercial quote workflow.
          </p>
        </div>

        <div className="form-stack">
          <section className="panel">
            <p className="panel-title">
              Customer / Route
            </p>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-600 font-medium">
                  Customer Name
                </span>

                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Optional"
                  className="mt-2 w-full rounded-xl bg-white border border-slate-300 p-4 text-lg text-slate-900"
                />
              </label>

            </div>
          </section>

          <MileageLookup pickup={pickupAddress} delivery={deliveryAddress} onPickupChange={setPickupAddress} onDeliveryChange={setDeliveryAddress} onMileage={(value) => setMiles(String(value))} />

          <section className="panel">
            <p className="panel-title">
              Service / Equipment
            </p>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-600 font-medium">
                  Service Type
                </span>

                <select
                  value={safeServiceType}
                  onChange={(event) => setServiceType(event.target.value)}
                  className="mt-2 w-full rounded-xl bg-white border border-slate-300 p-4 text-xl text-slate-900"
                >
                  {availableServices.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-slate-600 font-medium">
                  Equipment Type
                </span>

                <select
                  value={equipment}
                  onChange={(event) => {
                    setEquipment(
                      event.target.value as keyof typeof commercialEquipmentConfig
                    );
                    setServiceType("Direct");
                    setMoffett(false);
                    setLiftgate(false);
                  }}
                  className="mt-2 w-full rounded-xl bg-white border border-slate-300 p-4 text-xl text-slate-900"
                >
                  {Object.keys(commercialEquipmentConfig).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="panel">
            <p className="panel-title">
              Shipment Details
            </p>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-600 font-medium">
                  Miles
                </span>

                <input
                  type="number"
                  value={miles}
                  onChange={(event) => setMiles(event.target.value)}
                  placeholder="Enter miles"
                  className="mt-2 w-full rounded-xl bg-white border border-slate-300 p-4 text-xl text-slate-900"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-slate-600 font-medium">
                    Weight (lbs)
                  </span>

                  <input
                    type="number"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    placeholder="Optional"
                    className="mt-2 w-full rounded-xl bg-white border border-slate-300 p-4 text-xl text-slate-900"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600 font-medium">
                    Pallet Count
                  </span>

                  <input
                    type="number"
                    value={pallets}
                    onChange={(event) => setPallets(event.target.value)}
                    placeholder="Optional"
                    className="mt-2 w-full rounded-xl bg-white border border-slate-300 p-4 text-xl text-slate-900"
                  />
                </label>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-sm text-slate-600 font-medium">
                    Stops
                  </span>

                  <input
                    type="number"
                    value={stops}
                    onChange={(event) => setStops(event.target.value)}
                    className="mt-2 w-full rounded-xl bg-white border border-slate-300 p-4 text-xl text-slate-900"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600 font-medium">
                    Pick Wait
                  </span>

                  <input
                    type="number"
                    value={pickWaitTime}
                    onChange={(event) => setPickWaitTime(event.target.value)}
                    placeholder="0"
                    className="mt-2 w-full rounded-xl bg-white border border-slate-300 p-4 text-xl text-slate-900"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600 font-medium">
                    Drop Wait
                  </span>

                  <input
                    type="number"
                    value={dropWaitTime}
                    onChange={(event) => setDropWaitTime(event.target.value)}
                    placeholder="0"
                    className="mt-2 w-full rounded-xl bg-white border border-slate-300 p-4 text-xl text-slate-900"
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="panel">
            <p className="panel-title">
              Accessorials
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAfterHours(!afterHours)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  afterHours
                    ? "bg-[#0093aa] border-[#0093aa] text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                After Hours
              </button>

              <button
                onClick={() => setSharp(!sharp)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  sharp
                    ? "bg-[#0093aa] border-[#0093aa] text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                Sharp
              </button>

              <button
                onClick={() => setNoLoad(!noLoad)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  noLoad
                    ? "bg-[#0093aa] border-[#0093aa] text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                No Load
              </button>

              <button
                onClick={() => setLiftgate(!liftgate)}
                disabled={!selectedEquipment.liftgateAllowed}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  !selectedEquipment.liftgateAllowed
                    ? "bg-slate-200 border-slate-300 text-slate-400"
                    : liftgate
                      ? "bg-[#0093aa] border-[#0093aa] text-white"
                      : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                Liftgate
              </button>

              <button
                onClick={() => setMoffett(!moffett)}
                disabled={!selectedEquipment.moffettAllowed}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  !selectedEquipment.moffettAllowed
                    ? "bg-slate-200 border-slate-300 text-slate-400"
                    : moffett
                      ? "bg-[#0093aa] border-[#0093aa] text-white"
                      : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                Moffett
              </button>

              <button
                onClick={() => setHazmat(!hazmat)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  hazmat
                    ? "bg-[#0093aa] border-[#0093aa] text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                Hazmat
              </button>

              <button
                onClick={() => setAirport(!airport)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  airport
                    ? "bg-[#0093aa] border-[#0093aa] text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                Airport/TSA/SIDA
              </button>
            </div>
          </section>

          <div className="quote-card">
            <p className="quote-kicker">
              Estimated Quote
            </p>

            <p className="quote-amount">
              ${total.toFixed(2)}
            </p>

            <button
              onClick={copyQuote}
              className="primary-button relative z-[1] mt-5"
            >
              {copied ? "COPIED!" : "COPY QUOTE"}
            </button>

            <div className="breakdown">
              <p>Transport: ${transportBeforeFuel.toFixed(2)}</p>
              <p>
                Fuel ({(fuelPercent * 100).toFixed(1)}%): $
                {fuelCharge.toFixed(2)}
              </p>
              <p>Overweight: ${overweightCharge.toFixed(2)}</p>
              <p>Stops: ${additionalStopCharge.toFixed(2)}</p>
              <p>Wait Time: ${waitTimeCharge.toFixed(2)}</p>
              <p>Accessorials: ${accessorialTotal.toFixed(2)}</p>
              <p>Pallets: {palletCount}</p>
            </div>
          </div>
          <SaveQuote quoteType="Detailed Quote" amount={total} rateVersion={version} defaultCustomer={customerName} summary={{ Equipment: equipment, Service: safeServiceType, Pickup: pickupAddress || "Not entered", Delivery: deliveryAddress || "Not entered", Miles: mileage, "Weight (lbs)": shipmentWeight, Pallets: palletCount, Stops: stopCount, Accessorials: selectedAccessorials.join(", ") || "None", Transport: `$${transportBeforeFuel.toFixed(2)}`, Fuel: `$${fuelCharge.toFixed(2)}`, Total: `$${total.toFixed(2)}` }} />
        </div>
      </div>
    </main>
  );
}
