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
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[Typography.displayMd, { color: c.ink }]}>Etkinlikler</Text>
        <Text style={[Typography.bodySm, { color: c.inkSecondary, marginTop: 2 }]}>
          Yaklaşan etkinlikleri keşfet
        </Text>
      </View>

      {/* Arama */}
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

      {isLoading ? (
        <LoadingSpinner message="Etkinlikler yükleniyor..." />
      ) : (
        <FlatList
          data={events}
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
    </SafeAreaView>
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
