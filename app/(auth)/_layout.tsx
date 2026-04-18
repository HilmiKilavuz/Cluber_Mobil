// app/(auth)/_layout.tsx
// Auth ekranları için Stack navigator — login, register, verify-email

import { Stack } from 'expo-router';
import { useColors } from '@/hooks/ui/useColorScheme';

export default function AuthLayout() {
  const c = useColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: c.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verify-email" />
    </Stack>
  );
}
