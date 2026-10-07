import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api/apiClient";
import type { RootState } from "@/store/store";
import {
  logout as logoutAction,
  setAuthError,
  setAuthLoading,
  setCredentials,
} from "@/store/Slice/authSlice";
import type {
  ChangePasswordRequest,
  IAuthUser,
  LoginApiResponse,
  LoginRequest,
} from "@/types/auth";
import {
  checkPermission,
  checkRole,
  toAuthUser,
  type PermissionAction,
} from "@/utils/authUtils";
import { getApiErrorMessage } from "@/utils/apiError";

export const useAuth = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((s: RootState) => s.auth.authUser);
  const token = useSelector((s: RootState) => s.auth.token);
  const sliceLoading = useSelector((s: RootState) => s.auth.loading);
  const error = useSelector((s: RootState) => s.auth.error);
  const [localLoading, setLocalLoading] = useState(false);

  const isAuthenticated = Boolean(authUser && token);

  const login = useCallback(
    async (payload: LoginRequest): Promise<IAuthUser> => {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));
      try {
        const res = await api.post<LoginApiResponse>("/Auth/login", payload);
        const data = res.data;
        if (!data?.token) throw new Error("Login failed: no token returned.");
        const user = toAuthUser(data);
        dispatch(setCredentials({ token: data.token, user }));
        return user;
      } catch (err) {
        const message = getApiErrorMessage(err, "Unable to sign in");
        dispatch(setAuthError(message));
        throw new Error(message);
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch],
  );

  const logoutHandler = useCallback(async () => {
    try {
      await api.post("/Auth/logout");
    } catch {
      // best-effort
    }
    dispatch(logoutAction());
  }, [dispatch]);

  const changePassword = useCallback(
    async (payload: ChangePasswordRequest): Promise<string> => {
      setLocalLoading(true);
      try {
        const res = await api.post<{ success: boolean; message: string }>(
          "/Auth/change-password",
          payload,
        );
        if (!res.data?.success) {
          throw new Error(res.data?.message ?? "Failed to change password");
        }
        return res.data.message || "Password changed successfully.";
      } catch (err) {
        throw new Error(getApiErrorMessage(err, "Unable to change password"));
      } finally {
        setLocalLoading(false);
      }
    },
    [],
  );

  const hasPermission = useCallback(
    (code: string, action?: PermissionAction) =>
      checkPermission(authUser?.permissions, code, action),
    [authUser?.permissions],
  );

  const hasRole = useCallback(
    (roleCode: string) => checkRole(authUser?.roles, roleCode),
    [authUser?.roles],
  );

  return {
    authUser,
    user: authUser,
    token,
    isAuthenticated,
    loading: sliceLoading || localLoading,
    error,
    role: authUser?.role ?? null,
    login,
    logout: logoutHandler,
    changePassword,
    hasPermission,
    hasRole,
  };
};
