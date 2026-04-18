// lib/socket/socket.ts
// Socket.IO bağlantı factory — web projesi ile aynı pattern
// Kritik fark: transports: ['websocket'] — React Native'de polling çalışmaz

import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/constants/env';

let socket: Socket | null = null;

/**
 * Socket.IO bağlantısını döner veya oluşturur (singleton).
 * @param token - JWT access token (SecureStore'dan okunmuş olmalı)
 */
export function getSocket(token: string): Socket {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, {
      auth: { token },              // backend extractToken() bunu okur
      transports: ['websocket'],   // React Native'de polling çalışmaz!
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });
  }
  return socket;
}

/**
 * Socket bağlantısını kapatır (logout veya ekrandan çıkışta)
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
