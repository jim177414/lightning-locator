import { create } from 'zustand';
import { ENV } from '../lib/env';
import { loadSettings, saveSettings } from '../services/storage.service';

type Units = 'mi' | 'km';

type SettingsState = {
  units: Units;
  onboardingAccepted: boolean;
  funMode: boolean;
  hapticsEnabled: boolean;
  setUnits: (units: Units) => void;
  setOnboardingAccepted: (accepted: boolean) => void;
};

const persisted = loadSettings();

export const useSettingsStore = create<SettingsState>((set, get) => ({
  units: persisted?.units ?? 'mi',
  onboardingAccepted: persisted?.onboardingAccepted ?? false,
  funMode: ENV.funMode,
  hapticsEnabled: ENV.hapticsEnabled,
  setUnits: units => {
    set({ units });
    saveSettings({ units, onboardingAccepted: get().onboardingAccepted });
  },
  setOnboardingAccepted: accepted => {
    set({ onboardingAccepted: accepted });
    saveSettings({ units: get().units, onboardingAccepted: accepted });
  }
}));
