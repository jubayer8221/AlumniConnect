import type {
  IAuthUser,
  LoginApiResponse,
  Permission,
  Role,
  UserRole,
} from "@/types/auth";

export const TOKEN_KEY = "auth_token";
export const USER_KEY = "auth_user";

/** Roles that share the admin application permissions and navigation. */
export function hasAdminAccess(role: string | null | undefined): boolean {
  return role === "ADMIN" || role === "MODERATOR";
}

// export function deriveRole(roles: Role[]): UserRole {
//   const codes = (roles ?? []).map((r) => r.roleCode?.toUpperCase() ?? "");
//   return codes.some((c) => c.includes("ADMIN")) ? "ADMIN" : "ALUMNI";
// }
export function deriveRole(roles: Role[]): UserRole {
  const codes = (roles ?? []).map((r) => r.roleCode?.toUpperCase() ?? "");

  if (codes.some((c) => c.includes("ADMIN"))) return "ADMIN";
  if (codes.some((c) => c.includes("MODERATOR"))) return "MODERATOR";
  return "ALUMNI";
}

export function toAuthUser(payload: LoginApiResponse): IAuthUser {
  const u = payload.user;
  return {
    id: String(u.userID),
    username: u.username,
    userCode: u.userCode,
    email: u.email ?? undefined,
    fullName: u.fullName ?? undefined,
    displayName: u.fullName ?? u.username,
    alumniId: u.alumniID != null ? String(u.alumniID) : undefined,
    alumniCode: u.alumniCode ?? undefined,
    profilePhoto: u.profilePhoto ?? undefined,
    isVerified: u.isVerified,
    status: u.status ?? undefined,
    role: deriveRole(payload.roles ?? []),
    roles: payload.roles ?? [],
    permissions: payload.permissions ?? [],
    expiresAt: payload.expiresAt,
  };
}

export function isExpired(expiresAt?: string): boolean {
  return Boolean(expiresAt && Date.parse(expiresAt) <= Date.now());
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function loadStoredAuth(): {
  token: string | null;
  user: IAuthUser | null;
} {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  if (!token || !rawUser) return { token: null, user: null };

  try {
    const user = JSON.parse(rawUser) as IAuthUser;
    if (isExpired(user.expiresAt)) {
      clearStoredAuth();
      return { token: null, user: null };
    }
    return { token, user };
  } catch {
    clearStoredAuth();
    return { token: null, user: null };
  }
}

export type PermissionAction =
  | "canView"
  | "canAdd"
  | "canModify"
  | "canDelete"
  | "canApprove"
  | "canExport";

export function checkPermission(
  permissions: Permission[] | undefined,
  code: string,
  action?: PermissionAction,
): boolean {
  const p = permissions?.find((x) => x.permissionCode === code);
  if (!p) return false;
  if (!action) return true;
  return Boolean(p[action]);
}

export function checkRole(
  roles: Role[] | undefined,
  roleCode: string,
): boolean {
  return Boolean(
    roles?.some((r) => r.roleCode?.toUpperCase() === roleCode.toUpperCase()),
  );
}
