# Cluber Mobile — Design System Dokümantasyonu

> **Referans:** `Cluber_Web/design.md` — Web tasarım sistemiyle **tam uyum** hedeflenir.
> **Proje Adı:** Cluber Mobile
> **Platform:** iOS (birincil) & Android (ikincil)
> **Versiyon:** 1.0.0
> **Son Güncelleme:** 2026-04-17

---

## 1. Tasarım Felsefesi

Web ile **birebir aynı tasarım dili** kullanılır. React Native'in platform kısıtları dahilinde
web'in editorial minimalizmi mobil ekrana taşınır:

- **Az ama öz:** Gereksiz dekorasyon yok, içerik konuşur
- **Nefes alan boşluklar:** Generous padding — mobil ekranda özellikle önemli (parmak dostu)
- **Tipografi = Tasarım:** DM Sans, web'deki ile aynı font ailesi (`@expo-google-fonts/dm-sans`)
- **Hareket = Hayat:** Reanimated tabanlı mikro-animasyonlar; press feedback, geçiş animasyonları
- **Siyah & Krem:** Aynı achromatic palet — light mode krem-beyaz, dark mode koyu gri
- **Native hissi koru:** iOS/Android platform davranışlarına saygı göster (haptic feedback, gesture vs.)

---

## 2. Renk Paleti — `constants/Colors.ts`

Web'deki CSS custom properties, React Native'de bir JavaScript sabitleri nesnesi olarak tanımlanır.

```typescript
// constants/Colors.ts

export const Colors = {
  light: {
    // Backgrounds
    bg:          '#F5F4F0',  // Sayfa arka planı (krem-beyaz)
    bgSecondary: '#EEECEA',  // İkincil arka plan, kartlar
    surface:     '#FFFFFF',  // Yüksek kontrast yüzey (kartlar, modallar, input)

    // Text (Ink)
    ink:          '#111110',  // Ana metin (ılık siyah)
    inkSecondary: '#6B6A65',  // İkincil metin, açıklamalar
    inkTertiary:  '#A8A7A2',  // Placeholder, devre dışı metin

    // Borders
    border:       '#E2E0DB',  // Kenar çizgisi
    borderStrong: '#C8C6C0',  // Güçlü kenar çizgisi

    // Accent (Primary CTA)
    accent:      '#111110',   // Primary buton (siyah)
    accentHover: '#2A2A28',   // Pressed state
    accentFg:    '#FFFFFF',   // Siyah buton üzeri metin

    // Semantic
    success:    '#2D6A4F',
    successBg:  '#D8F3DC',
    error:      '#B5361A',
    errorBg:    '#FDECEA',
    warning:    '#9A5C18',
    warningBg:  '#FEF3CD',
  },

  dark: {
    // Backgrounds
    bg:          '#141414',
    bgSecondary: '#1C1C1C',
    surface:     '#242424',

    // Text (Ink)
    ink:          '#F0EFE9',
    inkSecondary: '#9A9891',
    inkTertiary:  '#5A5852',

    // Borders
    border:       '#2E2E2C',
    borderStrong: '#404040',

    // Accent
    accent:      '#F0EFE9',   // Dark modda krem CTA
    accentHover: '#D8D6D0',
    accentFg:    '#141414',

    // Semantic (dark'ta hafif ayarlanmış)
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
```

### Rengi Kullanma Kalıbı

```typescript
import { useColorScheme } from '@/hooks/ui/useColorScheme';
import { Colors } from '@/constants/Colors';

export function MyComponent() {
  const scheme = useColorScheme(); // 'light' | 'dark'
  const c = Colors[scheme];       // ThemeColors

  return (
    <View style={{ backgroundColor: c.bg }}>
      <Text style={{ color: c.ink }}>Merhaba</Text>
    </View>
  );
}
```

---

## 3. Tipografi

### 3.1 Font Kurulumu

```bash
npx expo install @expo-google-fonts/dm-sans expo-font
```

```typescript
// app/_layout.tsx
import {
  DM_Sans_400Regular,
  DM_Sans_500Medium,
  DM_Sans_600SemiBold,
  DM_Sans_700Bold,
  DM_Sans_400Regular_Italic,
} from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'DM-Sans-Regular': DM_Sans_400Regular,
    'DM-Sans-Medium':  DM_Sans_500Medium,
    'DM-Sans-SemiBold':DM_Sans_600SemiBold,
    'DM-Sans-Bold':    DM_Sans_700Bold,
    'DM-Sans-Italic':  DM_Sans_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return <Stack />;
}
```

### 3.2 Tipografi Ölçeği — `constants/Typography.ts`

