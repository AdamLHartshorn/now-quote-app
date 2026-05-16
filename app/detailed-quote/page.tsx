"use client";

import { useState } from "react";

import { commercialEquipmentConfig, fuelSurcharge } from "@/config/rates";

export default function DetailedQuote() {
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

  const baseTransport =
    selectedService.base + mileage * selectedService.ratePerMile;

  const overThresholdCharge =
    "overThresholdEntireTripRate" in selectedEquipment &&
    mileage > selectedEquipment.overMileageThreshold
      ? mileage * selectedEquipment.overThresholdEntireTripRate
      : "overThresholdAdditionalPerMile" in selectedEquipment &&
          mileage > selectedEquipment.overMileageThreshold
        ? (mileage - selectedEquipment.overMileageThreshold) *
          selectedEquipment.overThresholdAdditionalPerMile
        : 0;

  const transportBeforeFuel = noLoad
    ? 0
    : baseTransport + overThresholdCharge;

  const fuelPercent = fuelSurcharge[selectedEquipment.fuelClass];
  const fuelCharge = transportBeforeFuel * fuelPercent;

  const overweightAmount = Math.max(
    0,
    shipmentWeight - selectedEquipment.includedWeight
  );

  const overweightCharge =
    Math.ceil(overweightAmount / 100) *
    selectedEquipment.overweightRatePerCwt;

  const additionalStopCharge = stopCount > 1 ? (stopCount - 1) * 25 : 0;

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
    liftgate && selectedEquipment.liftgateAllowed ? 25 : 0;

  const moffettCharge =
    moffett &&
    selectedEquipment.moffettAllowed &&
    "moffettCharge" in selectedEquipment
      ? selectedEquipment.moffettCharge
      : 0;

  const hazmatCharge = hazmat ? 50 : 0;
  const airportCharge = airport ? 30 : 0;

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
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto w-full max-w-md">
        <a href="/" className="text-slate-400 text-sm">
          ← Back
        </a>

        <h1 className="text-4xl font-bold mt-6 mb-2">DETAILED QUOTE</h1>

        <p className="text-slate-400 mb-8">
          Operational commercial quote workflow.
        </p>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-slate-300">Customer Name</span>

            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Optional"
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-lg"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Pickup Address</span>

            <input
              type="text"
              value={pickupAddress}
              onChange={(event) => setPickupAddress(event.target.value)}
              placeholder="Optional"
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-lg"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Delivery Address</span>

            <input
              type="text"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              placeholder="Optional"
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-lg"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Service Type</span>

            <select
              value={safeServiceType}
              onChange={(event) => setServiceType(event.target.value)}
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
            >
              {availableServices.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Equipment Type</span>

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
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
            >
              {Object.keys(commercialEquipmentConfig).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Miles</span>

            <input
              type="number"
              value={miles}
              onChange={(event) => setMiles(event.target.value)}
              placeholder="Enter miles"
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-slate-300">Weight (lbs)</span>

              <input
                type="number"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                placeholder="Optional"
                className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Pallet Count</span>

              <input
                type="number"
                value={pallets}
                onChange={(event) => setPallets(event.target.value)}
                placeholder="Optional"
                className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="text-sm text-slate-300">Stops</span>

              <input
                type="number"
                value={stops}
                onChange={(event) => setStops(event.target.value)}
                className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Pick Wait</span>

              <input
                type="number"
                value={pickWaitTime}
                onChange={(event) => setPickWaitTime(event.target.value)}
                placeholder="0"
                className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Drop Wait</span>

              <input
                type="number"
                value={dropWaitTime}
                onChange={(event) => setDropWaitTime(event.target.value)}
                placeholder="0"
                className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
              />
            </label>
          </div>

          <section className="rounded-2xl bg-slate-900 border border-slate-700 p-4">
            <p className="text-sm text-slate-300 mb-3">Accessorials</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAfterHours(!afterHours)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  afterHours
                    ? "bg-blue-600 border-blue-500"
                    : "bg-slate-950 border-slate-700"
                }`}
              >
                After Hours
              </button>

              <button
                onClick={() => setSharp(!sharp)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  sharp
                    ? "bg-blue-600 border-blue-500"
                    : "bg-slate-950 border-slate-700"
                }`}
              >
                Sharp
              </button>

              <button
                onClick={() => setNoLoad(!noLoad)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  noLoad
                    ? "bg-blue-600 border-blue-500"
                    : "bg-slate-950 border-slate-700"
                }`}
              >
                No Load
              </button>

              <button
                onClick={() => setLiftgate(!liftgate)}
                disabled={!selectedEquipment.liftgateAllowed}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  !selectedEquipment.liftgateAllowed
                    ? "bg-slate-800 border-slate-700 text-slate-600"
                    : liftgate
                      ? "bg-blue-600 border-blue-500"
                      : "bg-slate-950 border-slate-700"
                }`}
              >
                Liftgate
              </button>

              <button
                onClick={() => setMoffett(!moffett)}
                disabled={!selectedEquipment.moffettAllowed}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  !selectedEquipment.moffettAllowed
                    ? "bg-slate-800 border-slate-700 text-slate-600"
                    : moffett
                      ? "bg-blue-600 border-blue-500"
                      : "bg-slate-950 border-slate-700"
                }`}
              >
                Moffett
              </button>

              <button
                onClick={() => setHazmat(!hazmat)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  hazmat
                    ? "bg-blue-600 border-blue-500"
                    : "bg-slate-950 border-slate-700"
                }`}
              >
                Hazmat
              </button>

              <button
                onClick={() => setAirport(!airport)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  airport
                    ? "bg-blue-600 border-blue-500"
                    : "bg-slate-950 border-slate-700"
                }`}
              >
                Airport/TSA/SIDA
              </button>
            </div>
          </section>

          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6 text-center">
            <p className="text-slate-400 text-sm">Estimated Quote</p>

            <p className="text-5xl font-bold mt-2">${total.toFixed(2)}</p>

            <button
              onClick={copyQuote}
              className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 p-4 text-lg font-bold"
            >
              {copied ? "COPIED!" : "COPY QUOTE"}
            </button>

            <div className="text-slate-500 text-sm mt-4 space-y-1">
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
        </div>
      </div>
    </main>
  );
}