// services/users/users.service.ts

import { axiosInstance } from '@/services/axiosInstance';
import type { AuthUser } from '@/types/auth';

export interface UpdateProfileDto {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  interests?: string[];
}

export const usersService = {
  updateProfile: async (payload: UpdateProfileDto): Promise<AuthUser> => {
    const response = await axiosInstance.patch<AuthUser>('/users/me', payload);
    return response.data;
  },
};
