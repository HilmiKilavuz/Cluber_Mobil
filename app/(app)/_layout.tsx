// app/(app)/_layout.tsx
// Ana uygulama stack yapısı — sekmeler ve iç sayfalar

import { Stack } from 'expo-router';
import { useColors } from '@/hooks/ui/useColorScheme';

export default function AppLayout() {
  const c = useColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: c.bg },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
