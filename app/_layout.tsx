// app/_layout.tsx
// Root layout — font yükleme, providers, splash screen yönetimi

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  DMSans_400Regular_Italic,
} from '@expo-google-fonts/dm-sans';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/ui/useColorScheme';

// Splash screen'i font yüklenene kadar göster
SplashScreen.preventAutoHideAsync();

// React Query client — mobile optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 dakika
      gcTime: 1000 * 60 * 10,         // 10 dakika
      retry: 2,
      refetchOnWindowFocus: false,    // Mobile'da window focus yok
      refetchOnReconnect: true,       // Ağ gelince yenile
    },
  },
});

export default function RootLayout() {
  const scheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    'DM-Sans-Regular':  DMSans_400Regular,
    'DM-Sans-Medium':   DMSans_500Medium,
    'DM-Sans-SemiBold': DMSans_600SemiBold,
    'DM-Sans-Bold':     DMSans_700Bold,
    'DM-Sans-Italic':   DMSans_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
