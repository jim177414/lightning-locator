import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { palette, spacing, typography } from '../constants/theme';
import { useSettingsStore } from '../state/settings.store';

const SAFETY_URL = 'https://www.weather.gov/safety/lightning';

export default function SettingsScreen() {
  const { units, setUnits, funMode, hapticsEnabled } = useSettingsStore(state => ({
    units: state.units,
    setUnits: state.setUnits,
    funMode: state.funMode,
    hapticsEnabled: state.hapticsEnabled
  }));

  const isMiles = units === 'mi';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.heading}>Units</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Miles</Text>
          <Switch value={isMiles} onValueChange={value => setUnits(value ? 'mi' : 'km')} />
        </View>
        <Text style={styles.caption}>Toggle off to use kilometers instead.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Fun mode</Text>
        <Text style={styles.caption}>
          {funMode
            ? 'Playful microcopy, goat chases, and badges are enabled. '
            : 'Fun bits are disabled via environment settings.'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Haptics</Text>
        <Text style={styles.caption}>
          {hapticsEnabled ? 'Strike confirmations use gentle vibrations.' : 'Haptics are disabled.'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Safety</Text>
        <Text style={styles.caption}>
          Always follow official guidance. If thunder follows lightning within 30 seconds, move indoors immediately.
        </Text>
        <Pressable onPress={() => Linking.openURL(SAFETY_URL)}>
          <Text style={styles.link}>NOAA Lightning Safety Tips</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background
  },
  content: {
    padding: spacing.lg,
    marginBottom: spacing.lg
  },
  section: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg
  },
  heading: {
    ...typography.heading,
    color: palette.textPrimary
  },
  label: {
    ...typography.body,
    color: palette.textPrimary
  },
  caption: {
    ...typography.body,
    color: palette.textSecondary,
    marginTop: spacing.xs
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  link: {
    ...typography.label,
    color: palette.accent
  }
});
