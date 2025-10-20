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
  hydrated: boolean;
  startTiming: () => void;
  stopTiming: () => void;
  recordBearingSample: (bearing: number) => void;
  addStrike: (strike: Omit<Strike, 'id' | 'createdAt'>) => Strike;
  clearHistory: () => void;
};

// Load strikes asynchronously
loadStrikes().then(strikes => {
  useStrikeStore.setState({ strikes, hydrated: true });
}).catch(error => {
  console.warn('Failed to load strikes', error);
  useStrikeStore.setState({ hydrated: true });
});

export const useStrikeStore = create<StrikeStoreState>((set, get) => ({
  strikes: [],
  hydrated: false,
  timing: {
    active: false,
    bearingSamples: []
  },
  startTiming: () => {
    console.log("[StrikeStore] Starting timing session");
    set({
      timing: {
        active: true,
        startedAt: Date.now(),
        bearingSamples: []
      }
    });
    console.log("[StrikeStore] Timing session started at:", new Date().toISOString());
    analytics.track('timing_started');
  },
  stopTiming: () => {
    const { timing } = get();
    console.log("[StrikeStore] Stopping timing. Current state:", timing);
    if (!timing.active) {
      console.warn("[StrikeStore] ⚠️ Attempted to stop timing when not active");
      return;
    }
    set({
      timing: {
        active: false,
        startedAt: timing.startedAt,
        bearingSamples: timing.bearingSamples
      }
    });
    console.log("[StrikeStore] Timing stopped. Samples collected:", timing.bearingSamples.length);
  },
  recordBearingSample: (bearing: number) => {
    const { timing } = get();
    if (!timing.active) {
      console.warn("[StrikeStore] ⚠️ Attempted to record bearing when timing not active");
      return;
    }
    set({
      timing: {
        ...timing,
        bearingSamples: [...timing.bearingSamples, bearing]
      }
    });
    console.log(`[StrikeStore] Bearing sample recorded: ${bearing}° (total: ${timing.bearingSamples.length + 1})`);
  },
  addStrike: (strikeInput) => {
    console.log("[StrikeStore] Adding new strike with input:", strikeInput);
    const strike: Strike = {
      id: nanoid(),
      createdAt: dayjs().valueOf(),
      ...strikeInput
    };
    console.log("[StrikeStore] Strike created with ID:", strike.id);
    const strikes = [strike, ...get().strikes];
    set({ strikes, timing: { active: false, bearingSamples: [] } });
    console.log(`[StrikeStore] ✅ Strike saved. Total strikes: ${strikes.length}`);
    saveStrikes(strikes).then(() => {
      console.log("[StrikeStore] Strikes persisted to storage");
    }).catch(err => {
      console.error("[StrikeStore] ❌ Failed to save strikes:", err);
    });
    analytics.track('strike_recorded', {
      distanceKm: strike.distanceKm,
      bearingDeg: strike.bearingDeg
    });
    return strike;
  },
  clearHistory: () => {
    console.log("[StrikeStore] Clearing all strike history");
    set({ strikes: [] });
    saveStrikes([]);
  }
}));

export function computeAverageBearing(samples: number[]) {
  console.log(`[computeAverageBearing] Computing from ${samples.length} samples:`, samples);
  if (samples.length === 0) {
    console.warn("[computeAverageBearing] ⚠️ No samples provided, returning 0");
    return 0;
  }
  const sinSum = samples.reduce((acc, value) => acc + Math.sin(toRad(value)), 0);
  const cosSum = samples.reduce((acc, value) => acc + Math.cos(toRad(value)), 0);
  console.log(`[computeAverageBearing] sinSum: ${sinSum.toFixed(4)}, cosSum: ${cosSum.toFixed(4)}`);
  const average = (Math.atan2(sinSum / samples.length, cosSum / samples.length) * 180) / Math.PI;
  const normalized = average < 0 ? average + 360 : average;
  console.log(`[computeAverageBearing] ✅ Average bearing: ${normalized.toFixed(1)}°`);
  return normalized;
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}
