# Cluber Mobile — Agent Dokümantasyonu

> Bu dosya, yeni bir chat/agent oturumu açıldığında projeyi anında kavramak amacıyla hazırlanmıştır.
> `.gitignore`'a eklenmiştir, GitHub'a **push edilmez**.

---

## 1. Projenin Amacı

**Cluber Mobile**, üniversite veya topluluk kulüplerini dijital ortamda yönetmeye yarayan **iOS & Android** uygulamasıdır. Web uygulamasıyla (`Cluber_Web`) **aynı backend'i** (`Cluber_Backend`) paylaşır — tüm özellikler mobilde de mevcut olacaktır.

Temel hedefler:
- Kullanıcılar **kulüp oluşturabilir**, katılabilir ve yönetebilir.
- Kulüp içinde **gerçek zamanlı sohbet** (Socket.IO) yapılabilir.
- Kulüplere bağlı **etkinlikler** oluşturulabilir ve RSVP takibi yapılabilir.
- **JWT tabanlı kimlik doğrulama** — token `expo-secure-store` ile güvenli şekilde saklanır.
- Uygulama Türkçe arayüzle çalışmaktadır.
- **iOS & Android** çift platform desteği; iOS fiziksel cihaz birincil test ortamıdır.

---

## 2. Teknoloji Stack'i

| Katman             | Teknoloji                                                     |
|--------------------|---------------------------------------------------------------|
| Framework          | **Expo SDK 52+** (Managed Workflow)                          |
| Navigasyon         | **Expo Router v4** (dosya tabanlı routing, Next.js benzeri)  |
| UI Dili            | **TypeScript 5**, **React Native**                            |
| Stil               | **React Native StyleSheet** + design token sabitleri         |
| İkonlar            | **@expo/vector-icons** (Ionicons / MaterialIcons)            |
| HTTP İstemcisi     | **Axios** (`axiosInstance` wrapper — web ile aynı pattern)   |
| Sunucu State       | **@tanstack/react-query v5** (queries + mutations)            |
| Global State       | **Zustand**                                                   |
| Form Yönetimi      | **react-hook-form** + **Zod** (validation)                   |
| Gerçek Zamanlı     | **Socket.IO Client v4**                                       |
| Toast Bildirimleri | **react-native-toast-message**                                |
| Tarih İşleme       | **date-fns**                                                  |
| Auth Token         | **expo-secure-store** (localStorage yerine, güvenli depo)    |
| Animasyonlar       | **react-native-reanimated v3**                               |
| Görseller          | **expo-image** (optimized image loading)                     |
| Medya Yükleme      | **expo-image-picker** + **expo-document-picker**             |
| Font               | **@expo-google-fonts/dm-sans**                               |
| Splash / Icon      | **expo-splash-screen**, **expo-status-bar**                  |

---

## 3. Mimari & Klasör Yapısı

