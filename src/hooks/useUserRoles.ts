import { useCallback, useState } from "react";
import api from "@/services/api/apiClient";
import type { Role } from "@/types/auth";
import { getApiErrorMessage } from "@/utils/apiError";

export interface AuthManagedUser {
  userID: number;
  userCode?: string | null;
  username: string;
  email?: string | null;
  fullName?: string | null;
  status?: string | null;
  roles: Role[];
}

type ListResponse = unknown;
interface UserQuery {
  search?: string;
  roleCode?: string;
  pageNumber?: number;
  pageSize?: number;
}

function unwrapList<T>(response: ListResponse, keys: string[]): T[] {
  if (Array.isArray(response)) return response as T[];
  if (!response || typeof response !== "object") return [];

  const record = response as Record<string, unknown>;
  for (const key of [...keys, "userList", "UserList", "roleList", "RoleList", "items", "Items", "data", "Data", "result", "Result"]) {
    const value = record[key];
    if (Array.isArray(value)) return value as T[];
    if (value && typeof value === "object") {
      const nested = unwrapList<T>(value, keys);
      if (nested.length) return nested;
    }
  }
  return [];
}

function unwrapTotal(response: ListResponse): number | undefined {
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    return undefined;
  }
  const record = response as Record<string, unknown>;
  const total = record.totalRecords ?? record.TotalRecords ?? record.totalCount ?? record.TotalCount ?? record.total ?? record.Total;
  if (typeof total === "number") return total;
  for (const key of ["data", "Data", "result", "Result", "items", "Items", "users", "Users"]) {
    const nested = record[key];
    if (nested && typeof nested === "object") {
      const found = unwrapTotal(nested);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function normalizeRole(input: unknown): Role {
  const role = input as Record<string, unknown>;
  return {
    roleID: Number(role.roleID ?? role.roleId ?? role.RoleID ?? role.id),
    roleCode: String(role.roleCode ?? role.RoleCode ?? role.code ?? ""),
    roleName: String(role.roleName ?? role.RoleName ?? role.name ?? "Unknown role"),
    description: (role.description ?? role.Description ?? null) as string | null,
  };
}

function normalizeUser(input: unknown): AuthManagedUser {
  const user = input as Record<string, unknown>;
  const rawRoles = user.roles ?? user.Roles ?? user.userRoles ?? user.UserRoles;
  const roles = Array.isArray(rawRoles) ? rawRoles.map(normalizeRole) : [];
  const singleRole = user.role ?? user.Role;
  if (!roles.length && singleRole && typeof singleRole === "object") {
    roles.push(normalizeRole(singleRole));
  }
  if (!roles.length && (user.roleID ?? user.roleId ?? user.RoleID) != null) {
    roles.push(normalizeRole(user));
  }
  return {
    userID: Number(user.userID ?? user.userId ?? user.UserID ?? user.id),
    userCode: String(user.userCode ?? user.UserCode ?? "") || null,
    username: String(user.username ?? user.userName ?? user.Username ?? user.UserName ?? ""),
    email: String(user.email ?? user.Email ?? "") || null,
    fullName: String(user.fullName ?? user.FullName ?? "") || null,
    status: String(user.status ?? user.Status ?? "") || null,
    roles,
  };
}

export function useUserRoles() {
  const [users, setUsers] = useState<AuthManagedUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingUserID, setSavingUserID] = useState<number | null>(null);

  const fetchUsersAndRoles = useCallback(async (query: UserQuery = {}) => {
    setLoading(true);
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        api.get<unknown>("/Auth/users", {
          params: {
            search: query.search?.trim() || undefined,
            roleCode: query.roleCode || undefined,
            pageNumber: query.pageNumber ?? 1,
            pageSize: query.pageSize ?? 10,
          },
        }),
        api.get<unknown>("/Auth/roles"),
      ]);
      for (const payload of [usersResponse.data, rolesResponse.data]) {
        if (payload && typeof payload === "object") {
          const response = payload as { success?: boolean; message?: string };
          if (response.success === false) {
            throw new Error(response.message || "Unable to load users and roles");
          }
        }
      }
      const userItems = unwrapList<unknown>(usersResponse.data, ["users", "Users"]);
      setUsers(userItems.map(normalizeUser));
      setTotalUsers(unwrapTotal(usersResponse.data) ?? userItems.length);
      setRoles(unwrapList<unknown>(rolesResponse.data, ["roles", "Roles"]).map(normalizeRole));
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to load users and roles"));
    } finally {
      setLoading(false);
    }
  }, []);

  const assignRole = useCallback(
    async (userID: number, roleID: number) => {
      const role = roles.find((item) => item.roleID === roleID);
      if (!role) throw new Error("The selected role could not be found.");

      setSavingUserID(userID);
      try {
        const response = await api.post<{ success?: boolean; message?: string }>(
          `/Auth/users/${userID}/roles`,
          { roleID, roleCode: role.roleCode },
        );
        if (response.data?.success === false) {
          throw new Error(response.data.message || "Unable to assign role");
        }
        setUsers((current) =>
          current.map((user) =>
            user.userID === userID ? { ...user, roles: [role] } : user,
          ),
        );
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "Unable to assign role"));
      } finally {
        setSavingUserID(null);
      }
    },
    [roles],
  );

  return { users, roles, totalUsers, loading, savingUserID, fetchUsersAndRoles, assignRole };
}
