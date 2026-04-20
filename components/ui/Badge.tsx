// components/ui/Badge.tsx
// Kategori / Rol etiketi — design.md ile uyumlu

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Radius } from '@/constants/Tokens';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const c = useColors();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: c.successBg, text: c.success, border: c.success };
      case 'error':
        return { bg: c.errorBg, text: c.error, border: c.error };
      case 'warning':
        return { bg: c.warningBg, text: c.warning, border: c.warning };
      default:
        return { bg: c.bgSecondary, text: c.inkSecondary, border: c.border };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        style,
      ]}
      accessibilityRole="text"
    >
      <Text style={[styles.label, { color: colors.text }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'DM-Sans-Medium',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
