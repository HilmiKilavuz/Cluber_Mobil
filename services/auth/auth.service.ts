// services/auth/auth.service.ts
// Web projesiyle birebir aynı API çağrıları
// Fark: Token yönetimi tokenStorage (SecureStore) ile yapılır

import { axiosInstance } from '@/services/axiosInstance';
import type {
  AuthSuccessResponse,
  AuthUser,
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  SessionResponse,
  VerifyEmailDto,
} from '@/types/auth';

const AUTH_BASE_PATH = '/auth';

export const authService = {
  login: async (payload: LoginDto): Promise<AuthSuccessResponse> => {
    const response = await axiosInstance.post<AuthSuccessResponse>(
      `${AUTH_BASE_PATH}/login`,
      payload,
    );
    return response.data;
  },

  register: async (
    payload: RegisterDto,
  ): Promise<{ user: AuthUser; message: string }> => {
    const response = await axiosInstance.post<{
      user: AuthUser;
      message: string;
    }>(`${AUTH_BASE_PATH}/register`, payload);
    return response.data;
  },

  getSession: async (): Promise<SessionResponse> => {
    const response = await axiosInstance.get<SessionResponse>(
      `${AUTH_BASE_PATH}/me`,
      {
        headers: {
          'x-silent-error': 'true', // Oturum yok hatasını sessizce yakala
        },
      },
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(`${AUTH_BASE_PATH}/logout`);
    } catch {
      // Logout hatası önemsiz, token zaten silinecek
    }
  },

  verifyEmail: async (
    payload: VerifyEmailDto,
  ): Promise<AuthSuccessResponse & { message: string }> => {
    const response = await axiosInstance.post<
      AuthSuccessResponse & { message: string }
    >(`${AUTH_BASE_PATH}/verify-email`, payload);
    return response.data;
  },

  changePassword: async (
    payload: ChangePasswordDto,
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(
      `${AUTH_BASE_PATH}/change-password`,
      payload,
    );
    return response.data;
  },
};
