// components/ui/Avatar.tsx
// Kullanıcı / Kulüp avatarı — resim yoksa baş harf gösterir

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Radius } from '@/constants/Tokens';

type AvatarSize = 32 | 40 | 44 | 48 | 64 | 80 | 96;
type AvatarShape = 'circle' | 'rounded';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  style?: object;
}

export function Avatar({ uri, name, size = 40, shape = 'circle', style }: AvatarProps) {
  const c = useColors();

  const borderRadius = shape === 'circle' ? size / 2 : Radius.lg;
  const fontSize = size <= 40 ? size * 0.4 : size * 0.35;
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '?';

  const containerStyle = {
    width: size,
    height: size,
    borderRadius,
    overflow: 'hidden' as const,
    backgroundColor: c.bgSecondary,
    borderWidth: 1,
    borderColor: c.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={containerStyle}
        contentFit="cover"
        transition={200}
        accessibilityLabel={name ?? 'Avatar'}
      />
    );
  }

  return (
    <View style={containerStyle}>
      <Text
        style={{
          fontFamily: 'DM-Sans-SemiBold',
          fontSize,
          color: c.inkSecondary,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
