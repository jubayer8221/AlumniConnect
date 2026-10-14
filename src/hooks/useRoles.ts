// src/hooks/useRoles.ts
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api/apiClient";
import type { RootState } from "@/store/store";
import { clearRoleData, setRoleData } from "@/store/Slice/roleSlice";
import type { CreateUpdateRoleRequest, RoleItem } from "@/types/role";
import { useAuth } from "@/hooks/useAuth";

export const useRoles = () => {
  const { authUser } = useAuth();
  const dispatch = useDispatch();
  const roles = useSelector((state: RootState) => state.role.roles);
  const [loading, setLoading] = useState(false);

  const handleError = (error: unknown, fallback: string) => {
    const msg =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || (error as Error).message;
    console.error(fallback, msg);
    throw error;
  };

  /* ---------- GET /api/Auth/roles ---------- */
  const fetchRoles = useCallback(async () => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await api.get<RoleItem[]>("/Auth/roles");
      dispatch(setRoleData(res.data ?? []));
      return res.data;
    } catch (error) {
      handleError(error, "Error fetching roles:");
    } finally {
      setLoading(false);
    }
  }, [authUser, dispatch]);

  /* ---------- POST /api/Auth/roles/CreateUpdate ---------- */
  const createUpdateRole = useCallback(
    async (payload: CreateUpdateRoleRequest) => {
      if (!authUser) return;
      setLoading(true);
      try {
        const res = await api.post<{
          success: boolean;
          roleID: number;
          message: string;
        }>("/Auth/roles/CreateUpdate", payload);
        await fetchRoles();
        return res.data;
      } catch (error) {
        handleError(error, "Error saving role:");
      } finally {
        setLoading(false);
      }
    },
    [authUser, fetchRoles],
  );

  /* ---------- POST /api/Auth/roles/Delete ---------- */
  const deleteRole = useCallback(
    async (roleID: number) => {
      if (!authUser) return;
      setLoading(true);
      try {
        await api.post("/Auth/roles/Delete", { roleID });
        await fetchRoles();
      } catch (error) {
        handleError(error, "Error deleting role:");
      } finally {
        setLoading(false);
      }
    },
    [authUser, fetchRoles],
  );

  const clearRoleDataHandler = useCallback(() => {
    dispatch(clearRoleData());
  }, [dispatch]);

  return {
    roles,
    loading,
    fetchRoles,
    createUpdateRole,
    deleteRole,
    clearRoleDataHandler,
    authUser,
  };
};
