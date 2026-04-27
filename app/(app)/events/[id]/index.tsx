// app/(app)/events/[id]/index.tsx
// Etkinlik detay ekranı — tam bilgi, katılımcı listesi, RSVP aksiyonu

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BackHeader } from '@/components/layout/BackHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useEvent, useRSVP, useCancelRSVP, useDeleteEvent } from '@/hooks/events/useEvents';
import { useAuth } from '@/hooks/auth/useAuth';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout, Radius, Shadows } from '@/constants/Tokens';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { tr } from 'date-fns/locale';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 240;

export default function EventDetailScreen() {
  const c = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessionQuery } = useAuth();
  const userId = sessionQuery.data?.id;

  const { data: event, isLoading, isError } = useEvent(id!);
  const rsvpMutation = useRSVP(id!);
  const cancelRsvpMutation = useCancelRSVP(id!);
  const deleteEventMutation = useDeleteEvent();

  const eventDate = event ? new Date(event.date) : null;
  const isEventPast = eventDate ? isPast(eventDate) : false;
  const isParticipating = event?.participants?.some((p) => p.userId === userId);
  const isCreator = event?.creatorId === userId;
  const participantCount = event?._count?.participants ?? event?.participants?.length ?? 0;
  const maxParticipants = event?.maxParticipants;
  const isFull = maxParticipants ? participantCount >= maxParticipants : false;

  const handleRSVP = useCallback(async () => {
    if (!event) return;
    try {
      if (isParticipating) {
        await cancelRsvpMutation.mutateAsync();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({ type: 'success', text1: 'Katılım iptal edildi' });
      } else {
        await rsvpMutation.mutateAsync();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({ type: 'success', text1: 'Etkinliğe katılıyorsunuz! 🎉' });
      }
    } catch {}
  }, [event, isParticipating, rsvpMutation, cancelRsvpMutation]);

  const handleShare = useCallback(async () => {
    if (!event) return;
    try {
      await Share.share({
        message: `${event.title} — ${eventDate ? format(eventDate, 'd MMM yyyy HH:mm', { locale: tr }) : ''}\n📍 ${event.location}`,
        title: event.title,
      });
    } catch {}
  }, [event, eventDate]);

  const handleDeleteEvent = useCallback(() => {
    if (!event) return;
    Alert.alert(
      'Etkinliği Sil',
      'Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEventMutation.mutateAsync(event.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Toast.show({ type: 'success', text1: 'Etkinlik silindi' });
              router.back();
            } catch {}
          },
        },
      ],
    );
  }, [event, deleteEventMutation]);

  if (isLoading) return <LoadingSpinner fullScreen message="Etkinlik yükleniyor..." />;

  if (isError || !event) {
    return (
      <ScreenWrapper>
        <BackHeader title="Etkinlik" />
        <EmptyState
          icon="alert-circle-outline"
          title="Etkinlik bulunamadı"
          description="Bu etkinlik mevcut değil veya erişim izniniz yok."
          action={{ label: 'Geri Dön', onPress: () => router.back() }}
        />
      </ScreenWrapper>
    );
  }

  const formattedDate = eventDate
    ? format(eventDate, 'd MMMM yyyy', { locale: tr })
    : '';
  const formattedTime = eventDate
    ? format(eventDate, 'HH:mm', { locale: tr })
    : '';
  const relativeTime = eventDate
    ? isEventPast
      ? formatDistanceToNow(eventDate, { locale: tr, addSuffix: true })
      : formatDistanceToNow(eventDate, { locale: tr, addSuffix: true })
    : '';

  return (
    <ScreenWrapper>
      <BackHeader
        title=""
        rightAction={
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Pressable
              onPress={handleShare}
              style={styles.headerBtn}
              accessibilityLabel="Paylaş"
              accessibilityRole="button"
            >
              <Ionicons name="share-outline" size={20} color={c.ink} />
            </Pressable>
            {isCreator && (
              <Pressable
                onPress={handleDeleteEvent}
                style={styles.headerBtn}
                accessibilityLabel="Etkinliği sil"
                accessibilityRole="button"
              >
                <Ionicons name="trash-outline" size={20} color={c.error} />
              </Pressable>
            )}
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Üst görsel — kapak resmi veya tarih bandı */}
        <Animated.View entering={FadeIn.duration(400)}>
          {event.imageUrl ? (
            <Image
              source={{ uri: event.imageUrl }}
              style={{ width: SCREEN_WIDTH, height: BANNER_HEIGHT }}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View
              style={[
                styles.placeholderBanner,
                { backgroundColor: c.bgSecondary, height: BANNER_HEIGHT },
              ]}
            >
              {/* Büyük tarih gösterimi */}
              <View style={[styles.datePill, { backgroundColor: c.accent }]}>
                <Text style={[styles.datePillDay, { color: c.accentFg }]}>
                  {eventDate ? format(eventDate, 'd', { locale: tr }) : '--'}
                </Text>
                <Text style={[styles.datePillMonth, { color: c.accentFg }]}>
                  {eventDate
                    ? format(eventDate, 'MMMM', { locale: tr }).toUpperCase()
                    : ''}
                </Text>
                <Text style={[styles.datePillYear, { color: c.accentFg, opacity: 0.7 }]}>
                  {eventDate ? format(eventDate, 'yyyy') : ''}
                </Text>
              </View>
            </View>
          )}

          {/* Durum rozeti */}
          {isEventPast && (
            <View style={[styles.pastBadge, { backgroundColor: c.bgSecondary + 'EE' }]}>
              <Ionicons name="time-outline" size={14} color={c.inkSecondary} />
              <Text style={[Typography.caption, { color: c.inkSecondary, marginLeft: 4 }]}>
                GEÇMİŞ ETKİNLİK
              </Text>
            </View>
          )}
        </Animated.View>

        {/* İçerik */}
        <View style={[styles.contentContainer, { backgroundColor: c.bg }]}>

          {/* Başlık & kategori */}
          <Animated.View entering={FadeInDown.delay(100).duration(300)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[2], marginBottom: Spacing[3] }}>
              {event.category && <Badge label={event.category} />}
              {isFull && !isEventPast && (
                <Badge label="Kontenjan Dolu" />
              )}
            </View>
            <Text style={[Typography.displayMd, { color: c.ink }]}>{event.title}</Text>
          </Animated.View>

          {/* Meta bilgileri */}
          <Animated.View
            entering={FadeInDown.delay(150).duration(300)}
            style={[styles.metaCard, { backgroundColor: c.surface, borderColor: c.border }]}
          >
            {/* Tarih & saat */}
            <View style={styles.metaRow}>
              <View style={[styles.metaIcon, { backgroundColor: c.bgSecondary }]}>
                <Ionicons name="calendar-outline" size={18} color={c.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.headingSm, { color: c.ink }]}>{formattedDate}</Text>
                <Text style={[Typography.bodySm, { color: c.inkSecondary }]}>
                  {formattedTime} · {relativeTime}
                </Text>
              </View>
            </View>

            <View style={[styles.metaDivider, { backgroundColor: c.border }]} />

            {/* Konum */}
            <View style={styles.metaRow}>
              <View style={[styles.metaIcon, { backgroundColor: c.bgSecondary }]}>
                <Ionicons name="location-outline" size={18} color={c.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.headingSm, { color: c.ink }]}>{event.location}</Text>
                <Text style={[Typography.bodySm, { color: c.inkSecondary }]}>Etkinlik Yeri</Text>
              </View>
            </View>

            <View style={[styles.metaDivider, { backgroundColor: c.border }]} />

            {/* Katılımcı sayısı */}
            <View style={styles.metaRow}>
              <View style={[styles.metaIcon, { backgroundColor: c.bgSecondary }]}>
                <Ionicons name="people-outline" size={18} color={c.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.headingSm, { color: c.ink }]}>
                  {participantCount}
                  {maxParticipants ? ` / ${maxParticipants}` : ''} Katılımcı
                </Text>
                <Text style={[Typography.bodySm, { color: c.inkSecondary }]}>
                  {maxParticipants && isFull
                    ? 'Kontenjan dolmuştur'
                    : maxParticipants
                    ? `${maxParticipants - participantCount} yer kaldı`
                    : 'Sınırsız kontenjan'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Kulüp bilgisi */}
          {event.club && (
            <Animated.View entering={FadeInDown.delay(200).duration(300)}>
              <Pressable
                onPress={() => router.push(`/(app)/clubs/${event.clubId}` as any)}
                style={[styles.clubRow, { backgroundColor: c.surface, borderColor: c.border }]}
                accessibilityRole="button"
                accessibilityLabel={`${event.club.name} kulübüne git`}
              >
                <Avatar
                  uri={event.club.imageUrl}
                  name={event.club.name}
                  size={40}
                  shape="rounded"
                />
                <View style={{ flex: 1, marginLeft: Spacing[3] }}>
                  <Text style={[Typography.caption, { color: c.inkTertiary, textTransform: 'uppercase', letterSpacing: 0.5 }]}>
                    DÜZENLEYEN KULÜP
                  </Text>
                  <Text style={[Typography.headingSm, { color: c.ink }]}>{event.club.name}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={c.inkTertiary} />
              </Pressable>
            </Animated.View>
          )}

          {/* Açıklama */}
          {event.description && (
            <Animated.View entering={FadeInDown.delay(250).duration(300)} style={styles.section}>
              <Text style={[Typography.headingSm, { color: c.inkSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing[3] }]}>
                HAKKINDA
              </Text>
              <Text style={[Typography.bodyMd, { color: c.ink, lineHeight: 26 }]}>
                {event.description}
              </Text>
            </Animated.View>
          )}

          {/* Katılımcı listesi */}
          {event.participants && event.participants.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.section}>
              <Text
                style={[
                  Typography.headingSm,
                  { color: c.inkSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing[3] },
                ]}
              >
                KATILIMCILAR ({participantCount})
              </Text>

              {/* İlk 5 katılımcının avatarlarını yan yana göster */}
              <View style={styles.participantsRow}>
                {event.participants.slice(0, 5).map((participant, idx) => (
                  <View
                    key={participant.id}
                    style={[styles.participantAvatar, { marginLeft: idx === 0 ? 0 : -12 }]}
                  >
                    <Avatar
                      uri={participant.user?.avatarUrl}
                      name={participant.user?.displayName ?? '?'}
                      size={40}
                    />
                  </View>
                ))}
                {participantCount > 5 && (
                  <View
                    style={[
                      styles.participantAvatar,
                      styles.moreParticipants,
                      { backgroundColor: c.bgSecondary, borderColor: c.border, marginLeft: -12 },
                    ]}
                  >
                    <Text style={[Typography.caption, { color: c.inkSecondary }]}>
                      +{participantCount - 5}
                    </Text>
                  </View>
                )}
              </View>

              {/* Katılımcı isim listesi */}
              <View style={[styles.participantsList, { borderColor: c.border }]}>
                {event.participants.slice(0, 10).map((participant, idx) => (
                  <View
                    key={participant.id}
                    style={[
                      styles.participantItem,
                      idx < event.participants!.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: c.border,
                      },
                    ]}
                  >
                    <Avatar
                      uri={participant.user?.avatarUrl}
                      name={participant.user?.displayName ?? '?'}
                      size={32}
                    />
                    <Text style={[Typography.bodyMd, { color: c.ink, marginLeft: Spacing[3], flex: 1 }]}>
                      {participant.user?.displayName ?? 'Katılımcı'}
                    </Text>
                    {participant.userId === userId && (
                      <Badge label="Sen" />
                    )}
                  </View>
                ))}
                {participantCount > 10 && (
                  <View style={styles.participantItem}>
                    <Text style={[Typography.bodySm, { color: c.inkSecondary }]}>
                      +{participantCount - 10} katılımcı daha
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          )}

          {/* Boş katılımcı durumu */}
          {(!event.participants || event.participants.length === 0) && !isEventPast && (
            <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.section}>
              <Text
                style={[
                  Typography.headingSm,
                  { color: c.inkSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing[3] },
                ]}
              >
                KATILIMCILAR
              </Text>
              <View
                style={[
                  styles.emptyParticipants,
                  { backgroundColor: c.surface, borderColor: c.border },
                ]}
              >
                <Ionicons name="people-outline" size={32} color={c.inkTertiary} />
                <Text style={[Typography.bodySm, { color: c.inkTertiary, marginTop: Spacing[2], textAlign: 'center' }]}>
                  Henüz katılımcı yok.{'\n'}İlk katılan sen ol!
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Alt boşluk (CTA butonu için yer) */}
          <View style={{ height: Spacing[20] }} />
        </View>
      </ScrollView>

      {/* Sabit RSVP Butonu */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(300)}
        style={[
          styles.ctaContainer,
          {
            backgroundColor: c.bg,
            borderTopColor: c.border,
          },
        ]}
      >
        {isEventPast ? (
          <Button
            label="Bu etkinlik sona erdi"
            onPress={() => {}}
            variant="ghost"
            size="lg"
            fullWidth
            disabled
          />
        ) : isFull && !isParticipating ? (
          <Button
            label="Kontenjan Dolu"
            onPress={() => {}}
            variant="ghost"
            size="lg"
            fullWidth
            disabled
          />
        ) : isParticipating ? (
          <Button
            label="Katılımdan Vazgeç"
            onPress={handleRSVP}
            variant="ghost"
            size="lg"
            fullWidth
            loading={cancelRsvpMutation.isPending}
          />
        ) : (
          <Button
            label="Etkinliğe Katıl"
            onPress={handleRSVP}
            variant="primary"
            size="lg"
            fullWidth
            loading={rsvpMutation.isPending}
          />
        )}
      </Animated.View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  placeholderBanner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePill: {
    alignItems: 'center',
    paddingHorizontal: Spacing[8],
    paddingVertical: Spacing[5],
    borderRadius: Radius.xl,
  },
  datePillDay: {
    fontFamily: 'DM-Sans-Bold',
    fontSize: 64,
    lineHeight: 70,
    letterSpacing: -2,
  },
  datePillMonth: {
    fontFamily: 'DM-Sans-SemiBold',
    fontSize: 18,
    letterSpacing: 3,
    marginTop: 4,
  },
  datePillYear: {
    fontFamily: 'DM-Sans-Regular',
    fontSize: 14,
    letterSpacing: 1,
    marginTop: 2,
  },
  pastBadge: {
    position: 'absolute',
    top: Spacing[3],
    right: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
  },
  contentContainer: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[5],
  },
  metaCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginTop: Spacing[5],
    ...Shadows.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    gap: Spacing[3],
  },
  metaIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaDivider: {
    height: 1,
    marginHorizontal: Spacing[4],
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    marginTop: Spacing[4],
    borderWidth: 1,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },
  section: {
    marginTop: Spacing[6],
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  participantAvatar: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreParticipants: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantsList: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  emptyParticipants: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[8],
    borderWidth: 1,
    borderRadius: Radius.lg,
    borderStyle: 'dashed',
  },
  ctaContainer: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[3],
    paddingBottom: Spacing[6],
    borderTopWidth: 1,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
});
