// constants/Colors.ts
// Cluber Design System — Color tokens
// Web design.md ile birebir aynı renk değerleri, React Native JS formatında

export const Colors = {
  light: {
    // ── Backgrounds ───────────────────────────────────────────────────────────
    bg:          '#F5F4F0',   // Sayfa arka planı (krem-beyaz)
    bgSecondary: '#EEECEA',   // İkincil arka plan, kartlar
    surface:     '#FFFFFF',   // Yüksek kontrast yüzey (kartlar, modallar, input)

    // ── Text (Ink) ────────────────────────────────────────────────────────────
    ink:          '#111110',  // Ana metin (ılık siyah)
    inkSecondary: '#6B6A65',  // İkincil metin, açıklamalar
    inkTertiary:  '#A8A7A2',  // Placeholder, devre dışı metin

    // ── Borders ───────────────────────────────────────────────────────────────
    border:       '#E2E0DB',  // Kenar çizgisi
    borderStrong: '#C8C6C0',  // Güçlü kenar çizgisi

    // ── Accent (Primary CTA) ──────────────────────────────────────────────────
    accent:      '#111110',   // Primary buton (siyah)
    accentHover: '#2A2A28',   // Pressed state
    accentFg:    '#FFFFFF',   // Siyah buton üzeri metin

    // ── Semantic ──────────────────────────────────────────────────────────────
    success:    '#2D6A4F',
    successBg:  '#D8F3DC',
    error:      '#B5361A',
    errorBg:    '#FDECEA',
    warning:    '#9A5C18',
    warningBg:  '#FEF3CD',
  },

  dark: {
    // ── Backgrounds ───────────────────────────────────────────────────────────
    bg:          '#141414',
    bgSecondary: '#1C1C1C',
    surface:     '#242424',

    // ── Text (Ink) ────────────────────────────────────────────────────────────
    ink:          '#F0EFE9',
    inkSecondary: '#9A9891',
    inkTertiary:  '#5A5852',

    // ── Borders ───────────────────────────────────────────────────────────────
    border:       '#2E2E2C',
    borderStrong: '#404040',

    // ── Accent (dark modda krem CTA) ──────────────────────────────────────────
    accent:      '#F0EFE9',
    accentHover: '#D8D6D0',
    accentFg:    '#141414',

    // ── Semantic (dark'ta ayarlanmış) ─────────────────────────────────────────
    success:    '#4ADE80',
    successBg:  '#052E16',
    error:      '#F87171',
    errorBg:    '#450A0A',
    warning:    '#FCD34D',
    warningBg:  '#421C04',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;