```typescript
// constants/Typography.ts
export const Typography = {
  // Display — Hero başlıklar
  displayXl: { fontFamily: 'DM-Sans-Medium', fontSize: 40, lineHeight: 44, letterSpacing: -0.8 },
  displayLg: { fontFamily: 'DM-Sans-Medium', fontSize: 32, lineHeight: 36, letterSpacing: -0.6 },
  displayMd: { fontFamily: 'DM-Sans-Medium', fontSize: 26, lineHeight: 30, letterSpacing: -0.4 },

  // Heading — Kart ve bölüm başlıkları
  headingLg: { fontFamily: 'DM-Sans-SemiBold', fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  headingMd: { fontFamily: 'DM-Sans-SemiBold', fontSize: 18, lineHeight: 24, letterSpacing: -0.1 },
  headingSm: { fontFamily: 'DM-Sans-SemiBold', fontSize: 15, lineHeight: 20, letterSpacing: 0 },

  // Body — Gövde metni
  bodyLg: { fontFamily: 'DM-Sans-Regular', fontSize: 17, lineHeight: 26, letterSpacing: 0 },
  bodyMd: { fontFamily: 'DM-Sans-Regular', fontSize: 15, lineHeight: 23, letterSpacing: 0 },
  bodySm: { fontFamily: 'DM-Sans-Regular', fontSize: 13, lineHeight: 20, letterSpacing: 0 },

  // Label / Badge
  label:   { fontFamily: 'DM-Sans-Medium',  fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
  caption: { fontFamily: 'DM-Sans-Medium',  fontSize: 11, lineHeight: 14, letterSpacing: 0.3 },
} as const;
```

### 3.3 Tipografi Kuralları

- **Başlıklar:** Soldan hizalı (web ile aynı Motto stili)
- **Letter-spacing:** Display metinlerde negatif tracking (premium hissi)
- **UPPERCASE:** Sadece Badge ve section marker'larda kullan (`text-transform` yerine JS `.toUpperCase()`)
- **Italic:** Hero açıklama metinleri için, özellikle `DM-Sans-Italic`

---

## 4. Spacing & Layout — `constants/Spacing.ts`

```typescript
// constants/Spacing.ts
export const Spacing = {
  1:  4,    2:  8,    3:  12,
  4:  16,   5:  20,   6:  24,
  8:  32,   10: 40,   12: 48,
  16: 64,   20: 80,
} as const;

// Ekran kenar padding'leri
export const Layout = {
  screenPaddingH: 20,   // Mobil: 20px yatay padding (web'de 80px ama mobil dar)
  screenPaddingV: 16,   // Dikey iç padding
  sectionSpacing: 40,   // Bölümler arası boşluk
  cardGap:         12,  // Kartlar arası boşluk
  tabBarHeight:    83,  // iOS tab bar yüksekliği (safe area dahil)
  headerHeight:    56,  // Stack header yüksekliği
} as const;
```

### 4.1 Safe Area Kuralları

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

// Her ekranın köküne ScreenWrapper koy:
export function ScreenWrapper({ children, style }) {
  const c = useColors();
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: c.bg }, style]}
      edges={['top', 'left', 'right']}  // Bottom tab varsa 'bottom' dahil etme
    >
      {children}
    </SafeAreaView>
  );
}
```

> **Kritik:** iPhone notch/Dynamic Island için `SafeAreaView` zorunlu.
> Tab bar olan ekranlarda bottom safe area tab navigator yönetir.

---

## 5. Border Radius — `constants/Radius.ts`

```typescript
// constants/Radius.ts — Web ile aynı değerler
export const Radius = {
  sm:   6,
  md:   8,
  lg:   12,
  xl:   16,
  xxl:  20,
  full: 9999,
} as const;
```

---

## 6. Gölge (Shadow) — Platform'a Göre

React Native'de shadow iOS ve Android'de farklı çalışır:

```typescript
// constants/Shadows.ts
import { Platform } from 'react-native';

export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.10,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
  }),
} as const;
```

---

## 7. Animasyonlar & Geçişler

### 7.1 Kurulum

```bash
npx expo install react-native-reanimated
```

`babel.config.js`'e **en son plugin olarak** ekle:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // ← en sona
  };
};
```

### 7.2 Temel Animasyon Prensipleri (Web ile uyumlu)