```
Cluber_Mobil/
├── app/                        # Expo Router — dosya tabanlı routing
│   ├── _layout.tsx             # Root layout (font yükleme, Providers, auth guard)
│   ├── index.tsx               # Giriş noktası (oturum durumuna göre yönlendirir)
│   ├── (auth)/                 # Auth group — korumasız rotalar
│   │   ├── _layout.tsx         # Auth stack layout
│   │   ├── login.tsx           # Giriş ekranı
│   │   ├── register.tsx        # Kayıt ekranı
│   │   └── verify-email.tsx    # E-posta doğrulama ekranı
│   └── (app)/                  # Ana uygulama group — JWT gerektirir
│       ├── _layout.tsx         # Tab navigator layout (bottom tabs)
│       ├── index.tsx           # Ana sayfa (Keşfet — kulüp listesi)
│       ├── events.tsx          # Etkinlikler listesi
│       ├── profile.tsx         # Kullanıcı profili
│       └── clubs/
│           ├── create.tsx      # Kulüp oluşturma formu
│           └── [id]/
│               ├── index.tsx   # Kulüp detay sayfası
│               ├── chat.tsx    # Kulüp sohbet ekranı (Socket.IO)
│               ├── events.tsx  # Kulüp etkinlikleri
│               ├── members.tsx # Üye listesi
│               ├── settings.tsx# Kulüp ayarları (owner/admin)
│               └── admin.tsx   # Kulüp admin paneli (owner only)
├── components/                 # Yeniden kullanılabilir UI bileşenleri
│   ├── auth/
│   │   ├── AuthHeader.tsx      # Auth ekranları üst başlık
│   │   ├── LoginForm.tsx       # Giriş formu
│   │   ├── RegisterForm.tsx    # Kayıt formu
│   │   └── VerifyEmailForm.tsx # E-posta doğrulama formu
│   ├── clubs/
│   │   ├── ClubCard.tsx        # Kulüp özet kartı (liste görünümü)
│   │   ├── ClubForm.tsx        # Kulüp oluşturma/düzenleme formu
│   │   ├── MemberCard.tsx      # Üye kartı
│   │   └── ClubHeader.tsx      # Kulüp detay üst bölümü (banner, avatar)
│   ├── events/
│   │   ├── EventCard.tsx       # Etkinlik özet kartı
│   │   └── EventForm.tsx       # Etkinlik oluşturma/düzenleme formu
│   ├── chat/
│   │   ├── ChatWindow.tsx      # Sohbet penceresi (FlatList + input)
│   │   └── MessageItem.tsx     # Tekil mesaj bileşeni
│   ├── profile/
│   │   ├── ProfileHeader.tsx   # Profil üst bölümü
│   │   ├── EditProfileModal.tsx# Profil düzenleme modalı
│   │   └── ChangePasswordModal.tsx
│   ├── layout/
│   │   ├── ScreenWrapper.tsx   # SafeAreaView + StatusBar sarmalayıcı
│   │   ├── TabBar.tsx          # Özelleştirilmiş bottom tab bar
│   │   └── BackHeader.tsx      # Stack ekranı başlığı (geri butonu)
│   └── ui/                     # Atom UI bileşenleri (design system)
│       ├── Button.tsx          # Primary / Ghost / Text varyantlı buton
│       ├── Input.tsx           # Metin girdi alanı (label + error)
│       ├── Card.tsx            # Kart sarmalayıcı
│       ├── Badge.tsx           # Kategori / rol etiketi
│       ├── Avatar.tsx          # Kullanıcı / kulüp avatarı
│       ├── Divider.tsx         # Ayırıcı çizgi
│       ├── LoadingSpinner.tsx  # Yükleme göstergesi
│       ├── EmptyState.tsx      # Boş durum gösterimi
│       └── ImageUpload.tsx     # Resim seçme + yükleme bileşeni
├── hooks/                      # Custom React hook'ları
│   ├── auth/useAuth.ts         # Oturum, login, register, logout, verifyEmail
│   ├── clubs/useClubs.ts       # Kulüp CRUD + join/leave hook'ları
│   ├── events/useEvents.ts     # Etkinlik CRUD + RSVP hook'ları
│   ├── chat/useSocket.ts       # Socket.IO bağlantı ve mesajlaşma
│   └── ui/useColorScheme.ts    # Sistem tema (light/dark) hook'u
├── services/                   # Saf API çağrı fonksiyonları
│   ├── axiosInstance.ts        # Axios config (baseURL, JWT inject, error toast)
│   ├── auth/auth.service.ts    # login, register, getSession, logout, verifyEmail, changePassword
│   ├── clubs/club.service.ts   # getClubs, getClubById, createClub, updateClub, deleteClub, joinClub, leaveClub, getJoinedClubs, getClubMembers, removeMember
│   ├── events/event.service.ts # CRUD etkinlik, RSVP, cancelRSVP
│   ├── chat/chat.service.ts    # Chat HTTP çağrıları (mesaj geçmişi)
│   ├── upload/upload.service.ts# Cloudinary'e resim yükleme
│   └── users/users.service.ts  # Profil güncelleme (PATCH /users/me)
├── store/                      # Global state (Zustand)
│   └── ui.store.ts             # Modal state, tab state, tema tercihi
├── types/                      # TypeScript tip tanımları (web ile aynı)
│   ├── auth.ts                 # AuthUser, LoginDto, RegisterDto, AuthSuccessResponse
│   ├── club.ts                 # Club, ClubMember, CreateClubDto, UpdateClubDto, ClubFilters
│   ├── event.ts                # Event, EventParticipant, RSVPStatus, CreateEventDto
│   ├── chat.ts                 # Message, ChatRoom, ServerToClientEvents, ClientToServerEvents
│   └── api.ts                  # PaginatedResponse<T>, ApiError
├── lib/                        # Yardımcı araçlar
│   ├── api/handleApiError.ts   # Axios hata yakalama ve toast
│   ├── auth/tokenStorage.ts    # SecureStore: getToken, setToken, removeToken
│   ├── constants/env.ts        # API_URL, SOCKET_URL ortam değişkenleri
│   ├── socket/socket.ts        # Socket.IO bağlantı factory (getSocket)
│   └── utils/                  # Tarih formatlama, truncate vb. utility
├── constants/
│   └── Colors.ts               # Design token sabitleri (JS nesnesi olarak)
├── assets/
│   ├── fonts/                  # (Expo Google Fonts kullandığı için boş kalabilir)
│   └── images/                 # Uygulama logosu, splash assets
├── app.json                    # Expo uygulama konfigürasyonu
├── eas.json                    # EAS Build konfigürasyonu (iOS/Android build)
├── babel.config.js             # Babel (Reanimated plugin dahil)
├── tsconfig.json               # TypeScript konfigürasyonu
└── .env                        # Ortam değişkenleri (gitignore'da)
```

