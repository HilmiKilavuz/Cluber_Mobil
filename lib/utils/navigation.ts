// lib/utils/navigation.ts
// Type-safe navigation helper — Expo Router typed routes workaround
// Projeyi çalıştırınca .expo/types klasörü oluşur ve typed routes devreye girer

import { router } from 'expo-router';
import type { Href } from 'expo-router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const navigate = (href: string) => router.push(href as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any  
export const navigateReplace = (href: string) => router.replace(href as any);
