// components/ui/Card.tsx
// Kart sarmalayıcı bileşen — press feedback ile

import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Radius, Shadows } from '@/constants/Tokens';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, onPress, style, padding = 16 }: CardProps) {
  const c = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardStyle: ViewStyle = {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    padding,
    ...Shadows.sm,
  };

  if (onPress) {
    return (
      <Animated.View style={[cardStyle, animatedStyle, style]}>
        <Pressable
          onPressIn={() => { scale.value = withTiming(0.98, { duration: 100 }); }}
          onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
          onPress={onPress}
          style={StyleSheet.absoluteFill}
        />
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[cardStyle, style]}>
      {children}
    </Animated.View>
  );
}
