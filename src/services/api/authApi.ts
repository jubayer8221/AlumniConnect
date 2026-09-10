import type { AuthService } from "@/services/interfaces/AuthService";
import type { LoginRequest, LoginResponse, User, ChangePasswordRequest } from "@/types/auth";
import type { ApiResponse } from "@/types/common";
import { apiClient } from "./apiClient";

export const restAuthService: AuthService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post("/auth/login", credentials);
    return res.data;
  },
  async logout(): Promise<ApiResponse<null>> {
    const res = await apiClient.post("/auth/logout");
    return res.data;
  },
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },
  getSession() {
    return null;
  },
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    const res = await apiClient.post("/auth/change-password", data);
    return res.data;
  },
};
