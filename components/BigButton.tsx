import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette, radius, shadow, spacing, typography } from '../constants/theme';

type BigButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: ReactNode;
};

export function BigButton({ label, onPress, disabled, icon }: BigButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.base, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View style={styles.content}>
        {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: palette.accent,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
    ...shadow.default
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  },
  disabled: {
    opacity: 0.6
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconWrapper: {
    marginRight: spacing.sm
  },
  label: {
    ...typography.heading,
    color: palette.background,
    textAlign: 'center'
  }
});
