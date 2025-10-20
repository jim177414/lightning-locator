import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { palette, radius, shadow, spacing, typography } from '../constants/theme';
import { copy } from '../constants/copy';

type CompassDialProps = {
  heading?: number | null;
};

const AnimatedNeedle = Animated.createAnimatedComponent(View);

const CARDINAL_POSITIONS = [
  { label: 'N', style: { top: spacing.sm, left: '48%' } },
  { label: 'E', style: { top: '48%', right: spacing.sm } },
  { label: 'S', style: { bottom: spacing.sm, left: '48%' } },
  { label: 'W', style: { top: '48%', left: spacing.sm } }
];

export function CompassDial({ heading }: CompassDialProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (typeof heading === 'number' && !Number.isNaN(heading)) {
      rotation.value = withTiming(heading, { duration: 250 });
    }
  }, [heading, rotation]);

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{copy.compassLabel}</Text>
      <View style={styles.dial}>
        {CARDINAL_POSITIONS.map(cardinal => (
          <Text key={cardinal.label} style={[styles.cardinal, cardinal.style]}>
            {cardinal.label}
          </Text>
        ))}
        <AnimatedNeedle style={[styles.needle, needleStyle]} />
        <Text style={styles.headingValue}>{heading?.toFixed(0) ?? '--'}°</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.lg
  },
  label: {
    ...typography.label,
    color: palette.textSecondary,
    marginBottom: spacing.sm
  },
  dial: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...shadow.default
  },
  cardinal: {
    position: 'absolute',
    ...typography.label,
    color: palette.textSecondary
  },
  needle: {
    position: 'absolute',
    width: 4,
    height: 90,
    backgroundColor: palette.accent,
    borderRadius: radius.sm,
    top: 20
  },
  headingValue: {
    ...typography.heading,
    color: palette.textPrimary
  }
});
