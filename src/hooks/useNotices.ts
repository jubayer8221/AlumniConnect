import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import {
  clearSelectedNotice,
  createNoticeAsync,
  deleteNoticeAsync,
  fetchNoticeByIdAsync,
  fetchNoticesAsync,
  publishNoticeAsync,
  setPage,
  setPageSize,
  setSearch,
  unpublishNoticeAsync,
  updateNoticeAsync,
} from "@/store/Slice/noticeSlice";
import type { NoticeQueryParams } from "@/types/notice";

/** Notice state and operations, following the same interface as useEvents. */
export const useNotices = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    selectedNotice,
    totalCount,
    pageNumber,
    pageSize,
    search,
    loading,
    error,
  } = useAppSelector((state) => state.notices);

  const fetchNotices = useCallback(
    (params?: NoticeQueryParams) =>
      dispatch(fetchNoticesAsync(params)).unwrap().catch(() => null),
    [dispatch],
  );
  const fetchNoticeById = useCallback(
    (id: string) =>
      dispatch(fetchNoticeByIdAsync(id)).unwrap().catch(() => null),
    [dispatch],
  );
  const createNotice = useCallback(
    (payload: Parameters<typeof createNoticeAsync>[0]) =>
      dispatch(createNoticeAsync(payload)).unwrap(),
    [dispatch],
  );
  const updateNotice = useCallback(
    (id: string, data: Parameters<typeof updateNoticeAsync>[0]["data"]) =>
      dispatch(updateNoticeAsync({ id, data })).unwrap(),
    [dispatch],
  );
  const deleteNotice = useCallback(
    (id: string) => dispatch(deleteNoticeAsync(id)).unwrap(),
    [dispatch],
  );
  const publishNotice = useCallback(
    (id: string) => dispatch(publishNoticeAsync(id)).unwrap(),
    [dispatch],
  );
  const unpublishNotice = useCallback(
    (id: string) => dispatch(unpublishNoticeAsync(id)).unwrap(),
    [dispatch],
  );
  const updateSearch = useCallback(
    (value: string) => dispatch(setSearch(value)),
    [dispatch],
  );
  const updatePage = useCallback(
    (value: number) => dispatch(setPage(value)),
    [dispatch],
  );
  const updatePageSize = useCallback(
    (value: number) => dispatch(setPageSize(value)),
    [dispatch],
  );
  const clearNotice = useCallback(
    () => dispatch(clearSelectedNotice()),
    [dispatch],
  );

  return {
    items,
    selectedNotice,
    totalCount,
    pageNumber,
    pageSize,
    search,
    loading,
    error,
    fetchNotices,
    fetchNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
    publishNotice,
    unpublishNotice,
    setSearch: updateSearch,
    setPage: updatePage,
    setPageSize: updatePageSize,
    clearNotice,
  };
};

export const useNotice = useNotices;
