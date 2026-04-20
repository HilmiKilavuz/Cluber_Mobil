// components/events/EventCard.tsx
// Etkinlik özet kartı

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Radius, Shadows } from '@/constants/Tokens';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const c = useColors();

  const participantCount = event._count?.participants ?? event.participants?.length ?? 0;
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'd MMM yyyy', { locale: tr });
  const formattedTime = format(eventDate, 'HH:mm');

  const handlePress = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/(app)/clubs/${event.clubId}/events` as any);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(300)}>
      <Pressable
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
        accessibilityLabel={`${event.title} etkinliği`}
      >
        {/* Tarih bandı */}
        <View style={[styles.dateBand, { backgroundColor: c.accent }]}>
          <Text style={[styles.dateDay, { color: c.accentFg }]}>
            {format(eventDate, 'd', { locale: tr })}
          </Text>
          <Text style={[styles.dateMonth, { color: c.accentFg }]}>
            {format(eventDate, 'MMM', { locale: tr }).toUpperCase()}
          </Text>
        </View>

        {/* İçerik */}
        <View style={styles.content}>
          {event.category && (
            <Badge label={event.category} style={{ marginBottom: Spacing[2] }} />
          )}
          <Text
            style={[Typography.headingSm, { color: c.ink }]}
            numberOfLines={2}
          >
            {event.title}
          </Text>

          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color={c.inkTertiary} />
            <Text style={[Typography.caption, { color: c.inkTertiary, marginLeft: 4 }]}>
              {formattedTime}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={c.inkTertiary} />
            <Text
              style={[Typography.caption, { color: c.inkTertiary, marginLeft: 4, flex: 1 }]}
              numberOfLines={1}
            >
              {event.location}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="people-outline" size={13} color={c.inkTertiary} />
            <Text style={[Typography.caption, { color: c.inkTertiary, marginLeft: 4 }]}>
              {participantCount} katılımcı
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
    flexDirection: 'row',
    ...Shadows.sm,
  },
  dateBand: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[4],
  },
  dateDay: {
    fontFamily: 'DM-Sans-Bold',
    fontSize: 22,
    lineHeight: 26,
  },
  dateMonth: {
    fontFamily: 'DM-Sans-Medium',
    fontSize: 11,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: Spacing[4],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[1],
  },
});
