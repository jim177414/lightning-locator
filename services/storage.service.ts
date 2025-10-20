import { MMKV } from 'react-native-mmkv';
import { Strike } from '../types/strike';

const storage = new MMKV({ id: 'lightning-locator' });

const STRIKES_KEY = 'strikes';
const SETTINGS_KEY = 'settings';

export function saveStrikes(strikes: Strike[]) {
  storage.set(STRIKES_KEY, JSON.stringify(strikes));
}

export function loadStrikes(): Strike[] {
  const raw = storage.getString(STRIKES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as Strike[];
  } catch (error) {
    console.warn('Failed to parse strikes from storage', error);
    return [];
  }
}

export type StoredSettings = {
  units: 'mi' | 'km';
  onboardingAccepted: boolean;
};

export function saveSettings(settings: StoredSettings) {
  storage.set(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings(): StoredSettings | null {
  const raw = storage.getString(SETTINGS_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredSettings;
  } catch (error) {
    console.warn('Failed to parse settings from storage', error);
    return null;
  }
}
