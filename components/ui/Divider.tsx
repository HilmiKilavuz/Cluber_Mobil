// components/ui/Divider.tsx

import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useColors } from '@/hooks/ui/useColorScheme';

interface DividerProps {
  style?: ViewStyle;
  marginV?: number;
}

export function Divider({ style, marginV = 0 }: DividerProps) {
  const c = useColors();
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: c.border,
          marginVertical: marginV,
        },
        style,
      ]}
    />
  );
}
