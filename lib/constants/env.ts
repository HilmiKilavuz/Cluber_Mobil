// lib/constants/env.ts
// Ortam değişkenleri — .env dosyasından okunur
// Fiziksel iOS cihazda test için gerçek IP adresi kullanılmalı (localhost çalışmaz)

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000';
