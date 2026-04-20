// app/(app)/clubs/[id]/index.tsx
// Kulüp detay ekranı — banner, avatar, katıl/ayrıl, sekmeler

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BackHeader } from '@/components/layout/BackHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { EventCard } from '@/components/events/EventCard';
import { useClub, useJoinClub, useLeaveClub } from '@/hooks/clubs/useClubs';
import { useEvents } from '@/hooks/events/useEvents';
import { useAuth } from '@/hooks/auth/useAuth';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout, Radius } from '@/constants/Tokens';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

type TabKey = 'hakkinda' | 'etkinlikler' | 'uyeler';

export default function ClubDetailScreen() {
  const c = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('hakkinda');

  const { data: club, isLoading } = useClub(id!);
  const { data: sessionData } = useAuth().sessionQuery;
  const joinMutation = useJoinClub();
  const leaveMutation = useLeaveClub();

  // Kullanıcının bu kulübe üye olup olmadığını kontrol et
  const membership = club?.memberships?.find((m) => m.userId === sessionData?.id);
  const isMember = !!membership;
  const isOwner = club?.creatorId === sessionData?.id;
  const memberCount = club?._count?.memberships ?? 0;

  const { data: eventsData } = useEvents({ clubId: id, limit: 5 });
  const events = eventsData?.pages.flatMap((p) => p.data) ?? [];

  const handleJoin = async () => {
    if (!id) return;
    try {
      await joinMutation.mutateAsync(id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: 'success', text1: 'Kulübe katıldın!' });
    } catch {}
  };

  const handleLeave = () => {
    Alert.alert('Kulüpten Ayrıl', 'Bu kulüpten ayrılmak istiyor musun?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Ayrıl',
        style: 'destructive',
        onPress: async () => {
          try {
            await leaveMutation.mutateAsync(id!);
            Toast.show({ type: 'success', text1: 'Kulüpten ayrıldın.' });
          } catch {}
        },
      },
    ]);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!club) {
    return (
      <ScreenWrapper>
        <BackHeader title="Kulüp" />
        <EmptyState icon="alert-circle-outline" title="Kulüp bulunamadı" />
      </ScreenWrapper>
    );
  }

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'hakkinda', label: 'Hakkında' },
    { key: 'etkinlikler', label: 'Etkinlikler' },
    { key: 'uyeler', label: 'Üyeler' },
  ];

  return (
    <ScreenWrapper edges={['top']}>
      <BackHeader
        title={club.name}
        rightAction={
          (isOwner || membership?.role === 'ADMIN') ? (
            <Pressable
              onPress={() => router.push(`/(app)/clubs/${id}/settings` as any)}
              style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="settings-outline" size={22} color={c.ink} />
            </Pressable>
          ) : undefined
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={{ position: 'relative' }}>
          {club.bannerUrl ? (
            <Image
              source={{ uri: club.bannerUrl }}
              style={{ width: SCREEN_WIDTH, height: BANNER_HEIGHT }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={{
                width: SCREEN_WIDTH,
                height: BANNER_HEIGHT,
                backgroundColor: c.bgSecondary,
              }}
            />
          )}
        </View>

        {/* Avatar (banner üzerine konumlandırılmış) */}
        <View style={styles.contentContainer}>
          <View style={styles.avatarRow}>
            <View
              style={[
                styles.avatarWrapper,
                { backgroundColor: c.bg, borderColor: c.bg },
              ]}
            >
              <Avatar uri={club.avatarUrl} name={club.name} size={80} shape="rounded" />
            </View>

            {/* Aksiyon butonları */}
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              {isOwner && (
                <Button
                  label="Admin"
                  onPress={() => router.push(`/(app)/clubs/${id}/admin` as any)}
                  variant="ghost"
                  size="sm"
                  icon={<Ionicons name="shield-outline" size={14} color={c.ink} />}
                />
              )}
              {!isOwner && (
                isMember ? (
                  <Button
                    label="Ayrıl"
                    onPress={handleLeave}
                    variant="ghost"
                    size="sm"
                    loading={leaveMutation.isPending}
                  />
                ) : (
                  <Button
                    label="Katıl"
                    onPress={handleJoin}
                    variant="primary"
                    size="sm"
                    loading={joinMutation.isPending}
                  />
                )
              )}
              <Button
                label="Sohbet"
                onPress={() => router.push(`/(app)/clubs/${id}/chat` as any)}
                variant="ghost"
                size="sm"
                icon={<Ionicons name="chatbubble-outline" size={14} color={c.ink} />}
              />
            </View>
          </View>

          {/* Başlık ve meta */}
          <Text style={[Typography.headingLg, { color: c.ink, marginTop: Spacing[4] }]}>
            {club.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing[2], gap: Spacing[3] }}>
            <Badge label={club.category} />
            <Text style={[Typography.caption, { color: c.inkTertiary }]}>
              {memberCount} üye
            </Text>
          </View>

          {/* Sekmeler */}
          <View style={[styles.tabBar, { borderBottomColor: c.border }]}>
            {TABS.map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tab,
                  activeTab === tab.key && {
                    borderBottomWidth: 2,
                    borderBottomColor: c.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    Typography.headingSm,
                    {
                      color: activeTab === tab.key ? c.ink : c.inkTertiary,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Sekme içeriği */}
          {activeTab === 'hakkinda' && (
            <View style={{ paddingTop: Spacing[4] }}>
              <Text style={[Typography.bodyMd, { color: c.inkSecondary, lineHeight: 24 }]}>
                {club.description}
              </Text>
              {club.creator && (
                <View style={[styles.creatorRow, { borderColor: c.border }]}>
                  <Avatar uri={club.creator.avatarUrl} name={club.creator.displayName} size={32} />
                  <View style={{ marginLeft: Spacing[3] }}>
                    <Text style={[Typography.caption, { color: c.inkTertiary }]}>KURUCU</Text>
                    <Text style={[Typography.bodyMd, { color: c.ink }]}>
                      {club.creator.displayName}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {activeTab === 'etkinlikler' && (
            <View style={{ paddingTop: Spacing[4], gap: Spacing[3] }}>
              {events.length === 0 ? (
                <EmptyState
                  icon="calendar-outline"
                  title="Etkinlik yok"
                  description="Bu kulüpte henüz etkinlik oluşturulmamış."
                />
              ) : (
                events.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))
              )}
            </View>
          )}

          {activeTab === 'uyeler' && (
            <View style={{ paddingTop: Spacing[4] }}>
              <Button
                label="Üye Listesini Gör"
                onPress={() => router.push(`/(app)/clubs/${id}/members` as any)}
                variant="ghost"
                fullWidth
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Spacing[8],
  },
  avatarWrapper: {
    marginTop: -40,
    borderRadius: Radius.lg + 4,
    borderWidth: 3,
    alignSelf: 'flex-start',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 0,
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: Spacing[6],
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingBottom: Spacing[3],
    alignItems: 'center',
    paddingTop: Spacing[2],
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
  },
});
