import { Platform } from 'react-native';
import { ENV } from '../lib/env';
import dayjs from 'dayjs';

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    // Ads disabled in development (Expo Go doesn't support react-native-google-mobile-ads)
    console.log('[Ads] Initialized (stub for development)');
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

    // Stub for development - ads disabled in Expo Go
    console.log('[Ads] Would show interstitial ad here (disabled in dev)');
    this.lastShownAt = dayjs();
  }
}

export const interstitialController = new InterstitialController();
