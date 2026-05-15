"use client";

import { useState } from "react";

import {
  equipmentConfig,
  accessorialRates,
} from "@/config/rates";

export default function FastQuote() {
  const [equipment, setEquipment] =
    useState<keyof typeof equipmentConfig>("Car");

  const [miles, setMiles] = useState("");

  const [rush, setRush] = useState(false);
  const [afterHours, setAfterHours] = useState(false);
  const [liftgate, setLiftgate] = useState(false);
  const [twoPerson, setTwoPerson] = useState(false);

  const selectedEquipment =
    equipmentConfig[equipment];

  const mileage =
    Number(miles) || 0;

  const mileageSubtotal =
    mileage *
    selectedEquipment.ratePerMile;

  const baseQuote =
    Math.max(
      mileageSubtotal,
      selectedEquipment.minimum
    );

  const accessorialTotal =
    (rush ? accessorialRates.rush : 0) +
    (afterHours
      ? accessorialRates.afterHours
      : 0) +
    (liftgate
      ? accessorialRates.liftgate
      : 0) +
    (twoPerson
      ? accessorialRates.twoPerson
      : 0);

  const estimatedQuote =
    baseQuote +
    accessorialTotal;

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="mx-auto w-full max-w-md">

        <a
          href="/"
          className="text-gray-400 text-sm"
        >
          ← Back
        </a>

        <h1 className="text-4xl font-bold mt-6 mb-2">
          FAST QUOTE
        </h1>

        <p className="text-gray-400 mb-8">
          Quick customer-facing estimate.
        </p>

        <div className="space-y-5">

          <label className="block">

            <span className="text-sm text-gray-300">
              Equipment
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
                <option key={item}>
                  {item}
                </option>
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
              onChange={(event) =>
                setMiles(event.target.value)
              }
              placeholder="Enter miles"
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            />

          </label>

          <section className="rounded-2xl bg-gray-900 border border-gray-700 p-4">

            <p className="text-sm text-gray-300 mb-3">
              Add-ons
            </p>

            <div className="grid grid-cols-2 gap-3">

              <button
                onClick={() =>
                  setRush(!rush)
                }
                className={`rounded-xl p-4 text-lg font-semibold border ${
                  rush
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Rush
              </button>

              <button
                onClick={() =>
                  setAfterHours(!afterHours)
                }
                className={`rounded-xl p-4 text-lg font-semibold border ${
                  afterHours
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                After Hours
              </button>

              <button
                onClick={() =>
                  setLiftgate(!liftgate)
                }
                className={`rounded-xl p-4 text-lg font-semibold border ${
                  liftgate
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Liftgate
              </button>

              <button
                onClick={() =>
                  setTwoPerson(!twoPerson)
                }
                className={`rounded-xl p-4 text-lg font-semibold border ${
                  twoPerson
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Two Person
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
                Base:
                {" "}
                $
                {baseQuote.toFixed(2)}
              </p>

              <p>
                Add-ons:
                {" "}
                $
                {accessorialTotal.toFixed(2)}
              </p>

              <p>
                {equipment}
                {" "}
                @
                {" "}
                $
                {selectedEquipment.ratePerMile.toFixed(2)}
                /mile
              </p>

              <p>
                Minimum:
                {" "}
                $
                {selectedEquipment.minimum.toFixed(2)}
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}