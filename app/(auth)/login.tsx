// app/(auth)/login.tsx
// Giriş ekranı — placeholder, useAuth hook bağlanınca doldurulacak

import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Tokens';

export default function LoginScreen() {
  const c = useColors();

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[Typography.displayMd, { color: c.ink }]}>Cluber</Text>
      <Text style={[Typography.bodyMd, { color: c.inkSecondary, marginTop: Spacing[2] }]}>
        Giriş ekranı — yakında
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[5],
  },
});
