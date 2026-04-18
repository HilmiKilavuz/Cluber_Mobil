// hooks/ui/useColorScheme.ts
// Sistem tema tercihini okur ve Colors token'larını döner

import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors, type ThemeColors } from '@/constants/Colors';

/** 'light' veya 'dark' döner — null olma ihtimaline karşı 'light' fallback */
export function useColorScheme() {
  return useRNColorScheme() ?? 'light';
}

/** Aktif temaya ait Colors nesnesini döner — component'lerde c.ink gibi kullan */
export function useColors(): ThemeColors {
  const scheme = useColorScheme();
  return Colors[scheme];
}
