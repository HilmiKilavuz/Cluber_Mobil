// app/(app)/index.tsx
// Keşfet — Kulüp listesi, arama, kategori filtresi, sonsuz scroll

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ClubCard } from '@/components/clubs/ClubCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { useClubs } from '@/hooks/clubs/useClubs';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout, Radius } from '@/constants/Tokens';
import { CLUB_CATEGORIES } from '@/types/club';
import type { Club } from '@/types/club';
import { useDebounce } from '@/hooks/ui/useDebounce';

export default function DiscoverScreen() {
  const c = useColors();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const debouncedSearch = useDebounce(search, 400);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category: selectedCategory,
      limit: 10,
    }),
    [debouncedSearch, selectedCategory],
  );

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch, isRefetching } =
    useClubs(filters);

  const clubs: Club[] = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCategoryPress = (cat: string) => {
    setSelectedCategory((prev) => (prev === cat ? undefined : cat));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[Typography.displayMd, { color: c.ink }]}>Keşfet</Text>
          <Text style={[Typography.bodySm, { color: c.inkSecondary, marginTop: 2 }]}>
            Topluluğuna katıl
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/(app)/clubs/create' as any)}
          style={[styles.createButton, { backgroundColor: c.accent }]}
          accessibilityLabel="Kulüp oluştur"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={22} color={c.accentFg} />
        </Pressable>
      </View>

      {/* Arama kutusu */}
      <View style={[styles.searchContainer, { borderColor: c.border, backgroundColor: c.surface }]}>
        <Ionicons name="search-outline" size={18} color={c.inkTertiary} />
        <TextInput
          style={[styles.searchInput, { color: c.ink, fontFamily: 'DM-Sans-Regular' }]}
          placeholder="Kulüp ara..."
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

      {/* Kategori filtresi */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={{ maxHeight: 44 }}
      >
        {CLUB_CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => handleCategoryPress(cat)}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === cat ? c.accent : c.surface,
                borderColor: selectedCategory === cat ? c.accent : c.border,
              },
            ]}
          >
            <Text
              style={[
                Typography.caption,
                {
                  color: selectedCategory === cat ? c.accentFg : c.inkSecondary,
                  letterSpacing: 0.3,
                },
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Kulüp listesi */}
      {isLoading ? (
        <LoadingSpinner message="Kulüpler yükleniyor..." />
      ) : (
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ClubCard club={item} index={index} />}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: Layout.cardGap }} />}
          ListEmptyComponent={
            <EmptyState
              icon="compass-outline"
              title="Kulüp bulunamadı"
              description={
                search
                  ? `"${search}" için sonuç yok`
                  : 'Henüz kulüp yok. İlk kulübü sen oluştur!'
              }
              action={{
                label: 'Kulüp Oluştur',
                onPress: () => router.push('/(app)/clubs/create' as any),
              }}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  categoriesContainer: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Spacing[3],
    gap: Spacing[2],
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Spacing[8],
    paddingTop: Spacing[2],
    flexGrow: 1,
  },
});
