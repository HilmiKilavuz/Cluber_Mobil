// app/(app)/events/create.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BackHeader } from '@/components/layout/BackHeader';
import { EventForm } from '@/components/events/EventForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/auth/useAuth';
import { useJoinedClubs } from '@/hooks/clubs/useClubs';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout, Radius } from '@/constants/Tokens';
import { Avatar } from '@/components/ui/Avatar';

export default function CreateEventScreen() {
  const c = useColors();
  const { sessionQuery } = useAuth();
  const user = sessionQuery.data;

  const { data: joinedClubs, isLoading } = useJoinedClubs();
  const ownedClubs = joinedClubs?.filter((club) => club.creatorId === user?.id) || [];

  const [selectedClubId, setSelectedClubId] = useState<string>('');

  useEffect(() => {
    if (ownedClubs.length > 0 && !selectedClubId) {
      setSelectedClubId(ownedClubs[0].id);
    }
  }, [ownedClubs, selectedClubId]);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <BackHeader title="Etkinlik Oluştur" />
        <LoadingSpinner />
      </ScreenWrapper>
    );
  }

  if (ownedClubs.length === 0) {
    return (
      <ScreenWrapper>
        <BackHeader title="Etkinlik Oluştur" />
        <EmptyState
          icon="alert-circle-outline"
          title="Yetkiniz Yok"
          description="Etkinlik oluşturabilmek için bir kulübün kurucusu olmanız gerekmektedir."
          action={{
            label: 'Yeni Kulüp Kur',
            onPress: () => router.push('/(app)/clubs/create' as any),
          }}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <BackHeader title="Etkinlik Oluştur" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[Typography.displayMd, { color: c.ink }]}>Yeni Etkinlik</Text>
            <Text style={[Typography.bodyMd, { color: c.inkSecondary, marginTop: Spacing[2] }]}>
              Üyesi olduğunuz kulüp adına etkinlik planlayın.
            </Text>
          </View>

          <View style={styles.clubSelectionSection}>
            <Text style={[Typography.label, { color: c.inkSecondary, marginBottom: Spacing[3] }]}>
              HANGİ KULÜP ADINA OLUŞTURULACAK?
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.clubsScroll}>
              {ownedClubs.map((club) => {
                const isSelected = selectedClubId === club.id;
                return (
                  <Pressable
                    key={club.id}
                    onPress={() => setSelectedClubId(club.id)}
                    style={[
                      styles.clubChip,
                      {
                        backgroundColor: isSelected ? c.accent : c.surface,
                        borderColor: isSelected ? c.accent : c.border,
                      },
                    ]}
                  >
                    <Avatar uri={club.avatarUrl ?? undefined} size={32} name={club.name} />
                    <Text
                      style={[
                        Typography.bodySm,
                        {
                          fontFamily: isSelected ? 'DM-Sans-SemiBold' : 'DM-Sans-Medium',
                          color: isSelected ? c.accentFg : c.ink,
                          marginLeft: Spacing[2],
                        },
                      ]}
                    >
                      {club.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {selectedClubId ? (
            <EventForm
              clubId={selectedClubId}
              onSuccess={() => {
                router.push(`/(app)/clubs/${selectedClubId}/events` as any);
              }}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[4],
    paddingBottom: Spacing[10],
  },
  header: {
    marginBottom: Spacing[6],
  },
  clubSelectionSection: {
    marginBottom: Spacing[8],
  },
  clubsScroll: {
    gap: Spacing[3],
  },
  clubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.full,
    borderWidth: 1,
  },
});
