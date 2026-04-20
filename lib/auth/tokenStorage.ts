// lib/auth/tokenStorage.ts
// SecureStore wrapper — web'deki localStorage'ın mobil karşılığı
// expo-secure-store max 2KB değer saklayabilir, JWT token için yeterli

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'cluber_access_token';

export const tokenStorage = {
  get: (): Promise<string | null> => SecureStore.getItemAsync(TOKEN_KEY),
  set: (token: string): Promise<void> =>
    SecureStore.setItemAsync(TOKEN_KEY, token),
  remove: (): Promise<void> => SecureStore.deleteItemAsync(TOKEN_KEY),
};
