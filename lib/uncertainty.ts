export type UncertaintyInput = {
  distanceKm: number;
  reactionSeconds: number;
  compassDeg: number;
  gpsAccuracyM?: number;
};

const DEG_TO_RAD = Math.PI / 180;

export function computeUncertaintyRadiusKm({
  distanceKm,
  reactionSeconds,
  compassDeg,
  gpsAccuracyM
}: UncertaintyInput) {
  const deltaTimeKm = reactionSeconds * 0.343;
  const deltaBearingKm = Math.abs(distanceKm * Math.sin(compassDeg * DEG_TO_RAD));
  const gpsKm = (gpsAccuracyM ?? 0) / 1000;
  const radius = Math.sqrt(deltaTimeKm ** 2 + deltaBearingKm ** 2) + gpsKm;
  return clamp(radius, 0.05, 50);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
