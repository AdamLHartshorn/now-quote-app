type ServiceRate = { base: number; ratePerMile: number };

type CommercialThreshold =
  | { overMileageThreshold: number; overThresholdEntireTripRate: number }
  | { overMileageThreshold: number; overThresholdAdditionalPerMile: number };

export function calculateCommercialTransport(
  mileage: number,
  service: ServiceRate,
  equipment: CommercialThreshold
) {
  const baseTransport = service.base + mileage * service.ratePerMile;

  if (
    "overThresholdEntireTripRate" in equipment &&
    mileage > equipment.overMileageThreshold
  ) {
    return service.base + mileage * equipment.overThresholdEntireTripRate;
  }

  if (
    "overThresholdAdditionalPerMile" in equipment &&
    mileage > equipment.overMileageThreshold
  ) {
    return (
      baseTransport +
      (mileage - equipment.overMileageThreshold) *
        equipment.overThresholdAdditionalPerMile
    );
  }

  return baseTransport;
}
