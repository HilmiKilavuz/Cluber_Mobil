// app/(app)/events.tsx
// Etkinlikler listesi — sonsuz scroll, arama

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EventCard } from '@/components/events/EventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useEvents } from '@/hooks/events/useEvents';
import { useColors } from '@/hooks/ui/useColorScheme';
import { useDebounce } from '@/hooks/ui/useDebounce';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout, Radius } from '@/constants/Tokens';
import type { Event } from '@/types/event';

export default function EventsScreen() {
  const c = useColors();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const filters = useMemo(
    () => ({ search: debouncedSearch || undefined, limit: 10 }),
    [debouncedSearch],
  );

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch, isRefetching } =
    useEvents(filters);

  const events: Event[] = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const sortedEvents = useMemo(() => {
    const now = new Date();
    const upcoming = events
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const past = events
      .filter((e) => new Date(e.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return [...upcoming, ...past];
  }, [events]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <ScreenWrapper style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <View>
            <Text style={[Typography.displayMd, { color: c.ink }]}>Etkinlikler</Text>
            <Text style={[Typography.bodySm, { color: c.inkSecondary, marginTop: 2 }]}>
              Yaklaşan etkinlikleri keşfet
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/(app)/events/create' as any)}
            style={{ width: 44, height: 44, borderRadius: Radius.full, backgroundColor: c.accent, justifyContent: 'center', alignItems: 'center' }}
          >
            <Ionicons name="add" size={24} color={c.accentFg} />
          </Pressable>
        </View>
      </Animated.View>

      {/* Arama */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <View
          style={[
            styles.searchContainer,
            { borderColor: c.border, backgroundColor: c.surface },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={c.inkTertiary} />
          <TextInput
            style={[styles.searchInput, { color: c.ink, fontFamily: 'DM-Sans-Regular' }]}
            placeholder="Etkinlik ara..."
            placeholderTextColor={c.inkTertiary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={c.inkTertiary} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {isLoading ? (
        <LoadingSpinner message="Etkinlikler yükleniyor..." />
      ) : (
        <FlatList
          data={sortedEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <EventCard event={item} index={index} />}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: Layout.cardGap }} />}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="Etkinlik bulunamadı"
              description={
                search
                  ? `"${search}" için etkinlik yok`
                  : 'Henüz etkinlik yok. Kulüplerini ziyaret et!'
              }
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={{ padding: Spacing[4] }}>
                <LoadingSpinner />
              </View>
            ) : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={c.accent}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Layout.screenPaddingH,
    marginBottom: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderWidth: 1,
    borderRadius: Radius.md,
    height: 44,
    gap: Spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: 44,
  },
  listContent: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Spacing[8],
    paddingTop: Spacing[2],
    flexGrow: 1,
  },
});
