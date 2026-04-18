// lib/auth/tokenStorage.ts
// JWT token'ını expo-secure-store'da güvenli şekilde saklar
// Web'deki localStorage'ın mobil karşılığı

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'cluber_access_token';

export const tokenStorage = {
  /** Token'ı güvenli depoya kaydeder */
  set: (token: string): Promise<void> =>
    SecureStore.setItemAsync(TOKEN_KEY, token),

  /** Kayıtlı token'ı okur — yoksa null döner */
  get: (): Promise<string | null> =>
    SecureStore.getItemAsync(TOKEN_KEY),

  /** Token'ı güvenli depodan siler (logout) */
  remove: (): Promise<void> =>
    SecureStore.deleteItemAsync(TOKEN_KEY),
};
