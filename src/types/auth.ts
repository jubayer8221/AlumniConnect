export type UserRole = "ADMIN" | "ALUMNI";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  alumniId?: string;
  email?: string;
  displayName?: string;
  profilePhoto?: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  userId: string;
  role: UserRole;
  username: string;
  alumniId?: string;
}

export interface CredentialRecord {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  alumniId?: string;
  email?: string;
  phone?: string;
  displayName?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    session: AuthSession;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
