// types/event.ts

export type RSVPStatus = 'GOING' | 'INTERESTED' | 'NOT_GOING';

export interface EventParticipant {
  id: string;
  userId: string;
  eventId: string;
  status: RSVPStatus;
  user?: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  createdAt: string;
}

export interface Event {
  id: string;
  clubId: string;
  creatorId: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string | null;
  maxParticipants?: number | null;
  category?: string | null;
  participants?: EventParticipant[];
  _count?: {
    participants: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  clubId: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  imageUrl?: string;
  maxParticipants?: number;
  category?: string;
}

export type UpdateEventDto = Partial<CreateEventDto>;

export interface EventFilters {
  clubId?: string;
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}
