// components/ui/Button.tsx
// Primary / Ghost / Text varyantlı evrensel buton bileşeni
// Reanimated ile press feedback animasyonu

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Radius } from '@/constants/Tokens';

type ButtonVariant = 'primary' | 'ghost' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const SIZE_CONFIG: Record<ButtonSize, { height: number; paddingH: number; fontSize: number; fontFamily: string }> = {
  sm: { height: 36, paddingH: 14, fontSize: 13, fontFamily: 'DM-Sans-Medium' },
  md: { height: 44, paddingH: 20, fontSize: 15, fontFamily: 'DM-Sans-Medium' },
  lg: { height: 52, paddingH: 24, fontSize: 16, fontFamily: 'DM-Sans-SemiBold' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const c = useColors();
  const scale = useSharedValue(1);
  const sizeConfig = SIZE_CONFIG[size];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const containerStyle: ViewStyle = {
    height: sizeConfig.height,
    paddingHorizontal: sizeConfig.paddingH,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    opacity: disabled || loading ? 0.5 : 1,
    ...(variant === 'primary' && {
      backgroundColor: c.accent,
    }),
    ...(variant === 'ghost' && {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: c.border,
    }),
    ...(variant === 'text' && {
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
    }),
  };

  const textStyle: TextStyle = {
    fontFamily: sizeConfig.fontFamily,
    fontSize: sizeConfig.fontSize,
    color: variant === 'primary' ? c.accentFg : c.ink,
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        style={containerStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? c.accentFg : c.ink}
          />
        ) : (
          <>
            {icon}
            <Text style={textStyle}>{label}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