---

## 4. Kimlik Doğrulama Akışı

```
Kullanıcı login/register
        ↓
authService.register() → POST /api/v1/auth/register
        ↓ (e-posta doğrulama kodu gönderilir)
VerifyEmail ekranı → POST /api/v1/auth/verify-email
        ↓
accessToken alınır
        ↓
SecureStore.setItemAsync('access_token', token)  ← localStorage YERİNE
        ↓
axiosInstance her istekte Authorization: Bearer <token> ekler (interceptor)
        ↓
authService.getSession() → GET /api/v1/auth/me  (uygulama açılışında)
        ↓
useAuth hook → React Query cache güncellenir
        ↓
Expo Router layout guard: oturum yoksa → /(auth)/login yönlendirmesi
Oturum varsa → /(app)/ yönlendirmesi
```

### Token Saklama — `lib/auth/tokenStorage.ts`

```typescript
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'cluber_access_token';

export const tokenStorage = {
  get: () => SecureStore.getItemAsync(TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  remove: () => SecureStore.deleteItemAsync(TOKEN_KEY),
};
```

> **Önemli:** Web'deki `localStorage` tamamen `expo-secure-store` ile değiştirilir.
> HTTP-only cookie mobile'da çalışmaz; backend `accessToken`'ı response body'de döndürür
> ve biz bunu güvenli depoda saklarız. Cookie header'ı GÖNDERMEYE GEREK YOK.

### Expo Router'da Route Koruması

`app/(app)/_layout.tsx` içinde:

```typescript
import { useAuth } from '@/hooks/auth/useAuth';
import { Redirect } from 'expo-router';

export default function AppLayout() {
  const { sessionQuery } = useAuth();

  if (sessionQuery.isLoading) return <LoadingSpinner />;
  if (!sessionQuery.data) return <Redirect href="/(auth)/login" />;

  return <Tabs>...</Tabs>;
}
```

---

## 5. Gerçek Zamanlı Sohbet (Socket.IO)

Web ile **aynı backend gateway**'ini kullanır. Tek fark token'ın SecureStore'dan okunmasıdır.

### Socket Bağlantısı — `lib/socket/socket.ts`

```typescript
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/constants/env';

let socket: Socket | null = null;

export function getSocket(token: string): Socket {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, {
      auth: { token },           // Backend extractToken() bunu okur
      transports: ['websocket'], // React Native'de polling sorun çıkarabilir
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
```

> **Kritik:** React Native'de `transports: ['websocket']` zorunludur.
> Polling transportu React Native ortamında düzgün çalışmaz.

### Socket Olayları (Backend Gateway ile uyumlu)

| Yön               | Olay                   | Açıklama                        |
|-------------------|------------------------|---------------------------------|
| Client → Server  | `chat:join-room`       | `{ clubId }` ile odaya katıl   |
| Client → Server  | `chat:send-message`    | `{ clubId, content }` gönder   |
| Server → Client  | `chat:new-message`     | Yeni mesaj broadcast'i          |
| Server → Client  | `chat:room-history`    | Oda geçmiş mesajları            |
| Server → Client  | `exception`            | Hata bildirimi                  |

---

## 6. Backend API Endpoint'leri

Tüm istekler `API_URL` base URL üzerinden yapılır (`.env`):

> **Base URL:** `http://<LOCAL_IP>:3000/api/v1`
> **Geliştirmede `localhost` KULLANMA** — fiziksel iOS cihazda çalışmaz.
> Bilgisayarın yerel IP'sini kullan (örn: `http://192.168.1.42:3000/api/v1`)

