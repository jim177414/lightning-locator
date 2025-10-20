import { computeUncertaintyRadiusKm } from '../../lib/uncertainty';

describe('computeUncertaintyRadiusKm', () => {
  it('handles close strikes', () => {
    const radius = computeUncertaintyRadiusKm({
      distanceKm: 1,
      reactionSeconds: 0.25,
      compassDeg: 8,
      gpsAccuracyM: 5
    });
    expect(radius).toBeGreaterThan(0.05);
  });

  it('caps large uncertainty', () => {
    const radius = computeUncertaintyRadiusKm({
      distanceKm: 1000,
      reactionSeconds: 5,
      compassDeg: 45,
      gpsAccuracyM: 20000
    });
    expect(radius).toBeLessThanOrEqual(50);
  });
});
