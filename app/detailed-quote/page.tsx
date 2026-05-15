"use client";

import { useState } from "react";

import {
  commercialEquipmentConfig,
  fuelSurcharge,
} from "@/config/rates";

export default function DetailedQuote() {
  const [equipment, setEquipment] =
    useState<keyof typeof commercialEquipmentConfig>("Dock Truck");

  const selectedEquipment =
    commercialEquipmentConfig[equipment];

  type ServiceType =
    keyof typeof selectedEquipment.serviceRates;

  const availableServices =
    Object.keys(selectedEquipment.serviceRates) as ServiceType[];

  const [serviceType, setServiceType] =
    useState<string>("Direct");

  const [miles, setMiles] = useState("");
  const [stops, setStops] = useState("1");
  const [waitTime, setWaitTime] = useState("");
  const [weight, setWeight] = useState("");

  const [afterHours, setAfterHours] = useState(false);
  const [sharp, setSharp] = useState(false);
  const [noLoad, setNoLoad] = useState(false);
  const [liftgate, setLiftgate] = useState(false);
  const [moffett, setMoffett] = useState(false);

  const safeServiceType =
    availableServices.includes(serviceType as ServiceType)
      ? (serviceType as ServiceType)
      : availableServices[0];

  const selectedService =
    selectedEquipment.serviceRates[safeServiceType];

  const mileage = Number(miles) || 0;
  const stopCount = Number(stops) || 1;
  const waitMinutes = Number(waitTime) || 0;
  const shipmentWeight = Number(weight) || 0;

  const baseMileage =
    selectedService.base +
    mileage * selectedService.ratePerMile;

  const overThresholdCharge =
    "overThresholdEntireTripRate" in selectedEquipment &&
    mileage > selectedEquipment.overMileageThreshold
      ? mileage * selectedEquipment.overThresholdEntireTripRate
      : "overThresholdAdditionalPerMile" in selectedEquipment &&
          mileage > selectedEquipment.overMileageThreshold
        ? (mileage - selectedEquipment.overMileageThreshold) *
          selectedEquipment.overThresholdAdditionalPerMile
        : 0;

  const transportBeforeFuel =
    noLoad
      ? 0
      : baseMileage + overThresholdCharge;

  const fuelPercent =
    fuelSurcharge[selectedEquipment.fuelClass];

  const fuelCharge =
    transportBeforeFuel * fuelPercent;

  const additionalStopCharge =
    stopCount > 1 ? (stopCount - 1) * 25 : 0;

  const chargeableWaitMinutes =
    Math.max(
      0,
      waitMinutes - selectedEquipment.freeWaitMinutes
    );

  const waitTimeCharge =
    chargeableWaitMinutes *
    selectedEquipment.waitRatePerMinute;

  const overweightAmount =
    Math.max(
      0,
      shipmentWeight - selectedEquipment.includedWeight
    );

  const overweightCharge =
    Math.ceil(overweightAmount / 100) *
    selectedEquipment.overweightRatePerCwt;

  const afterHoursCharge =
    afterHours ? selectedEquipment.afterHours : 0;

  const sharpCharge =
    sharp ? selectedEquipment.sharp : 0;

  const noLoadCharge =
    noLoad ? selectedEquipment.noLoad : 0;

  const liftgateCharge =
    liftgate && selectedEquipment.liftgateAllowed
      ? 25
      : 0;

  const moffettCharge =
    moffett &&
    selectedEquipment.moffettAllowed &&
    "moffettCharge" in selectedEquipment
      ? selectedEquipment.moffettCharge
      : 0;

  const total =
    transportBeforeFuel +
    fuelCharge +
    additionalStopCharge +
    waitTimeCharge +
    overweightCharge +
    afterHoursCharge +
    sharpCharge +
    noLoadCharge +
    liftgateCharge +
    moffettCharge;

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
          Commercial quote workflow.
        </p>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-gray-300">
              Equipment
            </span>

            <select
              value={equipment}
              onChange={(event) => {
                setEquipment(
                  event.target.value as keyof typeof commercialEquipmentConfig
                );
                setServiceType("Direct");
              }}
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            >
              {Object.keys(commercialEquipmentConfig).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">
              Service Type
            </span>

            <select
              value={safeServiceType}
              onChange={(event) =>
                setServiceType(event.target.value)
              }
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            >
              {availableServices.map((item) => (
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
                onClick={() => setSharp(!sharp)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  sharp
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Sharp
              </button>

              <button
                onClick={() => setNoLoad(!noLoad)}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  noLoad
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                No Load
              </button>

              <button
                onClick={() => setLiftgate(!liftgate)}
                disabled={!selectedEquipment.liftgateAllowed}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  !selectedEquipment.liftgateAllowed
                    ? "bg-gray-800 border-gray-700 text-gray-600"
                    : liftgate
                      ? "bg-red-600 border-red-500"
                      : "bg-black border-gray-700"
                }`}
              >
                Liftgate
              </button>

              <button
                onClick={() => setMoffett(!moffett)}
                disabled={!selectedEquipment.moffettAllowed}
                className={`rounded-xl p-4 text-base font-semibold border ${
                  !selectedEquipment.moffettAllowed
                    ? "bg-gray-800 border-gray-700 text-gray-600"
                    : moffett
                      ? "bg-red-600 border-red-500"
                      : "bg-black border-gray-700"
                }`}
              >
                Moffett
              </button>
            </div>
          </section>

          <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6 text-center">
            <p className="text-gray-400 text-sm">
              Estimated Quote
            </p>

            <p className="text-5xl font-bold mt-2">
              ${total.toFixed(2)}
            </p>

            <div className="text-gray-500 text-sm mt-4 space-y-1">
              <p>Transport: ${transportBeforeFuel.toFixed(2)}</p>

              <p>
                Fuel ({(fuelPercent * 100).toFixed(1)}%): $
                {fuelCharge.toFixed(2)}
              </p>

              <p>
                Over-threshold Mileage: $
                {overThresholdCharge.toFixed(2)}
              </p>

              <p>
                Stops: ${additionalStopCharge.toFixed(2)}
              </p>

              <p>
                Wait: ${waitTimeCharge.toFixed(2)}
              </p>

              <p>
                Overweight: ${overweightCharge.toFixed(2)}
              </p>

              <p>
                Accessorials: $
                {(
                  afterHoursCharge +
                  sharpCharge +
                  noLoadCharge +
                  liftgateCharge +
                  moffettCharge
                ).toFixed(2)}
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