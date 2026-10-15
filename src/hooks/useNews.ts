import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  setLoading,
  setNewsList,
  setSelectedNews,
  addNewsItem,
  updateNewsItem,
  deleteNewsItem,
  setError,
} from "@/store/Slice/newsSlice";
import api from "@/services/api/apiClient";
import { NewsItem } from "@/components/news/NewsSection";

/* ---------- response shape from GET /News/GetNews ---------- */
export interface PagedNewsResponse {
  items: NewsItem[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

/* ---------- request shape for POST /News/CreateUpdateNews ---------- */
export interface CreateUpdateNewsPayload {
  // omit or "" → create ; provide → update
  NewsID?: string | null;

  Title: string;
  Summary?: string;
  Content?: string;
  CategoryID?: string;
  Tags?: string[];
  Image?: string;
  AuthorID?: string;
  Status?: "Draft" | "Published" | "Unpublished";
  IsFeatured?: boolean;
  IsBreakingNews?: boolean;
  PublishedAt?: string | null;
  ScheduledAt?: string | null;
  MetaDescription?: string;
  IsActive?: boolean;
}

/* query params for GET /News/GetNews */
export interface FetchNewsParams {
  search?: string;
  categoryID?: string;
  status?: string;
  isFeatured?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

const unwrapError = (err: any, fallback: string): string =>
  err?.response?.data?.message ?? err?.message ?? fallback;

export const useNews = () => {
  const dispatch = useAppDispatch();
  const { newsList, selectedNews, loading, error } = useAppSelector(
    (state) => state.news,
  );

  /* ---------- LIST  →  GET /api/News/GetNews ---------- */
  const fetchAllNews = useCallback(
    async (params?: FetchNewsParams) => {
      dispatch(setLoading(true));
      try {
        const response = await api.get<PagedNewsResponse>("/News/GetNews", {
          params: {
            search: params?.search || undefined,
            categoryID: params?.categoryID || undefined,
            status: params?.status || undefined,
            isFeatured: params?.isFeatured,
            pageNumber: params?.pageNumber ?? 1,
            pageSize: params?.pageSize ?? 50,
          },
        });

        const data = response.data;
        const items = data?.items ?? [];
        dispatch(setNewsList(items));
        return data;
      } catch (err: any) {
        dispatch(setError(unwrapError(err, "Failed to fetch news")));
        dispatch(setNewsList([]));
        return null;
      }
    },
    [dispatch],
  );

  /* ---------- DETAIL  →  GET /api/News/GetNewsByID/{id} ---------- */
  const fetchNewsById = useCallback(
    async (newsId: string) => {
      dispatch(setLoading(true));
      try {
        const response = await api.get<NewsItem>(`/News/GetNewsByID/${newsId}`);
        dispatch(setSelectedNews(response.data));
        dispatch(setLoading(false));
        return response.data;
      } catch (err: any) {
        dispatch(setError(unwrapError(err, "Failed to fetch news item")));
        return null;
      }
    },
    [dispatch],
  );

  /* ---------- CREATE / UPDATE  →  POST /api/News/CreateUpdateNews ---------- */
  const createUpdateNews = useCallback(
    async (payload: CreateUpdateNewsPayload) => {
      dispatch(setLoading(true));
      try {
        const res = await api.post<{
          success: boolean;
          newsID: string;
          message: string;
        }>("/News/CreateUpdateNews", payload);

        const id = res.data?.newsID;
        if (!id) throw new Error("Server did not return a NewsID.");

        const fresh = await api.get<NewsItem>(`/News/GetNewsByID/${id}`);
        const item = fresh.data;
        if (payload.NewsID) {
          dispatch(updateNewsItem(item));
        } else {
          dispatch(addNewsItem(item));
        }
        dispatch(setLoading(false));
        return item;
      } catch (err: any) {
        dispatch(setError(unwrapError(err, "Failed to save news")));
        throw err;
      }
    },
    [dispatch],
  );

  /* ---------- DELETE  →  POST /api/News/DeleteNews ---------- */
  const deleteNews = useCallback(
    async (newsId: string) => {
      dispatch(setLoading(true));
      try {
        await api.post("/News/DeleteNews", { newsID: newsId });
        dispatch(deleteNewsItem(newsId));
        dispatch(setLoading(false));
      } catch (err: any) {
        dispatch(setError(unwrapError(err, "Failed to delete news")));
        throw err;
      }
    },
    [dispatch],
  );

  return {
    newsList,
    selectedNews,
    loading,
    error,
    fetchAllNews,
    fetchNewsById,
    createUpdateNews,
    deleteNews,
  };
};
