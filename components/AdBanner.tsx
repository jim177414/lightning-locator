import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';
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
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID={unitId}
        servePersonalizedAds
        onDidFailToReceiveAdWithError={error => console.warn('Banner error', error)}
        style={styles.banner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  banner: {
    alignSelf: 'center'
  }
});
