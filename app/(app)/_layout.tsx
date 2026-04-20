// app/(app)/_layout.tsx
// Ana uygulama layout — auth guard + bottom tab navigator
// useAuth hook ile oturum kontrolü yapılır

import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/ui/useColorScheme';
import { useAuth } from '@/hooks/auth/useAuth';
import { Typography } from '@/constants/Typography';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AppLayout() {
  const c = useColors();
  const { sessionQuery } = useAuth();

  // Oturum kontrol ediliyor
  if (sessionQuery.isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Oturum yoksa login'e yönlendir
  if (!sessionQuery.data) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopWidth: 1,
          borderTopColor: c.border,
          height: 83,
          paddingBottom: 28,
          paddingTop: 10,
        },
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.inkTertiary,
        tabBarLabelStyle: {
          ...Typography.caption,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Keşfet',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Etkinlikler',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Gizli rotalar — tab bar'da görünmez */}
      <Tabs.Screen name="clubs" options={{ href: null }} />
    </Tabs>
  );
}
