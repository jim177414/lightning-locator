import { create } from 'zustand';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { Strike } from '../types/strike';
import { saveStrikes, loadStrikes } from '../services/storage.service';
import { analytics } from '../services/analytics.service';

export type TimingSession = {
  active: boolean;
  startedAt?: number;
  bearingSamples: number[];
};

type StrikeStoreState = {
  strikes: Strike[];
  timing: TimingSession;
  startTiming: () => void;
  stopTiming: () => void;
  recordBearingSample: (bearing: number) => void;
  addStrike: (strike: Omit<Strike, 'id' | 'createdAt'>) => Strike;
  clearHistory: () => void;
};

const initialStrikes = loadStrikes();

export const useStrikeStore = create<StrikeStoreState>((set, get) => ({
  strikes: initialStrikes,
  timing: {
    active: false,
    bearingSamples: []
  },
  startTiming: () => {
    set({
      timing: {
        active: true,
        startedAt: Date.now(),
        bearingSamples: []
      }
    });
    analytics.track('timing_started');
  },
  stopTiming: () => {
    const { timing } = get();
    if (!timing.active) {
      return;
    }
    set({
      timing: {
        active: false,
        startedAt: timing.startedAt,
        bearingSamples: timing.bearingSamples
      }
    });
  },
  recordBearingSample: (bearing: number) => {
    const { timing } = get();
    if (!timing.active) {
      return;
    }
    set({
      timing: {
        ...timing,
        bearingSamples: [...timing.bearingSamples, bearing]
      }
    });
  },
  addStrike: strikeInput => {
    const strike: Strike = {
      id: nanoid(),
      createdAt: dayjs().valueOf(),
      ...strikeInput
    };
    const strikes = [strike, ...get().strikes];
    set({ strikes, timing: { active: false, bearingSamples: [] } });
    saveStrikes(strikes);
    analytics.track('strike_recorded', {
      distanceKm: strike.distanceKm,
      bearingDeg: strike.bearingDeg
    });
    return strike;
  },
  clearHistory: () => {
    set({ strikes: [] });
    saveStrikes([]);
  }
}));

export function computeAverageBearing(samples: number[]) {
  if (samples.length === 0) {
    return 0;
  }
  const sinSum = samples.reduce((acc, value) => acc + Math.sin(toRad(value)), 0);
  const cosSum = samples.reduce((acc, value) => acc + Math.cos(toRad(value)), 0);
  const average = (Math.atan2(sinSum / samples.length, cosSum / samples.length) * 180) / Math.PI;
  return (average + 360) % 360;
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}
