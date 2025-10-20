import { Link } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";

import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

import { AdBanner } from "../components/AdBanner";
import { BigButton } from "../components/BigButton";
import { CompassDial } from "../components/CompassDial";
import { DistanceCard } from "../components/DistanceCard";
import { notifyStrikeRecorded } from "../components/InterstitialManager";
import { StrikeCounter } from "../components/StrikeCounter";
import { StrikeMarker } from "../components/StrikeMarker";
import { copy } from "../constants/copy";
import { palette, spacing, typography } from "../constants/theme";
import { projectForward } from "../lib/bearing";
import { ENV } from "../lib/env";
import { strikeConfirmHaptic } from "../lib/haptics";
import { useHeading, getCurrentLocationAsync } from "../lib/sensors";
import { computeUncertaintyRadiusKm } from "../lib/uncertainty";
import { useSettingsStore } from "../state/settings.store";
import { useStrikeStore, computeAverageBearing } from "../state/strike.store";
import { Strike } from "../types/strike";

const RULE_OF_5 = "Rule of 5: Every 5 seconds ≈ 1 mile";
const RULE_OF_3 = "Rule of 3: Every 3 seconds ≈ 1 km";

export default function HomeScreen() {
  const heading = useHeading();
  const [lastStrike, setLastStrike] = useState<Strike | null>(null);
  const [isComputing, setIsComputing] = useState(false);

  const {
    startTiming,
    stopTiming,
    recordBearingSample,
    timing,
    addStrike,
    strikes,
  } = useStrikeStore();

  const { units, onboardingAccepted, setOnboardingAccepted, funMode } =
    useSettingsStore((state) => ({
      units: state.units,
      onboardingAccepted: state.onboardingAccepted,
      setOnboardingAccepted: state.setOnboardingAccepted,
      funMode: state.funMode,
    }));

  useEffect(() => {
    if (timing.active && typeof heading === "number") {
      recordBearingSample(heading);
    }
  }, [heading, timing.active, recordBearingSample]);

  const handleSawLightning = useCallback(async () => {
    console.log("[HomeScreen] 🌩️ User saw lightning - starting timing...");
    try {
      console.log("[HomeScreen] Requesting location...");
      const location = await getCurrentLocationAsync();
      console.log("[HomeScreen] ✅ Location obtained:", {
        lat: location.latitude,
        lon: location.longitude,
        accuracy: location.accuracy,
      });
    } catch (error) {
      console.error("[HomeScreen] ❌ Location error:", error);
      Alert.alert(
        "Location needed",
        "Please enable location services to estimate strikes.",
      );
      return;
    }
    console.log("[HomeScreen] Starting timer...");
    startTiming();
    console.log("[HomeScreen] ✅ Timer started successfully");
  }, [startTiming]);

  const handleHeardThunder = useCallback(async () => {
    console.log("[HomeScreen] ⚡ User heard thunder - computing strike...");
    const startedAt = timing.startedAt;

    console.log("[HomeScreen] Timing state:", {
      active: timing.active,
      startedAt,
      samplesCount: timing.bearingSamples?.length || 0,
    });

    if (!timing.active || !startedAt) {
      console.warn("[HomeScreen] ⚠️ Timer not active or not started");
      Alert.alert(
        "Not timing",
        'Tap "I saw lightning" before recording thunder.',
      );
      return;
    }

    setIsComputing(true);
    stopTiming();

    try {
      const deltaSeconds = (Date.now() - startedAt) / 1000;
      console.log(`[HomeScreen] Time elapsed: ${deltaSeconds.toFixed(2)}s`);

      const distanceMi = deltaSeconds / 5;
      const distanceKm = deltaSeconds * 0.343;
      console.log(
        `[HomeScreen] Calculated distance: ${distanceMi.toFixed(2)} mi / ${distanceKm.toFixed(2)} km`,
      );

      console.log(
        "[HomeScreen] Computing average bearing from samples:",
        timing.bearingSamples,
      );
      const bearing = computeAverageBearing(timing.bearingSamples);
      console.log(`[HomeScreen] Average bearing: ${bearing.toFixed(1)}°`);

      console.log("[HomeScreen] Getting current location...");
      const location = await getCurrentLocationAsync();
      const { latitude, longitude, accuracy } = location;
      console.log("[HomeScreen] Current location:", {
        latitude,
        longitude,
        accuracy,
      });

      console.log("[HomeScreen] Projecting strike location...");
      const projected = projectForward(
        { latitude, longitude },
        bearing,
        distanceKm,
      );
      console.log("[HomeScreen] Projected strike location:", projected);

      console.log("[HomeScreen] Computing uncertainty radius...");
      const radiusKm = computeUncertaintyRadiusKm({
        distanceKm,
        reactionSeconds: ENV.uncertaintyReactionSeconds,
        compassDeg: ENV.uncertaintyCompassDegrees,
        gpsAccuracyM: accuracy ?? undefined,
      });
      console.log(`[HomeScreen] Uncertainty radius: ${radiusKm.toFixed(3)} km`);

      console.log("[HomeScreen] Adding strike to store...");
      const strike = addStrike({
        userLat: latitude,
        userLon: longitude,
        userAccuracyM: accuracy ?? undefined,
        bearingDeg: bearing,
        deltaSeconds,
        distanceKm,
        distanceMi,
        targetLat: projected.latitude,
        targetLon: projected.longitude,
        radiusKm,
      });
      console.log("[HomeScreen] ✅ Strike added:", strike);

      setLastStrike(strike);
      console.log("[HomeScreen] Triggering haptic feedback...");
      await strikeConfirmHaptic();
      console.log("[HomeScreen] Notifying interstitial manager...");
      notifyStrikeRecorded();
      console.log("[HomeScreen] 🎉 Strike computation completed successfully!");
    } catch (error: any) {
      console.error("[HomeScreen] ❌ Error computing strike:", error);
      console.error("[HomeScreen] Error details:", {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      });
      Alert.alert(
        "Unable to compute strike",
        `Error: ${error?.message || "Unknown error"}. Check your permissions and try again.`,
      );
    } finally {
      setIsComputing(false);
      console.log("[HomeScreen] Computing state reset");
    }
  }, [addStrike, stopTiming, timing]);

  const strikeSummary = useMemo(() => {
    if (!lastStrike) {
      return "";
    }
    const distance =
      units === "mi"
        ? `${lastStrike.distanceMi.toFixed(2)} mi`
        : `${lastStrike.distanceKm.toFixed(2)} km`;
    const direction = `${lastStrike.bearingDeg.toFixed(0)}°`;
    if (funMode && lastStrike.distanceMi < 3) {
      return `${copy.streakLabels.goats} Estimated ${distance} away @ ${direction}.`;
    }
    if (lastStrike.deltaSeconds >= 3 && lastStrike.deltaSeconds <= 5) {
      return `${copy.streakLabels.good} ~${distance} @ ${direction}.`;
    }
    return `Estimated ${distance} away at bearing ${direction}.`;
  }, [lastStrike, units, funMode]);

  const mapRef = useRef<MapView>(null);

  // Center map on user location or latest strike
  const mapRegion = useMemo(() => {
    if (lastStrike) {
      return {
        latitude: lastStrike.userLat,
        longitude: lastStrike.userLon,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
    }
    return {
      latitude: 39.5,
      longitude: -98.35,
      latitudeDelta: 30,
      longitudeDelta: 30,
    };
  }, [lastStrike]);

  useEffect(() => {
    if (lastStrike && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: lastStrike.targetLat,
          longitude: lastStrike.targetLon,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        },
        1000,
      );
    }
  }, [lastStrike]);

  return (
    <View style={styles.container}>
      {/* Full-screen Map Background */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={mapRegion}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        customMapStyle={darkMapStyle}
      >
        {strikes.map((strike) => (
          <StrikeMarker key={strike.id} strike={strike} />
        ))}
      </MapView>

      {/* Dark overlay gradient from bottom - using View instead of LinearGradient for Expo Go */}
      <View style={styles.gradient} pointerEvents="none" />

      {/* Top floating compass */}
      <View style={styles.topSection}>
        <View style={styles.compassContainer}>
          <CompassDial heading={heading ?? 0} />
          <Text style={styles.helperText}>⚡ Lightning Locator ⚡</Text>
        </View>
      </View>

      {/* Bottom UI overlay */}
      <View style={styles.bottomSection}>
        <View style={styles.actionButtons}>
          <BigButton
            label={copy.sawLightningButton}
            onPress={handleSawLightning}
            disabled={timing.active}
          />
          <BigButton
            label={copy.heardThunderButton}
            onPress={handleHeardThunder}
            disabled={!timing.active || isComputing}
          />
        </View>

        <DistanceCard
          deltaSeconds={lastStrike?.deltaSeconds}
          distanceMi={lastStrike?.distanceMi}
          distanceKm={lastStrike?.distanceKm}
          radiusKm={lastStrike?.radiusKm}
        />

        {strikeSummary.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>⚡</Text>
            <Text style={styles.summary}>{strikeSummary}</Text>
          </View>
        )}

        <StrikeCounter totalStrikes={strikes.length} />

        <View style={styles.linksRow}>
          <Link href="/map" style={styles.linkText}>
            📍 Map
          </Link>
          <Link href="/history" style={styles.linkText}>
            📜 History
          </Link>
          <Link href="/settings" style={styles.linkText}>
            ⚙️ Settings
          </Link>
        </View>
      </View>

      <Modal visible={!onboardingAccepted} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{copy.safetyOnboardingTitle}</Text>
            <Text style={styles.modalBody}>{copy.safetyOnboardingBody}</Text>
            <BigButton
              label={copy.safetyOnboardingCta}
              onPress={() => setOnboardingAccepted(true)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Dark thunderstorm-themed map style
const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1a1a2e" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#8e8e93" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1a1a2e" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f1419" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#16213e" }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
    backgroundColor: "rgba(13, 19, 33, 0.85)",
  },
  topSection: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  compassContainer: {
    backgroundColor: "rgba(13, 19, 33, 0.85)",
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: palette.accent + "40",
    shadowColor: "#F0A500",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  helperText: {
    ...typography.label,
    color: palette.accent,
    textAlign: "center",
    marginTop: spacing.sm,
    fontWeight: "700",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  actionButtons: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCard: {
    backgroundColor: "rgba(240, 165, 0, 0.15)",
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.accent + "60",
  },
  summaryIcon: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  summary: {
    ...typography.body,
    color: palette.textPrimary,
    flex: 1,
  },
  linksRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: spacing.lg,
    backgroundColor: "rgba(13, 19, 33, 0.8)",
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.accent + "30",
  },
  linkText: {
    ...typography.label,
    color: palette.accent,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: palette.surface,
    padding: spacing.xl,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: palette.accent + "40",
    shadowColor: "#F0A500",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  modalTitle: {
    ...typography.heading,
    color: palette.textPrimary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  modalBody: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
});
