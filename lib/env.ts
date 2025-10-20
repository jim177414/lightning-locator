import Constants from 'expo-constants';
import { z } from 'zod';

const extraSchema = z.object({
  appEnv: z.string(),
  adsEnabled: z.boolean().optional().default(false),
  interstitialEvery: z.number().int().positive().default(3),
  interstitialCooldownMinutes: z.number().nonnegative().default(2),
  funMode: z.boolean().optional().default(true),
  hapticsEnabled: z.boolean().optional().default(true),
  uncertaintyReactionSeconds: z.number().nonnegative().default(0.25),
  uncertaintyCompassDegrees: z.number().nonnegative().default(8),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  ANALYTICS_WRITE_KEY: z.string().optional(),
  ADMOB_BANNER_ID_ANDROID: z.string().optional(),
  ADMOB_BANNER_ID_IOS: z.string().optional(),
  ADMOB_INTERSTITIAL_ID_ANDROID: z.string().optional(),
  ADMOB_INTERSTITIAL_ID_IOS: z.string().optional()
});

const parsed = extraSchema.safeParse(Constants.expoConfig?.extra ?? {});

if (!parsed.success) {
  console.error('Environment validation failed', parsed.error.flatten());
  throw new Error('Invalid environment configuration');
}

export const ENV = parsed.data;
