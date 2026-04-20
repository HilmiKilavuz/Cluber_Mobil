// components/ui/EmptyState.tsx
// Boş durum gösterimi — ikon, başlık, açıklama, aksiyon butonu

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Tokens';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const c = useColors();

  return (
    <View style={styles.container}>
      {icon && (
        <Ionicons
          name={icon}
          size={48}
          color={c.inkTertiary}
          style={{ marginBottom: Spacing[4] }}
        />
      )}
      <Text style={[Typography.headingMd, { color: c.ink, textAlign: 'center' }]}>
        {title}
      </Text>
      {description && (
        <Text
          style={[
            Typography.bodyMd,
            { color: c.inkSecondary, textAlign: 'center', marginTop: Spacing[2] },
          ]}
        >
          {description}
        </Text>
      )}
      {action && (
        <View style={{ marginTop: Spacing[6] }}>
          <Button label={action.label} onPress={action.onPress} variant="ghost" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[8],
  },
});
