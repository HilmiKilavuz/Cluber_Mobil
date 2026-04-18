// services/axiosInstance.ts
// Axios singleton — web projesi ile aynı pattern
// Fark: JWT token SecureStore'dan async olarak okunur

import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_URL } from '@/lib/constants/env';
import { tokenStorage } from '@/lib/auth/tokenStorage';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — her isteğe JWT Bearer token ekle
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — global hata toast'ı
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // x-silent-error header'ı varsa toast gösterme (örn. session check)
    const silent = error.config?.headers?.['x-silent-error'];

    if (!silent) {
      const message =
        error.response?.data?.message ??
        'Bir hata oluştu. Lütfen tekrar dene.';

      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: Array.isArray(message) ? message[0] : message,
        visibilityTime: 4000,
      });
    }

    return Promise.reject(error);
  },
);
