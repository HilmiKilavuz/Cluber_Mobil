// types/chat.ts
import { AuthUser } from './auth';

export interface Message {
  id: string;
  content: string;
  userId: string;
  clubId: string;
  user?: Partial<AuthUser>;
  createdAt: string;
}

export interface ChatRoom {
  clubId: string;
  messages: Message[];
  members: AuthUser[];
}

export interface ServerToClientEvents {
  'chat:new-message': (message: Message) => void;
  'chat:room-history': (messages: Message[]) => void;
  exception: (error: { message: string; statusCode: number }) => void;
}

export interface ClientToServerEvents {
  'chat:join-room': (
    data: { clubId: string },
    callback?: (res: { joined: boolean; clubId: string }) => void,
  ) => void;
  'chat:send-message': (
    data: { clubId: string; content: string },
    callback?: (res: Message) => void,
  ) => void;
}
