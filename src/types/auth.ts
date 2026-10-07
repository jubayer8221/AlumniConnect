// src/types/auth.ts
export type UserRole = "ADMIN" | "MODERATOR" | "ALUMNI";

export interface Permission {
  permissionID: number;
  permissionCode: string;
  permissionName: string;
  moduleName: string | null;
  canView: boolean;
  canAdd: boolean;
  canModify: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canExport: boolean;
}

export interface Role {
  roleID: number;
  roleCode: string;
  roleName: string;
  description: string | null;
}

export interface LoginUserPayload {
  userID: number;
  userCode: string;
  username: string;
  email: string | null;
  alumniID: number | null;
  alumniCode: string | null;
  fullName: string | null;
  profilePhoto: string | null;
  isVerified: boolean;
  status: string | null;
}

/** Raw response from POST /Auth/login (not wrapped in ApiResponse). */
export interface LoginApiResponse {
  token: string;
  expiresAt: string;
  user: LoginUserPayload;
  roles: Role[];
  permissions: Permission[];
}

/** Shape stored in Redux + localStorage. */
export interface IAuthUser {
  id: string;
  username: string;
  userCode?: string;
  email?: string;
  fullName?: string;
  displayName?: string;
  alumniId?: string;
  alumniCode?: string;
  profilePhoto?: string;
  isVerified?: boolean;
  status?: string;
  role: UserRole;
  roles: Role[];
  permissions: Permission[];
  expiresAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
