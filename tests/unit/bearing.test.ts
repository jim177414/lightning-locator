import { projectForward } from '../../lib/bearing';

describe('projectForward', () => {
  it('projects northward correctly', () => {
    const result = projectForward({ latitude: 0, longitude: 0 }, 0, 1);
    expect(result.latitude).toBeCloseTo(0.008993, 3);
    expect(result.longitude).toBeCloseTo(0, 3);
  });

  it('projects eastward correctly', () => {
    const result = projectForward({ latitude: 0, longitude: 0 }, 90, 1);
    expect(result.latitude).toBeCloseTo(0, 3);
    expect(result.longitude).toBeGreaterThan(0);
  });
});
