// src/hooks/useJobs.ts
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api/apiClient";
import type { RootState } from "@/store/store";
import {
  clearJobData,
  setFeaturedJobs,
  setJobData,
  setJobPage,
  setJobPageSize,
} from "@/store/Slice/jobSlice";
import type { CreateUpdateJobRequest, JobItem, JobQuery } from "@/types/job";
import { useAuth } from "@/hooks/useAuth";

export const useJobs = () => {
  const { authUser } = useAuth();
  const dispatch = useDispatch();
  const { jobs, featuredJobs, totalCount, pageNumber, pageSize } = useSelector(
    (state: RootState) => state.job,
  );
  const [loading, setLoading] = useState(false);

  /* ---------- GET /api/Job/GetJobs ---------- */
  const fetchJobs = useCallback(
    async (query: JobQuery = {}) => {
      setLoading(true);
      try {
        const res = await api.get("/Job/GetJobs", {
          params: {
            search: query.search || undefined,
            employmentType: query.employmentType || undefined,
            isFeatured: query.isFeatured,
            isActive: query.isActive,
            pageNumber: query.pageNumber ?? pageNumber,
            pageSize: query.pageSize ?? pageSize,
          },
        });
        const data = res.data as {
          items: JobItem[];
          totalRecords: number;
          pageNumber: number;
          pageSize: number;
        };
        dispatch(
          setJobData({
            items: data.items ?? [],
            totalCount: data.totalRecords ?? 0,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
          }),
        );
        return data;
      } catch (error: unknown) {
        const msg =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || (error as Error).message;
        console.error("Error fetching jobs:", msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, pageNumber, pageSize],
  );

  /* ---------- GET /api/Job/GetFeaturedJobs ---------- */
  const fetchFeaturedJobs = useCallback(
    async (limit = 3) => {
      setLoading(true);
      try {
        const res = await api.get<JobItem[]>("/Job/GetFeaturedJobs", {
          params: { limit },
        });
        dispatch(setFeaturedJobs(res.data ?? []));
        return res.data;
      } catch (error: unknown) {
        const msg =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || (error as Error).message;
        console.error("Error fetching featured jobs:", msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /* ---------- GET /api/Job/GetJobByID/{id} ---------- */
  const fetchJobById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get<JobItem>(`/Job/GetJobByID/${id}`);
      return res.data;
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || (error as Error).message;
      console.error("Error fetching job:", msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------- POST /api/Job/CreateUpdateJob ---------- */
  const createUpdateJob = useCallback(
    async (payload: CreateUpdateJobRequest) => {
      if (!authUser) {
        console.error("No authenticated user found");
        return;
      }
      setLoading(true);
      try {
        const res = await api.post<{
          success: boolean;
          jobID: string;
          message: string;
        }>("/Job/CreateUpdateJob", payload);

        // refetch the current page
        await fetchJobs({ pageNumber, pageSize });
        return res.data;
      } catch (error: unknown) {
        const msg =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || (error as Error).message;
        console.error("Error saving job:", msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [authUser, fetchJobs, pageNumber, pageSize],
  );

  /* ---------- POST /api/Job/DeleteJob ---------- */
  const deleteJob = useCallback(
    async (jobID: string) => {
      if (!authUser) {
        console.error("No authenticated user found");
        return;
      }
      setLoading(true);
      try {
        await api.post("/Job/DeleteJob", { jobID });
        await fetchJobs({ pageNumber, pageSize });
      } catch (error: unknown) {
        const msg =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || (error as Error).message;
        console.error("Error deleting job:", msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [authUser, fetchJobs, pageNumber, pageSize],
  );

  const clearJobDataHandler = useCallback(() => {
    dispatch(clearJobData());
  }, [dispatch]);

  const changePage = useCallback(
    (page: number) => dispatch(setJobPage(page)),
    [dispatch],
  );
  const changePageSize = useCallback(
    (size: number) => dispatch(setJobPageSize(size)),
    [dispatch],
  );

  return {
    jobs,
    featuredJobs,
    totalCount,
    pageNumber,
    pageSize,
    loading,
    fetchJobs,
    fetchFeaturedJobs,
    fetchJobById,
    createUpdateJob,
    deleteJob,
    clearJobDataHandler,
    setPage: changePage,
    setPageSize: changePageSize,
    authUser,
  };
};
