# Cluber Mobile 📱

Cluber Mobile, üniversite ve topluluk kulüplerini dijital ortamda yönetmeye yarayan **iOS & Android** uygulamasıdır. Kullanıcıların kulüp oluşturmasına, etkinliklere katılmasına ve topluluk içi gerçek zamanlı sohbet etmesine olanak tanır. Cluber Web projesiyle aynı güçlü backend altyapısını kullanır.

## 🚀 Özellikler

- **Gelişmiş Kimlik Doğrulama:** JWT tabanlı, e-posta onaylı ve güvenli (Expo Secure Store) oturum yönetimi.
- **Kulüp Yönetimi:** Kulüp oluşturma, düzenleme, katılma, ayrılma ve üye rolleri (Owner, Admin, Moderator, Member).
- **Gerçek Zamanlı Sohbet:** Socket.IO altyapısı ile kulüp içi anlık mesajlaşma.
- **Etkinlik & RSVP:** Kulüp etkinlikleri oluşturma ve katılımcı listesi (RSVP) yönetimi.
- **Dinamik UI:** React Native Reanimated ile desteklenmiş, karanlık/aydınlık (Dark/Light) tema destekli özel "Editorial" tasarım dili.
- **Admin Paneli:** Kulüp yöneticileri için üye çıkarma, kulüp silme gibi gelişmiş kontroller.

## 🛠 Teknoloji Yığını

- **Framework:** [Expo SDK 52+](https://expo.dev/) (React Native)
- **Routing:** Expo Router v4 (Dosya tabanlı navigasyon)
- **Dil:** TypeScript
- **State Yönetimi:** [Zustand](https://zustand-demo.pmnd.rs/) (Global) & [TanStack React Query v5](https://tanstack.com/query/v5) (Sunucu Durumu)
- **Ağ İstekleri:** Axios
- **Gerçek Zamanlı İletişim:** Socket.IO Client v4
- **Form & Validasyon:** React Hook Form + Zod
- **Güvenlik:** Expo Secure Store

## 📂 Proje Yapısı

\`\`\`text
Cluber_Mobil/
├── app/                  # Expo Router ekranları ve layoutları
│   ├── (auth)/           # Giriş, Kayıt, E-posta Doğrulama ekranları
│   └── (app)/            # Korumalı ana uygulama ekranları (Keşfet, Kulüp detayları, Profil)
├── components/           # Yeniden kullanılabilir UI, Form ve Layout bileşenleri
├── hooks/                # Özelleştirilmiş React Hook'ları (Auth, Clubs, Events, Chat)
├── services/             # Axios instance ve API servis fonksiyonları
├── store/                # Zustand ile UI state yönetimi
├── types/                # TypeScript interface ve type tanımlamaları
└── lib/                  # Yardımcı fonksiyonlar, Token yönetimi, Socket factory
\`\`\`

## ⚙️ Kurulum ve Geliştirme

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya yarn
- iOS Simülatörü (Mac) veya Android Emülatörü (veyahut test için fiziksel cihazda **Expo Go** uygulaması)
- Cluber Backend projesinin (NestJS) çalışır durumda olması.

### 1. Projeyi Klonlayın
\`\`\`bash
git clone <repository-url>
cd Cluber_Mobil
\`\`\`

### 2. Bağımlılıkları Yükleyin
\`\`\`bash
npm install
\`\`\`

### 3. Ortam Değişkenlerini Ayarlayın
Proje kök dizininde bir \`.env\` dosyası oluşturun ve IP adresinizi girin (Fiziksel cihaz testleri için \`localhost\` kullanılamaz, yerel ağ IP'niz gerekir):

\`\`\`env
# Bilgisayarınızın yerel IP adresi (örn: 192.168.1.42)
EXPO_PUBLIC_API_URL=http://<IP_ADRESINIZ>:3000/api/v1
EXPO_PUBLIC_SOCKET_URL=http://<IP_ADRESINIZ>:3000
\`\`\`

### 4. Geliştirme Sunucusunu Başlatın
\`\`\`bash
npx expo start --clear
\`\`\`
*(Açılan terminaldeki QR kodu telefonunuzun kamerasıyla veya Expo Go uygulamasıyla okutarak uygulamayı test edebilirsiniz.)*

## 🔒 Güvenlik Notu
- Uygulamanın geliştirme notlarını içeren \`agent.md\`, \`design.md\` ve ortam değişkeni barındıran \`.env\` dosyaları \`.gitignore\` içine dahil edilmiştir ve versiyon kontrol sistemine (GitHub) aktarılmaz.