| Grup        | Endpoint                              | Method | Auth | Açıklama                              |
|-------------|---------------------------------------|--------|------|---------------------------------------|
| **Auth**    | `/auth/register`                      | POST   | ❌   | Kayıt ol (e-posta doğrulama başlatır) |
|             | `/auth/verify-email`                  | POST   | ❌   | E-posta kodu doğrula + token al       |
|             | `/auth/login`                         | POST   | ❌   | Giriş yap → accessToken döner         |
|             | `/auth/logout`                        | POST   | ✅   | Çıkış yap (cookie temizle)            |
|             | `/auth/me`                            | GET    | ✅   | Mevcut oturumu getir                  |
|             | `/auth/change-password`               | POST   | ✅   | Şifre değiştir                        |
| **Clubs**   | `/clubs`                              | GET    | ✅   | Kulüp listesi (sayfalama + filtre)    |
|             | `/clubs`                              | POST   | ✅   | Kulüp oluştur                         |
|             | `/clubs/:clubId`                      | GET    | ✅   | Kulüp detayı (ID ile)                 |
|             | `/clubs/slug/:slug`                   | GET    | ✅   | Kulüp detayı (slug ile)               |
|             | `/clubs/my/joined`                    | GET    | ✅   | Üye olunan kulüpler                   |
|             | `/clubs/:clubId`                      | PATCH  | ✅   | Kulüp güncelle (owner/admin)          |
|             | `/clubs/:clubId`                      | DELETE | ✅   | Kulüp sil (owner only)                |
|             | `/clubs/:clubId/join`                 | POST   | ✅   | Kulübe katıl                          |
|             | `/clubs/:clubId/leave`                | POST   | ✅   | Kulüpten ayrıl                        |
|             | `/clubs/:clubId/members`              | GET    | ✅   | Üye listesi                           |
|             | `/clubs/:clubId/members/:userId`      | DELETE | ✅   | Üyeyi çıkar (owner only)              |
| **Events**  | `/events`                             | GET    | ✅   | Etkinlik listesi (filtre + sayfalama) |
|             | `/events`                             | POST   | ✅   | Etkinlik oluştur                      |
|             | `/events/:id`                         | GET    | ✅   | Etkinlik detayı                       |
|             | `/events/:id`                         | PATCH  | ✅   | Etkinlik güncelle                     |
|             | `/events/:id`                         | DELETE | ✅   | Etkinlik sil                          |
|             | `/events/:id/rsvp`                    | POST   | ✅   | Etkinliğe katıl (RSVP)                |
|             | `/events/:id/rsvp`                    | DELETE | ✅   | RSVP iptal                            |
| **Chat**    | `/chat/:clubId/messages`              | GET    | ✅   | Geçmiş mesajlar (HTTP)                |
|             | Socket.IO (WS)                        | —      | JWT  | Gerçek zamanlı mesajlaşma             |
| **Users**   | `/users/me`                           | PATCH  | ✅   | Profil güncelle                       |
| **Upload**  | `/upload`                             | POST   | ✅   | multipart/form-data → Cloudinary URL  |

### Sorgu Parametreleri

**GET /clubs:** `?search=&category=&page=1&limit=10`
**GET /events:** `?search=&clubId=&page=1&limit=10`

### Sayfalama Response Formatı

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

## 7. Önemli Dosyalar — Ne İçeriyor?

| Dosya | İçerik Özeti |
|-------|--------------|
| `app/_layout.tsx` | Root layout: font yükleme, QueryClient, Toast provider, SecureStore'dan token okuma |
| `app/(app)/_layout.tsx` | Auth guard + Bottom Tab navigator |
| `app/(auth)/_layout.tsx` | Stack navigator (login/register/verify) |
| `lib/auth/tokenStorage.ts` | SecureStore wrapper: `get`, `set`, `remove` |
| `lib/constants/env.ts` | `API_URL`, `SOCKET_URL` — `.env`'den okunur |
| `lib/socket/socket.ts` | Socket.IO singleton factory, `transports: ['websocket']` ayarı |
| `services/axiosInstance.ts` | Axios singleton: `baseURL`, JWT inject interceptor, global hata toast |
| `hooks/auth/useAuth.ts` | `sessionQuery`, `loginMutation`, `registerMutation`, `logoutMutation`, `verifyEmailMutation` |
| `hooks/clubs/useClubs.ts` | `useClubs`, `useClub`, `useCreateClub`, `useJoinClub`, `useLeaveClub` vb. |
| `hooks/chat/useSocket.ts` | Socket.IO lifecycle, `messages` state, `sendMessage` fonksiyonu |
| `constants/Colors.ts` | Tüm design token'ları (renk, radius, shadow) — JS sabitleri |
| `components/ui/Button.tsx` | Primary / Ghost / Text varyantlı evrensel buton bileşeni |
| `components/layout/ScreenWrapper.tsx` | `SafeAreaView` + `StatusBar` sarmalayıcı — her ekranda kullanılır |

