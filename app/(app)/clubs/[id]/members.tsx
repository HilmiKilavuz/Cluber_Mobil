// app/(app)/clubs/[id]/members.tsx
// Üye listesi ekranı

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BackHeader } from '@/components/layout/BackHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useClub, useClubMembers, useRemoveMember } from '@/hooks/clubs/useClubs';
import { useAuth } from '@/hooks/auth/useAuth';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout } from '@/constants/Tokens';
import type { ClubMember } from '@/types/club';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Sahip',
  ADMIN: 'Admin',
  MODERATOR: 'Moderatör',
  MEMBER: 'Üye',
};

export default function MembersScreen() {
  const c = useColors();
  const { id: clubId } = useLocalSearchParams<{ id: string }>();
  const { sessionQuery } = useAuth();
  const currentUserId = sessionQuery.data?.id;

  const { data: club } = useClub(clubId!);
  const { data: members, isLoading } = useClubMembers(clubId!);
  const removeMemberMutation = useRemoveMember(clubId!);

  const isOwner = club?.creatorId === currentUserId;

  const handleRemove = (member: ClubMember) => {
    Alert.alert(
      'Üyeyi Çıkar',
      `${member.user?.displayName ?? 'Bu üyeyi'} kulüpten çıkarmak istiyor musun?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMemberMutation.mutateAsync(member.userId);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Toast.show({ type: 'success', text1: 'Üye çıkarıldı.' });
            } catch {}
          },
        },
      ],
    );
  };

  const renderMember = ({ item, index }: { item: ClubMember; index: number }) => (
    <>
      <View style={styles.memberRow}>
        <Avatar
          uri={item.user?.avatarUrl}
          name={item.user?.displayName}
          size={48}
        />
        <View style={{ flex: 1, marginLeft: Spacing[3] }}>
          <Text style={[Typography.headingSm, { color: c.ink }]}>
            {item.user?.displayName ?? 'Kullanıcı'}
          </Text>
          <Text style={[Typography.caption, { color: c.inkTertiary, marginTop: 2 }]}>
            {ROLE_LABELS[item.role] ?? item.role}
          </Text>
        </View>
        {item.role !== 'OWNER' && (
          <Badge
            label={ROLE_LABELS[item.role] ?? item.role}
            variant={item.role === 'ADMIN' ? 'info' : 'default'}
          />
        )}
        {item.role === 'OWNER' && (
          <Ionicons name="shield" size={18} color={c.accent} />
        )}
        {isOwner && item.userId !== currentUserId && item.role !== 'OWNER' && (
          <Button
            label="Çıkar"
            onPress={() => handleRemove(item)}
            variant="text"
            size="sm"
            style={{ marginLeft: Spacing[2] }}
          />
        )}
      </View>
      {index < (members?.length ?? 0) - 1 && <Divider />}
    </>
  );

  return (
    <ScreenWrapper>
      <BackHeader title={`Üyeler (${members?.length ?? 0})`} />
      {isLoading ? (
        <LoadingSpinner message="Üyeler yükleniyor..." />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={renderMember}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="Üye bulunamadı"
              description="Bu kulüpte henüz üye yok."
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[2],
    paddingBottom: Spacing[8],
    flexGrow: 1,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[4],
  },
});
