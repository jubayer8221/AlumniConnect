import type { AuthService } from "@/services/interfaces/AuthService";
import type { LoginRequest, LoginResponse, User, AuthSession, ChangePasswordRequest, CredentialRecord } from "@/types/auth";
import type { ApiResponse } from "@/types/common";
import { localStorageService } from "@/services/storage/localStorageService";
import { STORAGE_KEYS } from "@/services/storage/storageKeys";
import { seedCredentials } from "@/data/seedData";
import { generateUUID } from "@/utils/generateId";

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureCredentials(): CredentialRecord[] {
  let creds = localStorageService.get<CredentialRecord[]>(STORAGE_KEYS.CREDENTIALS, []);
  if (creds.length === 0) {
    creds = [...seedCredentials];
    localStorageService.set(STORAGE_KEYS.CREDENTIALS, creds);
  } else {
    const admin = creds.find((credential) => credential.id === "cred-admin-001");
    if (admin && !admin.alumniId) {
      admin.alumniId = "ALM-ADMIN";
      localStorageService.set(STORAGE_KEYS.CREDENTIALS, creds);
    }
  }
  return creds;
}

export const mockAuthService: AuthService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await delay();
    const creds = ensureCredentials();
    const found = creds.find(
      (c) => c.username.toLowerCase() === credentials.username.toLowerCase() && c.password === credentials.password
    );
    if (!found) {
      return {
        success: false,
        message: "Invalid username or password",
        data: { user: null as unknown as User, session: null as unknown as AuthSession },
      };
    }
    const user: User = {
      id: found.id,
      username: found.username,
      role: found.role,
      alumniId: found.alumniId,
      email: found.email,
      displayName: found.displayName,
    };
    const session: AuthSession = {
      isAuthenticated: true,
      userId: found.id,
      role: found.role,
      username: found.username,
      alumniId: found.alumniId,
    };
    localStorageService.set(STORAGE_KEYS.AUTH_SESSION, session);
    return { success: true, message: "Login successful", data: { user, session } };
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay(100);
    localStorageService.remove(STORAGE_KEYS.AUTH_SESSION);
    return { success: true, message: "Logged out successfully", data: null };
  },

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    await delay(50);
    const session = localStorageService.get<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (!session) return { success: true, message: "No active session", data: null };
    const creds = ensureCredentials();
    const found = creds.find((c) => c.id === session.userId);
    if (!found) return { success: true, message: "User not found", data: null };
    const user: User = {
      id: found.id,
      username: found.username,
      role: found.role,
      alumniId: found.alumniId,
      email: found.email,
      displayName: found.displayName,
    };
    return { success: true, message: "User retrieved", data: user };
  },

  getSession(): AuthSession | null {
    return localStorageService.get<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
  },

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    await delay();
    const session = localStorageService.get<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (!session) return { success: false, message: "Not authenticated", data: null };
    const creds = ensureCredentials();
    const idx = creds.findIndex((c) => c.id === session.userId);
    if (idx === -1) return { success: false, message: "User not found", data: null };
    if (creds[idx].password !== data.currentPassword) {
      return { success: false, message: "Current password is incorrect", data: null };
    }
    creds[idx].password = data.newPassword;
    localStorageService.set(STORAGE_KEYS.CREDENTIALS, creds);
    return { success: true, message: "Password changed successfully", data: null };
  },
};

export function addCredential(cred: Omit<CredentialRecord, "id">): CredentialRecord {
  const creds = ensureCredentials();
  const newCred: CredentialRecord = { ...cred, id: generateUUID() };
  creds.push(newCred);
  localStorageService.set(STORAGE_KEYS.CREDENTIALS, creds);
  return newCred;
}

export function isUsernameUnique(username: string, excludeId?: string): boolean {
  const creds = ensureCredentials();
  return !creds.some((c) => c.username.toLowerCase() === username.toLowerCase() && c.id !== excludeId);
}
