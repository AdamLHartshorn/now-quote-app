"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  parcelServiceRates,
  parcelVehicleConfig,
} from "@/config/rates";
import { useFuelSettings } from "@/lib/fuel-settings";

export default function FastQuoteParcel() {
  const fuelSurcharge = useFuelSettings();
  const [serviceType, setServiceType] =
    useState<keyof typeof parcelServiceRates>("Direct");

  const [vehicle, setVehicle] =
    useState<keyof typeof parcelVehicleConfig>("Car");

  const [miles, setMiles] = useState("");
  const [weight, setWeight] = useState("");

  const selectedService = parcelServiceRates[serviceType];
  const selectedVehicle = parcelVehicleConfig[vehicle];

  const mileage = Number(miles) || 0;
  const shipmentWeight = Number(weight) || 0;

  const mileageRate =
    mileage > 50
      ? selectedVehicle.over50MileRate
      : selectedService.ratePerMile;

  const transport =
    Math.max(selectedService.minimum, mileage * mileageRate) +
    selectedVehicle.upcharge;

  const overweightAmount = Math.max(
    0,
    shipmentWeight - selectedVehicle.includedWeight
  );

  const overweightCharge =
    Math.ceil(overweightAmount / 100) *
    selectedVehicle.overweightRatePerCwt;

  const fuelPercent = fuelSurcharge[selectedVehicle.fuelClass];
  const fuel = transport * fuelPercent;

  const total = transport + overweightCharge + fuel;

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
          <p className="eyebrow">Fast quote</p>
          <h1 className="page-title">Parcel</h1>

          <p className="page-subtitle">
            Ballpark parcel quote for quick customer conversations.
          </p>
        </div>

        <div className="form-stack">
          <label className="block">
            <span className="field-label">
              Service Type
            </span>

            <select
              value={serviceType}
              onChange={(event) =>
                setServiceType(
                  event.target.value as keyof typeof parcelServiceRates
                )
              }
              className="control"
            >
              {Object.keys(parcelServiceRates).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">
              Vehicle
            </span>

            <select
              value={vehicle}
              onChange={(event) =>
                setVehicle(
                  event.target.value as keyof typeof parcelVehicleConfig
                )
              }
              className="control"
            >
              {Object.keys(parcelVehicleConfig).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">
              Miles
            </span>

            <input
              type="number"
              value={miles}
              onChange={(event) => setMiles(event.target.value)}
              placeholder="Enter miles"
              className="control"
            />
          </label>

          <label className="block">
            <span className="field-label">
              Weight (lbs)
            </span>

            <input
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="Optional"
              className="control"
            />
          </label>

          <div className="quote-card">
            <p className="quote-kicker">Ballpark quote</p>

            <p className="quote-amount">
              ${total.toFixed(2)}
            </p>

            <div className="breakdown">
              <p>Transport: ${transport.toFixed(2)}</p>
              <p>Overweight: ${overweightCharge.toFixed(2)}</p>
              <p>
                Fuel ({(fuelPercent * 100).toFixed(1)}%): $
                {fuel.toFixed(2)}
              </p>
              <p>
                {vehicle} / {serviceType}
              </p>
              <p className="pt-2 text-slate-500">
                Ballpark only — final invoice may vary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
