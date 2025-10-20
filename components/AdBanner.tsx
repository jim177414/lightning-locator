import { Platform, StyleProp, StyleSheet, View, ViewStyle, Text } from 'react-native';
import { ENV } from '../lib/env';
import { palette } from '../constants/theme';

type AdBannerProps = {
  style?: StyleProp<ViewStyle>;
};

export function AdBanner({ style }: AdBannerProps) {
  if (!ENV.adsEnabled) {
    return null;
  }

  const unitId = Platform.select({
    ios: ENV.ADMOB_BANNER_ID_IOS,
    android: ENV.ADMOB_BANNER_ID_ANDROID,
    default: undefined
  });

  if (!unitId) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.adPlaceholder}>
        <Text style={styles.adText}>Ad Space (Disabled in Dev)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  adPlaceholder: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 165, 0, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  adText: {
    color: palette.accent,
    fontSize: 12,
    opacity: 0.5,
  }
});
