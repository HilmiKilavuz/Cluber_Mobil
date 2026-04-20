// hooks/ui/useColorScheme.ts
// Sistem tema tercihini okur ve Colors token'larını döner

import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export type ColorScheme = 'light' | 'dark';

/** 'light' veya 'dark' döner — null olma ihtimaline karşı 'light' fallback */
export function useColorScheme(): ColorScheme {
  return (useRNColorScheme() as ColorScheme) ?? 'light';
}

/** Aktif temaya ait Colors nesnesini döner — component'lerde c.ink gibi kullan */
export function useColors() {
  const scheme = useColorScheme();
  return Colors[scheme];
}
