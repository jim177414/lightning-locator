import AsyncStorage from '@react-native-async-storage/async-storage';
import { Strike } from '../types/strike';

const STRIKES_KEY = 'strikes';
const SETTINGS_KEY = 'settings';

export async function saveStrikes(strikes: Strike[]) {
  try {
    await AsyncStorage.setItem(STRIKES_KEY, JSON.stringify(strikes));
  } catch (error) {
    console.warn('Failed to save strikes', error);
  }
}

export async function loadStrikes(): Promise<Strike[]> {
  try {
    const raw = await AsyncStorage.getItem(STRIKES_KEY);
    if (!raw) {
      return [];
    }
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

export async function saveSettings(settings: StoredSettings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings', error);
  }
}

export async function loadSettings(): Promise<StoredSettings | null> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredSettings;
  } catch (error) {
    console.warn('Failed to parse settings from storage', error);
    return null;
  }
}
