import { Platform } from 'react-native';
import {
  AdMobInterstitial,
  setTestDeviceIDAsync
} from 'expo-ads-admob';
import { ENV } from '../lib/env';
import dayjs from 'dayjs';

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await setTestDeviceIDAsync('EMULATOR');
    initialized = true;
  }
}

function getInterstitialUnitId() {
  return Platform.select({
    ios: ENV.ADMOB_INTERSTITIAL_ID_IOS,
    android: ENV.ADMOB_INTERSTITIAL_ID_ANDROID,
    default: undefined
  });
}

class InterstitialController {
  private strikeCount = 0;
  private lastShownAt: dayjs.Dayjs | null = null;

  async recordStrikeAndMaybeShow() {
    if (!ENV.adsEnabled) {
      return;
    }

    this.strikeCount += 1;

    const strikesUntilAd = ENV.interstitialEvery;
    if (this.strikeCount % strikesUntilAd !== 0) {
      return;
    }

    if (this.lastShownAt) {
      const minutesSince = dayjs().diff(this.lastShownAt, 'minute', true);
      if (minutesSince < ENV.interstitialCooldownMinutes) {
        return;
      }
    }

    const unitId = getInterstitialUnitId();
    if (!unitId) {
      return;
    }

    await ensureInit();

    try {
      await AdMobInterstitial.setAdUnitID(unitId);
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      await AdMobInterstitial.showAdAsync();
      this.lastShownAt = dayjs();
    } catch (error) {
      console.warn('Failed to show interstitial', error);
    }
  }
}

export const interstitialController = new InterstitialController();
