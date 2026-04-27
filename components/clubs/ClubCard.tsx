// components/clubs/ClubCard.tsx
// Kulüp özet kartı — liste görünümü için

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Radius, Shadows } from '@/constants/Tokens';
import type { Club } from '@/types/club';

interface ClubCardProps {
  club: Club;
  index?: number;
}

export function ClubCard({ club, index = 0 }: ClubCardProps) {
  const c = useColors();

  const memberCount = club._count?.memberships ?? club.memberships?.length ?? 0;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/(app)/clubs/${club.id}` as any);
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 60).duration(300)}
      style={animatedStyle}
    >
      <Pressable
        onPressIn={() => { scale.value = withTiming(0.98, { duration: 100 }); }}
        onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: c.surface,
            borderColor: c.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${club.name} kulübü`}
      >
        {/* Banner */}
        {club.bannerUrl ? (
          <Image
            source={{ uri: club.bannerUrl }}
            style={styles.banner}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.banner, { backgroundColor: c.bgSecondary }]} />
        )}

        {/* İçerik */}
        <View style={styles.content}>
          {/* Avatar + Kategori satırı */}
          <View style={styles.topRow}>
            <Avatar
              uri={club.avatarUrl}
              name={club.name}
              size={48}
              shape="rounded"
            />
            <Badge label={club.category} style={{ marginLeft: Spacing[3] }} />
          </View>

          {/* Başlık ve açıklama */}
          <Text
            style={[Typography.headingMd, { color: c.ink, marginTop: Spacing[3] }]}
            numberOfLines={1}
          >
            {club.name}
          </Text>
          <Text
            style={[
              Typography.bodyMd,
              { color: c.inkSecondary, marginTop: Spacing[1] },
            ]}
            numberOfLines={2}
          >
            {club.description}
          </Text>

          {/* Üye sayısı */}
          <View style={styles.footer}>
            <Ionicons name="people-outline" size={14} color={c.inkTertiary} />
            <Text
              style={[
                Typography.caption,
                { color: c.inkTertiary, marginLeft: 4 },
              ]}
            >
              {memberCount} üye
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  banner: {
    height: 100,
    width: '100%',
  },
  content: {
    padding: Spacing[4],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -Spacing[6],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[3],
  },
});
