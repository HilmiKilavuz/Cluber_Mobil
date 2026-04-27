// app/(auth)/login.tsx
// Giriş ekranı — react-hook-form + zod validasyon

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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Link, router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/auth/useAuth';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout } from '@/constants/Tokens';

const loginSchema = z.object({
  email: z.string().min(1, 'E-posta gereklidir').email('Geçerli bir e-posta giriniz'),
  password: z.string().min(1, 'Şifre gereklidir'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const c = useColors();
  const { loginMutation } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      router.replace('/(app)');
    } catch {
      // Hata axiosInstance interceptor tarafından toast olarak gösterilir
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / Başlık */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <View style={styles.header}>
              <Text style={[Typography.displayLg, { color: c.ink, fontFamily: 'DM-Sans-Bold' }]}>
                Cluber
              </Text>
              <Text style={[Typography.bodyMd, { color: c.inkSecondary, marginTop: Spacing[2] }]}>
                Topluluğuna giriş yap
              </Text>
            </View>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.form}>
            <View>
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
                    containerStyle={{ marginTop: Spacing[4] }}
                  />
                )}
              />

              <Button
                label="Giriş Yap"
                onPress={handleSubmit(onSubmit)}
                loading={loginMutation.isPending}
                fullWidth
                size="lg"
                style={{ marginTop: Spacing[8] }}
              />
            </View>
          </Animated.View>

          {/* Kayıt ol linki */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <View style={styles.footer}>
              <Text style={[Typography.bodyMd, { color: c.inkSecondary }]}>
                Hesabın yok mu?{' '}
              </Text>
              <Link href={'/(auth)/register' as any} asChild>
                <Pressable accessibilityRole="link">
                  <Text style={[Typography.bodyMd, { color: c.ink, fontFamily: 'DM-Sans-SemiBold' }]}>
                    Kayıt Ol
                  </Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[12],
    paddingBottom: Spacing[8],
  },
  header: {
    marginBottom: Spacing[10],
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
