import type { LoginRequest, LoginResponse, User, AuthSession, ChangePasswordRequest } from "@/types/auth";
import type { ApiResponse } from "@/types/common";

export interface AuthService {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<ApiResponse<null>>;
  getCurrentUser(): Promise<ApiResponse<User | null>>;
  getSession(): AuthSession | null;
  changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>>;
}
