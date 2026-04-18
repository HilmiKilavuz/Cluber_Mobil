// app/(app)/events.tsx
// Etkinlikler ekranı (placeholder)

import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Tokens';

export default function EventsScreen() {
  const c = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[Typography.headingLg, { color: c.ink }]}>Etkinlikler</Text>
        <Text style={[Typography.bodySm, { color: c.inkSecondary, marginTop: Spacing[1] }]}>
          Yaklaşan etkinlikleri keşfet
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
});
