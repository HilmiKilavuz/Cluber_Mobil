// app/(auth)/verify-email.tsx
// E-posta doğrulama ekranı — 6 haneli kod

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BackHeader } from '@/components/layout/BackHeader';
import { useAuth } from '@/hooks/auth/useAuth';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout } from '@/constants/Tokens';
import Toast from 'react-native-toast-message';

const verifySchema = z.object({
  code: z
    .string()
    .min(6, 'Kod 6 haneli olmalıdır')
    .max(6, 'Kod 6 haneli olmalıdır')
    .regex(/^\d+$/, 'Sadece rakam girin'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export default function VerifyEmailScreen() {
  const c = useColors();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyEmailMutation } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (data: VerifyFormData) => {
    if (!email) return;
    try {
      await verifyEmailMutation.mutateAsync({ email, code: data.code });
      Toast.show({
        type: 'success',
        text1: 'Hoş geldiniz!',
        text2: 'E-posta doğrulama başarılı.',
      });
      router.replace('/(app)');
    } catch {
      // Hata interceptor tarafından gösterilir
    }
  };

  return (
    <ScreenWrapper>
      <BackHeader title="E-posta Doğrulama" />
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
              Kodu Gir
            </Text>
            <Text
              style={[
                Typography.bodyMd,
                { color: c.inkSecondary, marginTop: Spacing[2] },
              ]}
            >
              {email
                ? `${email} adresine gönderilen 6 haneli kodu gir.`
                : 'E-posta adresine gönderilen 6 haneli kodu gir.'}
            </Text>
          </View>

          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Doğrulama Kodu"
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.code?.message}
              />
            )}
          />

          <Button
            label="Doğrula"
            onPress={handleSubmit(onSubmit)}
            loading={verifyEmailMutation.isPending}
            fullWidth
            size="lg"
            style={{ marginTop: Spacing[8] }}
          />

          <Text
            style={[
              Typography.bodySm,
              {
                color: c.inkTertiary,
                textAlign: 'center',
                marginTop: Spacing[6],
              },
            ]}
          >
            Kod gelmedi mi? Spam klasörünü kontrol et ya da birkaç dakika bekle.
          </Text>
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
});
