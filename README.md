<div align="center">

  <h1> Cluber Mobile</h1>
  <p><b>Topluluklar, Burada Yaşıyor.</b></p>
  
  [![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=D04A37)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
</div>

<br/>

##  Proje Hakkında

**Cluber Mobile**, üniversite ve topluluk kulüplerini dijital ortamda modern bir şekilde yönetmeye yarayan **iOS & Android** mobil uygulamasıdır. Kullanıcıların ilgi alanlarına uygun kulüpleri keşfetmesine, yeni topluluklar oluşturmasına, etkinliklere katılmasına ve kulüp üyeleriyle **gerçek zamanlı sohbet** etmesine olanak tanır. 

Web uygulamasıyla (Cluber Web) aynı güçlü **NestJS / PostgreSQL** backend altyapısını kullanarak platformlar arası kusursuz bir deneyim sunar. "Editorial" minimalist tasarım anlayışıyla geliştirilmiş, kullanıcı dostu, nefes alan ve premium bir arayüze sahiptir.

---

## ✨ Özellikler

###  Gelişmiş Kimlik Doğrulama & Güvenlik
- JWT tabanlı, e-posta onaylı üyelik sistemi.
- **Expo Secure Store** ile cihaz üzerinde yüksek güvenlikli token saklama.
- Axios interceptor'ları ile otomatik hata ve oturum süresi (401, 403, 500 hataları) yönetimi.

###  Kapsamlı Kulüp Yönetimi
- **Keşfet & Katıl:** Kategori filtreleme ile yeni kulüpleri kolayca bulun.
- **Rol Tabanlı Erişim:** Kurucu (Owner), Yönetici (Admin/Moderator) ve Üye (Member) hiyerarşisi ve yetkilendirme.
- **Admin Paneli:** Üye çıkarma, kulüp düzenleme, avatar ve banner resimleri yükleme (Cloudinary destekli) ve kulüp silme/kapatma yetkileri.

###  Gerçek Zamanlı Topluluk Sohbeti
- **Socket.IO** altyapısıyla kulüp sohbet odalarında gecikmesiz, anlık mesajlaşma.
- Akıcı mesajlaşma arayüzü ve performans odaklı `FlatList` entegrasyonu (Ters çevrilmiş liste - Inverted list).

###  Etkinlik ve LCV (RSVP) Yönetimi
- Kulübe özel detaylı etkinlikler (tarih, saat, konum bilgisi) planlama.
- Tek tıkla etkinliklere katılma (RSVP) iptal etme ve katılımcı listesini yönetme.
- Günü geçmiş etkinlikleri tespit edip katılımı dondurma mekanizması.

###  Premium UI / UX Tasarımı
- **Reanimated v3** ile desteklenen mikro animasyonlar ve pürüzsüz sayfa geçişleri.
- Cihazınızın sistem temasına eş zamanlı uyum sağlayan **Dark Mode / Light Mode** desteği.
- iPhone Çentiği / Dynamic Island uyumluluğu için `SafeAreaView` bazlı özel kenar boşluğu (Edge-to-Edge) mimarisi.

---

##  Teknoloji Yığını

| Kategori | Kullanılan Teknoloji |
| :--- | :--- |
| **Framework** | Expo SDK 52+ (Managed Workflow) |
| **Dil** | TypeScript 5 & React Native |
| **Navigasyon** | Expo Router v4 (Dosya tabanlı routing) |
| **Global State** | Zustand |
| **Sunucu State** | TanStack React Query v5 |
| **Gerçek Zamanlı** | Socket.IO Client v4 |
| **API İstekleri** | Axios |
| **Form Yönetimi** | React Hook Form + Zod Validasyonu |
| **Animasyonlar** | React Native Reanimated v3 |

---

##  Kurulum ve Geliştirme

Proje kopyasını kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

###  Gereksinimler
- Node.js (v18 veya üzeri önerilir)
- `npm` veya `yarn` paket yöneticisi
- Cluber Backend projesinin (API ve Socket hizmetleri için lokalde veya uzak sunucuda) çalışır durumda olması.
- [Expo Go](https://expo.dev/client) uygulaması (Fiziksel mobil cihazlarda test için) veya bilgisayarda kurulu iOS/Android simülatörü.

### Projeyi Klonlayın
```bash
git clone https://github.com/HilmiKilavuz/Cluber_Mobil.git
cd Cluber_Mobil
```

###  Bağımlılıkları Yükleyin
```bash
npm install
```

###  Çevre Değişkenlerini (ENV) Ayarlayın
Projenin ana dizininde bir `.env` dosyası oluşturun ve API/Socket URL bilgilerinizi ekleyin. 
>  **Önemli:** Eğer fiziksel bir mobil cihazla (telefonunuzla) test ediyorsanız, backend adresiniz `localhost` **olamaz**. Bilgisayarınızın aynı Wi-Fi ağı üzerindeki yerel ağ IP'sini (Örn: `192.168.1.15`) girmelisiniz.

```env
# Fiziksel cihaz testi için bilgisayarınızın yerel IP adresi
EXPO_PUBLIC_API_URL=http://<YEREL_IP_ADRESINIZ>:3000/api/v1
EXPO_PUBLIC_SOCKET_URL=http://<YEREL_IP_ADRESINIZ>:3000
```

###  Projeyi Başlatın
```bash
npx expo start --clear
```
Terminalde beliren QR kodu iOS cihazınızın kendi kamerasıyla veya Android cihazınızdaki "Expo Go" uygulamasıyla okutarak projeyi anında test etmeye başlayabilirsiniz.

### Testleri Çalıştırma
Projeye yapılandırılmış *Jest* ve *React Native Testing Library* ortamı ile birim testleri (unit tests) çalıştırmak için:
```bash
npm run test
```
*Testleri izleme (watch) modunda çalıştırmak için:* `npm run test:watch`

---

##  Mimari Yapı

Proje, dosya tabanlı navigasyon ile modülerliği harmanlayan aşağıdaki dizin mimarisini kullanır:

```text
Cluber_Mobil/
├── app/                  # Sayfalar ve Navigasyon (Expo Router)
│   ├── (auth)/           # Korumasız rotalar (Giriş, Kayıt, E-posta Doğrulama)
│   └── (app)/            # Korumalı ana rotalar (Tab Bar, Keşfet, Profil, Kulüpler)
├── components/           # Atom ve Molekül seviyesi UI Bileşenleri (Cards, Buttons, Modals)
├── constants/            # Tasarım Sistemi (Design Tokens: Renkler, Tipografi, Boşluklar)
├── hooks/                # Özel React Hook'ları (useAuth, useSocket, API etkileşimleri)
├── lib/                  # Yardımcı araçlar (SecureStore adaptörü, Socket Factory)
├── services/             # Axios instance ve modüler API servis sınıfları
├── store/                # Zustand Global UI State dosyaları
└── types/                # Ortak TypeScript arayüz (Interface) ve tipleri
```

---

##  Gelecek Planları (Roadmap)

Projeyi daha da ileri taşımak adına geliştirilmesi planlanan özellikler:

- [ ] **Push Notifications (Anlık Bildirimler):** `expo-notifications` entegrasyonu ile cihaz dışında yeni mesaj, yaklaşan etkinlik ve kulüp daveti bildirimleri.
- [ ] **Gelişmiş Arama:** Keşfet ekranında çoklu etiket seçimi ve detaylı filtreleme opsiyonları.
- [ ] **Özel Mesajlaşma (DM):** Kulüp odalarından bağımsız, kullanıcıların birebir mesajlaşabilmesi.
- [ ] **Sınama ve Güvenilirlik:** E2E (Uçtan uca) testlerinin yapılandırılıp test kapsamının (coverage) genişletilmesi.

---

<div align="center">
  <p>Geliştirici: <b>Hilmi Kılavuz</b></p>
  <p>Bu proje, modern web ve mobil teknolojileri deneyimlemek amacıyla açık kaynak kültürüne uygun olarak geliştirilmiştir.</p>
</div>
