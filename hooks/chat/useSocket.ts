// hooks/chat/useSocket.ts
// Socket.IO lifecycle — bağlan, mesaj gönder, dinle, ayrıl
//
// Önemli: unmount'ta socket tamamen kapatılmaz, sadece event listener'lar temizlenir.
// disconnectSocket() yalnızca logout sırasında çağrılmalı.

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket } from '@/lib/socket/socket';
import { chatService } from '@/services/chat/chat.service';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import type { Message } from '@/types/chat';

interface UseSocketResult {
  messages: Message[];
  isConnected: boolean;
  isLoading: boolean;
  sendMessage: (content: string) => void;
}

export function useSocket(clubId: string): UseSocketResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  /**
   * Mesaj gönder — optimistic update ile anında UI'ya yansıt.
   * Backend'den chat:new-message geldiğinde duplicate check kaldırır.
   */
  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !content.trim()) return;

      socketRef.current.emit('chat:send-message', { clubId, content });
    },
    [clubId],
  );

  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      try {
        setIsLoading(true);

        // ── 1. Geçmiş mesajları HTTP ile yükle ──────────────────────────────
        const history = await chatService.getMessages(clubId);
        if (!mounted) return;
        // Backend'den en yeni mesajlar en başta (desc) geliyor, 
        // kronolojik sıra için tersine çeviriyoruz.
        setMessages(history.reverse());
        setIsLoading(false);

        // ── 2. Token'ı SecureStore'dan al ────────────────────────────────────
        const token = await tokenStorage.get();
        if (!token || !mounted) return;

        // ── 3. Socket singleton'ını al (bağlı değilse yeni bağlantı açar) ──
        const socket = getSocket(token);
        socketRef.current = socket;

        // ── 4. Event listener'ları kaydet ────────────────────────────────────

        const onConnect = () => {
          if (!mounted) return;
          setIsConnected(true);
          // Odaya katıl — history zaten HTTP ile alındı
          socket.emit('chat:join-room', { clubId });
        };

        const onDisconnect = () => {
          if (mounted) setIsConnected(false);
        };

        const onNewMessage = (message: Message) => {
          if (!mounted) return;
          setMessages((prev) => {
            // Duplicate check — optimistic veya önceki mesajların tekrarını önle
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        };

        // Sunucu oda geçmişini tekrar gönderirse güncelle
        const onRoomHistory = (history: Message[]) => {
          if (mounted) setMessages(history);
        };

        // Bağlantı hatası — kullanıcıya bildir ama çökme
        const onException = (err: { message: string }) => {
          console.warn('[useSocket] Gateway exception:', err.message);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('chat:new-message', onNewMessage);
        socket.on('chat:room-history', onRoomHistory);
        socket.on('exception', onException);

        // Zaten bağlıysa 'connect' eventi tetiklenmez — manuel katıl
        if (socket.connected) {
          setIsConnected(true);
          socket.emit('chat:join-room', { clubId });
        }

        // ── 5. Cleanup — listener'ları temizle, socket'i KAPATMA ─────────────
        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
          socket.off('chat:new-message', onNewMessage);
          socket.off('chat:room-history', onRoomHistory);
          socket.off('exception', onException);
        };
      } catch (error) {
        if (mounted) setIsLoading(false);
        console.warn('[useSocket] Bağlantı hatası:', error);
      }
    };

    const cleanupPromise = connect();

    return () => {
      mounted = false;
      // Async cleanup'ı çalıştır (listener'ları kaldır)
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [clubId]);

  return { messages, isConnected, isLoading, sendMessage };
}
