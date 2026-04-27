// services/axiosInstance.ts
// Axios singleton — web projesi ile aynı pattern
// Fark: JWT token SecureStore'dan async olarak okunur

import axios from 'axios';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
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
  async (error) => {
    // x-silent-error header'ı varsa toast gösterme (örn. session check)
    const silent = error.config?.headers?.['x-silent-error'];

    if (!silent) {
      let title = 'Hata';
      let message = 'Bir hata oluştu. Lütfen tekrar dene.';

      if (!error.response) {
        // Ağ hatası veya sunucu yanıt vermiyor
        title = 'Bağlantı Hatası';
        message = 'Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.';
      } else {
        const status = error.response.status;
        const serverMessage = error.response.data?.message;

        switch (status) {
          case 401:
            title = 'Oturum Süresi Doldu';
            message = 'Lütfen tekrar giriş yapın.';
            await tokenStorage.remove();
            router.replace('/(auth)/login');
            break;
          case 403:
            title = 'Yetkisiz İşlem';
            message = 'Bu işlemi gerçekleştirmek için yetkiniz yok.';
            break;
          case 404:
            title = 'Bulunamadı';
            message = 'İstediğiniz kaynak bulunamadı.';
            break;
          case 500:
            title = 'Sunucu Hatası';
            message = 'Sunucuda bir problem var. Lütfen daha sonra tekrar deneyin.';
            break;
          default:
            if (serverMessage) {
              message = Array.isArray(serverMessage) ? serverMessage[0] : serverMessage;
            }
            break;
        }
      }

      Toast.show({
        type: 'error',
        text1: title,
        text2: message,
        visibilityTime: 4000,
      });
    }

    return Promise.reject(error);
  },
);
