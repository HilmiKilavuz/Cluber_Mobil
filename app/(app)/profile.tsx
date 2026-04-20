// app/(app)/profile.tsx
// Kullanıcı profili — oturum bilgisi, düzenleme, çıkış

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Divider } from '@/components/ui/Divider';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/auth/useAuth';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout, Radius, Shadows } from '@/constants/Tokens';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users/users.service';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

const editProfileSchema = z.object({
  displayName: z.string().min(2, 'Ad en az 2 karakter olmalı').max(50),
  bio: z.string().max(200, 'Bio en fazla 200 karakter olabilir').optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gerekli'),
  newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalı'),
});

type EditProfileData = z.infer<typeof editProfileSchema>;
type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export default function ProfileScreen() {
  const c = useColors();
  const { sessionQuery, logoutMutation, changePasswordMutation } = useAuth();
  const queryClient = useQueryClient();
  const user = sessionQuery.data;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['auth', 'session'], updatedUser);
      setEditModalVisible(false);
      Toast.show({ type: 'success', text1: 'Profil güncellendi' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    formState: { errors: editErrors },
    reset: resetEdit,
  } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { displayName: user?.displayName ?? '', bio: user?.bio ?? '' },
  });

  const {
    control: pwControl,
    handleSubmit: handlePwSubmit,
    formState: { errors: pwErrors },
    reset: resetPw,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabından çıkış yapmak istiyor musun?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: () => logoutMutation.mutate(),
      },
    ]);
  };

  const onEditSubmit = (data: EditProfileData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = async (data: ChangePasswordData) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      setPasswordModalVisible(false);
      resetPw();
      Toast.show({ type: 'success', text1: 'Şifre değiştirildi' });
    } catch {}
  };

  if (!user) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[Typography.displayMd, { color: c.ink }]}>Profil</Text>
        </View>

        {/* Profil kartı */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          <Avatar uri={user.avatarUrl} name={user.displayName} size={80} />
          <Text style={[Typography.headingLg, { color: c.ink, marginTop: Spacing[4] }]}>
            {user.displayName}
          </Text>
          <Text style={[Typography.bodyMd, { color: c.inkSecondary, marginTop: 2 }]}>
            {user.email}
          </Text>
          {user.bio && (
            <Text
              style={[
                Typography.bodyMd,
                {
                  color: c.inkSecondary,
                  marginTop: Spacing[3],
                  textAlign: 'center',
                },
              ]}
            >
              {user.bio}
            </Text>
          )}
          <View style={{ marginTop: Spacing[3] }}>
            <Badge label={user.role} />
          </View>
        </View>

        {/* Aksiyonlar */}
        <View style={[styles.section, { borderColor: c.border, backgroundColor: c.surface }]}>
          <MenuItem
            icon="person-outline"
            label="Profili Düzenle"
            onPress={() => {
              resetEdit({ displayName: user.displayName, bio: user.bio ?? '' });
              setEditModalVisible(true);
            }}
            color={c.ink}
          />
          <Divider />
          <MenuItem
            icon="lock-closed-outline"
            label="Şifre Değiştir"
            onPress={() => setPasswordModalVisible(true)}
            color={c.ink}
          />
          <Divider />
          <MenuItem
            icon="log-out-outline"
            label="Çıkış Yap"
            onPress={handleLogout}
            color={c.error}
            loading={logoutMutation.isPending}
          />
        </View>
      </ScrollView>

      {/* Profil düzenleme modalı */}
      <Modal visible={editModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
          <View style={styles.modalHeader}>
            <Text style={[Typography.headingMd, { color: c.ink }]}>Profili Düzenle</Text>
            <Pressable onPress={() => setEditModalVisible(false)}>
              <Ionicons name="close" size={24} color={c.ink} />
            </Pressable>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
            >
              <Controller
                control={editControl}
                name="displayName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Görüntülenecek Ad"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={editErrors.displayName?.message}
                  />
                )}
              />
              <Controller
                control={editControl}
                name="bio"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Bio"
                    placeholder="Kendinizi tanıtın..."
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value ?? ''}
                    error={editErrors.bio?.message}
                    multiline
                    numberOfLines={4}
                    containerStyle={{ marginTop: Spacing[4] }}
                  />
                )}
              />
              <Button
                label="Kaydet"
                onPress={handleEditSubmit(onEditSubmit)}
                loading={updateProfileMutation.isPending}
                fullWidth
                size="lg"
                style={{ marginTop: Spacing[8] }}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Şifre değiştirme modalı */}
      <Modal visible={passwordModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
          <View style={styles.modalHeader}>
            <Text style={[Typography.headingMd, { color: c.ink }]}>Şifre Değiştir</Text>
            <Pressable onPress={() => setPasswordModalVisible(false)}>
              <Ionicons name="close" size={24} color={c.ink} />
            </Pressable>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
            >
              <Controller
                control={pwControl}
                name="currentPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Mevcut Şifre"
                    secureTextEntry
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={pwErrors.currentPassword?.message}
                  />
                )}
              />
              <Controller
                control={pwControl}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Yeni Şifre"
                    secureTextEntry
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={pwErrors.newPassword?.message}
                    hint="En az 6 karakter"
                    containerStyle={{ marginTop: Spacing[4] }}
                  />
                )}
              />
              <Button
                label="Şifreyi Değiştir"
                onPress={handlePwSubmit(onPasswordSubmit)}
                loading={changePasswordMutation.isPending}
                fullWidth
                size="lg"
                style={{ marginTop: Spacing[8] }}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  color,
  loading,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  color: string;
  loading?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[Typography.bodyMd, { color, flex: 1, marginLeft: Spacing[3] }]}>
        {label}
      </Text>
      {!loading && <Ionicons name="chevron-forward" size={16} color={color} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  profileCard: {
    marginHorizontal: Layout.screenPaddingH,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing[6],
    alignItems: 'center',
    ...Shadows.sm,
  },
  section: {
    marginHorizontal: Layout.screenPaddingH,
    marginTop: Spacing[4],
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
  },
  modalContent: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[6],
    paddingBottom: Spacing[8],
  },
});
