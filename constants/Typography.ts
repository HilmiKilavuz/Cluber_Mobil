// constants/Typography.ts
// Cluber Design System — Typography scale (DM Sans)
// Web design.md'deki ölçek, React Native lineHeight & fontSize formatında

export const Typography = {
  // ── Display — Hero başlıklar ───────────────────────────────────────────────
  displayXl: { fontFamily: 'DM-Sans-Medium',   fontSize: 40, lineHeight: 44, letterSpacing: -0.8 },
  displayLg: { fontFamily: 'DM-Sans-Medium',   fontSize: 32, lineHeight: 36, letterSpacing: -0.6 },
  displayMd: { fontFamily: 'DM-Sans-Medium',   fontSize: 26, lineHeight: 30, letterSpacing: -0.4 },

  // ── Heading — Kart ve bölüm başlıkları ────────────────────────────────────
  headingLg: { fontFamily: 'DM-Sans-SemiBold', fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  headingMd: { fontFamily: 'DM-Sans-SemiBold', fontSize: 18, lineHeight: 24, letterSpacing: -0.1 },
  headingSm: { fontFamily: 'DM-Sans-SemiBold', fontSize: 15, lineHeight: 20, letterSpacing:  0.0 },

  // ── Body — Gövde metni ────────────────────────────────────────────────────
  bodyLg:    { fontFamily: 'DM-Sans-Regular',  fontSize: 17, lineHeight: 26, letterSpacing:  0.0 },
  bodyMd:    { fontFamily: 'DM-Sans-Regular',  fontSize: 15, lineHeight: 23, letterSpacing:  0.0 },
  bodySm:    { fontFamily: 'DM-Sans-Regular',  fontSize: 13, lineHeight: 20, letterSpacing:  0.0 },

  // ── Label / Badge ─────────────────────────────────────────────────────────
  label:     { fontFamily: 'DM-Sans-Medium',   fontSize: 12, lineHeight: 16, letterSpacing:  0.5 },
  caption:   { fontFamily: 'DM-Sans-Medium',   fontSize: 11, lineHeight: 14, letterSpacing:  0.3 },
} as const;