- **Press feedback:** Butonlarda `scale(0.96)` animasyonu (web'deki `scale(1.02)` hover'ın mobil karşılığı)
- **Sayfa geçişleri:** Expo Router native stack transition (iOS'ta doğal slide)
- **Liste elemanları:** `FadeInDown` ile stagger giriş animasyonu
- **Modal:** `SlideInUp` / `FadeIn` kombinasyonu
- **Duration:** 200–400ms (mobile'da web'den biraz hızlı olmalı)
- **Easing:** `Easing.bezier(0.4, 0, 0.2, 1)` (web'deki cubic-bezier ile aynı)

### 7.3 Buton Press Animasyonu

```typescript
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';

export function AnimatedButton({ onPress, children, style }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withTiming(0.96, { duration: 100 }); }}
      onPressOut={() => { scale.value = withTiming(1,    { duration: 150 }); }}
      onPress={onPress}
    >
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
```

### 7.4 Kart Giriş Animasyonu

```typescript
import Animated, { FadeInDown } from 'react-native-reanimated';

// Liste render'ında index'e göre stagger
<Animated.View entering={FadeInDown.delay(index * 60).duration(300)}>
  <ClubCard club={club} />
</Animated.View>
```

### 7.5 Haptic Feedback (iOS)

```typescript
import * as Haptics from 'expo-haptics';

// Buton basımında
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Başarılı işlemde
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Silme / hata durumunda
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

---

## 8. Komponent Tasarım Standartları

### 8.1 Butonlar — `components/ui/Button.tsx`

**3 Varyant (web ile aynı):**

| Varyant | Açıklama | Stil |
|---------|----------|------|
| `primary` | Siyah dolgu buton (light), krem dolgu (dark) | `bg: accent`, `text: accentFg` |
| `ghost` | Sadece kenar çizgisi | `border: 1px solid border`, `bg: transparent` |
| `text` | Sadece metin, ikon arrow → | `bg: transparent`, `color: ink` |

**Boyutlar:**

| Boyut | Height | H Padding | Font Size |
|-------|--------|-----------|-----------|
| `sm`  | 36px   | 14px      | 13px/Medium |
| `md`  | 44px   | 20px      | 15px/Medium |
| `lg`  | 52px   | 24px      | 16px/SemiBold |

**Border Radius:** `Radius.md` (8px)

```typescript
// components/ui/Button.tsx — Yapı
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}
```

### 8.2 Input Alanları — `components/ui/Input.tsx`

```typescript
// Web contained style ile aynı yaklaşım
const inputStyle = {
  borderWidth: 1,
  borderColor: c.border,
  borderRadius: Radius.md,
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: c.surface,
  fontFamily: 'DM-Sans-Regular',
  fontSize: 15,
  color: c.ink,
};

// Focus state — borderColor: c.accent
```

**Input bileşeni mutlaka şunları barındırır:**
- `label` prop (üst etiket)
- `error` prop (alt hata mesajı, kırmızı)
- `placeholder` rengi `c.inkTertiary`
- `secureTextEntry` desteği (şifre alanları)
- Focus animate: border rengi değişimi

### 8.3 Kartlar — `components/ui/Card.tsx`

```typescript
const cardStyle = {
  backgroundColor: c.surface,
  borderWidth: 1,
  borderColor: c.border,
  borderRadius: Radius.lg,    // 12px
  overflow: 'hidden',
  ...Shadows.sm,
};
```

**Kart press feedback:** `scale(0.98)` + hafif opaklık azalması.

### 8.4 Badge / Tag — `components/ui/Badge.tsx`

```typescript
const badgeStyle = {
  height: 24,
  paddingHorizontal: 10,
  borderRadius: Radius.full,
  borderWidth: 1,
  borderColor: c.border,
  backgroundColor: c.bgSecondary,
  // Text:
  fontFamily: 'DM-Sans-Medium',
  fontSize: 11,
  letterSpacing: 0.5,
  textTransform: 'uppercase',  // JS: label.toUpperCase()
};
```

### 8.5 Avatar — `components/ui/Avatar.tsx`

```typescript
interface AvatarProps {
  uri?: string;           // Cloudinary URL
  name?: string;          // Baş harf fallback için
  size?: 32 | 40 | 48 | 64 | 80 | 96;
  shape?: 'circle' | 'rounded';  // 'rounded' = Radius.lg
}
```

- Resim varsa: `expo-image` ile görüntüle (blur hash placeholder desteği)
- Resim yoksa: İsmin baş harfini `c.inkSecondary` renkte göster, `c.bgSecondary` arka plan

### 8.6 Tab Bar — `components/layout/TabBar.tsx`

```
Yükseklik:     83px (safe area dahil, iOS standart)
Arka Plan:     surface + backdrop blur (iOS BlurView)
Kenar:         borderTopWidth: 1, borderColor: border
Aktif ikon:    accent rengi
Pasif ikon:    inkTertiary rengi
Font:          11px, DM-Sans-Medium
```

**Sekmeler:**
1. 🏠 **Keşfet** — `/` (kulüp listesi)
2. 📅 **Etkinlikler** — `/events`
3. 👤 **Profil** — `/profile`

### 8.7 Stack Header — `components/layout/BackHeader.tsx`

```
Yükseklik:   56px
Arka Plan:   bg/90 + blurEffect (iOS)
Kenar:       borderBottomWidth: 1, borderColor: border
Başlık:      DM-Sans-SemiBold, 17px, color: ink
Geri butonu: Ionicons "arrow-back" (Android) / "chevron-back" (iOS)
Sağ aksiyon: İsteğe bağlı (ayarlar, düzenle vb.)
```

### 8.8 Boş Durum — `components/ui/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  icon?: string;       // Ionicons icon name
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}
```

Stil: İkon büyük (48px), başlık `headingMd`, açıklama `bodyMd inkSecondary`, ortalanmış.

---

## 9. Ekran Tasarım Kalıpları

### 9.1 Liste Ekranları (Kulüpler, Etkinlikler)

```
ScreenWrapper
└── Stack.Screen (başlık, filtre butonu)
└── SearchBar (Spacing.4 margin)
└── FilterChips (yatay kaydırma)
└── FlatList
    ├── renderItem → Card (Animated FadeInDown)
    ├── keyExtractor → item.id
    ├── contentContainerStyle → paddingH: 20, paddingB: 20
    ├── ItemSeparatorComponent → <View height={12} />
    ├── ListEmptyComponent → <EmptyState />
    └── onEndReached → sayfalama (fetchNextPage)
