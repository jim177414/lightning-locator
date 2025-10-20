import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { Platform } from 'react-native';

const SAMPLE_INTERVAL_MS = 100;

export async function ensureLocationPermissions() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== Location.PermissionStatus.GRANTED) {
    throw new Error('Location permission denied');
  }
}

export type HeadingSample = {
  timestamp: number;
  heading: number;
};

export class HeadingSampler {
  private samples: HeadingSample[] = [];
  private subscription: { remove: () => void } | null = null;

  start() {
    this.samples = [];
    Magnetometer.setUpdateInterval(SAMPLE_INTERVAL_MS);
    this.subscription = Magnetometer.addListener(({ x, y }) => {
      const heading = headingFromMagnetometer(x, y);
      if (heading != null) {
        this.samples.push({ heading, timestamp: Date.now() });
      }
    });
  }

  stop() {
    this.subscription?.remove();
    this.subscription = null;
  }

  getAverageHeading(defaultHeading = 0) {
    if (this.samples.length === 0) {
      return defaultHeading;
    }

    const sinSum = this.samples.reduce((acc, sample) => acc + Math.sin(toRad(sample.heading)), 0);
    const cosSum = this.samples.reduce((acc, sample) => acc + Math.cos(toRad(sample.heading)), 0);
    const average = (Math.atan2(sinSum / this.samples.length, cosSum / this.samples.length) * 180) / Math.PI;
    return (average + 360) % 360;
  }
}

function headingFromMagnetometer(x?: number | null, y?: number | null) {
  if (x == null || y == null) {
    return null;
  }
  let heading = Math.atan2(y, x) * (180 / Math.PI);
  heading = (heading + 360) % 360;
  if (Platform.OS === 'ios') {
    heading = 90 - heading;
  }
  return (heading + 360) % 360;
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export function useHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  useEffect(() => {
    Magnetometer.setUpdateInterval(250);
    const sub = Magnetometer.addListener(({ x, y }) => {
      const computed = headingFromMagnetometer(x, y);
      if (computed != null) {
        setHeading(computed);
      }
    });
    return () => sub.remove();
  }, []);
  return heading;
}

export async function getCurrentLocationAsync() {
  await ensureLocationPermissions();
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
    maximumAge: 10_000
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy
  };
}
