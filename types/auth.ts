// types/auth.ts
// Web projesi ile birebir aynı tip tanımları

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  avatarUrl?: string | null;
  bio?: string | null;
  interests?: string[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  displayName: string;
  password: string;
}

export interface AuthSuccessResponse {
  user: AuthUser;
  accessToken?: string;
}

export type SessionResponse = AuthUser;

export interface VerifyEmailDto {
  email: string;
  code: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