---

## 8. Kullanıcı Rolleri

```
Sistem Rolleri (AuthUser.role):       ADMIN | MODERATOR | MEMBER
Kulüp Üye Rolleri (ClubMember.role):  OWNER | ADMIN | MODERATOR | MEMBER
```

- **OWNER**: Kulübü oluşturan kişi. Admin panele, ayarlara, üye çıkarmaya erişimi var.
- **ADMIN / MODERATOR**: Yönetim yetkileri.
- **MEMBER**: Normal üye.

> **Not:** Kulüp `creator_id`'si OWNER'ı belirler. Backend `ClubsService` bunu kontrol eder.

---

## 9. Ortam Değişkenleri

```env
# .env (gitignore'da, asla commit edilmez)
# Expo'da env değişkenleri EXPO_PUBLIC_ prefix'i ile public olur

EXPO_PUBLIC_API_URL=http://192.168.1.42:3000/api/v1
EXPO_PUBLIC_SOCKET_URL=http://192.168.1.42:3000
```

> **Kritik:** Fiziksel iOS cihaz ile test ederken `localhost` yerine bilgisayarının
> gerçek yerel IP adresini kullan. `ipconfig` (Windows) veya `ifconfig` (Mac/Linux) ile öğrenebilirsin.

### `lib/constants/env.ts`

```typescript
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000';
```

---

## 10. Geliştirme Komutları

### Expo Geliştirme Sunucusunu Başlatmak

```bash
# Bağımlılıkları kur (ilk seferde)
npm install

# Expo Dev Server başlat (QR kod ile iOS cihaza bağlan)
npx expo start

# Sadece iOS için başlat
npx expo start --ios

# Cache temizleyerek başlat
npx expo start --clear
```

### Backend Sunucusunu Başlatmak (Cluber_Backend dizininde)

```bash
# Docker geliştirici ortamını başlat (port 3000)
docker-compose -f docker-compose.dev.yml up -d
```

### EAS Build (Fiziksel Cihaz İçin)

```bash
# EAS CLI kur
npm install -g eas-cli

# EAS hesabına giriş
eas login

# iOS build (TestFlight veya cihaza yükleme)
eas build --platform ios --profile preview

# Android build
eas build --platform android --profile preview
```

### Diğer Komutlar

```bash
# TypeScript tip kontrolü
npx tsc --noEmit

# Lint
npm run lint

# Expo Doctor (bağımlılık sorunlarını kontrol et)
npx expo-doctor
```

---

## 11. Kritik React Native / Expo Özel Notlar

### 11.1 Bilinen Tuzaklar

| Sorun | Çözüm |
|-------|-------|
| `localhost` iOS cihazda çalışmaz | `.env`'de bilgisayarın gerçek IP'sini kullan |
| Socket.IO bağlantı kopuyor | `transports: ['websocket']` zorunlu |
| `expo-secure-store` max 2KB değer | Token sığar ama büyük veri saklamaya çalışma |
| Reanimated plugin eksik | `babel.config.js`'e `react-native-reanimated/plugin` ekle |
| Android'de font yüklenmesi | `useFonts` hook ile `SplashScreen.preventAutoHideAsync()` kullan |
| KeyboardAvoidingView davranışı | iOS'ta `behavior="padding"`, Android'de `behavior="height"` |
| `FlatList` performansı | `keyExtractor`, `removeClippedSubviews`, `getItemLayout` kullan |

### 11.2 Platform Farklılıkları

```typescript
import { Platform } from 'react-native';

// Platform'a göre stil
const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    shadowOffset: Platform.OS === 'ios'
      ? { width: 0, height: 2 }
      : { width: 0, height: 1 },
  },
});
```

### 11.3 React Query Konfigürasyonu

