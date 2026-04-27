// services/chat/chat.service.ts
// HTTP üzerinden mesaj geçmişi (Socket.IO gerçek zamanlı için useSocket hook'u kullanılır)

import { axiosInstance } from '@/services/axiosInstance';
import type { Message } from '@/types/chat';

export const chatService = {
  getMessages: async (clubId: string): Promise<Message[]> => {
    const response = await axiosInstance.get<Message[]>(`/chat/${clubId}`);
    return response.data;
  },
};
