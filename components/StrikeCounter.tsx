import { StyleSheet, Text, View } from 'react-native';
import { copy } from '../constants/copy';
import { palette, radius, spacing, typography } from '../constants/theme';
import { ENV } from '../lib/env';

type StrikeCounterProps = {
  totalStrikes: number;
};

export function StrikeCounter({ totalStrikes }: StrikeCounterProps) {
  if (!ENV.adsEnabled) {
    return null;
  }
  const strikesUntilAd = ENV.interstitialEvery;
  const remainder = totalStrikes % strikesUntilAd;
  const remaining = totalStrikes === 0 ? strikesUntilAd : remainder === 0 ? 0 : strikesUntilAd - remainder;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{copy.strikeAdCountdown(remaining)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surfaceAlt,
    padding: spacing.sm,
    borderRadius: radius.md,
    alignSelf: 'center'
  },
  label: {
    ...typography.body,
    color: palette.textPrimary
  }
});
