// components/layout/BackHeader.tsx
// Stack ekranı başlığı — geri butonu + başlık + isteğe bağlı sağ aksiyon

import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout } from '@/constants/Tokens';

interface BackHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function BackHeader({ title, onBack, rightAction }: BackHeaderProps) {
  const c = useColors();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: c.border,
          backgroundColor: c.bg,
        },
      ]}
    >
      <Pressable
        onPress={handleBack}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Geri"
        hitSlop={8}
      >
        <Ionicons
          name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
          size={24}
          color={c.ink}
        />
      </Pressable>

      <Text
        style={[Typography.headingSm, { color: c.ink, flex: 1 }]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View style={styles.rightSlot}>
        {rightAction ?? <View style={{ width: 44 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing[2],
  },
  rightSlot: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
