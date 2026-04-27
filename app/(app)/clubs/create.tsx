// app/(app)/clubs/create.tsx
// Kulüp oluşturma formu

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BackHeader } from '@/components/layout/BackHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Avatar } from '@/components/ui/Avatar';
import { Image } from 'expo-image';
import { useCreateClub } from '@/hooks/clubs/useClubs';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout, Radius } from '@/constants/Tokens';
import { CLUB_CATEGORIES } from '@/types/club';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

const createClubSchema = z.object({
  name: z.string().min(3, 'Kulüp adı en az 3 karakter olmalı').max(100),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı').max(500),
  category: z.string().min(1, 'Kategori seçin'),
  avatarUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
});

type CreateClubFormData = z.infer<typeof createClubSchema>;

export default function CreateClubScreen() {
  const c = useColors();
  const createClubMutation = useCreateClub();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateClubFormData>({
    resolver: zodResolver(createClubSchema),
    defaultValues: { name: '', description: '', category: '', avatarUrl: null, bannerUrl: null },
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: CreateClubFormData) => {
    try {
      const club = await createClubMutation.mutateAsync({
        name: data.name,
        description: data.description,
        category: data.category,
        avatarUrl: data.avatarUrl ?? undefined,
        bannerUrl: data.bannerUrl ?? undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: 'success', text1: 'Kulüp oluşturuldu!' });
      router.replace(`/(app)/clubs/${club.id}` as any);
    } catch {}
  };

  return (
    <ScreenWrapper>
      <BackHeader title="Kulüp Oluştur" />
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
            <Text style={[Typography.displayMd, { color: c.ink }]}>Yeni Kulüp</Text>
            <Text style={[Typography.bodyMd, { color: c.inkSecondary, marginTop: Spacing[2] }]}>
              Topluluğunu oluşturmak için bilgileri doldur.
            </Text>
          </View>

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
                <Avatar uri={watch('avatarUrl') ?? undefined} size={80} />
              </ImageUpload>
            </View>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Kulüp Adı"
                placeholder="örn. Fotoğrafçılık Kulübü"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Açıklama"
                placeholder="Kulübünüzü tanıtın..."
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.description?.message}
                multiline
                numberOfLines={4}
                containerStyle={{ marginTop: Spacing[4] }}
              />
            )}
          />

          {/* Kategori seçici */}
          <View style={{ marginTop: Spacing[4] }}>
            <Text style={[Typography.label, { color: c.inkSecondary, marginBottom: 8 }]}>
              KATEGORİ
            </Text>
            {errors.category && (
              <Text style={[Typography.caption, { color: c.error, marginBottom: 6 }]}>
                {errors.category.message}
              </Text>
            )}
            <View style={styles.categoriesGrid}>
              {CLUB_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setValue('category', cat)}
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
                      },
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Button
            label="Kulübü Oluştur"
            onPress={handleSubmit(onSubmit)}
            loading={createClubMutation.isPending}
            fullWidth
            size="lg"
            style={{ marginTop: Spacing[8] }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[6],
    paddingBottom: Spacing[8],
  },
  header: {
    marginBottom: Spacing[6],
  },
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
});