```typescript
// app/_layout.tsx içinde
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5 dakika
      gcTime: 1000 * 60 * 10,        // 10 dakika
      retry: 2,
      refetchOnWindowFocus: false,   // Mobile'da window focus yok
      refetchOnReconnect: true,      // Ağ bağlantısı gelince yenile
    },
  },
});
```

### 11.4 Axios Interceptor (Mobile Uyarlaması)

```typescript
// services/axiosInstance.ts
import axios from 'axios';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { API_URL } from '@/lib/constants/env';
import Toast from 'react-native-toast-message';

export const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get(); // async — SecureStore
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const silent = error.config?.headers?.['x-silent-error'];
    if (!silent) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: error.response?.data?.message ?? 'Bir hata oluştu.',
      });
    }
    return Promise.reject(error);
  },
);
```

> **Web'den Fark:** `tokenStorage.get()` async olduğu için interceptor da `async` olmalı.

---

## 12. Tamamlanan Özellikler ✅ / Yapılacaklar 🔲

### Yapılacaklar (MVP → Full)

- [ ] Proje kurulumu (Expo + Expo Router + bağımlılıklar)
- [ ] Design token sabitleri (`constants/Colors.ts`)
- [ ] Atom UI bileşenleri (`Button`, `Input`, `Card`, `Badge`, `Avatar`)
- [ ] `ScreenWrapper` ve layout bileşenleri
- [ ] Auth akışı (login, register, verify-email, logout)
- [ ] Route koruması (Expo Router layout guard)
- [ ] Kulüp listesi ekranı (keşfet, arama, filtreleme, sayfalama)
- [ ] Kulüp detay ekranı (banner, avatar, katıl/ayrıl, sekmeler)
- [ ] Kulüp oluşturma formu
- [ ] Gerçek zamanlı sohbet (Socket.IO + FlatList)
- [ ] Etkinlik listesi ve detay ekranı
- [ ] Etkinlik oluşturma formu
- [ ] RSVP (katılım) özelliği
- [ ] Profil ekranı (görüntüleme + düzenleme)
- [ ] Şifre değiştirme
- [ ] Kulüp ayarları ekranı (owner)
- [ ] Admin paneli (üye çıkarma, kulüp silme)
- [ ] Medya yükleme (avatar, banner — expo-image-picker)
- [ ] Dark mode / Light mode desteği
- [ ] Üye listesi ekranı
- [ ] Bildirimler (expo-notifications — ileride)
- [ ] EAS Build konfigürasyonu

---

## 13. Veritabanı Modelleri (Referans)

Tüm veriler `Cluber_Backend` PostgreSQL veritabanından gelir:

| Model | Alanlar |
|-------|---------|
| `User` | `id`, `email`, `displayName`, `bio`, `avatarUrl`, `interests[]` |
| `Club` | `id`, `name`, `description`, `category`, `avatarUrl`, `bannerUrl`, `isActive`, `creatorId` |
| `Membership` | `userId`, `clubId`, `role (ADMIN/MODERATOR/MEMBER)`, `joinedAt` |
| `Event` | `id`, `title`, `description`, `date`, `location`, `clubId` |
| `EventParticipant` | `userId`, `eventId`, `joinedAt`, `reminderSent` |
| `Message` | `id`, `content`, `userId`, `clubId`, `createdAt` |
| `PendingUser` | `email`, `verificationCode`, `expiresAt` (e-posta doğrulanınca silinir) |

---

## 14. Kod Kalitesi Notları

- **Hata yönetimi:** Axios response interceptor global hata toast'ı gösterir. `x-silent-error: true` header'ı ile atlatılabilir (session check gibi).
- **Tip güvenliği:** Tüm API yanıtları TypeScript interface'leriyle tanımlı. `any` kullanımından kaçın.
- **Query invalidation:** Mutation başarısında ilgili query'ler invalidate edilmeli (web pattern'ı ile aynı).
- **Async token okuma:** Her axios isteğinden önce SecureStore async beklenimeli — interceptor `async` kullanır.
- **SafeAreaView:** Her ekran `ScreenWrapper` ile sarılmalı, yoksa iPhone notch/Dynamic Island içeriği kapatır.
- **`react-native-reanimated`:** `babel.config.js`'e plugin eklemeden `useSharedValue` vb. çalışmaz.
- **FlatList vs ScrollView:** Listeler için her zaman `FlatList` kullan — `ScrollView` + map memory sızıntısı yaratır.

---

*Son güncelleme: 2026-04-17*
