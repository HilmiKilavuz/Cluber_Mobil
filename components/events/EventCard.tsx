import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Radius, Shadows } from '@/constants/Tokens';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Event } from '@/types/event';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRSVP, useCancelRSVP } from '@/hooks/events/useEvents';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const c = useColors();
  const { sessionQuery } = useAuth();
  const userId = sessionQuery.data?.id;

  const participantCount = event._count?.participants ?? event.participants?.length ?? 0;
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'd MMM yyyy', { locale: tr });
  const formattedTime = format(eventDate, 'HH:mm');

  const isPast = eventDate < new Date();
  const isParticipating = event.participants?.some((p) => p.userId === userId);

  const rsvpMutation = useRSVP(event.id);
  const cancelRsvpMutation = useCancelRSVP(event.id);

  const handleRSVP = async () => {
    try {
      if (isParticipating) {
        await cancelRsvpMutation.mutateAsync();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({ type: 'success', text1: 'Katılım iptal edildi' });
      } else {
        await rsvpMutation.mutateAsync();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({ type: 'success', text1: 'Etkinliğe katılıyorsunuz' });
      }
    } catch {}
  };

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/(app)/events/${event.id}` as any);
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing[2], flexWrap: 'wrap', gap: Spacing[2] }}>
            {event.club && (
              <Text style={[Typography.caption, { color: c.inkSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }]} numberOfLines={1}>
                {event.club.name}
              </Text>
            )}
            {event.category && (
              <Badge label={event.category} />
            )}
          </View>
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
          
          <View style={{ marginTop: Spacing[4] }}>
            {isPast ? (
              <Button label="Geçmiş Etkinlik" onPress={() => {}} disabled variant="ghost" fullWidth size="sm" />
            ) : isParticipating ? (
              <Button 
                label="Katılımdan Vazgeç" 
                onPress={handleRSVP} 
                variant="ghost" 
                loading={cancelRsvpMutation.isPending} 
                fullWidth 
                size="sm" 
              />
            ) : (
              <Button 
                label="Katıl" 
                onPress={handleRSVP} 
                variant="primary" 
                loading={rsvpMutation.isPending} 
                fullWidth 
                size="sm" 
              />
            )}
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
