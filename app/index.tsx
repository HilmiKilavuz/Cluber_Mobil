// app/index.tsx
// Giriş noktası — oturum durumuna göre yönlendirir

import { Redirect } from 'expo-router';

/**
 * Root index: kullanıcıyı doğru gruba yönlendirir.
 * Auth durumu (app)/_layout.tsx içinde kontrol edilir.
 */
export default function Index() {
  return <Redirect href="/(app)" />;
}
