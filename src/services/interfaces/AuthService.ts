import type {
  ChangePasswordRequest,
  LoginApiResponse,
  LoginRequest,
} from "@/types/auth";
import type { MutationResult } from "@/types/api";

export interface AuthService {
  login(payload: LoginRequest): Promise<LoginApiResponse>;
  changePassword(payload: ChangePasswordRequest): Promise<MutationResult>;
  logout(): Promise<MutationResult>;
}
