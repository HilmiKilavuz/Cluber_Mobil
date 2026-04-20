// hooks/clubs/useClubs.ts
// Web projesiyle birebir aynı React Query hook'ları

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
import { clubService } from '@/services/clubs/club.service';
import type { Club, ClubFilters, ClubMember, CreateClubDto, UpdateClubDto } from '@/types/club';
import type { PaginatedResponse } from '@/types/api';

const CLUB_QUERY_KEYS = {
  all: ['clubs'] as const,
  list: (filters?: ClubFilters) => ['clubs', 'list', filters] as const,
  detail: (id: string) => ['clubs', 'detail', id] as const,
  detailBySlug: (slug: string) => ['clubs', 'detail', 'slug', slug] as const,
  members: (clubId: string) => ['clubs', 'members', clubId] as const,
  joined: ['joinedClubs'] as const,
};

export const useClubs = (
  filters?: ClubFilters,
): UseInfiniteQueryResult<InfiniteData<PaginatedResponse<Club>>, Error> => {
  return useInfiniteQuery({
    queryKey: CLUB_QUERY_KEYS.list(filters),
    queryFn: ({ pageParam }) =>
      clubService.getClubs({ ...filters, page: pageParam as number }),
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

export const useClub = (id: string): UseQueryResult<Club, Error> => {
  return useQuery({
    queryKey: CLUB_QUERY_KEYS.detail(id),
    queryFn: () => clubService.getClubById(id),
    enabled: !!id,
  });
};

export const useClubBySlug = (slug: string): UseQueryResult<Club, Error> => {
  return useQuery({
    queryKey: CLUB_QUERY_KEYS.detailBySlug(slug),
    queryFn: () => clubService.getClubBySlug(slug),
    enabled: !!slug,
  });
};

export const useJoinedClubs = (): UseQueryResult<Club[], Error> => {
  return useQuery({
    queryKey: CLUB_QUERY_KEYS.joined,
    queryFn: () => clubService.getJoinedClubs(),
  });
};

export const useClubMembers = (clubId: string): UseQueryResult<ClubMember[], Error> => {
  return useQuery({
    queryKey: CLUB_QUERY_KEYS.members(clubId),
    queryFn: () => clubService.getClubMembers(clubId),
    enabled: !!clubId,
  });
};

export const useCreateClub = (): UseMutationResult<Club, Error, CreateClubDto> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClubDto) => clubService.createClub(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.joined });
    },
  });
};

export const useUpdateClub = (id: string): UseMutationResult<Club, Error, UpdateClubDto> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateClubDto) => clubService.updateClub(id, payload),
    onSuccess: (updatedClub) => {
      queryClient.setQueryData(CLUB_QUERY_KEYS.detail(id), updatedClub);
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.all });
    },
  });
};

export const useDeleteClub = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clubService.deleteClub(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.joined });
    },
  });
};

export const useJoinClub = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clubId: string) => clubService.joinClub(clubId),
    onSuccess: (_, clubId) => {
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.detail(clubId) });
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.joined });
    },
  });
};

export const useLeaveClub = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clubId: string) => clubService.leaveClub(clubId),
    onSuccess: (_, clubId) => {
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.detail(clubId) });
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.joined });
    },
  });
};

export const useRemoveMember = (clubId: string): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => clubService.removeMember(clubId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.members(clubId) });
      queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.detail(clubId) });
    },
  });
};
