// app/(auth)/register.tsx
// Kayıt ekranı — e-posta, görüntülenecek ad, şifre

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
import { Link, router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BackHeader } from '@/components/layout/BackHeader';
import { useAuth } from '@/hooks/auth/useAuth';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout } from '@/constants/Tokens';

const registerSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Ad en az 2 karakter olmalı')
    .max(50, 'Ad en fazla 50 karakter olabilir'),
  email: z.string().min(1, 'E-posta gereklidir').email('Geçerli bir e-posta giriniz'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalı')
    .max(100, 'Şifre çok uzun'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const c = useColors();
  const { registerMutation } = useAuth();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      // Kayıt başarılı → e-posta doğrulama ekranına yönlendir
      router.push({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathname: '/(auth)/verify-email' as any,
        params: { email: data.email },
      });
    } catch {
      // Hata interceptor tarafından gösterilir
    }
  };

  return (
    <ScreenWrapper>
      <BackHeader title="Kayıt Ol" />
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
            <Text style={[Typography.displayMd, { color: c.ink }]}>
              Hesap Oluştur
            </Text>
            <Text
              style={[
                Typography.bodyMd,
                { color: c.inkSecondary, marginTop: Spacing[2] },
              ]}
            >
              Kayıt olduktan sonra e-postanı doğrulaman gerekecek.
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Görüntülenecek Ad"
                  placeholder="Adın Soyadın"
                  autoCapitalize="words"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.displayName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-posta"
                  placeholder="ornek@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.email?.message}
                  containerStyle={{ marginTop: Spacing[4] }}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Şifre"
                  placeholder="••••••••"
                  secureTextEntry
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                  hint="En az 6 karakter"
                  containerStyle={{ marginTop: Spacing[4] }}
                />
              )}
            />

            <Button
              label="Kayıt Ol"
              onPress={handleSubmit(onSubmit)}
              loading={registerMutation.isPending}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing[8] }}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[Typography.bodyMd, { color: c.inkSecondary }]}>
              Zaten hesabın var mı?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable accessibilityRole="link">
                <Text
                  style={[
                    Typography.bodyMd,
                    { color: c.ink, fontFamily: 'DM-Sans-SemiBold' },
                  ]}
                >
                  Giriş Yap
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[6],
    paddingBottom: Spacing[8],
  },
  header: {
    marginBottom: Spacing[8],
  },
  form: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[8],
  },
});
