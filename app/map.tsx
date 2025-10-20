import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { palette, spacing, typography } from '../constants/theme';
import { useStrikeStore } from '../state/strike.store';
import { StrikeMarker } from '../components/StrikeMarker';
import { ShareSnapshot } from '../components/ShareSnapshot';
import { AdBanner } from '../components/AdBanner';

export default function MapScreen() {
  const { strikes } = useStrikeStore();
  const mapRef = useRef<MapView | null>(null);
  const captureRefObj = useRef<View | null>(null);
  const params = useLocalSearchParams();

  const focusId = typeof params.focusId === 'string' ? params.focusId : undefined;
  const focusStrike = strikes.find(strike => strike.id === focusId);
  const latestStrike = focusStrike ?? strikes[0];

  useEffect(() => {
    if (latestStrike && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: latestStrike.targetLat,
          longitude: latestStrike.targetLon
        },
        zoom: 10
      });
    }
  }, [latestStrike]);

  const region = useMemo(() => {
    if (latestStrike) {
      return {
        latitude: latestStrike.targetLat,
        longitude: latestStrike.targetLon,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3
      };
    }
    return {
      latitude: 39.5,
      longitude: -98.35,
      latitudeDelta: 30,
      longitudeDelta: 30
    };
  }, [latestStrike]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer} ref={captureRefObj}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation
          showsCompass
        >
          {strikes.map(strike => (
            <StrikeMarker key={strike.id} strike={strike} />
          ))}
        </MapView>
      </View>
      <View style={styles.bottomSheet}>
        {latestStrike ? (
          <>
            <Text style={styles.title}>Strike details</Text>
            <Text style={styles.detail}>
              {latestStrike.distanceMi.toFixed(2)} mi / {latestStrike.distanceKm.toFixed(2)} km
            </Text>
            <Text style={styles.detail}>Bearing {latestStrike.bearingDeg.toFixed(0)}°</Text>
            <Text style={styles.detail}>Uncertainty radius {(latestStrike.radiusKm * 1000).toFixed(0)} m</Text>
            <View style={styles.shareWrapper}>
              <ShareSnapshot targetRef={captureRefObj} />
            </View>
          </>
        ) : (
          <Text style={styles.detail}>Record a strike to see it on the map.</Text>
        )}
      </View>
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background
  },
  mapContainer: {
    flex: 1
  },
  bottomSheet: {
    padding: spacing.lg,
    backgroundColor: palette.surface
  },
  title: {
    ...typography.heading,
    color: palette.textPrimary
  },
  detail: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: spacing.xs
  },
  shareWrapper: {
    marginTop: spacing.sm
  }
});
