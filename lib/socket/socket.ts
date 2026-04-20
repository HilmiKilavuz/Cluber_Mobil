// lib/socket/socket.ts
// Socket.IO singleton factory
// Kritik: React Native'de transports: ['websocket'] zorunludur

import { io, type Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/constants/env';
import type { ClientToServerEvents, ServerToClientEvents } from '@/types/chat';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

export function getSocket(token: string): AppSocket {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, {
      auth: { token },                // Backend extractToken() bunu okur
      transports: ['websocket'],      // React Native'de polling çalışmaz
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
