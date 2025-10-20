export type Strike = {
  id: string;
  createdAt: number;
  userLat: number;
  userLon: number;
  userAccuracyM?: number;
  bearingDeg: number;
  deltaSeconds: number;
  distanceKm: number;
  distanceMi: number;
  targetLat: number;
  targetLon: number;
  radiusKm: number;
  notes?: string;
  badgeAwarded?: string;
};
