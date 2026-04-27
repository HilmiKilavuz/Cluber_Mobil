// app/(app)/clubs/[id]/settings.tsx
// Kulüp ayarları — owner/admin erişimi

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BackHeader } from '@/components/layout/BackHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Avatar } from '@/components/ui/Avatar';
import { Image } from 'expo-image';
import { useClub, useUpdateClub, useDeleteClub } from '@/hooks/clubs/useClubs';
import { useAuth } from '@/hooks/auth/useAuth';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout, Radius } from '@/constants/Tokens';
import { CLUB_CATEGORIES } from '@/types/club';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

const settingsSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  category: z.string().min(1),
  avatarUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
});
type SettingsForm = z.infer<typeof settingsSchema>;

export default function ClubSettingsScreen() {
  const c = useColors();
  const { id: clubId } = useLocalSearchParams<{ id: string }>();
  const { sessionQuery } = useAuth();
  const { data: club, isLoading } = useClub(clubId!);
  const updateMutation = useUpdateClub(clubId!);
  const deleteMutation = useDeleteClub();
  const isOwner = club?.creatorId === sessionQuery.data?.id;

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    values: { name: club?.name ?? '', description: club?.description ?? '', category: club?.category ?? '', avatarUrl: club?.avatarUrl ?? null, bannerUrl: club?.bannerUrl ?? null },
  });
  const selectedCategory = watch('category');

  const onSave = async (data: SettingsForm) => {
    try {
      await updateMutation.mutateAsync({
        name: data.name,
        description: data.description,
        category: data.category,
        avatarUrl: data.avatarUrl ?? undefined,
        bannerUrl: data.bannerUrl ?? undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: 'success', text1: 'Kulüp güncellendi.' });
    } catch {}
  };

  const handleDelete = () => {
    Alert.alert('Kulübü Sil', 'Bu işlem geri alınamaz.', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
        try {
          await deleteMutation.mutateAsync(clubId!);
          Toast.show({ type: 'success', text1: 'Kulüp silindi.' });
          router.replace('/(app)');
        } catch {}
      }},
    ]);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <ScreenWrapper>
      <BackHeader title="Kulüp Ayarları" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.mediaContainer}>
            <ImageUpload
              aspect={[16, 9]}
              shape="rounded"
              onUploadSuccess={(url) => setValue('bannerUrl', url, { shouldValidate: true })}
              containerStyle={styles.bannerUploadContainer}
              editIconPosition="top-right"
            >
              <View style={[styles.bannerPreview, { backgroundColor: c.bgSecondary, borderColor: c.border }]}>
                {watch('bannerUrl') ? (
                  <Image source={{ uri: watch('bannerUrl')! }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                ) : (
                  <Text style={[Typography.bodySm, { color: c.inkTertiary }]}>Banner Ekle (16:9)</Text>
                )}
              </View>
            </ImageUpload>

            <View style={[styles.avatarUploadWrapper, { backgroundColor: c.bg }]}>
              <ImageUpload
                aspect={[1, 1]}
                shape="circle"
                onUploadSuccess={(url) => setValue('avatarUrl', url, { shouldValidate: true })}
              >
                <Avatar uri={watch('avatarUrl') ?? undefined} name={club?.name} size={80} />
              </ImageUpload>
            </View>
          </View>
          <Controller control={control} name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Kulüp Adı" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.name?.message} />
            )}
          />
          <Controller control={control} name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Açıklama" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.description?.message} multiline numberOfLines={4} containerStyle={{ marginTop: Spacing[4] }} />
            )}
          />
          <View style={{ marginTop: Spacing[4] }}>
            <Text style={[Typography.label, { color: c.inkSecondary, marginBottom: 8 }]}>KATEGORİ</Text>
            <View style={styles.categoriesGrid}>
              {CLUB_CATEGORIES.map((cat) => (
                <Pressable key={cat} onPress={() => setValue('category', cat)}
                  style={[styles.chip, { backgroundColor: selectedCategory === cat ? c.accent : c.surface, borderColor: selectedCategory === cat ? c.accent : c.border }]}>
                  <Text style={[Typography.caption, { color: selectedCategory === cat ? c.accentFg : c.inkSecondary }]}>{cat}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Button label="Kaydet" onPress={handleSubmit(onSave)} loading={updateMutation.isPending} fullWidth size="lg" style={{ marginTop: Spacing[8] }} />
          {isOwner && (
            <View style={[styles.dangerZone, { borderColor: c.error + '40' }]}>
              <Text style={[Typography.headingSm, { color: c.error, marginBottom: Spacing[3] }]}>Tehlikeli Bölge</Text>
              <Button label="Kulübü Kalıcı Sil" onPress={handleDelete} variant="ghost" fullWidth loading={deleteMutation.isPending} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Layout.screenPaddingH, paddingTop: Spacing[4], paddingBottom: Spacing[8] },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1 },
  dangerZone: { marginTop: Spacing[8], borderWidth: 1, borderRadius: Radius.lg, padding: Spacing[5] },
  mediaContainer: {
    marginBottom: Spacing[8],
    alignItems: 'center',
  },
  bannerUploadContainer: {
    width: '100%',
    height: 160,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  bannerPreview: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarUploadWrapper: {
    marginTop: -40,
    padding: 4,
    borderRadius: Radius.full,
  },
});
