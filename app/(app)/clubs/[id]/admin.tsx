// app/(app)/clubs/[id]/admin.tsx
// Admin paneli — üye çıkarma, kulüp silme (owner only)

import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BackHeader } from '@/components/layout/BackHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useClub, useClubMembers, useRemoveMember, useDeleteClub } from '@/hooks/clubs/useClubs';
import { useAuth } from '@/hooks/auth/useAuth';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout, Radius, Shadows } from '@/constants/Tokens';
import type { ClubMember } from '@/types/club';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

export default function AdminScreen() {
  const c = useColors();
  const { id: clubId } = useLocalSearchParams<{ id: string }>();
  const { sessionQuery } = useAuth();
  const currentUserId = sessionQuery.data?.id;

  const { data: club } = useClub(clubId!);
  const { data: members, isLoading } = useClubMembers(clubId!);
  const removeMutation = useRemoveMember(clubId!);
  const deleteMutation = useDeleteClub();

  const isOwner = club?.creatorId === currentUserId;

  const handleRemove = (member: ClubMember) => {
    Alert.alert('Üyeyi Çıkar', `${member.user?.displayName} kulüpten çıkarılsın mı?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkar', style: 'destructive', onPress: async () => {
        try {
          await removeMutation.mutateAsync(member.userId);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Toast.show({ type: 'success', text1: 'Üye çıkarıldı.' });
        } catch {}
      }},
    ]);
  };

  const handleDeleteClub = () => {
    Alert.alert('Kulübü Sil', 'Kulüp kalıcı olarak silinecek. Emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Evet, Sil', style: 'destructive', onPress: async () => {
        try {
          await deleteMutation.mutateAsync(clubId!);
          Toast.show({ type: 'success', text1: 'Kulüp silindi.' });
          router.replace('/(app)');
        } catch {}
      }},
    ]);
  };

  const memberCount = members?.length ?? 0;
  const nonOwnerMembers = members?.filter((m) => m.role !== 'OWNER') ?? [];

  return (
    <ScreenWrapper>
      <BackHeader title="Admin Paneli" />
      {isLoading ? <LoadingSpinner /> : (
        <FlatList
          data={nonOwnerMembers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <>
              {/* İstatistikler */}
              <View style={[styles.statsCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                <View style={styles.statItem}>
                  <Text style={[Typography.displayMd, { color: c.ink }]}>{memberCount}</Text>
                  <Text style={[Typography.caption, { color: c.inkSecondary }]}>Toplam Üye</Text>
                </View>
              </View>
              <Text style={[Typography.headingSm, { color: c.ink, marginTop: Spacing[6], marginBottom: Spacing[3] }]}>
                ÜYE YÖNETİMİ
              </Text>
            </>
          }
          renderItem={({ item, index }) => (
            <>
              <View style={styles.memberRow}>
                <Avatar uri={item.user?.avatarUrl} name={item.user?.displayName} size={44} />
                <View style={{ flex: 1, marginLeft: Spacing[3] }}>
                  <Text style={[Typography.headingSm, { color: c.ink }]}>{item.user?.displayName}</Text>
                  <Text style={[Typography.caption, { color: c.inkTertiary }]}>{item.role}</Text>
                </View>
                {isOwner && (
                  <Button
                    label="Çıkar"
                    onPress={() => handleRemove(item)}
                    variant="ghost"
                    size="sm"
                    loading={removeMutation.isPending}
                  />
                )}
              </View>
              {index < nonOwnerMembers.length - 1 && <Divider />}
            </>
          )}
          ListEmptyComponent={
            <EmptyState icon="people-outline" title="Üye yok" description="Henüz katılan üye yok." />
          }
          ListFooterComponent={
            isOwner ? (
              <View style={[styles.dangerZone, { borderColor: c.error + '40' }]}>
                <Text style={[Typography.headingSm, { color: c.error, marginBottom: Spacing[3] }]}>
                  Tehlikeli Bölge
                </Text>
                <Button
                  label="Kulübü Kalıcı Olarak Sil"
                  onPress={handleDeleteClub}
                  variant="ghost"
                  fullWidth
                  loading={deleteMutation.isPending}
                />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.screenPaddingH, paddingBottom: Spacing[8] },
  statsCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing[5], alignItems: 'center', marginTop: Spacing[4], ...Shadows.sm },
  statItem: { alignItems: 'center' },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing[4] },
  dangerZone: { marginTop: Spacing[8], borderWidth: 1, borderRadius: Radius.lg, padding: Spacing[5] },
});
