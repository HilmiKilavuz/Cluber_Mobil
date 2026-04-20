// hooks/auth/useAuth.ts
// Web projesiyle aynı pattern — tek fark token'ın SecureStore'da saklanması

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { authService } from '@/services/auth/auth.service';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import type {
  AuthSuccessResponse,
  AuthUser,
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  VerifyEmailDto,
} from '@/types/auth';
import { router } from 'expo-router';

const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

interface UseAuthResult {
  sessionQuery: UseQueryResult<AuthUser | null, Error>;
  loginMutation: UseMutationResult<AuthUser, Error, LoginDto>;
  registerMutation: UseMutationResult<{ user: AuthUser; message: string }, Error, RegisterDto>;
  logoutMutation: UseMutationResult<void, Error, void>;
  verifyEmailMutation: UseMutationResult<
    AuthSuccessResponse & { message: string },
    Error,
    VerifyEmailDto
  >;
  changePasswordMutation: UseMutationResult<{ message: string }, Error, ChangePasswordDto>;
}

export const useAuth = (): UseAuthResult => {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery<AuthUser | null, Error>({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: async () => {
      try {
        const token = await tokenStorage.get();
        if (!token) return null;
        const response = await authService.getSession();
        return response ?? null;
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const loginMutation = useMutation<AuthUser, Error, LoginDto>({
    mutationFn: async (payload) => {
      const response = await authService.login(payload);
      // Token'ı SecureStore'a kaydet (localStorage yerine)
      if (response.accessToken) {
        await tokenStorage.set(response.accessToken);
      }
      return response.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, user);
    },
  });

  const registerMutation = useMutation<{ user: AuthUser; message: string }, Error, RegisterDto>({
    mutationFn: async (payload) => {
      const response = await authService.register(payload);
      return response;
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await authService.logout();
      await tokenStorage.remove(); // SecureStore'dan token'ı sil
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
      queryClient.clear();
      router.replace('/(auth)/login');
    },
  });

  const verifyEmailMutation = useMutation<
    AuthSuccessResponse & { message: string },
    Error,
    VerifyEmailDto
  >({
    mutationFn: async (payload) => {
      const response = await authService.verifyEmail(payload);
      // Doğrulama başarılı → token'ı SecureStore'a kaydet
      if (response.accessToken) {
        await tokenStorage.set(response.accessToken);
      }
      return response;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, response.user);
    },
  });

  const changePasswordMutation = useMutation<{ message: string }, Error, ChangePasswordDto>({
    mutationFn: (payload) => authService.changePassword(payload),
  });

  return {
    sessionQuery,
    loginMutation,
    registerMutation,
    logoutMutation,
    verifyEmailMutation,
    changePasswordMutation,
  };
};
