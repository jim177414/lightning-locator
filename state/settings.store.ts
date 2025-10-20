import { create } from 'zustand';
import { ENV } from '../lib/env';
import { loadSettings, saveSettings } from '../services/storage.service';

type Units = 'mi' | 'km';

type SettingsState = {
  units: Units;
  onboardingAccepted: boolean;
  funMode: boolean;
  hapticsEnabled: boolean;
  hydrated: boolean;
  setUnits: (units: Units) => void;
  setOnboardingAccepted: (accepted: boolean) => void;
};

// Load settings asynchronously
loadSettings().then(persisted => {
  if (persisted) {
    useSettingsStore.setState({ 
      units: persisted.units,
      onboardingAccepted: persisted.onboardingAccepted,
      hydrated: true 
    });
  } else {
    useSettingsStore.setState({ hydrated: true });
  }
}).catch(error => {
  console.warn('Failed to load settings', error);
  useSettingsStore.setState({ hydrated: true });
});

export const useSettingsStore = create<SettingsState>((set, get) => ({
  units: 'mi',
  onboardingAccepted: false,
  hydrated: false,
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

