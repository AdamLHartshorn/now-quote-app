"use client";

import { useState } from "react";

import {
  equipmentConfig,
  accessorialRates,
  fuelSurcharge,
  serviceMultipliers,
} from "@/config/rates";

export default function DetailedQuote() {
  const [serviceType, setServiceType] =
    useState<keyof typeof serviceMultipliers>("Same Day");

  const [equipment, setEquipment] =
    useState<keyof typeof equipmentConfig>("Car");

  const [miles, setMiles] = useState("");
  const [stops, setStops] = useState("1");
  const [waitTime, setWaitTime] = useState("");
  const [weight, setWeight] = useState("");

  const [rush, setRush] = useState(false);
  const [afterHours, setAfterHours] = useState(false);
  const [liftgate, setLiftgate] = useState(false);
  const [twoPerson, setTwoPerson] = useState(false);
  const [palletJack, setPalletJack] = useState(false);
  const [insideDelivery, setInsideDelivery] = useState(false);
  const [moffett, setMoffett] = useState(false);
  const [airport, setAirport] = useState(false);

  const selectedEquipment = equipmentConfig[equipment];

  const mileage = Number(miles) || 0;
  const stopCount = Number(stops) || 1;
  const waitMinutes = Number(waitTime) || 0;
  const shipmentWeight = Number(weight) || 0;

  const serviceMultiplier = serviceMultipliers[serviceType];
  const fuelPercent = fuelSurcharge[selectedEquipment.fuelClass];

  const baseMileage =
    mileage *
    selectedEquipment.ratePerMile *
    serviceMultiplier;

  const fuelCharge = baseMileage * fuelPercent;

  const loadedMileage = baseMileage + fuelCharge;

  const baseQuote = Math.max(
    loadedMileage,
    selectedEquipment.minimum
  );

  const additionalStopCharge =
    stopCount > 1 ? (stopCount - 1) * 25 : 0;

  const chargeableWaitMinutes = Math.max(
    0,
    waitMinutes - selectedEquipment.freeWaitMinutes
  );

  const waitTimeCharge =
    chargeableWaitMinutes *
    selectedEquipment.waitRatePerMinute;

  const overweightAmount = Math.max(
    0,
    shipmentWeight - selectedEquipment.includedWeight
  );

  const overweightCharge =
    overweightAmount *
    selectedEquipment.overweightRate;

  const accessorialTotal =
    (rush ? accessorialRates.rush : 0) +
    (afterHours ? accessorialRates.afterHours : 0) +
    (liftgate ? accessorialRates.liftgate : 0) +
    (twoPerson ? accessorialRates.twoPerson : 0) +
    (palletJack ? accessorialRates.palletJack : 0) +
    (insideDelivery ? accessorialRates.insideDelivery : 0) +
    (moffett ? accessorialRates.moffett : 0) +
    (airport ? accessorialRates.airport : 0);

  const estimatedQuote =
    baseQuote +
    additionalStopCharge +
    waitTimeCharge +
    overweightCharge +
    accessorialTotal;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto w-full max-w-md">
        <a href="/" className="text-gray-400 text-sm">
          ← Back
        </a>

        <h1 className="text-4xl font-bold mt-6 mb-2">
          DETAILED QUOTE
        </h1>

        <p className="text-gray-400 mb-8">
          Full operational quote workflow.
        </p>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-gray-300">
              Service Type
            </span>

            <select
              value={serviceType}
              onChange={(event) =>
                setServiceType(
                  event.target.value as keyof typeof serviceMultipliers
                )
              }
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            >
              {Object.keys(serviceMultipliers).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">
              Equipment Type
            </span>

            <select
              value={equipment}
              onChange={(event) =>
                setEquipment(
                  event.target.value as keyof typeof equipmentConfig
                )
              }
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            >
              {Object.keys(equipmentConfig).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">
              Miles
            </span>

            <input
              type="number"
              value={miles}
              onChange={(event) => setMiles(event.target.value)}
              placeholder="Enter miles"
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-gray-300">
                Stops
              </span>

              <input
                type="number"
                value={stops}
                onChange={(event) => setStops(event.target.value)}
                className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-300">
                Wait Minutes
              </span>

              <input
                type="number"
                value={waitTime}
                onChange={(event) => setWaitTime(event.target.value)}
                placeholder="0"
                className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-gray-300">
              Weight
            </span>

            <input
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="Optional"
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            />
          </label>

          <section className="rounded-2xl bg-gray-900 border border-gray-700 p-4">
            <p className="text-sm text-gray-300 mb-3">
              Accessorials
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRush(!rush)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  rush ? "bg-red-600 border-red-500" : "bg-black border-gray-700"
                }`}
              >
                Rush
              </button>

              <button
                onClick={() => setAfterHours(!afterHours)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  afterHours
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                After Hours
              </button>

              <button
                onClick={() => setLiftgate(!liftgate)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  liftgate
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Liftgate
              </button>

              <button
                onClick={() => setTwoPerson(!twoPerson)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  twoPerson
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Two Person
              </button>

              <button
                onClick={() => setPalletJack(!palletJack)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  palletJack
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Pallet Jack
              </button>

              <button
                onClick={() => setInsideDelivery(!insideDelivery)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  insideDelivery
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Inside Delivery
              </button>

              <button
                onClick={() => setMoffett(!moffett)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  moffett
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Moffett
              </button>

              <button
                onClick={() => setAirport(!airport)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  airport
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Airport
              </button>
            </div>
          </section>

          <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6 text-center">
            <p className="text-gray-400 text-sm">
              Estimated Quote
            </p>

            <p className="text-5xl font-bold mt-2">
              ${estimatedQuote.toFixed(2)}
            </p>

            <div className="text-gray-500 text-sm mt-4 space-y-1">
              <p>
                Base Mileage: ${baseMileage.toFixed(2)}
              </p>

              <p>
                Fuel ({(fuelPercent * 100).toFixed(1)}%): $
                {fuelCharge.toFixed(2)}
              </p>

              <p>
                Loaded Mileage: ${loadedMileage.toFixed(2)}
              </p>

              <p>
                Minimum Applied: ${selectedEquipment.minimum.toFixed(2)}
              </p>

              <p>
                Additional Stops: ${additionalStopCharge.toFixed(2)}
              </p>

              <p>
                Wait Time: ${waitTimeCharge.toFixed(2)}
              </p>

              <p>
                Overweight: ${overweightCharge.toFixed(2)}
              </p>

              <p>
                Accessorials: ${accessorialTotal.toFixed(2)}
              </p>

              <p>
                {equipment} / {serviceType} @ $
                {selectedEquipment.ratePerMile.toFixed(2)}/mile
              </p>

              <p>
                Free Wait: {selectedEquipment.freeWaitMinutes} min
              </p>

              <p>
                Included Weight: {selectedEquipment.includedWeight} lbs
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}