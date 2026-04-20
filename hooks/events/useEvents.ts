// hooks/events/useEvents.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  type UseMutationResult,
  type UseQueryResult,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from '@tanstack/react-query';
import { eventService } from '@/services/events/event.service';
import type { Event, EventFilters, CreateEventDto, UpdateEventDto } from '@/types/event';
import type { PaginatedResponse } from '@/types/api';

const EVENT_QUERY_KEYS = {
  all: ['events'] as const,
  list: (filters?: EventFilters) => ['events', 'list', filters] as const,
  detail: (id: string) => ['events', 'detail', id] as const,
};

export const useEvents = (
  filters?: EventFilters,
): UseInfiniteQueryResult<InfiniteData<PaginatedResponse<Event>>, Error> => {
  return useInfiniteQuery({
    queryKey: EVENT_QUERY_KEYS.list(filters),
    queryFn: ({ pageParam }) =>
      eventService.getEvents({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) return undefined;
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
  });
};

export const useEvent = (id: string): UseQueryResult<Event, Error> => {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.detail(id),
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = (): UseMutationResult<Event, Error, CreateEventDto> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventDto) => eventService.createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};

export const useUpdateEvent = (id: string): UseMutationResult<Event, Error, UpdateEventDto> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateEventDto) => eventService.updateEvent(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(EVENT_QUERY_KEYS.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};

export const useDeleteEvent = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};

export const useRSVP = (eventId: string): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => eventService.rsvpEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};

export const useCancelRSVP = (eventId: string): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => eventService.cancelRSVP(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
    },
  });
};
