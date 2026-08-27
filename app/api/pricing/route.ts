import { NextResponse } from "next/server";

import { defaultPricingConfig, type PricingConfig } from "@/config/rates";
import { getPricingConfig, savePricingConfig } from "@/lib/pricing-server";
import { getSessionRole } from "@/lib/auth-server";

function isPositiveNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function matchesPricingShape(value: unknown, template: unknown): boolean {
  if (typeof template === "number") return isPositiveNumber(value);
  if (typeof template === "string" || typeof template === "boolean") {
    return value === template;
  }
  if (!value || typeof value !== "object" || !template || typeof template !== "object") {
    return false;
  }

  const valueRecord = value as Record<string, unknown>;
  const templateRecord = template as Record<string, unknown>;
  const expectedKeys = Object.keys(templateRecord);
  return (
    Object.keys(valueRecord).length === expectedKeys.length &&
    expectedKeys.every((key) =>
      Object.hasOwn(valueRecord, key) && matchesPricingShape(valueRecord[key], templateRecord[key])
    )
  );
}

export async function GET() {
  if (!(await getSessionRole())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(await getPricingConfig());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load pricing" },
      { status: 503 }
    );
  }
}

export async function PUT(request: Request) {
  if ((await getSessionRole()) !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = (await request.json()) as {
    config?: PricingConfig;
    effectiveDate?: string;
    version?: number;
  };
  if (
    !body.config ||
    !matchesPricingShape(body.config, defaultPricingConfig) ||
    body.config.globalPricingRules.dedicatedBillingIncrementHours <= 0 ||
    !body.effectiveDate?.match(/^\d{4}-\d{2}-\d{2}$/) ||
    !Number.isInteger(body.version)
  ) {
    return NextResponse.json({ error: "Invalid pricing configuration" }, { status: 400 });
  }

  try {
    return NextResponse.json(
      await savePricingConfig(body.config, body.effectiveDate, body.version!)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save pricing";
    return NextResponse.json(
      { error: message },
      { status: message.includes("another session") ? 409 : 503 }
    );
  }
}