```

### 9.2 Detay Ekranları (Kulüp, Etkinlik)

```
ScreenWrapper
└── ScrollView (nestedScrollEnabled)
    ├── Banner (Image, height: 200)
    ├── Avatar (position: absolute, bottom: -32, left: 20)
    ├── Spacer (height: 40)
    ├── Başlık + Badge
    ├── Aksiyon butonları (Katıl/Ayrıl/Ayarlar)
    ├── Sekme bar (Detay / Etkinlikler / Üyeler)
    └── Sekme içeriği
```

### 9.3 Form Ekranları (Kayıt, Kulüp Oluştur)

```
ScreenWrapper
└── KeyboardAvoidingView
    │   behavior: Platform.OS === 'ios' ? 'padding' : 'height'
    └── ScrollView (keyboardShouldPersistTaps="handled")
        ├── Başlık (displayMd)
        ├── Alt başlık (bodyMd inkSecondary)
        ├── Input alanları (Spacing.4 gap)
        └── Submit Button (fullWidth, mt: Spacing.8)
```

### 9.4 Chat Ekranı

```
ScreenWrapper (edges: ['top', 'left', 'right'])
└── BackHeader ("Kulüp Sohbeti")
└── KeyboardAvoidingView (flex: 1)
    ├── FlatList (inverted — yeni mesajlar altta)
    │   └── MessageItem
    └── MessageInput (border-top, SafeArea-aware)
         ├── TextInput (multiline, max: 4 satır)
         └── Gönder butonu (accent rengi)
```

**MessageItem alternating style:**
- Kendi mesajım: `alignSelf: 'flex-end'`, `bg: accent`, `color: accentFg`
- Diğerinin mesajı: `alignSelf: 'flex-start'`, `bg: bgSecondary`, `color: ink`

---

## 10. Navigasyon Tasarımı

### 10.1 Navigasyon Yapısı

```
Root Stack (_layout.tsx)
├── (auth) Group — korumasız
│   ├── login        → Giriş ekranı
│   ├── register     → Kayıt ekranı
│   └── verify-email → Doğrulama kodu
└── (app) Group — JWT gerektirir
    ├── Tabs (_layout.tsx)
    │   ├── index        → Keşfet (kulüp listesi)
    │   ├── events       → Etkinlikler
    │   └── profile      → Profil
    └── Stack (tabs üzeri)
        └── clubs/
            ├── create   → Kulüp oluştur
            └── [id]/
                ├── index    → Kulüp detay
                ├── chat     → Sohbet
                ├── events   → Etkinlikler
                ├── members  → Üyeler
                ├── settings → Ayarlar
                └── admin    → Admin paneli
```

### 10.2 Transition Animasyonları

```typescript
// app/(app)/_layout.tsx — Stack screen options
<Stack
  screenOptions={{
    animation: 'slide_from_right',        // iOS native davranımı
    headerShown: false,                    // Custom header kullanıyoruz
    contentStyle: { backgroundColor: c.bg },
  }}
