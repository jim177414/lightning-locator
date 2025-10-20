import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

const CONFIG_KEYS = [
  'GOOGLE_MAPS_API_KEY',
  'SENTRY_DSN',
  'ANALYTICS_WRITE_KEY',
  'ADMOB_BANNER_ID_ANDROID',
  'ADMOB_BANNER_ID_IOS',
  'ADMOB_INTERSTITIAL_ID_ANDROID',
  'ADMOB_INTERSTITIAL_ID_IOS'
] as const;

type EnvKey = (typeof CONFIG_KEYS)[number];

function getEnvValue(name: EnvKey) {
  return process.env[name] ?? '';
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Lightning Locator',
  slug: 'lightning-locator',
  scheme: 'lightninglocator',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.example.lightninglocator',
    config: {
      googleMapsApiKey: getEnvValue('GOOGLE_MAPS_API_KEY')
    }
  },
  android: {
    package: 'com.example.lightninglocator',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0D1321'
    },
    config: {
      googleMaps: {
        apiKey: getEnvValue('GOOGLE_MAPS_API_KEY')
      }
    }
  },
  extra: {
    eas: {
      projectId: '00000000-0000-0000-0000-000000000000'
    },
    appEnv: process.env.APP_ENV ?? 'development',
    adsEnabled: process.env.ADS_ENABLED === 'true',
    interstitialEvery: Number(process.env.INTERSTITIAL_EVERY_N_STRIKES ?? '3'),
    interstitialCooldownMinutes: Number(
      process.env.INTERSTITIAL_COOLDOWN_MINUTES ?? '2'
    ),
    funMode: process.env.FUN_MODE !== 'false',
    hapticsEnabled: process.env.HAPTICS_ENABLED !== 'false',
    uncertaintyReactionSeconds: Number(
      process.env.UNCERTAINTY_REACTION_SECONDS ?? '0.25'
    ),
    uncertaintyCompassDegrees: Number(
      process.env.UNCERTAINTY_COMPASS_DEGREES ?? '8'
    ),
    ...CONFIG_KEYS.reduce(
      (acc, key) => ({
        ...acc,
        [key]: getEnvValue(key)
      }),
      {}
    )
  },
  updates: {
    url: 'https://u.expo.dev/00000000-0000-0000-0000-000000000000'
  },
  plugins: ['expo-router', 'expo-maps'],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true
  }
});
