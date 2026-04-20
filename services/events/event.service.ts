// services/events/event.service.ts

import { axiosInstance } from '@/services/axiosInstance';
import type { Event, EventFilters, CreateEventDto, UpdateEventDto } from '@/types/event';
import type { PaginatedResponse } from '@/types/api';

const EVENTS_BASE_PATH = '/events';

export const eventService = {
  getEvents: async (filters?: EventFilters): Promise<PaginatedResponse<Event>> => {
    const response = await axiosInstance.get<PaginatedResponse<Event>>(EVENTS_BASE_PATH, {
      params: filters,
    });
    return response.data;
  },

  getEventById: async (id: string): Promise<Event> => {
    const response = await axiosInstance.get<Event>(`${EVENTS_BASE_PATH}/${id}`);
    return response.data;
  },

  createEvent: async (payload: CreateEventDto): Promise<Event> => {
    const response = await axiosInstance.post<Event>(EVENTS_BASE_PATH, payload);
    return response.data;
  },

  updateEvent: async (id: string, payload: UpdateEventDto): Promise<Event> => {
    const response = await axiosInstance.patch<Event>(`${EVENTS_BASE_PATH}/${id}`, payload);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${EVENTS_BASE_PATH}/${id}`);
  },

  rsvpEvent: async (id: string): Promise<void> => {
    await axiosInstance.post(`${EVENTS_BASE_PATH}/${id}/rsvp`);
  },

  cancelRSVP: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${EVENTS_BASE_PATH}/${id}/rsvp`);
  },
};
