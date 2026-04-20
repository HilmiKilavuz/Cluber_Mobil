// services/clubs/club.service.ts
// Web projesiyle birebir aynı API çağrıları

import { axiosInstance } from '@/services/axiosInstance';
import type { Club, ClubFilters, ClubMember, CreateClubDto, UpdateClubDto } from '@/types/club';
import type { PaginatedResponse } from '@/types/api';

const CLUBS_BASE_PATH = '/clubs';

export const clubService = {
  getClubs: async (filters?: ClubFilters): Promise<PaginatedResponse<Club>> => {
    const response = await axiosInstance.get<PaginatedResponse<Club>>(CLUBS_BASE_PATH, {
      params: filters,
    });
    return response.data;
  },

  getClubById: async (id: string): Promise<Club> => {
    const response = await axiosInstance.get<Club>(`${CLUBS_BASE_PATH}/${id}`);
    return response.data;
  },

  getClubBySlug: async (slug: string): Promise<Club> => {
    const response = await axiosInstance.get<Club>(`${CLUBS_BASE_PATH}/slug/${slug}`);
    return response.data;
  },

  getJoinedClubs: async (): Promise<Club[]> => {
    const response = await axiosInstance.get<Club[]>(`${CLUBS_BASE_PATH}/my/joined`);
    return response.data;
  },

  createClub: async (payload: CreateClubDto): Promise<Club> => {
    const response = await axiosInstance.post<Club>(CLUBS_BASE_PATH, payload);
    return response.data;
  },

  updateClub: async (id: string, payload: UpdateClubDto): Promise<Club> => {
    const response = await axiosInstance.patch<Club>(`${CLUBS_BASE_PATH}/${id}`, payload);
    return response.data;
  },

  deleteClub: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${CLUBS_BASE_PATH}/${id}`);
  },

  joinClub: async (clubId: string): Promise<void> => {
    await axiosInstance.post(`${CLUBS_BASE_PATH}/${clubId}/join`);
  },

  leaveClub: async (clubId: string): Promise<void> => {
    await axiosInstance.post(`${CLUBS_BASE_PATH}/${clubId}/leave`);
  },

  getClubMembers: async (clubId: string): Promise<ClubMember[]> => {
    const response = await axiosInstance.get<ClubMember[]>(
      `${CLUBS_BASE_PATH}/${clubId}/members`,
    );
    return response.data;
  },

  removeMember: async (clubId: string, userId: string): Promise<void> => {
    await axiosInstance.delete(`${CLUBS_BASE_PATH}/${clubId}/members/${userId}`);
  },
};
