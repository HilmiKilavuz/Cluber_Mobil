// app/(app)/clubs/[id]/events.tsx
// Kulübe ait etkinlikler listesi

import React, { useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BackHeader } from '@/components/layout/BackHeader';
import { EventCard } from '@/components/events/EventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useEvents } from '@/hooks/events/useEvents';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Spacing, Layout } from '@/constants/Tokens';
import type { Event } from '@/types/event';

export default function ClubEventsScreen() {
  const { id: clubId } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useEvents({ clubId, limit: 10 });

  const events: Event[] = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <ScreenWrapper>
      <BackHeader title="Etkinlikler" />
      {isLoading ? <LoadingSpinner /> : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <EventCard event={item} index={index} />}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => <View style={{ height: Layout.cardGap }} />}
          ListEmptyComponent={<EmptyState icon="calendar-outline" title="Etkinlik yok" description="Bu kulüpte henüz etkinlik oluşturulmamış." />}
          ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.screenPaddingH, paddingVertical: Spacing[3], flexGrow: 1 },
});
