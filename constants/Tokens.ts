// constants/Tokens.ts
// Cluber Design System — Spacing, Radius, Shadow tokens

import { Platform } from 'react-native';

// ── Spacing ───────────────────────────────────────────────────────────────────
export const Spacing = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

// ── Layout ────────────────────────────────────────────────────────────────────
export const Layout = {
  screenPaddingH: 20,   // Ekran yatay kenar boşluğu
  screenPaddingV: 16,   // Ekran dikey iç padding
  sectionSpacing: 40,   // Bölümler arası boşluk
  cardGap:        12,   // Kartlar arası boşluk
  tabBarHeight:   83,   // iOS tab bar (safe area dahil)
  headerHeight:   56,   // Stack header yüksekliği
} as const;

// ── Border Radius ─────────────────────────────────────────────────────────────
export const Radius = {
  sm:   6,
  md:   8,
  lg:   12,
  xl:   16,
  xxl:  20,
  full: 9999,
} as const;

// ── Shadows (Platform'a göre) ─────────────────────────────────────────────────
export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.10,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {},
  }),
} as const;
