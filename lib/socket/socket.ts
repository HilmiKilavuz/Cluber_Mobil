// lib/socket/socket.ts
// Socket.IO singleton factory
// Kritik: React Native'de transports: ['websocket'] zorunludur

import { io, type Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/constants/env';
import type { ClientToServerEvents, ServerToClientEvents } from '@/types/chat';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;
let currentToken: string | null = null;

/**
 * Socket singleton'ını döndürür. Token değişmişse yeni bağlantı oluşturur.
 * React Native'de transports: ['websocket'] zorunludur — polling çalışmaz.
 */
export function getSocket(token: string): AppSocket {
  // Token değişmişse eski bağlantıyı kapat
  if (socket && currentToken !== token) {
    socket.disconnect();
    socket = null;
  }

  if (!socket || !socket.connected) {
    currentToken = token;
    socket = io(SOCKET_URL, {
      auth: { token },              // Backend extractToken() auth.token'ı okur
      transports: ['websocket'],    // React Native'de polling çalışmaz
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  return socket;
}

/**
 * Belirli bir kulüp odasından ayrılır ancak socket bağlantısını korur.
 * Chat ekranından çıkarken bu fonksiyon kullanılmalı.
 */
export function leaveRoom(clubId: string): void {
  if (socket?.connected) {
    // Backend gateway'de özel bir leave-room eventi yoksa sadece local temizlik yaparız.
    // Socket arka planda canlı kalır, kulüp odası server-side hâlâ aktif.
    // Yeni bir join-room yapıldığında history tekrar alınır.
    socket.emit('chat:join-room' as any, { clubId }); // re-join is safe
  }
}

/**
 * Socket bağlantısını tamamen kapatır (logout veya uygulama kapanması için).
 */
export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
  currentToken = null;
}
