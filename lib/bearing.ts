const EARTH_RADIUS_KM = 6371.0088;

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI;
}

export function projectForward(
  { latitude, longitude }: Coordinate,
  bearingDegrees: number,
  distanceKm: number
): Coordinate {
  const angularDistance = distanceKm / EARTH_RADIUS_KM;
  const bearingRad = degreesToRadians(bearingDegrees);
  const latRad = degreesToRadians(latitude);
  const lonRad = degreesToRadians(longitude);

  const projectedLat = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearingRad)
  );

  const projectedLon =
    lonRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(projectedLat)
    );

  return {
    latitude: radiansToDegrees(projectedLat),
    longitude: ((radiansToDegrees(projectedLon) + 540) % 360) - 180
  };
}

export function bearingBetween(start: Coordinate, end: Coordinate) {
  const startLat = degreesToRadians(start.latitude);
  const startLon = degreesToRadians(start.longitude);
  const endLat = degreesToRadians(end.latitude);
  const endLon = degreesToRadians(end.longitude);
  const dLon = endLon - startLon;

  const y = Math.sin(dLon) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLon);
  const brng = radiansToDegrees(Math.atan2(y, x));
  return (brng + 360) % 360;
}
