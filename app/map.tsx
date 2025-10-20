import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

import { AdBanner } from "../components/AdBanner";
import { ShareSnapshot } from "../components/ShareSnapshot";
import { StrikeMarker } from "../components/StrikeMarker";
import { palette, spacing, typography } from "../constants/theme";
import { useStrikeStore } from "../state/strike.store";

export default function MapScreen() {
  const { strikes } = useStrikeStore();
  const mapRef = useRef<MapView>(null);
  const captureRefObj = useRef<View | null>(null);
  const params = useLocalSearchParams();

  const focusId =
    typeof params.focusId === "string" ? params.focusId : undefined;
  const focusStrike = strikes.find((strike) => strike.id === focusId);
  const latestStrike = focusStrike ?? strikes[0];

  // Center map on latest strike
  useEffect(() => {
    if (latestStrike && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: latestStrike.targetLat,
          longitude: latestStrike.targetLon,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        },
        1000
      );
    }
  }, [latestStrike]);

  // Initial region for map
  const initialRegion = useMemo(() => {
    if (latestStrike) {
      return {
        latitude: latestStrike.targetLat,
        longitude: latestStrike.targetLon,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
    }
    // Default to center of US
    return {
      latitude: 39.5,
      longitude: -98.35,
      latitudeDelta: 30,
      longitudeDelta: 30,
    };
  }, [latestStrike]);

  return (
    <View style={styles.container}>
      {/* Real Map with strike markers */}
      <View style={styles.mapContainer} ref={captureRefObj}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_DEFAULT}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton
          showsCompass
        >
          {strikes.map((strike) => (
            <StrikeMarker key={strike.id} strike={strike} />
          ))}
        </MapView>
      </View>

      {/* Strike Details Card */}
      <ScrollView style={styles.detailsContainer}>
        {latestStrike ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>⚡ Strike Details</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Latest</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>
                  {latestStrike.distanceMi.toFixed(1)} mi
                </Text>
                <Text style={styles.statSubValue}>
                  {latestStrike.distanceKm.toFixed(1)} km
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Bearing</Text>
                <Text style={styles.statValue}>
                  {latestStrike.bearingDeg.toFixed(0)}°
                </Text>
                <Text style={styles.statSubValue}>
                  {getCompassDirection(latestStrike.bearingDeg)}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Uncertainty</Text>
                <Text style={styles.statValue}>
                  ±{(latestStrike.radiusKm * 1000).toFixed(0)}
                </Text>
                <Text style={styles.statSubValue}>meters</Text>
              </View>
            </View>

            <View style={styles.locationSection}>
              <Text style={styles.locationLabel}>📍 Coordinates</Text>
              <Text style={styles.locationValue}>
                {latestStrike.targetLat.toFixed(6)},{" "}
                {latestStrike.targetLon.toFixed(6)}
              </Text>
            </View>

            <View style={styles.shareWrapper}>
              <ShareSnapshot targetRef={captureRefObj} />
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🌩️</Text>
            <Text style={styles.emptyTitle}>No Strikes Yet</Text>
            <Text style={styles.emptyText}>
              Record a lightning strike to see it here
            </Text>
          </View>
        )}

        {/* All Strikes List */}
        {strikes.length > 1 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Recent Strikes ({strikes.length})
            </Text>
            {strikes.slice(0, 5).map((strike, index) => (
              <View key={strike.id} style={styles.strikeListItem}>
                <View style={styles.strikeNumber}>
                  <Text style={styles.strikeNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.strikeInfo}>
                  <Text style={styles.strikeDistance}>
                    {strike.distanceMi.toFixed(1)} mi •{" "}
                    {strike.bearingDeg.toFixed(0)}°
                  </Text>
                  <Text style={styles.strikeTime}>
                    {new Date(strike.createdAt).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <AdBanner style={styles.adBanner} />
    </View>
  );
}

function getCompassDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  mapContainer: {
    height: 300,
    borderBottomWidth: 4,
    borderBottomColor: palette.accent,
  },
  detailsContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: palette.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    color: palette.textPrimary,
  },
  badge: {
    backgroundColor: palette.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  badgeText: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  statItem: {
    flex: 1,
    backgroundColor: palette.background,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  statLabel: {
    ...typography.caption,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h2,
    color: palette.accent,
    marginBottom: spacing.xs,
  },
  statSubValue: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  locationSection: {
    backgroundColor: palette.background,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  locationLabel: {
    ...typography.caption,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  locationValue: {
    ...typography.body,
    color: palette.textPrimary,
    fontFamily: "Courier",
  },
  shareWrapper: {
    marginTop: spacing.md,
  },
  emptyCard: {
    backgroundColor: palette.surface,
    margin: spacing.md,
    padding: spacing.xxl,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: palette.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: "center",
  },
  strikeListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.background,
  },
  strikeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.accent + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  strikeNumberText: {
    ...typography.caption,
    color: palette.accent,
    fontWeight: "600",
  },
  strikeInfo: {
    flex: 1,
  },
  strikeDistance: {
    ...typography.body,
    color: palette.textPrimary,
    marginBottom: spacing.xs,
  },
  strikeTime: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  adBanner: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
});
