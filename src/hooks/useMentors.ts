// src/hooks/useMentors.ts
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api/apiClient";
import type { RootState } from "@/store/store";
import {
  clearMentorData,
  setMentorData,
  setMentorPage,
  setMentorPageSize,
} from "@/store/Slice/mentorSlice";
import type { MentorListItem, MentorQuery } from "@/types/mentor";
import { useAuth } from "@/hooks/useAuth";

export const useMentors = () => {
  const { authUser } = useAuth();
  const dispatch = useDispatch();
  const { mentors, totalCount, pageNumber, pageSize } = useSelector(
    (state: RootState) => state.mentor,
  );
  const [loading, setLoading] = useState(false);

  /* ---------- GET /api/Alumni/GetMentors ---------- */
  const fetchMentors = useCallback(
    async (query: MentorQuery = {}) => {
      setLoading(true);
      try {
        const res = await api.get("/Alumni/GetMentors", {
          params: {
            search: query.search || undefined,
            programId: query.programId,
            pageNumber: query.pageNumber ?? pageNumber,
            pageSize: query.pageSize ?? pageSize,
          },
        });
        const data = res.data as {
          items: MentorListItem[];
          totalRecords: number;
          pageNumber: number;
          pageSize: number;
        };
        dispatch(
          setMentorData({
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
        console.error("Error fetching mentors:", msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, pageNumber, pageSize],
  );

  /* ---------- POST /api/Alumni/UpdateMentorFlags ---------- */
  const updateMentorFlags = useCallback(
    async (isMentor: boolean, willingToMentor: boolean) => {
      if (!authUser) {
        console.error("No authenticated user found");
        return;
      }
      setLoading(true);
      try {
        await api.post("/Alumni/UpdateMentorFlags", {
          isMentor,
          willingToMentor,
        });
      } catch (error: unknown) {
        const msg =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || (error as Error).message;
        console.error("Error updating mentor flags:", msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [authUser],
  );

  const clearMentorDataHandler = useCallback(() => {
    dispatch(clearMentorData());
  }, [dispatch]);

  const changePage = useCallback(
    (page: number) => dispatch(setMentorPage(page)),
    [dispatch],
  );
  const changePageSize = useCallback(
    (size: number) => dispatch(setMentorPageSize(size)),
    [dispatch],
  );

  return {
    mentors,
    totalCount,
    pageNumber,
    pageSize,
    loading,
    fetchMentors,
    updateMentorFlags,
    clearMentorDataHandler,
    setPage: changePage,
    setPageSize: changePageSize,
    authUser,
  };
};
