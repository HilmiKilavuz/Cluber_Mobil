// hooks/chat/useSocket.ts
// Socket.IO lifecycle — bağlan, mesaj gönder, dinle, ayrıl

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket/socket';
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
        // Geçmiş mesajları HTTP ile yükle
        const history = await chatService.getMessages(clubId);
        if (mounted) {
          setMessages(history);
          setIsLoading(false);
        }

        // Token'ı SecureStore'dan al
        const token = await tokenStorage.get();
        if (!token || !mounted) return;

        // Socket'e bağlan
        const socket = getSocket(token);
        socketRef.current = socket;

        socket.on('connect', () => {
          if (mounted) setIsConnected(true);
          // Odaya katıl
          socket.emit('chat:join-room', { clubId });
        });

        socket.on('disconnect', () => {
          if (mounted) setIsConnected(false);
        });

        socket.on('chat:new-message', (message: Message) => {
          if (mounted) {
            setMessages((prev) => {
              // Duplicate check
              if (prev.some((m) => m.id === message.id)) return prev;
              return [...prev, message];
            });
          }
        });

        socket.on('chat:room-history', (history: Message[]) => {
          if (mounted) setMessages(history);
        });

        // Zaten bağlıysa connect olayı tetiklenmez, manuel katıl
        if (socket.connected) {
          setIsConnected(true);
          socket.emit('chat:join-room', { clubId });
        }
      } catch (error) {
        if (mounted) setIsLoading(false);
        console.error('[useSocket] Bağlantı hatası:', error);
      }
    };

    connect();

    return () => {
      mounted = false;
      // Socket'i kapat (component unmount)
      disconnectSocket();
    };
  }, [clubId]);

  return { messages, isConnected, isLoading, sendMessage };
}
