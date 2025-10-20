import { StyleSheet, Text, View } from 'react-native';
import { palette, radius, shadow, spacing, typography } from '../constants/theme';

type DistanceCardProps = {
  deltaSeconds?: number;
  distanceMi?: number;
  distanceKm?: number;
  radiusKm?: number;
};

export function DistanceCard({ deltaSeconds, distanceMi, distanceKm, radiusKm }: DistanceCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Timing</Text>
      <Text style={styles.value}>{deltaSeconds ? `${deltaSeconds.toFixed(1)} s` : '--'}</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Miles</Text>
          <Text style={styles.valueSmall}>{distanceMi ? distanceMi.toFixed(2) : '--'}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Kilometers</Text>
          <Text style={styles.valueSmall}>{distanceKm ? distanceKm.toFixed(2) : '--'}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Uncertainty</Text>
          <Text style={styles.valueSmall}>{radiusKm ? `${(radiusKm * 1000).toFixed(0)} m` : '--'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.default,
    width: '100%',
    marginVertical: spacing.md
  },
  title: {
    ...typography.label,
    color: palette.textSecondary
  },
  value: {
    ...typography.heading,
    color: palette.textPrimary
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md
  },
  column: {
    flex: 1,
    alignItems: 'center'
  },
  label: {
    ...typography.label,
    color: palette.textSecondary
  },
  valueSmall: {
    ...typography.body,
    color: palette.textPrimary
  }
});
