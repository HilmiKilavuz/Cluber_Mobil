// components/ui/LoadingSpinner.tsx

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message, fullScreen = false }: LoadingSpinnerProps) {
  const c = useColors();

  return (
    <View
      style={[
        styles.container,
        fullScreen && { flex: 1, backgroundColor: c.bg },
        { backgroundColor: fullScreen ? c.bg : 'transparent' },
      ]}
    >
      <ActivityIndicator size="large" color={c.accent} />
      {message && (
        <Text style={[Typography.bodyMd, { color: c.inkSecondary, marginTop: 12 }]}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
