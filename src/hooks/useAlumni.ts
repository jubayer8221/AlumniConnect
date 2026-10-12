import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api/apiClient";
import type { RootState } from "@/store/store";
import type {
  AlumniListQuery,
  AlumniPrivacySettings,
  AlumniProfileFullModel,
  CreateUpdateAlumniRequest,
} from "@/types/alumni";
import type { PagedResult } from "@/types/api";
import {
  clearAlumniData,
  clearSelectedAlumni,
  setAlumniData,
  setPrivacy,
  setSelectedAlumni,
} from "@/store/Slice/alumniSlice";
import { getApiErrorMessage } from "@/utils/apiError";
import { useAuth } from "./useAuth";

export const useAlumni = () => {
  const { authUser } = useAuth();
  const dispatch = useDispatch();

  const alumniData = useSelector((s: RootState) => s.alumni.alumni);
  const selectedAlumni = useSelector((s: RootState) => s.alumni.selectedAlumni);
  const privacy = useSelector((s: RootState) => s.alumni.privacy);
  const totalCount = useSelector((s: RootState) => s.alumni.totalCount);

  const [loading, setLoading] = useState<boolean>(false);

  const fetchAlumniData = useCallback(
    async (
      query: AlumniListQuery = { pageNumber: 1, pageSize: 10 },
    ): Promise<PagedResult<AlumniProfileFullModel>> => {
      setLoading(true);
      try {
        const res = await api.get<PagedResult<AlumniProfileFullModel>>(
          "/Alumni/GetAllAlumni",
          { params: query },
        );
        const data = res.data;
        dispatch(
          setAlumniData({
            items: data.items ?? [],
            totalCount: data.totalRecords,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
          }),
        );
        return data;
      } catch (error) {
        console.error(
          "Error fetching Alumni data:",
          getApiErrorMessage(error, "Unable to load alumni"),
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const fetchAlumniById = useCallback(
    async (id: string | number): Promise<AlumniProfileFullModel> => {
      setLoading(true);
      try {
        const res = await api.get<AlumniProfileFullModel>(
          `/Alumni/GetAlumniByID/${id}`,
        );
        dispatch(setSelectedAlumni(res.data));
        return res.data;
      } catch (error) {
        console.error(
          "Error fetching Alumni by ID:",
          getApiErrorMessage(error, "Unable to load alumni profile"),
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const createUpdateAlumni = useCallback(
    async (
      payload: CreateUpdateAlumniRequest,
      refreshQuery?: AlumniListQuery,
    ) => {
      if (!authUser) {
        console.error("No authenticated user found");
        return;
      }
      setLoading(true);
      try {
        const res = await api.post<{
          success: boolean;
          alumniID: number;
          message: string;
        }>("/Alumni/CreateUpdateAlumni", {
          ...payload,
          createdBy: payload.createdBy ?? Number(authUser.id),
        });

        if (!res.data?.success) {
          throw new Error(res.data?.message ?? "Save failed");
        }

        if (refreshQuery) await fetchAlumniData(refreshQuery);
        return res.data;
      } catch (error) {
        console.error(
          "Error saving Alumni:",
          getApiErrorMessage(error, "Unable to save alumni"),
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [authUser, fetchAlumniData],
  );

  const fetchPrivacy = useCallback(
    async (id: string | number): Promise<AlumniPrivacySettings> => {
      setLoading(true);
      try {
        const res = await api.get<AlumniPrivacySettings>(
          `/Alumni/AlumniPrivacy/${id}`,
        );
        dispatch(setPrivacy(res.data));
        return res.data;
      } catch (error) {
        console.error(
          "Error fetching privacy settings:",
          getApiErrorMessage(error, "Unable to load privacy settings"),
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const savePrivacy = useCallback(
    async (payload: AlumniPrivacySettings) => {
      setLoading(true);
      try {
        const res = await api.post<{ success: boolean; message: string }>(
          "/Alumni/AlumniPrivacy",
          payload,
        );
        if (!res.data?.success) {
          throw new Error(res.data?.message ?? "Save failed");
        }
        await fetchPrivacy(payload.alumniID);
        return res.data;
      } catch (error) {
        console.error(
          "Error saving privacy settings:",
          getApiErrorMessage(error, "Unable to save privacy settings"),
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchPrivacy],
  );

  const setAlumniActive = useCallback(
    async (
      alumniID: number,
      isActive: boolean,
      refreshQuery?: AlumniListQuery,
    ) => {
      setLoading(true);
      try {
        const res = await api.post<{ success: boolean; message: string }>(
          "/Alumni/AlumniActive",
          { alumniID, isActive },
        );
        if (!res.data?.success) {
          throw new Error(res.data?.message ?? "Update failed");
        }
        if (refreshQuery) await fetchAlumniData(refreshQuery);
        return res.data;
      } catch (error) {
        console.error(
          "Error updating alumni active state:",
          getApiErrorMessage(error, "Unable to update status"),
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchAlumniData],
  );

  const clearAlumniDataHandler = useCallback(() => {
    dispatch(clearAlumniData());
  }, [dispatch]);

  const clearSelectedAlumniHandler = useCallback(() => {
    dispatch(clearSelectedAlumni());
  }, [dispatch]);

  return {
    alumniData,
    selectedAlumni,
    privacy,
    totalCount,
    loading,
    setLoading,
    authUser,
    fetchAlumniData,
    fetchAlumniById,
    createUpdateAlumni,
    fetchPrivacy,
    savePrivacy,
    setAlumniActive,
    clearAlumniDataHandler,
    clearSelectedAlumniHandler,
  };
};
