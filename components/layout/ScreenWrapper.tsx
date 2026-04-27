// components/layout/ScreenWrapper.tsx
// SafeAreaView + StatusBar sarmalayıcı — her ekranda kullanılır
// iPhone notch/Dynamic Island için zorunlu

import React from 'react';
import { type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColors } from '@/hooks/ui/useColorScheme';
import { useColorScheme } from '@/hooks/ui/useColorScheme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function ScreenWrapper({
  children,
  style,
  edges = ['top', 'left', 'right', 'bottom'],
}: ScreenWrapperProps) {
  const c = useColors();
  const scheme = useColorScheme();

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: c.bg }, style]}
      edges={edges}
    >
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </SafeAreaView>
  );
}
