import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { palette, spacing, typography } from '../constants/theme';
import { useStrikeStore } from '../state/strike.store';

export default function HistoryScreen() {
  const { strikes } = useStrikeStore();

  return (
    <View style={styles.container}>
      <FlatList
        data={strikes}
        keyExtractor={item => item.id}
        contentContainerStyle={strikes.length === 0 ? styles.emptyContainer : undefined}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>{dayjs(item.createdAt).format('MMM D, YYYY h:mm A')}</Text>
            <Text style={styles.subtitle}>
              {item.distanceMi.toFixed(2)} mi ({item.distanceKm.toFixed(2)} km)
            </Text>
            <Text style={styles.subtitle}>Bearing {item.bearingDeg.toFixed(0)}°</Text>
            <Link href={{ pathname: '/map', params: { focusId: item.id } }} style={styles.link}>
              View on map
            </Link>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No strikes recorded yet. Tap the lightning button to start.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    padding: spacing.lg
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md
  },
  title: {
    ...typography.heading,
    color: palette.textPrimary
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary
  },
  link: {
    ...typography.label,
    color: palette.accent,
    marginTop: spacing.sm
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center'
  }
});
