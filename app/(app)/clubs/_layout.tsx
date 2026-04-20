// app/(app)/clubs/_layout.tsx
// Kulüp stack navigator

import { Stack } from 'expo-router';
import { useColors } from '@/hooks/ui/useColorScheme';

export default function ClubsLayout() {
  const c = useColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: c.bg },
      }}
    />
  );
}
