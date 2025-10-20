import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'expo-router';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BigButton } from '../components/BigButton';
import { CompassDial } from '../components/CompassDial';
import { DistanceCard } from '../components/DistanceCard';
import { AdBanner } from '../components/AdBanner';
import { StrikeCounter } from '../components/StrikeCounter';
import { copy } from '../constants/copy';
import { palette, spacing, typography } from '../constants/theme';
import { useHeading, getCurrentLocationAsync } from '../lib/sensors';
import { useSettingsStore } from '../state/settings.store';
import { useStrikeStore, computeAverageBearing } from '../state/strike.store';
import { computeUncertaintyRadiusKm } from '../lib/uncertainty';
import { projectForward } from '../lib/bearing';
import { strikeConfirmHaptic } from '../lib/haptics';
import { notifyStrikeRecorded } from '../components/InterstitialManager';
import { ENV } from '../lib/env';
import { Strike } from '../types/strike';

const RULE_OF_5 = 'Rule of 5: Every 5 seconds ≈ 1 mile';
const RULE_OF_3 = 'Rule of 3: Every 3 seconds ≈ 1 km';

export default function HomeScreen() {
  const heading = useHeading();
  const [lastStrike, setLastStrike] = useState<Strike | null>(null);
  const [isComputing, setIsComputing] = useState(false);

  const { startTiming, stopTiming, recordBearingSample, timing, addStrike, strikes } = useStrikeStore();

  const { units, onboardingAccepted, setOnboardingAccepted, funMode } = useSettingsStore(state => ({
    units: state.units,
    onboardingAccepted: state.onboardingAccepted,
    setOnboardingAccepted: state.setOnboardingAccepted,
    funMode: state.funMode
  }));

  useEffect(() => {
    if (timing.active && typeof heading === 'number') {
      recordBearingSample(heading);
    }
  }, [heading, timing.active, recordBearingSample]);

  const handleSawLightning = useCallback(async () => {
    try {
      await getCurrentLocationAsync();
    } catch (error) {
      Alert.alert('Location needed', 'Please enable location services to estimate strikes.');
      return;
    }
    startTiming();
  }, [startTiming]);

  const handleHeardThunder = useCallback(async () => {
    const startedAt = timing.startedAt;
    if (!timing.active || !startedAt) {
      Alert.alert('Not timing', 'Tap “I saw lightning” before recording thunder.');
      return;
    }

    setIsComputing(true);
    stopTiming();

    try {
      const deltaSeconds = (Date.now() - startedAt) / 1000;
      const distanceMi = deltaSeconds / 5;
      const distanceKm = deltaSeconds * 0.343;
      const bearing = computeAverageBearing(timing.bearingSamples);
      const location = await getCurrentLocationAsync();
      const { latitude, longitude, accuracy } = location;
      const projected = projectForward({ latitude, longitude }, bearing, distanceKm);
      const radiusKm = computeUncertaintyRadiusKm({
        distanceKm,
        reactionSeconds: ENV.uncertaintyReactionSeconds,
        compassDeg: ENV.uncertaintyCompassDegrees,
        gpsAccuracyM: accuracy ?? undefined
      });

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
        radiusKm
      });

      setLastStrike(strike);
      await strikeConfirmHaptic();
      notifyStrikeRecorded();
    } catch (error) {
      console.warn(error);
      Alert.alert('Unable to compute strike', 'Check your permissions and try again.');
    } finally {
      setIsComputing(false);
    }
  }, [addStrike, stopTiming, timing]);

  const distanceHelperText = useMemo(() => `${RULE_OF_5}\n${RULE_OF_3}`, []);

  const strikeSummary = useMemo(() => {
    if (!lastStrike) {
      return '';
    }
    const distance = units === 'mi'
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.helper}>{distanceHelperText}</Text>
        <CompassDial heading={heading ?? 0} />
        <BigButton label={copy.sawLightningButton} onPress={handleSawLightning} disabled={timing.active} />
        <BigButton label={copy.heardThunderButton} onPress={handleHeardThunder} disabled={!timing.active || isComputing} />
        <DistanceCard
          deltaSeconds={lastStrike?.deltaSeconds}
          distanceMi={lastStrike?.distanceMi}
          distanceKm={lastStrike?.distanceKm}
          radiusKm={lastStrike?.radiusKm}
        />
        {strikeSummary.length > 0 && <Text style={styles.summary}>{strikeSummary}</Text>}
        <StrikeCounter totalStrikes={strikes.length} />
        <View style={styles.linksRow}>
          <Link href="/map" style={styles.linkText}>
            View map
          </Link>
          <Link href="/history" style={styles.linkText}>
            History
          </Link>
          <Link href="/settings" style={styles.linkText}>
            Settings
          </Link>
        </View>
      </ScrollView>
      <AdBanner />
      <Modal visible={!onboardingAccepted} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{copy.safetyOnboardingTitle}</Text>
            <Text style={styles.modalBody}>{copy.safetyOnboardingBody}</Text>
            <BigButton label={copy.safetyOnboardingCta} onPress={() => setOnboardingAccepted(true)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background
  },
  scrollContent: {
    padding: spacing.lg,
    alignItems: 'center'
  },
  helper: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center'
  },
  summary: {
    ...typography.body,
    color: palette.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.lg
  },
  linkText: {
    ...typography.label,
    color: palette.accent
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg
  },
  modalCard: {
    backgroundColor: palette.surface,
    padding: spacing.lg,
    borderRadius: 24,
    alignItems: 'center'
  },
  modalTitle: {
    ...typography.heading,
    color: palette.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm
  },
  modalBody: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md
  }
});
