// app/(app)/_layout.tsx
// Ana uygulama layout — auth guard + bottom tab navigator

import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';

// useAuth hook buraya import edilecek — şimdilik stub
function useAuthGuard() {
  // TODO: return { isLoading, isAuthenticated } from useAuth hook
  return { isLoading: false, isAuthenticated: true };
}

export default function AppLayout() {
  const c = useColors();
  const { isLoading, isAuthenticated } = useAuthGuard();

  // Oturum kontrol ediliyor
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}>
        <ActivityIndicator color={c.accent} />
      </View>
    );
  }

  // Oturum yoksa login'e yönlendir
  if (!isAuthenticated) {
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
    </Tabs>
  );
}