/>
```

### 10.3 Tab Bar Aktif Göstergesi

Aktif sekme: ikon + label `c.accent` rengi, hafif `c.bgSecondary` pill arka plan.
Pasif sekme: ikon + label `c.inkTertiary` rengi.

---

## 11. Dark Mode

### 11.1 Sistem Teması Takibi

```typescript
// hooks/ui/useColorScheme.ts
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  return useRNColorScheme() ?? 'light';
}

// Kullanım kolaylığı için:
export function useColors() {
  const scheme = useColorScheme();
  return Colors[scheme];
}
```

### 11.2 Dark Mode Uygulaması

- **Arka plan:** `c.bg` — dark'ta `#141414`
- **Kartlar:** `c.surface` — dark'ta `#242424`
- **Metin:** `c.ink` — dark'ta `#F0EFE9` (krem)
- **Accent CTA:** Light'ta siyah, dark'ta krem — buton rengi otomatik döner
- **StatusBar:** Light mode'da `dark-content`, dark mode'da `light-content`

```typescript
import { StatusBar } from 'expo-status-bar';
const scheme = useColorScheme();

<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
```

---

## 12. Uygulama Adı & Marka Standardizasyonu

| Element | Değer |
|---------|-------|
| Uygulama Adı | `Cluber` |
| Slogan | `Topluluklar, Burada Yaşıyor.` |
| Logo Tipi | `DM-Sans-Bold`, 700 weight |
| Logo Rengi | Light: `#111110` / Dark: `#F0EFE9` |
| Icon (app icon) | Koyu arka plan + "C" harfi veya özel logo asset |
| Bundle ID (iOS) | `com.cluber.mobile` |
| Package (Android) | `com.cluber.mobile` |

### App Store / Play Store Hazırlığı (EAS Build)

```json
// app.json
{
  "expo": {
    "name": "Cluber",
    "slug": "cluber-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "splash": {
      "backgroundColor": "#F5F4F0"
    },
    "ios": {
      "bundleIdentifier": "com.cluber.mobile",
      "supportsTablet": false
    },
    "android": {
      "package": "com.cluber.mobile",
      "adaptiveIcon": {
        "backgroundColor": "#111110"
      }
    }
  }
}
```

---

## 13. Erişilebilirlik (Accessibility)

- Her interaktif element `accessibilityLabel` prop'u almalı
- `accessibilityRole` tanımlanmalı (`button`, `link`, `image` vb.)
- Minimum dokunma alanı: **44×44px** (Apple HIG standardı)
- Renk kontrastı: `ink` üzerinde `bg` — WCAG AA uyumlu
- `reduceMotion` kullanıcılar için animasyonları kısaltma:

```typescript
import { useReduceMotion } from 'react-native-reanimated';

const reduceMotion = useReduceMotion();
const duration = reduceMotion ? 0 : 300;
```

---

## 14. Uygulama Sırası (Adım Adım Plan)

Her adımda **yalnızca tasarım** değişir, işlevsel mantık korunur. Web design.md ile aynı felsefe:

1. **[✅]** `design.md` — Bu doküman
2. **[ ]** `constants/Colors.ts` — Renk token'ları
3. **[ ]** `constants/Typography.ts` — Tipografi ölçeği
4. **[ ]** `constants/Spacing.ts`, `Radius.ts`, `Shadows.ts` — Spacing & görsel token'lar
5. **[ ]** `components/ui/Button.tsx` — Evrensel buton bileşeni
6. **[ ]** `components/ui/Input.tsx` — Form input bileşeni
7. **[ ]** `components/ui/Card.tsx`, `Badge.tsx`, `Avatar.tsx` — Atom bileşenler
8. **[ ]** `components/layout/ScreenWrapper.tsx` — SafeArea sarmalayıcı
9. **[ ]** `components/layout/TabBar.tsx` — Özel tab bar
10. **[ ]** Auth ekranları (login, register, verify-email)
11. **[ ]** Keşfet ekranı — `ClubCard` + liste
12. **[ ]** Kulüp detay ekranı — banner, avatar, sekmeler
13. **[ ]** Kulüp oluşturma formu
14. **[ ]** Chat ekranı — Socket.IO + FlatList inverted
15. **[ ]** Etkinlikler ekranı — `EventCard` + liste
16. **[ ]** Profil ekranı
17. **[ ]** Tüm dark mode token kontrolü
18. **[ ]** Animasyon polish (Reanimated geçişler)
